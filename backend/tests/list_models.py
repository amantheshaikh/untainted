
from google import genai
import os

api_key = os.environ.get("GEMINI_API_KEY") 
if not api_key:
    # Try reading from .env manually if needed, but we pass it via env var
    from dotenv import load_dotenv
    load_dotenv()
    api_key = os.environ.get("GEMINI_API_KEY")

if api_key:
    client = genai.Client(api_key=api_key)

    try:
        print("Listing available models...")
        for m in client.models.list():
            # In new SDK, supported generation methods might be different or implied.
            # We can check simple presence or just list them.
            # m.name should be available.
            print(f"- {m.name}")
    except Exception as e:
        print(f"Error listing models: {e}")
else:
    print("BACKEND_API_KEY not found.")
