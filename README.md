# Untainted

Untainted is a B2B-first product intelligence platform for evaluating food safety and quality. It combines a Next.js frontend with a FastAPI backend to analyze ingredients using barcode scanning and OCR.

## 📚 Documentation

- **[Architecture Overview](docs/ARCHITECTURE.md)**: High-level system design and data flow.
- **[AI Context](.agent/project_context.md)**: Optimized context for AI agents/LLMs.
- **[API Reference](docs/API_REFERENCE.md)**: Backend API documentation.

## 🚀 Quick Start

### 1. Frontend (Next.js)
```bash
cd landing-page
pnpm install
pnpm dev
# Running at http://localhost:3000
```

### 2. Backend (FastAPI)
```bash
# Create virtual env
python -m venv .venv
source .venv/bin/activate

# Install dependencies
pip install -r backend/requirements.txt

# Run server
uvicorn backend.app:app --reload --port 8080
# Running at http://localhost:8080
# API Docs at http://localhost:8080/docs
```

## 🤖 For AI Agents
If you are an AI agent or using one (like Claude/Cursor), please refer to `.agent/project_context.md` for high-density structural information or read `llms.txt`.
