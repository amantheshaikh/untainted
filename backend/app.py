from __future__ import annotations

import json
import urllib.parse
from typing import Any, Dict, List, Optional
from pathlib import Path

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse
from pydantic import BaseModel, Field, ValidationError

from .server import build_capabilities, process_ingredients, off_dataset_lookup, _extract_product_fields

ALLOWED_ORIGINS = [
    "https://clean-food-app.vercel.app",
    "https://clean-food-app-git-main-amantheshaikh.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://localhost:3001",
    "http://10.0.2.2:3000",
    "http://10.0.2.2:3001",
    "capacitor://localhost",
]

VERCEL_REGEX = r"https://([^.]+-)*clean-food-app.*\.vercel\.app"


class CheckPayload(BaseModel):
    ingredients: str = Field(..., min_length=1, description="Raw ingredient text to analyse")
    preferences: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Optional diet/allergy configuration matching the legacy server payload",
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


async def _resolve_payload(request: Request) -> CheckPayload:
    content_type = (request.headers.get('Content-Type') or '').lower()
    if 'application/json' in content_type:
        try:
            data = await request.json()
        except Exception as exc:
            raise HTTPException(status_code=400, detail=f'Invalid JSON body: {exc}')
        if not isinstance(data, dict):
            raise HTTPException(status_code=400, detail='JSON body must be an object')
        try:
            return CheckPayload(**data)
        except ValidationError as exc:
            raise HTTPException(status_code=400, detail=exc.errors())

    if 'application/x-www-form-urlencoded' in content_type or 'multipart/form-data' in content_type:
        form = await request.form()
        ingredients = form.get('ingredients', '')
        preferences = _parse_preferences(form.get('preferences'))
        try:
            return CheckPayload(ingredients=ingredients, preferences=preferences)
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
            try:
                return CheckPayload(ingredients=ingredients, preferences=preferences)
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
    is_clean: bool
    hits: List[str]
    diet_hits: List[str] = Field(default_factory=list)
    diet_preference: Optional[str] = None
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


def _require_api_key_if_present(request: Request) -> Optional[str]:
    key = request.headers.get("x-api-key") or request.headers.get("X-API-KEY")
    if key and key not in API_KEYS:
        raise HTTPException(status_code=403, detail="invalid api key")
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
async def product_lookup(payload: ProductLookupRequest) -> ProductResponse:
    """Lookup product data by barcode using the local dataset helper.

    This wraps the legacy dataset helpers in `server.py`.
    """
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


@app.post("/check", response_model=CheckResponse)
async def check(request: Request) -> CheckResponse:
    # rate-limit and API key validation (demo in-memory)
    _require_api_key_if_present(request)
    _enforce_rate_limit(request)

    payload = await _resolve_payload(request)
    ingredients = payload.ingredients.strip()
    if not ingredients:
        raise HTTPException(status_code=400, detail="ingredients cannot be empty")

    try:
        analysis = process_ingredients(ingredients, payload.preferences)
    except HTTPException:
        raise
    except Exception as exc:  # pragma: no cover - defensive guardrail
        raise HTTPException(status_code=500, detail=f"analysis failed: {exc}") from exc

    return CheckResponse(**analysis)


@app.get("/")
async def root() -> Dict[str, str]:
    return {"message": "Untainted backend is running"}
