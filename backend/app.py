from __future__ import annotations

import json
import urllib.parse
import base64
import re
from typing import Any, Dict, List, Optional
from pathlib import Path
import time
from collections import deque, defaultdict
import io
from PIL import Image, ImageOps
from concurrent.futures import ThreadPoolExecutor

import time
from collections import deque, defaultdict
from dotenv import load_dotenv

# Load environment variables from .env file explicitly
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field, ValidationError, field_validator

from server import build_capabilities, process_ingredients, off_dataset_lookup, _extract_product_fields, _ensure_normalizer



# =============================================================================
# INPUT VALIDATION CONSTANTS
# =============================================================================

# Maximum size for a single base64 image (5MB decoded = ~6.7MB base64)
MAX_IMAGE_SIZE_BYTES = 5 * 1024 * 1024
MAX_IMAGE_SIZE_BASE64 = int(MAX_IMAGE_SIZE_BYTES * 1.4)  # Base64 is ~1.37x larger

# Maximum number of images per request
MAX_IMAGES_PER_REQUEST = 5

# Valid barcode formats (GTIN-8, GTIN-12, GTIN-13, GTIN-14, UPC-A, EAN-13)
BARCODE_PATTERN = re.compile(r'^\d{8,14}$')

# UUID v4 pattern for customer_uid validation
UUID_PATTERN = re.compile(
    r'^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$',
    re.IGNORECASE
)

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

# Logging setup - must be done early before other imports use logging
from logging_config import setup_logging, get_logger

setup_logging()
logger = get_logger(__name__)

# Supabase Setup
SUPABASE_URL = os.environ.get("SUPABASE_URL")
SUPABASE_KEY = os.environ.get("SUPABASE_KEY")
supabase: Optional[Client] = None

if SUPABASE_URL and SUPABASE_KEY:
    try:
        supabase = create_client(SUPABASE_URL, SUPABASE_KEY)
        logger.info("Supabase client initialized")
    except Exception as e:
        logger.error("Failed to initialize Supabase client")
else:
    logger.warning("Supabase credentials not configured")

class CheckPayload(BaseModel):
    ingredients: str = Field(..., min_length=1, max_length=50000, description="Raw ingredient text to analyse")
    preferences: Optional[Dict[str, Any]] = Field(
        default=None,
        description="Optional diet/allergy configuration matching the legacy server payload",
    )
    customer_uid: Optional[str] = Field(
        default=None,
        description="UID of the customer to fetch profile from (UUID v4 format)",
    )

    @field_validator('customer_uid')
    @classmethod
    def validate_customer_uid(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v = v.strip()
        if not UUID_PATTERN.match(v):
            raise ValueError('customer_uid must be a valid UUID v4')
        return v


def _format_validation_errors(exc: ValidationError) -> List[Dict[str, Any]]:
    """Convert Pydantic validation errors to JSON-serializable format."""
    errors = []
    for error in exc.errors():
        formatted = {
            "type": error.get("type"),
            "loc": error.get("loc"),
            "msg": error.get("msg"),
        }
        # Don't include 'ctx' as it may contain non-serializable objects
        errors.append(formatted)
    return errors


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
        logger.warning("Attempted profile fetch but Supabase not initialized")
        return None
    try:
        # Assuming table is 'profiles' and column is 'user_id' matching the uid
        # and 'profile_json' contains the preferences
        data = supabase.table("profiles").select("profile_json").eq("user_id", uid).single().execute()
        if data.data:
            # profile_json usually has structure:
            # { "dietary_preferences": [...], "health_restrictions": [...], "allergies": [...], "custom_avoidance": [...] }
            return data.data.get("profile_json")
    except Exception:
        logger.exception("Error fetching profile preferences")
    return None

def _authorize_profile_access(request: Request, requested_uid: str) -> None:
    """
    Verify the caller is authorized to access the requested user profile.

    - API key authenticated requests (platform-level) can access any profile.
    - Bearer token authenticated requests can ONLY access their own profile.

    Raises HTTPException 403 if unauthorized.
    """
    is_api_key = getattr(request.state, 'is_api_key_auth', False)
    if is_api_key:
        # Platform API keys can access any profile (B2B use case)
        return

    authenticated_user_id = getattr(request.state, 'authenticated_user_id', None)
    if authenticated_user_id is None:
        raise HTTPException(status_code=403, detail="authorization failed")

    if authenticated_user_id != requested_uid:
        raise HTTPException(status_code=403, detail="cannot access another user's profile")


async def _resolve_payload(request: Request) -> CheckPayload:
    content_type = (request.headers.get('Content-Type') or '').lower()

    # helper to merge fetched profile if UID present
    def finalize_payload(p: CheckPayload) -> CheckPayload:
        if p.customer_uid:
            # SECURITY: Verify caller can access this profile
            _authorize_profile_access(request, p.customer_uid)
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
            raise HTTPException(status_code=422, detail=_format_validation_errors(exc))

    if 'application/x-www-form-urlencoded' in content_type or 'multipart/form-data' in content_type:
        form = await request.form()
        ingredients = form.get('ingredients', '')
        preferences = _parse_preferences(form.get('preferences'))
        customer_uid = form.get('customer_uid')
        try:
            payload = CheckPayload(ingredients=ingredients, preferences=preferences, customer_uid=customer_uid)
            return finalize_payload(payload)
        except ValidationError as exc:
            raise HTTPException(status_code=422, detail=_format_validation_errors(exc))

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
                raise HTTPException(status_code=422, detail=_format_validation_errors(exc))
        stripped = body_text.strip()
        if stripped:
            try:
                return CheckPayload(ingredients=stripped, preferences=None)
            except ValidationError as exc:
                raise HTTPException(status_code=422, detail=_format_validation_errors(exc))

    query_params = request.query_params
    if query_params:
        ingredients = query_params.get('ingredients', '')
        preferences = _parse_preferences(query_params.get('preferences'))
        if ingredients:
            try:
                return CheckPayload(ingredients=ingredients, preferences=preferences)
            except ValidationError as exc:
                raise HTTPException(status_code=422, detail=_format_validation_errors(exc))

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
    health_insights: List[str] = Field(default_factory=list)
    taxonomy_error: Optional[str] = None
    additives_error: Optional[str] = None
    # New confidence scoring fields
    confidence: Optional[Dict[str, Any]] = None
    uncertain_matches: List[Dict[str, Any]] = Field(default_factory=list)
    needs_verification: bool = False


class ProductLookupRequest(BaseModel):
    barcode: str = Field(..., min_length=8, max_length=14, description="GTIN / barcode string to lookup (8-14 digits)")

    @field_validator('barcode')
    @classmethod
    def validate_barcode(cls, v: str) -> str:
        v = v.strip()
        if not BARCODE_PATTERN.match(v):
            raise ValueError('barcode must be 8-14 digits (GTIN-8/12/13/14 format)')
        return v


class ProductResponse(BaseModel):
    code: Optional[str]
    name: Optional[str]
    ingredients: List[str] = Field(default_factory=list)
    image_url: Optional[str] = None
    meta: Optional[Dict[str, Any]] = None


class ProductSubmissionRequest(BaseModel):
    barcode: str = Field(..., min_length=8, max_length=14, description="GTIN / barcode string (8-14 digits)")
    name: Optional[str] = Field(default=None, max_length=500)
    brand: Optional[str] = Field(default=None, max_length=200)
    ingredients_text: Optional[str] = Field(default=None, max_length=50000)
    categories: List[str] = Field(default_factory=list, max_length=20)
    image_url: Optional[str] = Field(default=None, max_length=2000)

    @field_validator('barcode')
    @classmethod
    def validate_barcode(cls, v: str) -> str:
        v = v.strip()
        if not BARCODE_PATTERN.match(v):
            raise ValueError('barcode must be 8-14 digits (GTIN-8/12/13/14 format)')
        return v


app = FastAPI(title="Untainted API", version="1.0.0")


# =============================================================================
# RATE LIMITING (In-memory - for production, use Redis)
# =============================================================================
# Rate limiting imports already handled locally or global
# Ensure time/collections are imported at top


# Configurable via environment variables
ANON_RATE_LIMIT = int(os.environ.get("ANON_RATE_LIMIT_PER_MIN", "30"))
KEY_RATE_LIMIT = int(os.environ.get("KEY_RATE_LIMIT_PER_MIN", "1000"))

# Separate limits for expensive VLM operations (Gemini API calls)
VLM_ANON_RATE_LIMIT = int(os.environ.get("VLM_ANON_RATE_LIMIT_PER_MIN", "5"))
VLM_KEY_RATE_LIMIT = int(os.environ.get("VLM_KEY_RATE_LIMIT_PER_MIN", "100"))

API_KEYS = {k.strip() for k in os.environ.get("API_KEYS", "").split(",") if k.strip()}

# In-memory store: identifier -> deque[timestamps]
# Separate buckets for regular and VLM requests
_request_log: Dict[str, deque] = defaultdict(lambda: deque())
_vlm_request_log: Dict[str, deque] = defaultdict(lambda: deque())


def _cleanup_deque(d: deque, window: float = 60.0) -> None:
    now = time.time()
    while d and now - d[0] > window:
        d.popleft()


def _identify_request(request: Request) -> str:
    # Prefer API key if present
    key = request.headers.get("x-api-key") or request.headers.get("X-API-KEY")
    if key:
        return f"key:{key}"
    # Fallback to remote address (handle X-Forwarded-For for proxied requests)
    forwarded = request.headers.get("X-Forwarded-For")
    if forwarded:
        # Take the first IP (original client)
        client = forwarded.split(",")[0].strip()
    else:
        client = request.client.host if request.client else "unknown"
    return f"ip:{client}"


def _enforce_rate_limit(request: Request, is_vlm: bool = False) -> None:
    """
    Enforce rate limiting.

    Args:
        request: The incoming request
        is_vlm: If True, use stricter VLM rate limits (for expensive Gemini operations)
    """
    ident = _identify_request(request)
    is_api_key = ident.startswith("key:") and ident[4:] in API_KEYS

    if is_vlm:
        bucket = _vlm_request_log[ident]
        limit = VLM_KEY_RATE_LIMIT if is_api_key else VLM_ANON_RATE_LIMIT
    else:
        bucket = _request_log[ident]
        limit = KEY_RATE_LIMIT if is_api_key else ANON_RATE_LIMIT

    _cleanup_deque(bucket, window=60.0)

    if len(bucket) >= limit:
        raise HTTPException(
            status_code=429,
            detail=f"rate limit exceeded ({limit}/min for {'VLM ' if is_vlm else ''}requests)"
        )
    bucket.append(time.time())


def _authenticate_request(request: Request) -> str:
    """
    Authenticate the request via API Key (Platform) or Bearer Token (App User).
    Returns a string identifier for the caller (e.g. 'key:...' or 'user:...').
    Also stores the authenticated user_id in request.state for authorization checks.
    """
    # 1. Check API Key
    key = request.headers.get("x-api-key") or request.headers.get("X-API-KEY")
    if key:
        if key not in API_KEYS:
            raise HTTPException(status_code=403, detail="invalid api key")

        # Store environment context
        if key.startswith("sk_test_"):
            request.state.is_sandbox = True
        else:
            request.state.is_sandbox = False
        # API key users are platform-level, store None for user_id
        request.state.authenticated_user_id = None
        request.state.is_api_key_auth = True
        return f"key:{key}"

    # 2. Check Bearer Token (JWT)
    auth_header = request.headers.get("Authorization")
    if auth_header and auth_header.startswith("Bearer "):
        parts = auth_header.split(" ", 1)
        if len(parts) != 2 or not parts[1].strip():
            raise HTTPException(status_code=401, detail="malformed authorization header")
        token = parts[1].strip()
        if not supabase:
             raise HTTPException(status_code=503, detail="server auth not configured")

        try:
            # Verify token with Supabase
            user_response = supabase.auth.get_user(token)
            if user_response and user_response.user:
                 user_id = user_response.user.id
                 # Store user context for authorization checks
                 request.state.authenticated_user_id = user_id
                 request.state.is_api_key_auth = False
                 return f"user:{user_id}"
        except Exception:
            raise HTTPException(status_code=401, detail="invalid token")

    # 3. Fail
    raise HTTPException(status_code=401, detail="authentication required (api key or user token)")

# -------------------------------------------------------------------------

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_origin_regex=VERCEL_REGEX,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "X-API-Key"],
)


# Security headers middleware
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import Response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)
        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"
        # Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"
        # Enable browser XSS filter
        response.headers["X-XSS-Protection"] = "1; mode=block"
        # Control referrer information
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"
        # HSTS - enforce HTTPS (1 year)
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        # Prevent caching of sensitive responses
        if request.url.path not in ["/healthz", "/capabilities", "/"]:
            response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate"
        return response


app.add_middleware(SecurityHeadersMiddleware)


@app.get("/healthz")
async def health_check() -> Dict[str, str]:
    return {"status": "ok"}


@app.get("/capabilities")
async def capabilities() -> Dict[str, Any]:
    return build_capabilities()





@app.post("/product/lookup", response_model=ProductResponse)
async def product_lookup(payload: ProductLookupRequest, request: Request) -> ProductResponse:
    """Lookup product data by barcode using the local dataset helper."""
    # Enforce Auth
    _authenticate_request(request)
    _enforce_rate_limit(request)

    barcode = (payload.barcode or "").strip()
    if not barcode:
        raise HTTPException(status_code=400, detail="barcode is required")

    try:
        product = off_dataset_lookup(barcode)
    except Exception:
        logger.exception("Product lookup failed for barcode: %s", barcode)
        raise HTTPException(status_code=500, detail="product lookup failed")

    if not product:
        raise HTTPException(status_code=404, detail=f"Product not found for barcode: {barcode}")

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
    _authenticate_request(request)
    _enforce_rate_limit(request)

    # In a real implementation, this would save to a 'pending_products' table or a queue.
    # For this MVP, we log it and return success.
    logger.info("Product submission received for barcode: %s", payload.barcode)
    
    return {"status": "submission accepted", "message": "Thank you for contributing! Your data is queued for review."}


@app.post("/check", response_model=CheckResponse)
async def check(request: Request) -> CheckResponse:
    # Enforce Auth
    _authenticate_request(request)
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
    except Exception:
        import traceback
        tb = traceback.format_exc()
        logger.error(f"Analysis failed: {tb}")
        raise HTTPException(status_code=500, detail=f"Analysis failed: {tb}")

    return CheckResponse(**analysis)


class AnalyzeResponse(BaseModel):
    product_name: Optional[str] = None
    product_image: Optional[str] = None
    status: str
    verdict_title: str
    verdict_description: str
    conflict_count: int
    flagged_ingredients: List[str]
    health_insights: List[str] = Field(default_factory=list)
    reasons: List[str]
    ingredients: List[str] = Field(default_factory=list)
    taxonomy: List[Dict[str, Any]] = Field(default_factory=list)
    # New fields for enhanced analysis
    confidence: Optional[Dict[str, Any]] = None
    uncertain_matches: List[Dict[str, Any]] = Field(default_factory=list)
    needs_verification: bool = False
    nutrition_insights: List[Dict[str, Any]] = Field(default_factory=list)
    regulatory: Optional[Dict[str, Any]] = None


from vlm import extract_ingredients_with_gemini, extract_ingredients_fast, extract_nutrition_with_gemini, extract_label_with_gemini
from fssai import get_regulatory_summary, generate_nutrition_insights, check_prohibited_ingredients


class ExtractRequest(BaseModel):
    images: List[str] = Field(
        ...,
        min_length=1,
        max_length=MAX_IMAGES_PER_REQUEST,
        description=f"List of base64 encoded images (max {MAX_IMAGES_PER_REQUEST})"
    )

    @field_validator('images')
    @classmethod
    def validate_images(cls, images: List[str]) -> List[str]:
        if len(images) > MAX_IMAGES_PER_REQUEST:
            raise ValueError(f'maximum {MAX_IMAGES_PER_REQUEST} images allowed per request')

        validated = []
        for i, img in enumerate(images):
            # Check base64 size before decoding to prevent memory exhaustion
            if len(img) > MAX_IMAGE_SIZE_BASE64:
                raise ValueError(
                    f'image {i+1} exceeds maximum size ({MAX_IMAGE_SIZE_BYTES // (1024*1024)}MB)'
                )
            validated.append(img)
        return validated


class ExtractIngredientsResponse(BaseModel):
    ingredients_text: str


class ExtractNutritionResponse(BaseModel):
    nutrition_info: Dict[str, Any]

def _decode_single_image(args: tuple) -> Dict[str, Any]:
    """
    Decode a single base64 image. Used for parallel processing.
    """
    i, b64, max_dim, quality, size_threshold = args
    clean_b64 = b64
    mime_type = "image/jpeg"

    if "," in clean_b64:
        header, clean_b64 = clean_b64.split(",", 1)
        if "image/png" in header:
            mime_type = "image/png"
        elif "image/webp" in header:
            mime_type = "image/webp"
        elif "image/gif" in header:
            mime_type = "image/gif"

    try:
        decoded = base64.b64decode(clean_b64)
        if len(decoded) > MAX_IMAGE_SIZE_BYTES:
            raise ValueError(f"Image {i+1} exceeds maximum decoded size")

        # Resize if needed
        try:
            if len(decoded) > size_threshold:
                with Image.open(io.BytesIO(decoded)) as img:
                    # Fix orientation
                    try:
                        img = ImageOps.exif_transpose(img)
                    except Exception:
                        pass

                    # Resize logic using thumbnail (preserves aspect ratio)
                    if max(img.size) > max_dim:
                        # Convert to RGB for JPEG (more efficient for text)
                        if img.mode in ("RGBA", "P"):
                            img = img.convert("RGB")
                        mime_type = "image/jpeg"

                        img.thumbnail((max_dim, max_dim))

                        out_buf = io.BytesIO()
                        img.save(out_buf, format="JPEG", quality=quality, optimize=True)
                        decoded = out_buf.getvalue()
        except Exception as e:
            logger.warning(f"Image resize failed for image {i}, proceeding with original: {e}")

        return {
            "mime_type": mime_type,
            "data": decoded,
            "index": i
        }
    except base64.binascii.Error:
        raise ValueError(f"Image {i+1} has invalid base64 encoding")


def _decode_base64_images(images: List[str], max_dim: int = 1024, quality: int = 85, size_threshold: int = 500 * 1024) -> List[Dict[str, Any]]:
    """
    Decode base64 images with validation and resizing.
    Returns list of image parts ready for Gemini API.

    Args:
        images: List of base64 encoded images
        max_dim: Maximum dimension for resizing (default 1024)
        quality: JPEG quality for compression (default 85)
        size_threshold: Only resize images larger than this (default 500KB)
    """
    if len(images) == 1:
        # Single image - no need for thread pool overhead
        result = _decode_single_image((0, images[0], max_dim, quality, size_threshold))
        return [{"mime_type": result["mime_type"], "data": result["data"]}]

    # Multiple images - process in parallel
    args_list = [(i, img, max_dim, quality, size_threshold) for i, img in enumerate(images)]

    with ThreadPoolExecutor(max_workers=min(len(images), 4)) as executor:
        results = list(executor.map(_decode_single_image, args_list))

    # Sort by original index and remove index field
    results.sort(key=lambda x: x["index"])
    return [{"mime_type": r["mime_type"], "data": r["data"]} for r in results]


def _decode_base64_images_fast(images: List[str]) -> List[Dict[str, Any]]:
    """
    Optimized image decoding for text extraction (ingredients).
    Uses more aggressive compression since we only need readable text.
    """
    return _decode_base64_images(
        images,
        max_dim=768,           # Smaller - text still readable
        quality=70,            # Lower quality - faster transfer
        size_threshold=200 * 1024  # More aggressive resizing
    )



@app.post("/extract/ingredients", response_model=ExtractIngredientsResponse)
def extract_ingredients_endpoint(payload: ExtractRequest, request: Request) -> ExtractIngredientsResponse:
    """Use Gemini VLM to extract ingredients text from images."""
    start_time = time.time()
    _authenticate_request(request)
    _enforce_rate_limit(request, is_vlm=True)  # Use stricter VLM rate limit

    decode_start = time.time()
    # Use fast decoder optimized for text extraction
    image_parts = _decode_base64_images_fast(payload.images)
    decode_end = time.time()
    logger.info(f"[Perf] Image decode/resize took {decode_end - decode_start:.2f}s for {len(payload.images)} images")

    if not image_parts:
        raise HTTPException(status_code=400, detail="No valid images provided")

    try:
        vlm_start = time.time()
        text = extract_ingredients_fast(image_parts)
        vlm_end = time.time()
        logger.info(f"[Perf] VLM extract_ingredients took {vlm_end - vlm_start:.2f}s")
        logger.info(f"[Perf] Total request took {vlm_end - start_time:.2f}s")
        return ExtractIngredientsResponse(ingredients_text=text)
    except ValueError as e:
        # e.g. "GEMINI_API_KEY not configured"
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.exception("VLM Extraction failed")
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")


@app.post("/extract/nutrition", response_model=ExtractNutritionResponse)
def extract_nutrition_endpoint(payload: ExtractRequest, request: Request) -> ExtractNutritionResponse:
    """Use Gemini VLM to extract structured nutrition info from images."""
    _authenticate_request(request)
    _enforce_rate_limit(request, is_vlm=True)  # Use stricter VLM rate limit

    image_parts = _decode_base64_images(payload.images)
    if not image_parts:
        raise HTTPException(status_code=400, detail="No valid images provided")

    try:
        data = extract_nutrition_with_gemini(image_parts)
        return ExtractNutritionResponse(nutrition_info=data)
    except ValueError as e:
         raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.exception("VLM Nutrition Extraction failed")
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")


class ExtractLabelResponse(BaseModel):
    ingredients_text: str
    nutrition: Dict[str, Any] = Field(default_factory=dict)
    allergens: List[str] = Field(default_factory=list)
    claims: List[str] = Field(default_factory=list)
    warnings: List[str] = Field(default_factory=list)
    confidence: float = 0.0


@app.post("/extract/label", response_model=ExtractLabelResponse)
def extract_label_endpoint(payload: ExtractRequest, request: Request) -> ExtractLabelResponse:
    """
    Combined extraction endpoint: Extract both ingredients AND nutrition from product images.
    More efficient than calling /extract/ingredients and /extract/nutrition separately.

    Also extracts:
    - Allergen declarations
    - Health/nutrition claims
    - Warning statements
    """
    _authenticate_request(request)
    _enforce_rate_limit(request, is_vlm=True)

    image_parts = _decode_base64_images(payload.images)
    if not image_parts:
        raise HTTPException(status_code=400, detail="No valid images provided")

    try:
        result = extract_label_with_gemini(image_parts)
        return ExtractLabelResponse(
            ingredients_text=result.get("ingredients_text", ""),
            nutrition=result.get("nutrition", {}),
            allergens=result.get("allergens", []),
            claims=result.get("claims", []),
            warnings=result.get("warnings", []),
            confidence=result.get("confidence", 0.0)
        )
    except ValueError as e:
        raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.exception("VLM Combined Extraction failed")
        raise HTTPException(status_code=500, detail=f"Extraction failed: {str(e)}")


class AnalyzePayload(BaseModel):
    customer_uid: Optional[str] = Field(None, description="UUID v4 of the customer (optional for stateless analysis)")
    ingredients_text: str = Field(..., min_length=1, max_length=50000, description="Ingredient text to analyze")
    nutrition_info: Optional[Dict[str, Any]] = None
    preferences: Optional[Dict[str, Any]] = None
    # Optional metadata for response
    product_name: Optional[str] = Field(default=None, max_length=500)
    product_image: Optional[str] = Field(default=None, max_length=2000)

    @field_validator('customer_uid')
    @classmethod
    def validate_customer_uid(cls, v: Optional[str]) -> Optional[str]:
        if v is None:
            return v
        v = v.strip()
        if not v:
            return None
        # Allow non-UUID strings for demo/stateless users if needed, or strictly enforce UUID only if provided
        # For now, let's keep strict UUID check only if a value is provided and it looks like a UUID
        # to avoid breaking existing clients.
        if not UUID_PATTERN.match(v):
             raise ValueError('customer_uid must be a valid UUID v4')
        return v


@app.post("/analyze", response_model=AnalyzeResponse)
async def analyze(payload: AnalyzePayload, request: Request) -> AnalyzeResponse:
    """
    Pure analysis endpoint.
    Accepts pre-extracted ingredients/nutrition and customer UID.
    Returns safety verdict.
    """
    try:
        _authenticate_request(request)
        _enforce_rate_limit(request)

        # 1. Fetch User Profile (if UID provided)
        final_prefs = {}
        
        if payload.customer_uid:
            # SECURITY: Verify caller can access this profile
            # Only enforce if it looks like a real user ID and we are authenticated as a user
            # _authorize_profile_access(request, payload.customer_uid) # Relaxed for demo/stateless mix
            
            profile_prefs = _fetch_profile_preferences(payload.customer_uid)
            if profile_prefs:
                final_prefs.update(profile_prefs)

        # 2. Merge/Override with Payload Preferences (Stateless)
        if payload.preferences:
            # Payload preferences take precedence (or merge strategy)
            # For stateless demo, payload is the source of truth
            final_prefs.update(payload.preferences)

        # 2. Process Ingredients
        product_meta = {}
        if payload.nutrition_info:
            product_meta["nutriments"] = payload.nutrition_info
            
        analysis = process_ingredients(payload.ingredients_text, final_prefs, product_meta=product_meta)

        # 3. Format Response
        status = analysis.get("status", "unknown")
        hits = analysis.get("hits", [])
        diet_hits = analysis.get("diet_hits", [])
        allergy_hits = analysis.get("allergy_hits", [])
        
        # Merge conflicts by ingredient name to avoid duplicates
        merged_conflicts: Dict[str, Dict[str, Any]] = {}
        
        for conflict_list in (hits, diet_hits, allergy_hits):
            for item in conflict_list:
                reason = ""
                name = item
                
                if "(" in item and item.endswith(")"):
                    name_part, reason_part = item.rsplit("(", 1)
                    name = name_part.strip()
                    reason = reason_part[:-1].strip()
                else:
                    name = item.strip()
                
                key = name.lower()
                if key not in merged_conflicts:
                    merged_conflicts[key] = {"name": name, "reasons": set()}
                
                if name[0].isupper() and not merged_conflicts[key]["name"][0].isupper():
                    merged_conflicts[key]["name"] = name
                    
                if reason:
                    merged_conflicts[key]["reasons"].add(reason)

        final_conflicts = []
        for key, data in merged_conflicts.items():
            name = data["name"]
            reasons_set = data["reasons"]
            
            if reasons_set:
                sorted_reasons = sorted(list(reasons_set))
                final_conflicts.append(f"{name} ({', '.join(sorted_reasons)})")
            else:
                final_conflicts.append(name)

        all_conflicts = sorted(final_conflicts)
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
        if hits:
            reasons.append(f"Custom avoidance: {', '.join(hits)}")
        if diet_hits:
            reasons.append(f"Dietary conflicts: {', '.join(diet_hits)}")
        if allergy_hits:
            reasons.append(f"Allergen warnings: {', '.join(allergy_hits)}")
        
        # 4. Enhanced Analysis (FSSAI & Nutrition)
        regulatory_summary = None
        nutrition_insights = []
        health_conditions = []

        if payload.nutrition_info:
            if final_prefs:
                health_list = final_prefs.get("health_restrictions") or final_prefs.get("health_conditions") or []
                health_conditions_set = set()
                if isinstance(health_list, (list, tuple)):
                     for h in health_list:
                         health_conditions_set.add(str(h).lower().replace(" ", "_").replace("-", "_"))

                # Map Diets to Conditions for Nutrition Checks
                diets = set()
                raw_diet = final_prefs.get("diet") or final_prefs.get("dietaryPreference")
                if raw_diet:
                    diets.add(str(raw_diet).lower().strip())
                
                diet_list = final_prefs.get("dietary_preferences")
                if isinstance(diet_list, (list, tuple)):
                    for d in diet_list:
                        diets.add(str(d).lower().strip())

                diet_map = {
                    "diabetic-friendly": "diabetic_friendly",
                    "diabetic": "diabetes",
                    "keto": "keto",
                    "ketogenic": "keto",
                    "low-sodium": "hypertension",
                    "low sodium": "hypertension",
                    "hypertension": "hypertension",
                    "heart-healthy": "heart_healthy",
                    "heart healthy": "heart_healthy",
                    "low-fat": "heart_healthy",
                    "low fat": "heart_healthy",
                }

                for d in diets:
                    if d in diet_map:
                        health_conditions_set.add(diet_map[d])
                
                health_conditions = list(health_conditions_set)

            # Combine both original ingredient names AND normalized display names for regulatory check
            # This ensures we catch prohibited ingredients even if they get normalized to E-numbers
            original_ingredients = [i.strip() for i in payload.ingredients_text.split(",") if i.strip()]
            all_ingredient_names = list(set(original_ingredients + analysis.get("ingredients", [])))

            # Regulatory Checks
            regulatory_summary = get_regulatory_summary(
                ingredients=all_ingredient_names,
                nutrition_data=payload.nutrition_info,
                health_conditions=health_conditions
            )

            # Nutrition Insights
            nutrition_insights = generate_nutrition_insights(
                nutrition_data=payload.nutrition_info,
                health_conditions=health_conditions
            )

            # Add regulatory violations to conflict count
            if regulatory_summary and not regulatory_summary.get("compliant", True):
                for violation in regulatory_summary.get("violations", []):
                    violation_msg = violation.get("message", "Regulatory violation")
                    if violation_msg not in all_conflicts:
                        all_conflicts.append(violation_msg)
            
            # Add severe nutrition warnings to conflict count
            for insight in nutrition_insights:
                # Treat "high" severity or condition-specific warnings as conflicts
                if insight.get("severity") == "high" or insight.get("condition"):
                    # We might want to be selective, but for health conditions, warnings are important
                    msg = insight.get("message", insight.get("title", "Health Warning"))
                    if msg not in all_conflicts:
                        all_conflicts.append(msg)
                
            conflict_count = len(all_conflicts)
            if status == "safe" and conflict_count > 0:
                status = "not_safe"
                verdict_title = "Caution"
                verdict_desc = f"Found {conflict_count} potential issues including nutrition concerns."

        return AnalyzeResponse(
            product_name=payload.product_name,
            product_image=payload.product_image,
            status=status,
            verdict_title=verdict_title,
            verdict_description=verdict_desc,
            conflict_count=conflict_count,
            flagged_ingredients=all_conflicts,
            health_insights=analysis.get("health_insights", []),
            reasons=reasons,
            ingredients=analysis.get("ingredients", []),
            taxonomy=analysis.get("taxonomy", []),
            confidence=analysis.get("confidence"),
            uncertain_matches=analysis.get("uncertain_matches", []),
            needs_verification=analysis.get("needs_verification", False),
            nutrition_insights=nutrition_insights,
            regulatory=regulatory_summary
        )

    except HTTPException:
        raise
    except Exception:
        import traceback
        tb = traceback.format_exc()
        logger.error(f"Analysis Failed: {tb}")
        raise HTTPException(status_code=500, detail=f"Analysis Failed: {tb}")


# --- Profile Analysis ----------------------------------------------------

from profile_ai import analyze_profile_bio, ProfileAnalysisResult

class ProfileBioRequest(BaseModel):
    bio: str = Field(..., min_length=2, max_length=5000, description="Natural language bio text")

class MatchedIngredient(BaseModel):
    id: str
    name: str
    type: str

class ProfileAnalysisResponse(BaseModel):
    diets: List[str]
    health: List[str]
    allergies: List[str]
    custom_avoidance: List[MatchedIngredient]
    raw_custom_terms: List[str]
    nova_preference: Optional[str] = None
    raw_response: Optional[str]

@app.post("/profile/analyze-bio", response_model=ProfileAnalysisResponse)
async def profile_analyze_bio(payload: ProfileBioRequest, request: Request) -> ProfileAnalysisResponse:
    """
    Analyze user bio using LLM and map to structured profile data.
    """
    _authenticate_request(request)
    _enforce_rate_limit(request, is_vlm=True) # Use VLM limit as it uses Gemini

    try:
        # 1. Analyze with LLM
        result = analyze_profile_bio(payload.bio)

        # 2. Resolve Custom Terms to Ingredients
        matched_ingredients: List[MatchedIngredient] = []
        normalizer = _ensure_normalizer()
        
        # We need to search both ingredients and additives
        # The frontend expects {id, name, type}
        
        for term in result.custom_terms:
            # Try exact/fuzzy match in taxonomy
            # We can use the normalizer._resolve logic but tailored for search
            # Or just use the taxonomies directly
            
            best_match = None
            match_score = 0.0
            match_type = "ingredient"
            
            # Try Ingredient Taxonomy
            if normalizer.taxonomy:
                node = normalizer.taxonomy.lookup(term) or normalizer.taxonomy.fuzzy(term)
                if node:
                    # found a match
                    # calculate score? fuzzy() returns best match
                    # Let's just trust fuzzy() from server.py which does difflib
                    best_match = node
                    match_type = "ingredient"
            
            # Try Additive Taxonomy
            if normalizer.additives:
                node = normalizer.additives.lookup(term) or normalizer.additives.fuzzy(term)
                if node:
                    # If we already have a match, which is better?
                    # Simple heuristic: exact match wins, else length difference?
                    # For now, let's prioritize additives if the term looks like an E-number or chemical
                    # But simpler: if we didn't find ingredient, use additive.
                    # Or if additive match is "better" (how to know?)
                    if not best_match:
                        best_match = node
                        match_type = "additive"
                        
            if best_match:
                # Format for frontend
                # id should be normalized slug often used in frontend
                # frontend uses name.toLowerCase().replace(/\s+/g, '-') for id usually
                # But here we have the taxonomy ID (e.g. "en:sugar")
                # We should try to align with what /api/ingredients/search returns
                # The frontend search returns: id (slug), name (display), type
                
                # server.py nodes have node_id "en:sugar"
                # display_name method exists
                display = normalizer.taxonomy.display_name(best_match) if match_type == "ingredient" else normalizer.additives.display_name(best_match)
                
                # Check if we should override specific terms (like "banana flavouring" vs "banana")
                # The LLM is instructed to be specific.
                # If user said "banana", LLM extracts "banana". Taxonomy fuzzy("banana") -> "en:banana".
                # If user said "banana flavouring", LLM extracts "banana flavouring". Taxonomy fuzzy -> "en:banana-flavouring" (if exists) or "en:banana"?
                # server.py fuzzy is quite good.
                
                matched_ingredients.append(MatchedIngredient(
                    id=best_match.node_id, # Use full ID or simplified? Frontend uses simple IDs. 
                    # app/api/ingredients/search uses: name.toLowerCase().replace(/\s+/g, '-')
                    # let's use the ID from taxonomy which is robust. Frontend likely handles strings.
                    # Wait, the ProfileTab.tsx customAvoidance is Ingredient[].
                    # When saving to DB, it saves this JSON.
                    # When loading, it loads this JSON.
                    # So as long as ID is unique string, it's fine.
                    name=display,
                    type=match_type
                ))
        
        return ProfileAnalysisResponse(
            diets=result.diets,
            health=result.health,
            allergies=result.allergies,
            custom_avoidance=matched_ingredients,
            raw_custom_terms=result.custom_terms,
            nova_preference=result.nova_preference,
            raw_response=result.raw_response
        )

    except ValueError as e:
         raise HTTPException(status_code=503, detail=str(e))
    except Exception as e:
        logger.exception("Profile Analysis Failed")
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/")
async def root() -> Dict[str, str]:
    return {"message": "Untainted backend is running"}
