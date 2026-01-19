from __future__ import annotations

import json
import urllib.parse
from typing import Any, Dict, List, Optional
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field, ValidationError

from .server import build_capabilities, process_ingredients, off_dataset_lookup, _extract_product_fields, extract_text_from_image

ALLOWED_ORIGINS = [
    "https://clean-food-app.vercel.app",
    "https://clean-food-app-git-main-amantheshaikh.vercel.app",
    "https://untainted.io",
    "https://www.untainted.io",
    "https://api.untainted.io",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://10.0.2.2:3000",
    "http://10.0.2.2:3001",
    "capacitor://localhost",
]

VERCEL_REGEX = r"https://([^.]+-)*clean-food-app.*\.vercel\.app"


from supabase import create_client, Client
import os

# ... existing imports ...

# Supabase Setup
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Optional[Client] = None

if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
    except Exception as e:
        print(f"Failed to initialize Supabase: {e}")

class CheckPayload(BaseModel):
    ingredients: str = Field(..., min_length=1, description="Raw ingredient text to analyse")
    preferences: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Optional diet/allergy configuration matching the legacy server payload",
    )
    customer_uid: Optional[str] = Field(
        default=None,
        description="UID of the customer to fetch profile from (overrides preferences if found)",
    )


def _parse_preferences(raw_preferences: Any) -> Optional[Dict[str, Any]]:
    if isinstance(raw_preferences, dict):
        return raw_preferences
    if isinstance(raw_preferences, str) and raw_preferences.strip():
        try:
            parsed = json.loads(raw_preferences)
        except json.JSONDecodeError:
            return None
        if isinstance(parsed, dict):
            return parsed
    return None

def _fetch_profile_preferences(uid: str) -> Optional[Dict[str, Any]]:
    if not supabase:
        print("Supabase client not initialized")
        return None
    try:
        # Assuming table is 'profiles' and column is 'user_id' matching the uid
        # and 'profile_json' contains the preferences
        data = supabase.table("profiles").select("profile_json").eq("user_id", uid).single().execute()
        if data.data:
            return data.data.get("profile_json")
    except Exception as e:
        print(f"Error fetching profile for {uid}: {e}")
    return None

async def _resolve_payload(request: Request) -> CheckPayload:
    content_type = (request.headers.get('Content-Type') or '').lower()
    
    # helper to merge fetched profile if UID present
    def finalize_payload(p: CheckPayload) -> CheckPayload:
        if p.customer_uid:
            fetched = _fetch_profile_preferences(p.customer_uid)
            if fetched:
                # Merge logic: Fetched profile takes precedence or acts as base? 
                # Let's say if preferences are NOT provided in payload, use fetched.
                # If both provided, maybe payload overrides? Or merge?
                # User request implied UID maps to profile against which product is checked.
                # So likely UID sourced profile is the source of truth.
                p.preferences = fetched
        return p

    if 'application/json' in content_type:
        try:
            data = await request.json()
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f'Invalid JSON body: {exc}')
        if not isinstance(data, dict):
            raise HTTPException(status_code=400, detail='JSON body must be an object')
        try:
            payload = CheckPayload(**data)
            return finalize_payload(payload)
        except ValidationError as exc:
            raise HTTPException(status_code=400, detail=exc.errors())

    if 'application/x-www-form-urlencoded' in content_type or 'multipart/form-data' in content_type:
        form = await request.form()
        ingredients = form.get('ingredients', '')
        preferences = _parse_preferences(form.get('preferences'))
        customer_uid = form.get('customer_uid')
        try:
            payload = CheckPayload(ingredients=ingredients, preferences=preferences, customer_uid=customer_uid)
            return finalize_payload(payload)
        except ValidationError as exc:
            raise HTTPException(status_code=400, detail=exc.errors())

    body_bytes = await request.body()
    body_text = ''
    if body_bytes:
        try:
            body_text = body_bytes.decode('utf-8')
        except UnicodeDecodeError:
            raise HTTPException(status_code=400, detail='Request body is not valid UTF-8 text')
        parsed = urllib.parse.parse_qs(body_text, keep_blank_values=True)
        if parsed:
            ingredients = parsed.get('ingredients', [''])[-1]
            pref_values = parsed.get('preferences')
            pref_raw = pref_values[-1] if pref_values else None
            preferences = _parse_preferences(pref_raw)
            customer_uid = parsed.get('customer_uid', [None])[-1]
            try:
                payload = CheckPayload(ingredients=ingredients, preferences=preferences, customer_uid=customer_uid)
                return finalize_payload(payload)
            except ValidationError as exc:
                raise HTTPException(status_code=400, detail=exc.errors())
        stripped = body_text.strip()
        if stripped:
            try:
                return CheckPayload(ingredients=stripped, preferences=None)
            except ValidationError as exc:
                raise HTTPException(status_code=400, detail=exc.errors())

    query_params = request.query_params
    if query_params:
        ingredients = query_params.get('ingredients', '')
        preferences = _parse_preferences(query_params.get('preferences'))
        if ingredients:
            try:
                return CheckPayload(ingredients=ingredients, preferences=preferences)
            except ValidationError as exc:
                raise HTTPException(status_code=400, detail=exc.errors())

    raise HTTPException(status_code=400, detail='Missing or invalid ingredients payload')


class CheckResponse(BaseModel):
    source: str
    ingredients: List[str]
    canonical: List[str]
    taxonomy: List[Dict[str, Any]]
    status: str = Field(..., description="'safe' or 'not_safe'")
    is_clean: bool = Field(..., description="Legacy boolean flag, mirrors status=='safe'")
    hits: List[str]
    diet_hits: List[str] = Field(default_factory=list)
    diet_preference: Optional[str] = None
    active_diets: List[str] = Field(default_factory=list)
    allergy_hits: List[str] = Field(default_factory=list)
    allergy_preferences: List[str] = Field(default_factory=list)
    taxonomy_error: Optional[str] = None
    additives_error: Optional[str] = None


class ProductLookupRequest(BaseModel):
    barcode: str = Field(..., min_length=1, description="GTIN / barcode string to lookup")


class ProductResponse(BaseModel):
    code: Optional[str]
    name: Optional[str]
    ingredients: List[str] = Field(default_factory=list)
    image_url: Optional[str] = None
    meta: Optional[Dict[str, Any]] = None


class ProductSubmissionRequest(BaseModel):
    barcode: str = Field(..., min_length=1, description="GTIN / barcode string")
    name: Optional[str] = None
    brand: Optional[str] = None
    ingredients_text: Optional[str] = None
    categories: List[str] = Field(default_factory=list)
    image_url: Optional[str] = None


app = FastAPI(title="Untainted API", version="1.0.0")


# --- Simple API key + in-memory rate limiter (demo only) ------------------
import os
import time
from collections import deque, defaultdict

# Configurable via environment variables
ANON_RATE_LIMIT = int(os.environ.get("ANON_RATE_LIMIT_PER_MIN", "30"))
KEY_RATE_LIMIT = int(os.environ.get("KEY_RATE_LIMIT_PER_MIN", "1000"))
API_KEYS = {k.strip() for k in os.environ.get("API_KEYS", "").split(",") if k.strip()}

# In-memory store: identifier -> deque[timestamps]
_request_log: Dict[str, deque] = defaultdict(lambda: deque())


def _cleanup_deque(d: deque, window: float = 60.0) -> None:
    now = time.time()
    while d and now - d[0] > window:
        d.popleft()


def _identify_request(request: Request) -> str:
    # Prefer API key if present
    key = request.headers.get("x-api-key") or request.headers.get("X-API-KEY")
    if key:
        return f"key:{key}"
    # Fallback to remote address
    client = request.client.host if request.client else "unknown"
    return f"ip:{client}"


def _enforce_rate_limit(request: Request) -> None:
    ident = _identify_request(request)
    bucket = _request_log[ident]
    _cleanup_deque(bucket, window=60.0)
    # determine limit
    if ident.startswith("key:") and ident[4:] in API_KEYS:
        limit = KEY_RATE_LIMIT
    else:
        limit = ANON_RATE_LIMIT
    if len(bucket) >= limit:
        raise HTTPException(status_code=429, detail="rate limit exceeded")
    bucket.append(time.time())


def _require_api_key(request: Request) -> str:
    key = request.headers.get("x-api-key") or request.headers.get("X-API-KEY")
    if not key:
        raise HTTPException(status_code=401, detail="missing api key")
    
    if key not in API_KEYS:
        # Check if it's a test key that we might want to allow for sandbox (if configured)
        # For now, strict allowlist check as per user request for "authentication details"
        raise HTTPException(status_code=403, detail="invalid api key")
    
    # Store environment context
    if key.startswith("sk_test_"):
        request.state.is_sandbox = True
    else:
        request.state.is_sandbox = False
        
    return key

# -------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=VERCEL_REGEX,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/healthz")
async def health_check() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/capabilities")
async def capabilities() -> Dict[str, Any]:
    return build_capabilities()


@app.get("/openapi.yaml")
async def openapi_spec() -> FileResponse:
    """Serve the authoritative OpenAPI YAML for the service."""
    spec_path = Path(__file__).resolve().parent / "openapi.yaml"
    if not spec_path.exists():
        raise HTTPException(status_code=404, detail="openapi.yaml not found")
    # Return YAML with permissive CORS header to ensure the docs UI can fetch it from localhost dev
    return FileResponse(spec_path, media_type="application/x-yaml", headers={"Access-Control-Allow-Origin": "*"})


@app.post("/product/lookup", response_model=ProductResponse)
async def product_lookup(payload: ProductLookupRequest, request: Request) -> ProductResponse:
    """Lookup product data by barcode using the local dataset helper."""
    # Enforce Auth
    _require_api_key(request)
    _enforce_rate_limit(request)

    barcode = (payload.barcode or "").strip()
    if not barcode:
        raise HTTPException(status_code=400, detail="barcode is required")

    try:
        product = off_dataset_lookup(barcode)
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"product lookup failed: {exc}") from exc

    if not product:
        raise HTTPException(status_code=404, detail="product not found")

    code, name, ingredients = _extract_product_fields(product)
    # attempt to find an image url from common keys
    image_url = None
    for key in ("image_url_large", "image_url", "image_small_url", "image_front_url"):
        if isinstance(product.get(key), str) and product.get(key).strip():
            image_url = product.get(key).strip()
            break

    return ProductResponse(code=code, name=name, ingredients=ingredients or [], image_url=image_url, meta=product)


@app.post("/product/missing", status_code=201)
async def submit_missing_product(payload: ProductSubmissionRequest, request: Request) -> Dict[str, str]:
    """Submit details for a missing product.

    This endpoint allows businesses or users to contribute product data when a lookup fails (404).
    Data submitted here is queued for validation and addition to the global dataset.
    """
    # Enforce Auth
    _require_api_key(request)
    _enforce_rate_limit(request)

    # In a real implementation, this would save to a 'pending_products' table or a queue.
    # For this MVP, we log it and return success.
    print(f"Product Submission Received: {payload.model_dump_json()}")
    
    return {"status": "submission accepted", "message": "Thank you for contributing! Your data is queued for review."}


@app.post("/check", response_model=CheckResponse)
async def check(request: Request) -> CheckResponse:
    # Enforce Auth
    _require_api_key(request)
    _enforce_rate_limit(request)

    payload = await _resolve_payload(request)
    ingredients = payload.ingredients.strip()
    if not ingredients:
        raise HTTPException(status_code=400, detail="ingredients cannot be empty")

    try:
        analysis = process_ingredients(ingredients, payload.preferences)
        if payload.customer_uid:
            # Redact sensitive profile details to prevent reverse-engineering
            analysis["active_diets"] = []
            analysis["allergy_preferences"] = []
            analysis["diet_preference"] = None
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover - defensive guardrail
        raise HTTPException(status_code=500, detail=f"analysis failed: {exc}") from exc

    return CheckResponse(**analysis)


class AnalyzeResponse(BaseModel):
    product_name: Optional[str] = None
    product_image: Optional[str] = None
    status: str
    verdict_title: str
    verdict_description: str
    conflict_count: int
    flagged_ingredients: List[str]
    reasons: List[str]


from .vlm import extract_ingredients_with_gemini, extract_nutrition_with_gemini

class ExtractRequest(BaseModel):
    images: List[str] = Field(..., description="List of base64 encoded images")

class ExtractIngredientsResponse(BaseModel):
    ingredients_text: str

class ExtractNutritionResponse(BaseModel):
    nutrition_info: Dict[str, Any]

@app.post("/extract/ingredients", response_model=ExtractIngredientsResponse)
async def extract_ingredients_endpoint(payload: ExtractRequest, request: Request) -> ExtractIngredientsResponse:
    """Use Gemini VLM to extract ingredients text from images."""
    _require_api_key(request)
    _enforce_rate_limit(request)
    
    # Prepare images for Gemini
    # payload.images are base64 strings
    image_parts = []
    for b64 in payload.images:
        # minimal cleanup if data URI
        clean_b64 = b64
        if "," in clean_b64:
            clean_b64 = clean_b64.split(",", 1)[1]
        try:
            image_parts.append({
                "mime_type": "image/jpeg", # defaulting to jpeg for simplicity
                "data": base64.b64decode(clean_b64)
            })
        except Exception:
            continue
            
    if not image_parts:
         raise HTTPException(status_code=400, detail="No valid images provided")

    text = extract_ingredients_with_gemini(image_parts)
    return ExtractIngredientsResponse(ingredients_text=text)

@app.post("/extract/nutrition", response_model=ExtractNutritionResponse)
async def extract_nutrition_endpoint(payload: ExtractRequest, request: Request) -> ExtractNutritionResponse:
    """Use Gemini VLM to extract structured nutrition info from images."""
    _require_api_key(request)
    _enforce_rate_limit(request)
    
    image_parts = []
    for b64 in payload.images:
        clean_b64 = b64
        if "," in clean_b64:
             clean_b64 = clean_b64.split(",", 1)[1]
        try:
             image_parts.append({
                 "mime_type": "image/jpeg",
                 "data": base64.b64decode(clean_b64)
             })
        except Exception:
             continue
             
    if not image_parts:
         raise HTTPException(status_code=400, detail="No valid images provided")

    data = extract_nutrition_with_gemini(image_parts)
    return ExtractNutritionResponse(nutrition_info=data)


class AnalyzePayload(BaseModel):
    customer_uid: str
    ingredients_text: str
    nutrition_info: Optional[Dict[str, Any]] = None
    preferences: Optional[Dict[str, Any]] = None
    # Optional metadata for response
    product_name: Optional[str] = None
    product_image: Optional[str] = None


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(payload: AnalyzePayload, request: Request) -> AnalyzeResponse:
    """
    Pure analysis endpoint. 
    Accepts pre-extracted ingredients/nutrition and customer UID.
    Returns safety verdict.
    """
    _require_api_key(request)
    _enforce_rate_limit(request)

    # 1. Fetch User Profile
    profile_prefs = _fetch_profile_preferences(payload.customer_uid)
    final_prefs = profile_prefs or {}
    if payload.preferences:
        final_prefs.update(payload.preferences)

    # 2. Process Ingredients
    # We pass the nutrition info into product_meta if available so process_ingredients can try to use it
    # (Though currently process_ingredients logic specifically for nutrition is limited, we passed it in `product_meta` before)
    product_meta = {}
    if payload.nutrition_info:
        # Map snake_case keys to what process_ingredients expects if needed
        # process_ingredients looks for "nutriments" dict
        product_meta["nutriments"] = payload.nutrition_info
        
    analysis = process_ingredients(payload.ingredients_text, final_prefs, product_meta=product_meta)

    # 3. Format Response
    status = analysis.get("status", "unknown")
    hits = analysis.get("hits", [])
    diet_hits = analysis.get("diet_hits", [])
    allergy_hits = analysis.get("allergy_hits", [])
    
    all_conflicts = list(set(hits + diet_hits + allergy_hits))
    conflict_count = len(all_conflicts)
    
    verdict_title = "Safe to Consume"
    verdict_desc = "No conflicts found with your profile."
    
    if status == "not_safe":
        verdict_title = "Avoid"
        if conflict_count == 1:
             verdict_desc = f"Contains {all_conflicts[0]}."
        else:
             verdict_desc = f"Contains {conflict_count} conflicting ingredients."

    reasons = []
    if diet_hits:
        reasons.append(f"Dietary conflicts: {', '.join(diet_hits)}")
    if allergy_hits:
        reasons.append(f"Allergen warnings: {', '.join(allergy_hits)}")
    
    return AnalyzeResponse(
        product_name=payload.product_name,
        product_image=payload.product_image,
        status=status,
        verdict_title=verdict_title,
        verdict_description=verdict_desc,
        conflict_count=conflict_count,
        flagged_ingredients=all_conflicts,
        reasons=reasons
    )



@app.get("/")
async def root() -> Dict[str, str]:
    return {"message": "Untainted backend is running"}
