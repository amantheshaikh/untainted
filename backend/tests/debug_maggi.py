
import sys
import os
import json

# Add backend to path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from server import off_dataset_lookup, _extract_product_fields

barcode = "8901058000290"

print(f"Looking up barcode: {barcode}")
product = off_dataset_lookup(barcode)

if product:
    print(f"Product Found: {product.get('product_name', 'Unknown Name')}")
    print("-" * 20)
    print("KEYS:", product.keys())
    print("-" * 20)
    print("Ingredients Text (raw):")
    print(product.get("ingredients_text", "N/A"))
    print("-" * 20)
    print("Ingredients Text (en):")
    print(product.get("ingredients_text_en", "N/A"))
    print("-" * 20)
    
    code, name, extracted_ingredients = _extract_product_fields(product)
    print("Extracted Ingredients List:")
    print(json.dumps(extracted_ingredients, indent=2))
    
    # Verify processing logic
    from server import process_ingredients
    
    print("-" * 20)
    print("Processing Ingredients...")
    # Use the raw text we just fetched
    raw_text = product.get("ingredients_text_en") or product.get("ingredients_text")
    
    # Test with Vegan diet and Nut allergy to see flags
    prefs = {
        "diet_preference": "Vegan",
        "allergies": ["Nut", "Gluten", "Soy"],
        "custom_avoidance": []
    }
    
    analysis = process_ingredients(raw_text, prefs, product_meta=product)
    print("Analysis Result:")
    print(json.dumps(analysis, indent=2))

else:
    print("Product NOT FOUND.")
