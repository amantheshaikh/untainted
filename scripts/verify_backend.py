import sys
import os

# Add backend directory to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '../backend')))

from server import process_ingredients

def run_test(name, ingredients, preferences, expected_status, expected_diets):
    print(f"Running Test: {name}")
    result = process_ingredients(ingredients, preferences)
    
    status = result["status"]
    active_diets = result["active_diets"]
    
    status_match = status == expected_status
    diets_match = set(active_diets) == set(expected_diets)
    
    if status_match and diets_match:
        print(f"✅ PASS")
    else:
        print(f"❌ FAIL")
        print(f"  Expected Status: {expected_status}, Got: {status}")
        print(f"  Expected Diets: {expected_diets}, Got: {active_diets}")
        print(f"  Hits: {result['hits']}")
        print(f"  Diet Hits: {result['diet_hits']}")

# Test 1: Basic Vegan Clean
run_test(
    "Vegan Clean",
    "apples, bananas",
    {"dietary_preferences": ["Vegan"]},
    "safe",
    ["vegan"]
)

# Test 2: Vegan Unclean (Honey)
run_test(
    "Vegan Unclean (Honey)",
    "apples, honey",
    {"dietary_preferences": ["Vegan"]},
    "not_safe",
    ["vegan"]
)

# Test 3: Multiple Diets (Vegan + Gluten-Free Clean)
run_test(
    "Vegan + GF Clean",
    "rice, vegetables",
    {"dietary_preferences": ["Vegan"], "health_restrictions": ["Gluten-Free"]},
    "safe",
    ["vegan", "gluten-free"]
)

# Test 4: Multiple Diets (Vegan Clean, GF Unclean)
run_test(
    "Vegan Clean but GF Unclean (Wheat)",
    "wheat, vegetables",
    {"dietary_preferences": ["Vegan"], "health_restrictions": ["Gluten-Free"]},
    "not_safe",
    ["vegan", "gluten-free"]
)

# Test 5: Paleo Check (New Diet)
run_test(
    "Paleo Unclean (Grains)",
    "oats, berries",
    {"dietary_preferences": ["Paleo"]},
    "not_safe",
    ["paleo"]
)

# Test 6: Low FODMAP Check (New Diet) - Garlic
run_test(
    "Low FODMAP Unclean (Garlic)",
    "chicken, garlic",
    {"health_restrictions": ["Low FODMAP"]},
    "not_safe",
    ["low-fodmap"]
)

# Test 7: Legacy Key Support
run_test(
    "Legacy Key Support",
    "milk",
    {"diet": "Vegan"},
    "not_safe",
    ["vegan"]
)
