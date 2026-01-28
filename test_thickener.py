
import sys
import os

# Add backend to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), 'backend')))

from server import _ensure_normalizer, normalize_token

def test_normalization():
    normalizer = _ensure_normalizer()
    
    test_cases = [
        "Thickeners",
        "thickener",
        "chicken",
        "Refined Wheat Flour",
        "Palm Oil"
    ]
    
    for text in test_cases:
        items = normalizer.normalize(text)
        print(f"Input: {text}")
        for item in items:
            print(f"  Canonical: {item.canonical}")
            print(f"  Display: {item.display}")
            print(f"  Match Type: {item.match_type}")
            print(f"  Confidence: {item.confidence}")
            if item.taxonomy:
                print(f"  Taxonomy ID: {item.taxonomy.get('id')}")
        print("-" * 20)

if __name__ == "__main__":
    test_normalization()
