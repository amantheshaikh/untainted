"""
Vision Language Model (VLM) Integration for Label Extraction

Uses Google Gemini for extracting:
- Ingredients text from product images
- Nutrition facts from product images
- Combined extraction for efficiency
"""

import os
import json
import re
from typing import Dict, Any, Optional, List

import google.generativeai as genai

# Configure API key
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

# Model to use for extraction
# Model to use for extraction
GEMINI_MODEL = "gemini-3-flash-preview"


def _clean_json_response(text: str) -> str:
    """Clean markdown code blocks from response."""
    cleaned = text.strip()
    if cleaned.startswith("```json"):
        cleaned = cleaned[7:]
    if cleaned.startswith("```"):
        cleaned = cleaned[3:]
    if cleaned.endswith("```"):
        cleaned = cleaned[:-3]
    return cleaned.strip()


def _parse_numeric(value: Any) -> Optional[float]:
    """Parse a numeric value from various formats."""
    if value is None:
        return None
    if isinstance(value, (int, float)):
        return float(value)
    if isinstance(value, str):
        # Remove units and extract number
        cleaned = re.sub(r'[^\d.]', '', value.replace(',', '.'))
        try:
            return float(cleaned) if cleaned else None
        except ValueError:
            return None
    return None


def _normalize_nutrition_keys(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Normalize nutrition data keys to standard format.

    Standard keys (per 100g):
    - energy_kcal / calories
    - total_fat_g
    - saturated_fat_g
    - trans_fat_g
    - carbohydrates_g
    - sugars_g / sugar_g
    - fiber_g
    - protein_g
    - sodium_mg
    - cholesterol_mg
    """
    key_mapping = {
        # Energy
        "calories": "energy_kcal",
        "energy": "energy_kcal",
        "kcal": "energy_kcal",
        "energy_value": "energy_kcal",

        # Fat
        "fat": "total_fat_g",
        "total fat": "total_fat_g",
        "total_fat": "total_fat_g",
        "fat_g": "total_fat_g",

        "saturated fat": "saturated_fat_g",
        "saturated_fat": "saturated_fat_g",
        "sat fat": "saturated_fat_g",
        "sat_fat": "saturated_fat_g",

        "trans fat": "trans_fat_g",
        "trans_fat": "trans_fat_g",

        # Carbs
        "carbohydrate": "carbohydrates_g",
        "carbohydrates": "carbohydrates_g",
        "carbs": "carbohydrates_g",
        "total carbohydrate": "carbohydrates_g",
        "total_carbohydrate": "carbohydrates_g",

        "sugar": "sugars_g",
        "sugars": "sugars_g",
        "total sugars": "sugars_g",
        "total_sugars": "sugars_g",
        "added sugars": "added_sugars_g",
        "added_sugars": "added_sugars_g",

        "dietary fiber": "fiber_g",
        "dietary_fiber": "fiber_g",
        "fibre": "fiber_g",
        "fiber": "fiber_g",

        # Protein
        "protein": "protein_g",
        "proteins": "protein_g",

        # Minerals
        "sodium": "sodium_mg",
        "salt": "sodium_mg",  # Will need conversion: salt * 400 = sodium
        "na": "sodium_mg",

        "cholesterol": "cholesterol_mg",

        # Serving
        "serving size": "serving_size",
        "serving_size": "serving_size",
        "servings per container": "servings_per_container",
        "servings_per_container": "servings_per_container",
    }

    normalized = {}
    is_salt_based = False

    for key, value in data.items():
        # Skip internal keys
        if key.startswith("_") or key == "is_per_100g":
            normalized[key] = value
            continue

        # Normalize key
        key_lower = key.lower().strip().replace("-", "_").replace(" ", "_")

        # Remove trailing units from keys
        key_lower = re.sub(r'_?(g|mg|kcal|kj)$', '', key_lower)

        # Check if this is salt (needs conversion to sodium)
        if key_lower in ("salt", "salt_g"):
            is_salt_based = True

        # Map to standard key
        standard_key = key_mapping.get(key_lower, key_lower)

        # Parse numeric value
        parsed_value = _parse_numeric(value)
        if parsed_value is not None:
            normalized[standard_key] = parsed_value
        elif isinstance(value, str) and value.strip():
            # Keep string values like serving_size
            normalized[standard_key] = value.strip()

    # Convert salt to sodium if needed (salt g * 400 = sodium mg approximately)
    if is_salt_based and "sodium_mg" in normalized:
        # If we have salt in grams, convert to sodium in mg
        salt_g = normalized.get("sodium_mg", 0)
        if isinstance(salt_g, (int, float)) and salt_g < 10:  # Likely in grams, convert
            normalized["sodium_mg"] = salt_g * 400

    return normalized


def extract_ingredients_with_gemini(image_parts: List[Dict[str, Any]]) -> str:
    """
    Uses Gemini to extract ingredients text from images.
    Returns the raw ingredient text.
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not configured")

    model = genai.GenerativeModel(GEMINI_MODEL)

    prompt = """
    Analyze these product images carefully. Your task is to find and transcribe the INGREDIENTS list.

    Instructions:
    1. Look for text that starts with "Ingredients:", "INGREDIENTS:", or similar
    2. Transcribe ALL ingredients exactly as they appear, including:
       - Sub-ingredients in parentheses
       - Percentage values if shown
       - Allergen warnings like "Contains: milk, soy"
    3. Preserve the original formatting and punctuation
    4. If multiple images show the same ingredients, use the clearest one
    5. Do NOT include nutrition facts, just ingredients

    Output format:
    - Return ONLY the ingredients text, nothing else
    - Do not include the word "Ingredients:" at the start
    - If no ingredients found, return empty string

    Example output:
    Water, Sugar, Cocoa Powder (10%), Milk Solids, Emulsifier (Soy Lecithin), Natural Flavors. Contains: Milk, Soy.
    """

    content = [prompt]
    for img in image_parts:
        content.append(img)

    try:
        response = model.generate_content(content, request_options={'timeout': 30})
        try:
            return response.text.strip()
        except ValueError:
            # Handle cases where response.text is not available (e.g. safety filters)
            if response.candidates:
                print(f"Gemini output blocked. Finish reason: {response.candidates[0].finish_reason}")
                print(f"Safety ratings: {response.candidates[0].safety_ratings}")
            return ""
    except Exception as e:
        print(f"VLM Error: {e}")
        raise e


def extract_nutrition_with_gemini(image_parts: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Uses Gemini to extract structured nutrition info from images.
    Returns normalized nutrition data per 100g where possible.
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not configured")

    model = genai.GenerativeModel(GEMINI_MODEL)

    prompt = """
    Analyze these product images to extract the NUTRITION FACTS / NUTRITION INFORMATION table.

    Instructions:
    1. Find the nutrition label/table in the image(s)
    2. Extract ALL nutritional values you can find
    3. IMPORTANT: Prefer "per 100g" or "per 100ml" values if available
    4. If only "per serving" is available, include the serving size
    5. Include units in the values (e.g., "5g", "120mg")

    Return a JSON object with these fields (use snake_case, include only what you find):
    {
        "serving_size": "30g",
        "servings_per_container": 10,
        "calories": 120,
        "total_fat": "5g",
        "saturated_fat": "2g",
        "trans_fat": "0g",
        "cholesterol": "10mg",
        "sodium": "150mg",
        "carbohydrates": "15g",
        "fiber": "1g",
        "sugars": "10g",
        "added_sugars": "8g",
        "protein": "3g",
        "is_per_100g": true
    }

    Set "is_per_100g" to true if values are per 100g/100ml, false if per serving.

    Return ONLY valid JSON, no markdown or explanation.
    """

    try:
        content = [prompt]
        for img in image_parts:
            content.append(img)

        response = model.generate_content(content, request_options={'timeout': 30})
        try:
            text_content = response.text
        except ValueError:
             if response.candidates:
                print(f"Gemini output blocked. Finish reason: {response.candidates[0].finish_reason}")
             return {"_error": "No content returned from model"}
             
        clean_json = _clean_json_response(text_content)
        raw_data = json.loads(clean_json)

        # Normalize the keys and values
        normalized = _normalize_nutrition_keys(raw_data)

        # Add metadata
        normalized["_extraction_source"] = "gemini-vlm"
        normalized["_is_per_100g"] = raw_data.get("is_per_100g", False)

        return normalized

    except json.JSONDecodeError as e:
        print(f"Gemini Nutrition JSON Error: {e}")
        return {"_error": "Failed to parse nutrition data", "_raw": response.text if 'response' in locals() else None}
    except Exception as e:
        print(f"Gemini Nutrition Error: {e}")
        return {"_error": str(e)}


def extract_label_with_gemini(image_parts: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Combined extraction: Get both ingredients and nutrition in one API call.
    More efficient than two separate calls.

    Returns:
        {
            "ingredients_text": "...",
            "nutrition": {...},
            "allergens": [...],
            "claims": [...],
            "confidence": 0.95
        }
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not configured")

    model = genai.GenerativeModel(GEMINI_MODEL)

    prompt = """
    Analyze these product label images and extract ALL information.

    Return a JSON object with:

    {
        "ingredients_text": "Full ingredients list as it appears on label",
        "nutrition": {
            "serving_size": "30g",
            "calories": 120,
            "total_fat_g": 5,
            "saturated_fat_g": 2,
            "trans_fat_g": 0,
            "cholesterol_mg": 10,
            "sodium_mg": 150,
            "carbohydrates_g": 15,
            "fiber_g": 1,
            "sugars_g": 10,
            "protein_g": 3,
            "is_per_100g": false
        },
        "allergens": ["milk", "soy", "wheat"],
        "claims": ["sugar free", "high protein", "organic"],
        "warnings": ["Contains phenylalanine"],
        "confidence": 0.95
    }

    Instructions:
    1. ingredients_text: Full comma-separated list, no "Ingredients:" prefix
    2. nutrition: Numeric values only, use standard keys with units (g, mg)
    3. allergens: List of allergens from "Contains:" statement or bold text
    4. claims: Any health/nutrition claims on the package
    5. warnings: Any warnings or advisory statements
    6. confidence: Your confidence in extraction accuracy (0.0-1.0)

    Return ONLY valid JSON.
    """

    try:
        content = [prompt]
        for img in image_parts:
            content.append(img)

        response = model.generate_content(content, request_options={'timeout': 30})
        try:
            text_content = response.text
        except ValueError:
             if response.candidates:
                print(f"Gemini output blocked. Finish reason: {response.candidates[0].finish_reason}")
             raise ValueError("Model returned no content")

        clean_json = _clean_json_response(text_content)
        data = json.loads(clean_json)

        # Normalize nutrition data
        if "nutrition" in data and isinstance(data["nutrition"], dict):
            data["nutrition"] = _normalize_nutrition_keys(data["nutrition"])

        # Ensure required fields
        data.setdefault("ingredients_text", "")
        data.setdefault("nutrition", {})
        data.setdefault("allergens", [])
        data.setdefault("claims", [])
        data.setdefault("warnings", [])
        data.setdefault("confidence", 0.8)

        return data

    except json.JSONDecodeError as e:
        print(f"Gemini Combined Extraction JSON Error: {e}")
        # Fallback to separate extraction
        return {
            "ingredients_text": "",
            "nutrition": {},
            "allergens": [],
            "claims": [],
            "warnings": [],
            "confidence": 0.0,
            "_error": "JSON parse failed, try separate extraction"
        }
    except Exception as e:
        print(f"Gemini Combined Extraction Error: {e}")
        return {
            "ingredients_text": "",
            "nutrition": {},
            "allergens": [],
            "claims": [],
            "warnings": [],
            "confidence": 0.0,
            "_error": str(e)
        }
