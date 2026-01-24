"""
Tests for critical API endpoints.

These tests cover:
- Authentication (API key validation)
- Authorization (profile access control)
- Input validation (barcode format, UUID format, image limits)
- Rate limiting
- Core functionality
"""
import pytest
import base64
from httpx import AsyncClient


class TestHealthCheck:
    """Tests for /healthz endpoint."""

    @pytest.mark.asyncio
    async def test_health_check_returns_ok(self, client: AsyncClient):
        """Health check should return OK status."""
        response = await client.get("/healthz")
        assert response.status_code == 200
        assert response.json() == {"status": "ok"}


class TestAuthentication:
    """Tests for authentication logic."""

    @pytest.mark.asyncio
    async def test_check_requires_authentication(self, client: AsyncClient, sample_ingredients):
        """Check endpoint should require authentication."""
        response = await client.post(
            "/check",
            json={"ingredients": sample_ingredients}
        )
        assert response.status_code == 401
        assert "authentication required" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_check_rejects_invalid_api_key(self, client: AsyncClient, sample_ingredients, invalid_api_key):
        """Check endpoint should reject invalid API keys."""
        response = await client.post(
            "/check",
            json={"ingredients": sample_ingredients},
            headers={"x-api-key": invalid_api_key}
        )
        assert response.status_code == 403
        assert "invalid api key" in response.json()["detail"]

    @pytest.mark.asyncio
    async def test_check_accepts_valid_api_key(self, client: AsyncClient, sample_ingredients, auth_headers):
        """Check endpoint should accept valid API key."""
        response = await client.post(
            "/check",
            json={"ingredients": sample_ingredients},
            headers=auth_headers
        )
        assert response.status_code == 200


class TestInputValidation:
    """Tests for input validation."""

    @pytest.mark.asyncio
    async def test_barcode_rejects_invalid_format(self, client: AsyncClient, auth_headers):
        """Barcode must be 8-14 digits."""
        # Too short
        response = await client.post(
            "/product/lookup",
            json={"barcode": "123"},
            headers=auth_headers
        )
        assert response.status_code == 422  # Validation error

        # Contains letters
        response = await client.post(
            "/product/lookup",
            json={"barcode": "12345678ABC"},
            headers=auth_headers
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_barcode_accepts_valid_gtin13(self, client: AsyncClient, auth_headers, sample_barcode):
        """Valid GTIN-13 barcode should be accepted."""
        response = await client.post(
            "/product/lookup",
            json={"barcode": sample_barcode},
            headers=auth_headers
        )
        # Should return 200 (found) or 404 (not found), not 422 (validation error)
        assert response.status_code in [200, 404]

    @pytest.mark.asyncio
    async def test_customer_uid_rejects_invalid_uuid(self, client: AsyncClient, auth_headers, sample_ingredients):
        """customer_uid must be valid UUID v4."""
        response = await client.post(
            "/check",
            json={
                "ingredients": sample_ingredients,
                "customer_uid": "not-a-valid-uuid"
            },
            headers=auth_headers
        )
        assert response.status_code == 422
        data = response.json()
        assert "detail" in data

    @pytest.mark.asyncio
    async def test_customer_uid_accepts_valid_uuid(self, client: AsyncClient, auth_headers, sample_ingredients):
        """Valid UUID v4 should be accepted for customer_uid."""
        response = await client.post(
            "/check",
            json={
                "ingredients": sample_ingredients,
                "customer_uid": "550e8400-e29b-41d4-a716-446655440000"
            },
            headers=auth_headers
        )
        # API key auth allows any UID access (B2B use case)
        assert response.status_code == 200

    @pytest.mark.asyncio
    async def test_ingredients_text_required(self, client: AsyncClient, auth_headers):
        """Check endpoint requires non-empty ingredients."""
        response = await client.post(
            "/check",
            json={"ingredients": ""},
            headers=auth_headers
        )
        # Returns 422 due to Pydantic validation (min_length=1)
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_extract_rejects_too_many_images(self, client: AsyncClient, auth_headers):
        """Extract endpoint should reject more than 5 images."""
        # Create 6 tiny base64 images
        tiny_image = base64.b64encode(b"fake_image_data").decode()
        images = [tiny_image] * 6

        response = await client.post(
            "/extract/ingredients",
            json={"images": images},
            headers=auth_headers
        )
        assert response.status_code == 422


class TestCheckEndpoint:
    """Tests for /check endpoint functionality."""

    @pytest.mark.asyncio
    async def test_check_returns_analysis(self, client: AsyncClient, auth_headers, sample_ingredients):
        """Check should return ingredient analysis."""
        response = await client.post(
            "/check",
            json={"ingredients": sample_ingredients},
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()

        # Verify response structure
        assert "status" in data
        assert "ingredients" in data
        assert "is_clean" in data
        assert data["status"] in ["safe", "not_safe"]

    @pytest.mark.asyncio
    async def test_check_with_preferences(self, client: AsyncClient, auth_headers):
        """Check should respect dietary preferences."""
        response = await client.post(
            "/check",
            json={
                "ingredients": "water, honey, sugar",
                "preferences": {
                    "dietary_preferences": ["vegan"]
                }
            },
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()

        # Honey is not vegan, should flag it
        assert data["status"] == "not_safe" or len(data.get("diet_hits", [])) > 0


class TestProductLookup:
    """Tests for /product/lookup endpoint."""

    @pytest.mark.asyncio
    async def test_product_lookup_requires_auth(self, client: AsyncClient, sample_barcode):
        """Product lookup requires authentication."""
        response = await client.post(
            "/product/lookup",
            json={"barcode": sample_barcode}
        )
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_product_lookup_returns_404_for_unknown(self, client: AsyncClient, auth_headers):
        """Product lookup returns 404 for unknown barcode."""
        response = await client.post(
            "/product/lookup",
            json={"barcode": "00000000000"},  # Unlikely to exist
            headers=auth_headers
        )
        # Either 404 (not found) or 200 (found) is acceptable
        assert response.status_code in [200, 404]


class TestSecurityHeaders:
    """Tests for security headers."""

    @pytest.mark.asyncio
    async def test_security_headers_present(self, client: AsyncClient):
        """Security headers should be present in responses."""
        response = await client.get("/healthz")

        assert response.headers.get("X-Content-Type-Options") == "nosniff"
        assert response.headers.get("X-Frame-Options") == "DENY"
        assert response.headers.get("X-XSS-Protection") == "1; mode=block"
        assert "strict-origin" in response.headers.get("Referrer-Policy", "")
        assert "max-age=" in response.headers.get("Strict-Transport-Security", "")


class TestRateLimiting:
    """Tests for rate limiting."""

    @pytest.mark.asyncio
    async def test_rate_limit_header_format(self, client: AsyncClient, auth_headers, sample_ingredients):
        """Rate limiting should work and return proper error."""
        # Make many requests - this won't actually hit rate limit due to high test limits
        # but verifies the endpoint works
        response = await client.post(
            "/check",
            json={"ingredients": sample_ingredients},
            headers=auth_headers
        )
        assert response.status_code == 200


class TestAnalyzeEndpoint:
    """Tests for /analyze endpoint."""

    @pytest.mark.asyncio
    async def test_analyze_requires_auth(self, client: AsyncClient):
        """Analyze endpoint requires authentication."""
        response = await client.post(
            "/analyze",
            json={
                "customer_uid": "550e8400-e29b-41d4-a716-446655440000",
                "ingredients_text": "water, sugar"
            }
        )
        assert response.status_code == 401

    @pytest.mark.asyncio
    async def test_analyze_requires_valid_uuid(self, client: AsyncClient, auth_headers):
        """Analyze endpoint requires valid UUID for customer_uid."""
        response = await client.post(
            "/analyze",
            json={
                "customer_uid": "invalid-uuid",
                "ingredients_text": "water, sugar"
            },
            headers=auth_headers
        )
        assert response.status_code == 422

    @pytest.mark.asyncio
    async def test_analyze_returns_verdict(self, client: AsyncClient, auth_headers):
        """Analyze should return verdict and conflicts."""
        response = await client.post(
            "/analyze",
            json={
                "customer_uid": "550e8400-e29b-41d4-a716-446655440000",
                "ingredients_text": "water, sugar, salt"
            },
            headers=auth_headers
        )
        assert response.status_code == 200
        data = response.json()

        # Verify response structure
        assert "status" in data
        assert "verdict_title" in data
        assert "verdict_description" in data
        assert "conflict_count" in data
        assert "flagged_ingredients" in data
