# API Reference

The Untainted Backend is built with **FastAPI**, which automatically generates interactive API documentation.

## Viewed Locally
When running the backend locally (`uvicorn backend.app:app --reload`), you can access the full API reference at:
- **Swagger UI**: [http://localhost:8080/docs](http://localhost:8080/docs)
- **ReDoc**: [http://localhost:8080/redoc](http://localhost:8080/redoc)
- **OpenAPI JSON**: [http://localhost:8080/openapi.json](http://localhost:8080/openapi.json)

## Key Endpoints

### Product
- `GET /product/lookup?barcode={code}`: Fetch product details from internal DB or Open Food Facts.

### Analysis
- `POST /analyze`: Upload an image of an ingredient label to detect potentially harmful additives.

## Authentication
All protected endpoints require a valid JWT token in the header:
```http
Authorization: Bearer <SUPABASE_JWT>
```
Tokens are issued by Supabase Auth on the frontend.
