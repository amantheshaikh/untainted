#!/usr/bin/env python3
"""Test script to debug product lookup issues."""

import sys
import traceback
from server import off_dataset_lookup

def test_lookup(barcode: str):
    """Test the product lookup function."""
    print(f"\n{'='*60}")
    print(f"Testing barcode: {barcode}")
    print(f"{'='*60}")
    
    try:
        result = off_dataset_lookup(barcode)
        if result:
            print(f"✓ Success! Found product:")
            print(f"  Code: {result.get('code')}")
            print(f"  Name: {result.get('product_name')}")
            print(f"  Ingredients: {result.get('ingredients_text', 'N/A')[:100]}")
        else:
            print(f"✗ No product found for barcode: {barcode}")
    except Exception as e:
        print(f"✗ Exception occurred:")
        print(f"  Error: {e}")
        print(f"\nFull traceback:")
        traceback.print_exc()

if __name__ == "__main__":
    # Test with a known barcode
    test_barcodes = [
        "737628064502",  # Nutella
        "3017620422003",  # Nutella (EU)
        "0016000275287",  # Oreo
    ]
    
    for barcode in test_barcodes:
        test_lookup(barcode)
