
import os
import google.generativeai as genai
from typing import Dict, Any, Optional, List
import json
import re

# Configure API key
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

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

def extract_ingredients_with_gemini(image_parts: List[Dict[str, Any]]) -> str:
    """
    Uses Gemini to extract ingredients text from images.
    Returns the raw ingredient text.
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not configured")

    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = """
    Analyze these product images. Locate the "Ingredients" list. 
    Transcribe the ingredients exactly as they appear on the package. 
    Do NOT include the word "Ingredients:" or any other labels. 
    Just return the comma-separated list of ingredients.
    If you cannot find an ingredient list, return empty string.
    """
    
    try:
        # Prepare content: Text prompt + Images
        content = [prompt]
        for img in image_parts:
             # structure expected by google-generativeai for images
             # assuming img is {"mime_type": "...", "data": bytes}
             content.append(img)

        response = model.generate_content(content)
        return response.text.strip()
    except Exception as e:
        print(f"Gemini Ingredients Error: {e}")
        return ""

def extract_nutrition_with_gemini(image_parts: List[Dict[str, Any]]) -> Dict[str, Any]:
    """
    Uses Gemini to extract nutrition info as structured JSON.
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not configured")

    model = genai.GenerativeModel('gemini-1.5-flash')
    
    prompt = """
    Analyze these product images. Locate the Nutrition Facts / Nutrition Information table.
    Extract the values into a JSON object. 
    Standardize keys to snake_case (e.g., "calories", "total_fat_g", "sugar_g", "protein_g").
    Try to capture the values 'per 100g' if available, otherwise 'per serving'.
    
    Example format:
    {
      "serving_size": "30g",
      "calories": 120,
      "total_fat": "5g",
      "sugar": "10g",
      "protein": "2g"
    }
    
    Return ONLY valid JSON.
    """
    
    try:
        content = [prompt]
        for img in image_parts:
             content.append(img)
             
        response = model.generate_content(content)
        clean_json = _clean_json_response(response.text)
        return json.loads(clean_json)
    except Exception as e:
        print(f"Gemini Nutrition Error: {e}")
        return {}
