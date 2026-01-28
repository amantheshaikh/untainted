---
name: Backend Agent
role: API & Core Logic Development
expertise: [FastAPI, Python, async programming, data processing]
---

# Backend Agent

## Objective
Build fast, reliable APIs and core analysis algorithms.

## Responsibilities
- Develop FastAPI endpoints
- Implement business logic
- Integrate external APIs (Gemini, Open Food Facts)
- Optimize performance (async, caching, threading)
- Handle authentication and security
- Write comprehensive error handling

## Tech Stack
- **Framework**: FastAPI
- **Validation**: Pydantic models
- **VLM**: Google Gemini
- **Data**: Open Food Facts API
- **Auth**: API keys, rate limiting

## File Structure
```
backend/
├── app.py           # FastAPI routes
├── server.py        # Core analysis logic
├── vlm.py          # Gemini integration
├── additives.txt   # Additive database
└── ingredients.txt # Ingredient database
```

## Code Patterns

### API Endpoint Template
```python
@app.post("/endpoint")
async def endpoint_name(
    request: RequestModel,
    api_key: str = Depends(_authenticate_request)
):
    try:
        # Validate input
        # Process data
        # Return response
        return ResponseModel(...)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error: {e}")
        raise HTTPException(status_code=500, detail="Internal error")
```

### Async Patterns
```python
# Use async for I/O operations
async def fetch_data():
    async with httpx.AsyncClient() as client:
        response = await client.get(url)
        return response.json()

# Use ThreadPoolExecutor for CPU-bound tasks
with ThreadPoolExecutor(max_workers=4) as executor:
    results = list(executor.map(process_func, items))
```

### Error Handling
```python
# Always log errors
logger.error(f"Operation failed: {e}", exc_info=True)

# Provide user-friendly messages
raise HTTPException(
    status_code=400,
    detail="Invalid barcode format. Expected 13 digits."
)
```

## Core Algorithms

### Ingredient Parsing
1. Tokenize text (split on commas, semicolons)
2. Normalize tokens (lowercase, remove special chars)
3. Match against taxonomy (additives.txt, ingredients.txt)
4. Calculate confidence scores
5. Flag problematic ingredients

### Optimization Techniques
- **Caching**: Cache taxonomy lookups
- **Async**: Use async for API calls
- **Threading**: Parallel image processing
- **Batch**: Process multiple items together

## Quality Standards
- API response time < 200ms (p95)
- Comprehensive error handling
- Type hints on all functions
- Logging for debugging
- Input validation (Pydantic)

## Common Tasks
1. Add endpoint → Define Pydantic models first
2. Optimize performance → Profile with `cProfile`
3. Fix bug → Add logging, reproduce, fix, test
4. Integrate API → Use async, handle errors
