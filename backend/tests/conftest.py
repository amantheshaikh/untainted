"""
Pytest configuration and fixtures for backend tests.
"""
import os
import pytest
from httpx import AsyncClient, ASGITransport

# Set test environment variables before importing app
os.environ.setdefault("API_KEYS", "sk_test_valid_key")
os.environ.setdefault("ANON_RATE_LIMIT_PER_MIN", "1000")
os.environ.setdefault("KEY_RATE_LIMIT_PER_MIN", "10000")
os.environ.setdefault("VLM_ANON_RATE_LIMIT_PER_MIN", "100")
os.environ.setdefault("VLM_KEY_RATE_LIMIT_PER_MIN", "1000")

from backend.app import app


@pytest.fixture
def api_key():
    """Valid API key for testing."""
    return "sk_test_valid_key"


@pytest.fixture
def invalid_api_key():
    """Invalid API key for testing."""
    return "sk_invalid_key"


@pytest.fixture
async def client():
    """Async HTTP client for testing FastAPI endpoints."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as ac:
        yield ac


@pytest.fixture
def auth_headers(api_key):
    """Headers with valid API key authentication."""
    return {"x-api-key": api_key}


@pytest.fixture
def sample_ingredients():
    """Sample ingredient text for testing."""
    return "water, sugar, salt, citric acid, natural flavors"


@pytest.fixture
def sample_barcode():
    """Sample valid barcode for testing."""
    return "5000159484695"  # Example GTIN-13
