import requests
import json
import os

# Assuming server is running on 8080
BASE_URL = "http://localhost:8080"

def test_profile_analysis():
    print("Testing /profile/analyze-bio endpoint...")
    
    # We need a valid token? The endpoint uses _authenticate_request.
    # Testing with API Key if available is easier.
    # The app accepts x-api-key header.
    
    api_key = os.environ.get("BACKEND_API_KEY", "sk_test_123") # Assuming dev key or similar
    # If no key, we might need a bearer token. But for local dev often there's a dev key or we can mocking.
    # Let's try to see if we can use a key.
    # If not, the request will fail with 401.
    
    # Let's try with a dummy key first, or skip auth check if possible?
    # app.py says: API_KEYS = {k.strip() for k in os.environ.get("API_KEYS", "").split(",") ...}
    
    headers = {
        "Content-Type": "application/json",
        "X-API-Key": api_key 
    }
    
    payload = {
        "bio": "I am a vegan and allergic to banana. I also avoid red dye 40."
    }
    
    try:
        response = requests.post(f"{BASE_URL}/profile/analyze-bio", json=payload, headers=headers)
        
        print(f"Status Code: {response.status_code}")
        if response.status_code != 200:
            print("Response:", response.text)
            return

        data = response.json()
        print("\nResult:")
        print(json.dumps(data, indent=2))
        
        # assertions
        assert "Vegan" in data["diets"]
        # Custom avoidance should ideally contain banana
        found_banana = any("banana" in item["name"].lower() for item in data["custom_avoidance"])
        if found_banana:
            print("SUCCESS: Found banana in custom avoidance.")
        else:
            print("WARNING: Banana not found in custom avoidance (check taxonomy resolution).")
            
    except Exception as e:
        print(f"Test failed: {e}")

if __name__ == "__main__":
    test_profile_analysis()
