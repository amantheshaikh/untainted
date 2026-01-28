
import google.generativeai as genai
import os

api_key = os.environ.get("BACKEND_API_KEY") 
if not api_key:
    # Try reading from .env manually if needed, but we pass it via env var
    pass

genai.configure(api_key=api_key)

try:
    print("Listing available models...")
    for m in genai.list_models():
        if 'generateContent' in m.supported_generation_methods:
            print(f"- {m.name}")
except Exception as e:
    print(f"Error listing models: {e}")
