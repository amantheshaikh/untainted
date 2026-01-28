# System Map (Codebase Hologram)

This file maps logical features to physical code locations.

## 1. Core Features

### Feature: Product Lookup (Barcode)
- **Endpoint**: `POST /product/lookup`
- **Entry Point**: `backend/app.py:product_lookup`
- **Logic**:
    1.  Auth Check: `backend/app.py:_authenticate_request`
    2.  Dataset Query: `backend/server.py:off_dataset_lookup` (Uses Open Food Facts DB)
    3.  Field Extraction: `backend/server.py:_extract_product_fields`
- **Frontend Client**: `landing-page/lib/untainted-api.ts:lookupProductByBarcode`

### Feature: Ingredient Analysis (Text/Label)
- **Endpoint**: `POST /check` or `POST /analyze`
- **Entry Point**: `backend/app.py:check`
- **Logic**:
    1.  Payload Resolution: `backend/app.py:_resolve_payload`
    2.  Core Analysis: `backend/server.py:process_ingredients`
        -   Normalizer: `backend/server.py:IngredientNormalizer`
        -   Taxonomy: `backend/server.py:IngredientTaxonomy` (Loads `backend/ingredients.txt`)
        -   Safety Check: Checks against `CLEAN_EATING_WATCHLIST` in `server.py`.
- **Frontend Client**: `landing-page/lib/untainted-api.ts:analyzeIngredients`

### Feature: Vision Extraction (VLM)
- **Endpoint**: 
    - `POST /extract/ingredients` (Text only)
    - `POST /extract/nutrition` (Nutrition facts only)
    - `POST /extract/label` (Combined)
- **Entry Point**: 
    - `backend/app.py:extract_ingredients_endpoint`
    - `backend/app.py:extract_nutrition_endpoint`
    - `backend/app.py:extract_label_endpoint`
- **Logic**:
    1.  Image Decode: `backend/app.py:_decode_base64_images`
    2.  Gemini Call: 
        - `backend/vlm.py:extract_ingredients_with_gemini`
        - `backend/vlm.py:extract_nutrition_with_gemini`
        - `backend/vlm.py:extract_label_with_gemini`
    3.  Prompt: Defined inside `backend/vlm.py`.

## 2. Critical Configuration

### Backend (`backend/.env` / `backend/app.py`)
-   `OFF_TAXONOMY_PATH`: Path to `ingredients.txt`.
-   `GEMINI_API_KEY`: Required for VLM features.
-   `SUPABASE_URL` / `SUPABASE_KEY`: Database connection.
-   `Rate Limits`: `ANON_RATE_LIMIT_PER_MIN`, `KEY_RATE_LIMIT_PER_MIN` (in `app.py`).

### Frontend (`landing-page/.env.local`)
-   `NEXT_PUBLIC_API_BASE`: URL of the backend (e.g., `https://api.untainted.io`).

## 3. Data Flow Triggers
-   **Server Actions**: `landing-page/app/actions.ts` handles form submissions (like "Contact Us").
-   **Client Fetches**: All app logic (`/scan`, `/result`) uses `landing-page/lib/untainted-api.ts` to talk to the backend.
