#!/usr/bin/env python3
"""Test script for ingredient parsing enhancements."""

import sys
import os

# Add parent directory to path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from server import normalize_additive_code, normalize_token, IngredientNormalizer

def test_normalize_additive_code():
    """Test INS to E-number conversion."""
    print("\n" + "="*60)
    print("Testing normalize_additive_code()")
    print("="*60)
    
    test_cases = [
        ("INS 500", "e500"),
        ("INS 500 (ii)", "e500(ii)"),
        ("INS 500(ii)", "e500(ii)"),
        ("E 500 (ii)", "e500(ii)"),
        ("E500(ii)", "e500(ii)"),
        ("ins 452 (i)", "e452(i)"),
        ("Raising Agents (INS 500 (ii), INS 500(i))", "Raising Agents (e500(ii), e500(i))"),
    ]
    
    for input_text, expected in test_cases:
        result = normalize_additive_code(input_text)
        status = "✓" if expected in result.lower() else "✗"
        print(f"{status} '{input_text}' -> '{result}'")
        if expected not in result.lower():
            print(f"  Expected to contain: '{expected}'")

def test_normalize_token():
    """Test token normalization with E-number preservation."""
    print("\n" + "="*60)
    print("Testing normalize_token()")
    print("="*60)
    
    test_cases = [
        ("e500(ii)", "e500(ii)"),  # Should preserve
        ("E500(i)", "e500(i)"),     # Should preserve
        ("wheat flour", "wheat flour"),  # Normal text
        ("sugar (96%)", "sugar 96"),     # Parentheses removed for non-E-numbers
    ]
    
    for input_text, expected in test_cases:
        result = normalize_token(input_text)
        status = "✓" if result == expected else "✗"
        print(f"{status} '{input_text}' -> '{result}' (expected: '{expected}')")

def test_full_ingredient_parsing():
    """Test full ingredient parsing with real-world example."""
    print("\n" + "="*60)
    print("Testing Full Ingredient Parsing")
    print("="*60)
    
    # Real-world noodles example
    ingredients_text = """
    Raising Agents (INS 500 (ii), INS 500(i)), 
    Thickening Agents (INS 452 (i), INS 451 (i))
    """
    
    # Test just the tokenization
    from server import IngredientNormalizer
    
    # Create a minimal test - just check the tokenize function
    print(f"\nInput: {ingredients_text.strip()}")
    print(f"\nAfter normalize_additive_code:")
    normalized = normalize_additive_code(ingredients_text)
    print(f"  {normalized.strip()}")
    
    # Check for E-numbers in the normalized text
    print("\nChecking for E-number conversion:")
    enumbers_to_check = ["e500(ii)", "e500(i)", "e452(i)", "e451(i)"]
    
    for enumber in enumbers_to_check:
        found = enumber in normalized.lower()
        status = "✓" if found else "✗"
        print(f"  {status} {enumber}: {'Found' if found else 'Not found'}")

if __name__ == "__main__":
    test_normalize_additive_code()
    test_normalize_token()
    test_full_ingredient_parsing()
    print("\n" + "="*60)
    print("Testing Complete")
    print("="*60)
