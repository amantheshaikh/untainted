"""
FSSAI (Food Safety and Standards Authority of India) Regulations Module

This module implements food safety regulations based on:
- FSSAI Food Safety and Standards (Packaging and Labelling) Regulations, 2011
- FSSAI Food Safety and Standards (Advertising and Claims) Regulations, 2018
- FSSAI Food Safety and Standards (Food Products Standards and Food Additives) Regulations

References:
- https://fssai.gov.in/cms/regulations.php
"""

from dataclasses import dataclass, field
from typing import Dict, List, Optional, Set, Any, Tuple
from enum import Enum


class RegulatoryStatus(Enum):
    """Regulatory status of an ingredient or additive."""
    PERMITTED = "permitted"
    RESTRICTED = "restricted"  # Allowed with limits
    PROHIBITED = "prohibited"  # Banned
    CONDITIONAL = "conditional"  # Allowed in specific food categories only


@dataclass
class NutrientLimit:
    """Daily recommended limit for a nutrient."""
    max_per_100g: Optional[float] = None
    max_per_serving: Optional[float] = None
    daily_limit: Optional[float] = None
    unit: str = "g"
    warning_threshold_percent: float = 0.2  # Warn at 20% of daily limit per serving


@dataclass
class AdditiveRegulation:
    """Regulation for a food additive."""
    ins_code: str  # INS/E number
    name: str
    status: RegulatoryStatus
    max_limit_ppm: Optional[float] = None  # Parts per million
    permitted_categories: List[str] = field(default_factory=list)
    prohibited_categories: List[str] = field(default_factory=list)
    notes: str = ""


@dataclass
class ClaimValidation:
    """Validation result for a health/nutrition claim."""
    claim: str
    is_valid: bool
    requirement: str
    actual_value: Optional[float] = None
    threshold: Optional[float] = None
    message: str = ""


# =============================================================================
# FSSAI PROHIBITED INGREDIENTS (Complete ban in India)
# =============================================================================

FSSAI_PROHIBITED_INGREDIENTS: Set[str] = {
    # Banned colors
    "rhodamine b",
    "metanil yellow",
    "lead chromate",
    "sudan dyes",
    "sudan i", "sudan ii", "sudan iii", "sudan iv",
    "orange ii",
    "auramine",
    "malachite green",

    # Banned preservatives/additives
    "potassium bromate",  # Banned in bread
    "carbide",  # Used to ripen fruits artificially
    "calcium carbide",
    "formalin",  # Used illegally in fish/milk preservation
    "formaldehyde",
    "boric acid",  # In sweets
    "borax",

    # Banned sweeteners in certain contexts
    "cyclamate",  # Banned in India
    "sodium cyclamate",
    "calcium cyclamate",

    # Harmful adulterants
    "urea",  # In milk
    "melamine",  # In milk powder
    "detergent",  # In milk
    "argemone oil",  # In edible oils
    "mineral oil",  # In edible oils (non-food grade)

    # Banned in infant foods
    "added sugar",  # In infant formula (under 12 months)
    "added salt",  # In infant foods
    "honey",  # Risk of botulism in infants
}

# =============================================================================
# FSSAI RESTRICTED ADDITIVES (Allowed with limits)
# =============================================================================

FSSAI_ADDITIVE_LIMITS: Dict[str, AdditiveRegulation] = {
    # Colors
    "e102": AdditiveRegulation(
        ins_code="E102", name="Tartrazine",
        status=RegulatoryStatus.RESTRICTED,
        max_limit_ppm=100,
        notes="Requires warning label in EU; linked to hyperactivity"
    ),
    "e110": AdditiveRegulation(
        ins_code="E110", name="Sunset Yellow FCF",
        status=RegulatoryStatus.RESTRICTED,
        max_limit_ppm=100,
        notes="Requires warning label in EU"
    ),
    "e122": AdditiveRegulation(
        ins_code="E122", name="Carmoisine",
        status=RegulatoryStatus.RESTRICTED,
        max_limit_ppm=50,
        notes="Banned in some countries"
    ),
    "e124": AdditiveRegulation(
        ins_code="E124", name="Ponceau 4R",
        status=RegulatoryStatus.RESTRICTED,
        max_limit_ppm=50,
        notes="Banned in US, restricted in EU"
    ),
    "e129": AdditiveRegulation(
        ins_code="E129", name="Allura Red AC",
        status=RegulatoryStatus.RESTRICTED,
        max_limit_ppm=100,
        notes="Linked to hyperactivity in children"
    ),
    "e133": AdditiveRegulation(
        ins_code="E133", name="Brilliant Blue FCF",
        status=RegulatoryStatus.RESTRICTED,
        max_limit_ppm=100,
        notes="Generally recognized as safe"
    ),

    # Preservatives
    "e211": AdditiveRegulation(
        ins_code="E211", name="Sodium Benzoate",
        status=RegulatoryStatus.RESTRICTED,
        max_limit_ppm=200,
        notes="Can form benzene with ascorbic acid"
    ),
    "e220": AdditiveRegulation(
        ins_code="E220", name="Sulphur Dioxide",
        status=RegulatoryStatus.RESTRICTED,
        max_limit_ppm=50,
        notes="Allergen; must be declared if >10ppm"
    ),
    "e250": AdditiveRegulation(
        ins_code="E250", name="Sodium Nitrite",
        status=RegulatoryStatus.RESTRICTED,
        max_limit_ppm=200,
        permitted_categories=["cured meats"],
        notes="Carcinogenic in high doses; limited use"
    ),
    "e251": AdditiveRegulation(
        ins_code="E251", name="Sodium Nitrate",
        status=RegulatoryStatus.RESTRICTED,
        max_limit_ppm=500,
        permitted_categories=["cured meats", "cheese"],
        notes="Converts to nitrite; limited use"
    ),

    # Flavor enhancers
    "e621": AdditiveRegulation(
        ins_code="E621", name="Monosodium Glutamate (MSG)",
        status=RegulatoryStatus.RESTRICTED,
        max_limit_ppm=10000,  # 1%
        prohibited_categories=["infant_food", "baby_food"],
        notes="Prohibited in infant foods"
    ),

    # Sweeteners
    "e950": AdditiveRegulation(
        ins_code="E950", name="Acesulfame Potassium",
        status=RegulatoryStatus.RESTRICTED,
        max_limit_ppm=600,
        notes="ADI: 15 mg/kg body weight"
    ),
    "e951": AdditiveRegulation(
        ins_code="E951", name="Aspartame",
        status=RegulatoryStatus.RESTRICTED,
        max_limit_ppm=600,
        notes="Warning required for PKU patients; ADI: 40 mg/kg"
    ),
    "e952": AdditiveRegulation(
        ins_code="E952", name="Cyclamate",
        status=RegulatoryStatus.PROHIBITED,
        notes="Banned in India and USA"
    ),
    "e955": AdditiveRegulation(
        ins_code="E955", name="Sucralose",
        status=RegulatoryStatus.RESTRICTED,
        max_limit_ppm=400,
        notes="ADI: 15 mg/kg body weight"
    ),
}

# =============================================================================
# FSSAI NUTRITION CLAIMS VALIDATION
# Per FSSAI Advertising and Claims Regulations, 2018
# =============================================================================

NUTRITION_CLAIM_THRESHOLDS: Dict[str, Dict[str, Any]] = {
    # Energy claims
    "low_calorie": {
        "max_energy_kcal_100g": 40,
        "max_energy_kcal_100ml": 20,
        "claim_text": "Low Calorie"
    },
    "calorie_free": {
        "max_energy_kcal_100g": 4,
        "max_energy_kcal_100ml": 4,
        "claim_text": "Calorie Free"
    },

    # Fat claims
    "low_fat": {
        "max_fat_g_100g": 3.0,
        "max_fat_g_100ml": 1.5,
        "claim_text": "Low Fat"
    },
    "fat_free": {
        "max_fat_g_100g": 0.5,
        "max_fat_g_100ml": 0.5,
        "claim_text": "Fat Free"
    },
    "low_saturated_fat": {
        "max_saturated_fat_g_100g": 1.5,
        "max_saturated_fat_g_100ml": 0.75,
        "max_saturated_fat_energy_percent": 10,
        "claim_text": "Low Saturated Fat"
    },
    "saturated_fat_free": {
        "max_saturated_fat_g_100g": 0.1,
        "claim_text": "Saturated Fat Free"
    },

    # Sugar claims
    "low_sugar": {
        "max_sugar_g_100g": 5.0,
        "max_sugar_g_100ml": 2.5,
        "claim_text": "Low Sugar"
    },
    "sugar_free": {
        "max_sugar_g_100g": 0.5,
        "max_sugar_g_100ml": 0.5,
        "claim_text": "Sugar Free"
    },
    "no_added_sugar": {
        "no_added_sugars": True,
        "no_added_ingredients_with_sugars": True,
        "claim_text": "No Added Sugar"
    },

    # Sodium claims
    "low_sodium": {
        "max_sodium_mg_100g": 120,
        "max_sodium_mg_100ml": 120,
        "claim_text": "Low Sodium"
    },
    "very_low_sodium": {
        "max_sodium_mg_100g": 40,
        "max_sodium_mg_100ml": 40,
        "claim_text": "Very Low Sodium"
    },
    "sodium_free": {
        "max_sodium_mg_100g": 5,
        "max_sodium_mg_100ml": 5,
        "claim_text": "Sodium Free"
    },

    # Protein claims
    "source_of_protein": {
        "min_protein_energy_percent": 10,
        "claim_text": "Source of Protein"
    },
    "high_protein": {
        "min_protein_energy_percent": 20,
        "claim_text": "High Protein"
    },

    # Fiber claims
    "source_of_fiber": {
        "min_fiber_g_100g": 3.0,
        "claim_text": "Source of Fiber"
    },
    "high_fiber": {
        "min_fiber_g_100g": 6.0,
        "claim_text": "High Fiber"
    },

    # Trans fat
    "trans_fat_free": {
        "max_trans_fat_g_100g": 0.2,
        "claim_text": "Trans Fat Free"
    },

    # Cholesterol
    "low_cholesterol": {
        "max_cholesterol_mg_100g": 20,
        "max_saturated_fat_g_100g": 1.5,
        "claim_text": "Low Cholesterol"
    },
    "cholesterol_free": {
        "max_cholesterol_mg_100g": 5,
        "max_saturated_fat_g_100g": 1.5,
        "claim_text": "Cholesterol Free"
    },
}

# =============================================================================
# FSSAI LABELING REQUIREMENTS
# =============================================================================

MANDATORY_ALLERGEN_DECLARATIONS: Set[str] = {
    "cereals containing gluten",
    "wheat", "barley", "rye", "oats", "spelt",
    "crustaceans",
    "eggs",
    "fish",
    "peanuts",
    "soybeans", "soy",
    "milk", "lactose",
    "tree nuts",
    "almonds", "cashews", "walnuts", "pistachios", "hazelnuts", "pecans", "brazil nuts", "macadamia",
    "sulphites",  # If > 10 mg/kg
    "celery",
    "mustard",
    "sesame", "sesame seeds",
    "lupin",
    "molluscs",
}

# Health conditions and their FSSAI-relevant nutrient thresholds
HEALTH_CONDITION_THRESHOLDS: Dict[str, Dict[str, NutrientLimit]] = {
    "diabetes": {
        "sugar": NutrientLimit(max_per_100g=5.0, daily_limit=25.0, unit="g"),
        "carbohydrates": NutrientLimit(max_per_100g=15.0, daily_limit=130.0, unit="g"),
        "glycemic_index": NutrientLimit(max_per_serving=55),  # Low GI threshold
    },
    "hypertension": {
        "sodium": NutrientLimit(max_per_100g=400.0, daily_limit=2000.0, unit="mg"),
        "potassium": NutrientLimit(max_per_100g=None, daily_limit=4700.0, unit="mg"),  # Higher is better
    },
    "heart_disease": {
        "saturated_fat": NutrientLimit(max_per_100g=1.5, daily_limit=20.0, unit="g"),
        "trans_fat": NutrientLimit(max_per_100g=0.5, daily_limit=2.0, unit="g"),
        "cholesterol": NutrientLimit(max_per_100g=20.0, daily_limit=300.0, unit="mg"),
        "sodium": NutrientLimit(max_per_100g=400.0, daily_limit=2000.0, unit="mg"),
    },
    "kidney_disease": {
        "sodium": NutrientLimit(max_per_100g=200.0, daily_limit=1500.0, unit="mg"),
        "potassium": NutrientLimit(max_per_100g=200.0, daily_limit=2000.0, unit="mg"),
        "phosphorus": NutrientLimit(max_per_100g=100.0, daily_limit=800.0, unit="mg"),
        "protein": NutrientLimit(max_per_100g=10.0, daily_limit=50.0, unit="g"),
    },
    "obesity": {
        "energy": NutrientLimit(max_per_100g=100.0, daily_limit=1800.0, unit="kcal"),
        "sugar": NutrientLimit(max_per_100g=5.0, daily_limit=25.0, unit="g"),
        "saturated_fat": NutrientLimit(max_per_100g=1.5, daily_limit=20.0, unit="g"),
    },
}

# =============================================================================
# REGULATORY CHECK FUNCTIONS
# =============================================================================


def check_prohibited_ingredients(ingredients: List[str]) -> List[Dict[str, Any]]:
    """
    Check if any ingredients are prohibited under FSSAI regulations.

    Returns list of violations with details.
    """
    import re
    violations = []

    # Items that should only be checked with exact/word-boundary matching
    # to avoid false positives (e.g., "sugar" matching "added sugar")
    exact_match_only = {"added sugar", "added salt", "sugar", "salt", "honey"}

    for ingredient in ingredients:
        normalized = ingredient.lower().strip()

        for prohibited in FSSAI_PROHIBITED_INGREDIENTS:
            matched = False

            if prohibited in exact_match_only:
                # Use word boundary matching for common terms
                # This prevents "sugar" from matching "added sugar"
                pattern = r'\b' + re.escape(prohibited) + r'\b'
                if re.search(pattern, normalized):
                    # For "added sugar", require explicit "added" prefix
                    if prohibited.startswith("added "):
                        if prohibited in normalized:
                            matched = True
                    elif prohibited in ("sugar", "salt", "honey"):
                        # These are only prohibited in infant foods, skip general check
                        continue
                    else:
                        matched = True
            else:
                # For other prohibited items, use substring matching
                if prohibited in normalized:
                    matched = True

            if matched:
                violations.append({
                    "ingredient": ingredient,
                    "matched": prohibited,
                    "status": "prohibited",
                    "regulation": "FSSAI Food Safety and Standards Act",
                    "severity": "critical",
                    "message": f"'{ingredient}' contains prohibited substance '{prohibited}'"
                })
                break

    return violations


def check_additive_compliance(additive_code: str) -> Optional[AdditiveRegulation]:
    """
    Check if an additive (INS/E code) is compliant with FSSAI limits.

    Args:
        additive_code: INS or E number (e.g., "E621", "INS 621")

    Returns:
        AdditiveRegulation if found, None otherwise
    """
    # Normalize the code
    normalized = additive_code.lower().replace("ins", "e").replace(" ", "").strip()

    return FSSAI_ADDITIVE_LIMITS.get(normalized)


def validate_nutrition_claim(claim_type: str, nutrition_data: Dict[str, Any],
                             is_solid: bool = True) -> ClaimValidation:
    """
    Validate if a nutrition claim is compliant with FSSAI regulations.

    Args:
        claim_type: Type of claim (e.g., "sugar_free", "low_fat")
        nutrition_data: Nutrition facts per 100g/100ml
        is_solid: True for solid foods, False for liquids

    Returns:
        ClaimValidation with result
    """
    thresholds = NUTRITION_CLAIM_THRESHOLDS.get(claim_type.lower().replace(" ", "_"))

    if not thresholds:
        return ClaimValidation(
            claim=claim_type,
            is_valid=False,
            requirement="Unknown claim type",
            message=f"Claim '{claim_type}' is not recognized under FSSAI regulations"
        )

    suffix = "100g" if is_solid else "100ml"

    # Check each threshold
    for key, threshold in thresholds.items():
        if key == "claim_text":
            continue

        # Determine the actual nutrient key
        if key.startswith("max_"):
            nutrient = key.replace("max_", "").replace(f"_{suffix}", "").replace("_g", "").replace("_mg", "").replace("_kcal", "")
            actual = nutrition_data.get(nutrient) or nutrition_data.get(f"{nutrient}_{suffix}")

            if actual is not None:
                try:
                    actual_val = float(actual)
                    if actual_val > threshold:
                        return ClaimValidation(
                            claim=claim_type,
                            is_valid=False,
                            requirement=f"{nutrient} must be ≤ {threshold}",
                            actual_value=actual_val,
                            threshold=threshold,
                            message=f"Claim '{thresholds.get('claim_text', claim_type)}' invalid: {nutrient} is {actual_val}, exceeds limit of {threshold}"
                        )
                except (ValueError, TypeError):
                    pass

        elif key.startswith("min_"):
            nutrient = key.replace("min_", "").replace(f"_{suffix}", "").replace("_g", "").replace("_mg", "")
            actual = nutrition_data.get(nutrient) or nutrition_data.get(f"{nutrient}_{suffix}")

            if actual is not None:
                try:
                    actual_val = float(actual)
                    if actual_val < threshold:
                        return ClaimValidation(
                            claim=claim_type,
                            is_valid=False,
                            requirement=f"{nutrient} must be ≥ {threshold}",
                            actual_value=actual_val,
                            threshold=threshold,
                            message=f"Claim '{thresholds.get('claim_text', claim_type)}' invalid: {nutrient} is {actual_val}, below minimum of {threshold}"
                        )
                except (ValueError, TypeError):
                    pass

    return ClaimValidation(
        claim=claim_type,
        is_valid=True,
        requirement="All thresholds met",
        message=f"Claim '{thresholds.get('claim_text', claim_type)}' is valid under FSSAI regulations"
    )


def generate_nutrition_insights(
    nutrition_data: Dict[str, Any],
    health_conditions: Optional[List[str]] = None,
    serving_size_g: float = 100.0
) -> List[Dict[str, Any]]:
    """
    Generate health insights based on nutrition data and user's health conditions.

    Args:
        nutrition_data: Nutrition facts (per 100g)
        health_conditions: User's health conditions (e.g., ["diabetes", "hypertension"])
        serving_size_g: Serving size in grams

    Returns:
        List of health insights with severity levels
    """
    insights = []

    # Helper to get nutrient value
    def get_nutrient(keys: List[str]) -> Optional[float]:
        for key in keys:
            if key in nutrition_data:
                try:
                    return float(nutrition_data[key])
                except (ValueError, TypeError):
                    pass
        return None

    # Calculate per-serving values
    serving_multiplier = serving_size_g / 100.0

    # General nutrition insights (applicable to everyone)
    sugar = get_nutrient(["sugar", "sugars", "sugar_100g", "sugars_100g", "total_sugars"])
    if sugar is not None:
        per_serving = sugar * serving_multiplier
        daily_percent = (per_serving / 25.0) * 100  # WHO recommends max 25g/day

        if daily_percent >= 50:
            insights.append({
                "type": "warning",
                "category": "sugar",
                "title": "Very High Sugar Content",
                "value": f"{sugar}g per 100g ({per_serving:.1f}g per serving)",
                "daily_percent": round(daily_percent, 1),
                "message": f"One serving provides {daily_percent:.0f}% of daily recommended sugar limit",
                "severity": "high"
            })
        elif daily_percent >= 25:
            insights.append({
                "type": "caution",
                "category": "sugar",
                "title": "High Sugar Content",
                "value": f"{sugar}g per 100g",
                "daily_percent": round(daily_percent, 1),
                "message": f"Contains {daily_percent:.0f}% of daily sugar limit per serving",
                "severity": "medium"
            })

    sodium = get_nutrient(["sodium", "sodium_100g", "salt", "sodium_mg"])
    if sodium is not None:
        # Convert salt to sodium if needed (salt = sodium * 2.5)
        if "salt" in str(nutrition_data.keys()):
            sodium = sodium / 2.5

        per_serving = sodium * serving_multiplier
        daily_percent = (per_serving / 2000.0) * 100  # FSSAI recommends max 2000mg/day

        if daily_percent >= 30:
            insights.append({
                "type": "warning",
                "category": "sodium",
                "title": "High Sodium Content",
                "value": f"{sodium}mg per 100g",
                "daily_percent": round(daily_percent, 1),
                "message": f"One serving provides {daily_percent:.0f}% of daily sodium limit",
                "severity": "high"
            })

    saturated_fat = get_nutrient(["saturated_fat", "saturated_fat_100g", "saturated_fat_g"])
    if saturated_fat is not None:
        per_serving = saturated_fat * serving_multiplier
        daily_percent = (per_serving / 20.0) * 100  # Max 20g/day

        if daily_percent >= 25:
            insights.append({
                "type": "caution",
                "category": "saturated_fat",
                "title": "High Saturated Fat",
                "value": f"{saturated_fat}g per 100g",
                "daily_percent": round(daily_percent, 1),
                "message": f"Contains {daily_percent:.0f}% of daily saturated fat limit per serving",
                "severity": "medium"
            })

    trans_fat = get_nutrient(["trans_fat", "trans_fat_100g", "trans_fat_g"])
    if trans_fat is not None and trans_fat > 0.2:
        insights.append({
            "type": "warning",
            "category": "trans_fat",
            "title": "Contains Trans Fat",
            "value": f"{trans_fat}g per 100g",
            "message": "Trans fats increase heart disease risk. FSSAI recommends avoiding them.",
            "severity": "high"
        })

    # Condition-specific insights
    if health_conditions:
        for condition in health_conditions:
            condition_lower = condition.lower().replace(" ", "_").replace("-", "_")
            thresholds = HEALTH_CONDITION_THRESHOLDS.get(condition_lower)

            if not thresholds:
                continue

            for nutrient_name, limit in thresholds.items():
                value = get_nutrient([nutrient_name, f"{nutrient_name}_100g", f"{nutrient_name}_g", f"{nutrient_name}_mg"])

                if value is None:
                    continue

                if limit.max_per_100g is not None and value > limit.max_per_100g:
                    insights.append({
                        "type": "warning",
                        "category": nutrient_name,
                        "condition": condition,
                        "title": f"High {nutrient_name.replace('_', ' ').title()} for {condition.title()}",
                        "value": f"{value}{limit.unit} per 100g",
                        "threshold": f"{limit.max_per_100g}{limit.unit}",
                        "message": f"This product has {value}{limit.unit} {nutrient_name.replace('_', ' ')}, which exceeds the recommended {limit.max_per_100g}{limit.unit}/100g for people with {condition}",
                        "severity": "high"
                    })

    # Positive insights
    fiber = get_nutrient(["fiber", "fiber_100g", "dietary_fiber"])
    if fiber is not None and fiber >= 6.0:
        insights.append({
            "type": "positive",
            "category": "fiber",
            "title": "High in Fiber",
            "value": f"{fiber}g per 100g",
            "message": "Good source of dietary fiber, supporting digestive health",
            "severity": "info"
        })

    protein = get_nutrient(["protein", "protein_100g", "proteins"])
    if protein is not None and protein >= 10.0:
        insights.append({
            "type": "positive",
            "category": "protein",
            "title": "Good Protein Source",
            "value": f"{protein}g per 100g",
            "message": "Contains significant protein for muscle health and satiety",
            "severity": "info"
        })

    return insights


def check_infant_food_compliance(ingredients: List[str], nutrition_data: Dict[str, Any]) -> List[Dict[str, Any]]:
    """
    Check compliance with FSSAI infant food regulations.

    Per FSSAI, infant foods (0-12 months) must not contain:
    - Added sugars
    - Salt/sodium above limits
    - Honey (botulism risk)
    - MSG and flavor enhancers
    """
    violations = []

    # Prohibited ingredients in infant food
    infant_prohibited = {
        "sugar", "added sugar", "cane sugar", "high fructose corn syrup",
        "honey", "jaggery", "gur",
        "salt", "added salt",
        "msg", "monosodium glutamate", "e621",
        "artificial flavors", "artificial flavours",
        "artificial colors", "artificial colours",
    }

    for ingredient in ingredients:
        normalized = ingredient.lower().strip()
        for prohibited in infant_prohibited:
            if prohibited in normalized:
                violations.append({
                    "ingredient": ingredient,
                    "status": "prohibited_in_infant_food",
                    "severity": "critical",
                    "message": f"'{ingredient}' is not permitted in infant food under FSSAI regulations"
                })
                break

    # Check sodium content
    sodium = nutrition_data.get("sodium") or nutrition_data.get("sodium_100g")
    if sodium is not None:
        try:
            sodium_val = float(sodium)
            if sodium_val > 50:  # FSSAI limit for infant food
                violations.append({
                    "nutrient": "sodium",
                    "value": sodium_val,
                    "limit": 50,
                    "severity": "high",
                    "message": f"Sodium content ({sodium_val}mg) exceeds infant food limit of 50mg/100g"
                })
        except (ValueError, TypeError):
            pass

    return violations


def get_regulatory_summary(
    ingredients: List[str],
    nutrition_data: Optional[Dict[str, Any]] = None,
    health_conditions: Optional[List[str]] = None,
    is_infant_food: bool = False
) -> Dict[str, Any]:
    """
    Generate a comprehensive regulatory compliance summary.

    Returns:
        Dictionary with compliance status, violations, and insights
    """
    result = {
        "compliant": True,
        "violations": [],
        "warnings": [],
        "insights": [],
        "allergen_declarations": []
    }

    # Check prohibited ingredients
    prohibited = check_prohibited_ingredients(ingredients)
    if prohibited:
        result["compliant"] = False
        result["violations"].extend(prohibited)

    # Check for allergens that need declaration
    for ingredient in ingredients:
        normalized = ingredient.lower()
        for allergen in MANDATORY_ALLERGEN_DECLARATIONS:
            if allergen in normalized:
                result["allergen_declarations"].append({
                    "allergen": allergen,
                    "ingredient": ingredient,
                    "message": f"'{allergen}' must be declared prominently on label per FSSAI"
                })

    # Check additives
    for ingredient in ingredients:
        # Look for E-numbers or INS codes
        import re
        e_match = re.search(r'[eE][\s-]?(\d{3,4})', ingredient)
        ins_match = re.search(r'INS[\s-]?(\d{3,4})', ingredient, re.IGNORECASE)

        code = None
        if e_match:
            code = f"e{e_match.group(1)}"
        elif ins_match:
            code = f"e{ins_match.group(1)}"

        if code:
            regulation = check_additive_compliance(code)
            if regulation:
                if regulation.status == RegulatoryStatus.PROHIBITED:
                    result["compliant"] = False
                    result["violations"].append({
                        "additive": regulation.name,
                        "code": regulation.ins_code,
                        "status": "prohibited",
                        "message": regulation.notes
                    })
                elif regulation.status == RegulatoryStatus.RESTRICTED:
                    result["warnings"].append({
                        "additive": regulation.name,
                        "code": regulation.ins_code,
                        "limit": regulation.max_limit_ppm,
                        "notes": regulation.notes
                    })

    # Generate nutrition insights
    if nutrition_data:
        insights = generate_nutrition_insights(
            nutrition_data,
            health_conditions=health_conditions
        )
        result["insights"] = insights

        # Check high-severity insights
        for insight in insights:
            if insight.get("severity") == "high":
                result["warnings"].append({
                    "type": "nutrition",
                    "category": insight.get("category"),
                    "message": insight.get("message")
                })

    # Infant food checks
    if is_infant_food:
        infant_violations = check_infant_food_compliance(ingredients, nutrition_data or {})
        if infant_violations:
            result["compliant"] = False
            result["violations"].extend(infant_violations)

    return result
