"""
Profile Analysis using Google Gemini.

Parses natural language bio text into structured dietary preferences,
allergies, health goals, and custom avoidance ingredients.
"""

import os
import json
import google.generativeai as genai
from typing import Dict, Any, List, Optional
from dataclasses import dataclass

# Configure API key
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY")

if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

GEMINI_MODEL = "gemini-3-flash-preview"  # Use a fast model for interactive requests

@dataclass
class ProfileAnalysisResult:
    diets: List[str]
    health: List[str]
    allergies: List[str]
    custom_terms: List[str]
    nova_preference: Optional[str] = None
    raw_response: Optional[str] = None

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

def analyze_profile_bio(text: str) -> ProfileAnalysisResult:
    """
    Analyzes a user's bio text to extract dietary profile.
    """
    if not GEMINI_API_KEY:
        raise ValueError("GEMINI_API_KEY not configured")

    if not text or not text.strip():
        return ProfileAnalysisResult([], [], [], [], None, None)

    # Try multiple models in order of preference/speed
    models_to_try = ["gemini-3-flash-preview", "gemini-2.5-flash"]
    
    prompt = f"""
    You are an intelligent dietary assistant. Analyze the user's bio and extract their dietary requirements.

    User Bio: "{text}"

    Map their requirements into the following categories EXACTLY (use these exact enum values):

    1. Diets (Select from):
       - "Vegan" (No animal products)
       - "Vegetarian" (No meat/fish)
       - "Jain" (Vegetarian + no root veggies like onion/garlic/potato)
       - "Sattvic" (Pure veg, no onion/garlic/stimulants)
       - "Keto" (Low carb, high fat)
       - "Keto" (Low carb, high fat)
       - "Paleo" (Whole foods, no grains/legumes)
       - "Auto Immune Protocol" (Elimination diet, no nightshades/seeds/grains)

    2. Health Goals (Select from):
       - "Clean Eating" (No additives/preservatives)
       - "Diabetic-Friendly" (Low sugar, low GI)
       - "Low FODMAP" (Digestive health)
       - "No Maida" (No refined flour)
       - "No Onion-Garlic" (No alliums)
       - "High Cholesterol" (Low saturated fat/cholesterol)
       - "Hypertension" (Low sodium/BP friendly)
       - "Heart Healthy" (Cardiac friendly)
       - "Kidney Friendly" (Low protein/phosphorus/potassium if needed)
       - "Weight Loss" (Low calorie/fat)
       - "High Protein" (Muscle gain)

    3. Allergies (Select from):
       - "Gluten"
       - "Dairy"
       - "Nut"
       - "Soy"
       - "Egg"
       - "Shellfish"
       - "Fish"
       - "Sesame"

    4. Custom Avoidance (List of strings):
       - Extract SPECIFIC ingredients the user wants to avoid that don't fit the categories above.
       - Be precise. "I hate bananas" -> ["banana"]
       - "No red dye" -> ["red dye"]
       - "Allergic to strawberries" -> ["strawberry"]
       - Do NOT include things already covered by the Diets/Allergies selected above (e.g. if Vegan is selected, don't list "pork" in custom avoidance).
       - Do NOT include generic terms like "unhealthy food". Only specific ingredients or additives.

     5. NOVA / Processing Preference (Select one string or null):
        - "avoid_nova_4" (If user mentions avoiding ultra-processed foods, processed foods, junk food, or "clean eating")
        - "no_preference" (Default)

    Return JSON format:
    {{
        "diets": ["Vegan"],
        "health": ["Clean Eating"],
        "allergies": ["Nut"],
        "custom_terms": ["banana", "red dye 40"],

        "nova_preference": "avoid_nova_4"
    }}
    """

    last_error = None

    for model_name in models_to_try:
        try:
            model = genai.GenerativeModel(model_name)
            response = model.generate_content(prompt)
            cleaned_json = _clean_json_response(response.text)
            data = json.loads(cleaned_json)

            return ProfileAnalysisResult(
                diets=data.get("diets", []),
                health=data.get("health", []),
                allergies=data.get("allergies", []),
                custom_terms=data.get("custom_terms", []),
                nova_preference=data.get("nova_preference"),
                raw_response=response.text
            )
        except Exception as e:
            print(f"Gemini Profile Analysis Error ({model_name}): {e}")
            last_error = e
            continue

    # If all failed
    # If all failed
    return ProfileAnalysisResult([], [], [], [], None, str(last_error))
