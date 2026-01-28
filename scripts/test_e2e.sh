#!/bin/bash

# test_e2e.sh
# Validation Step: Runs Backend Tests and Frontend Build Check.

echo "🧪 Starting End-to-End Validation..."

# 1. Backend Tests
echo "----------------------------------------"
echo "🐍 Running Backend Tests (pytest)..."
if [ -d "backend" ]; then
    # Create venv if needed or just use active python
    # Assuming environment is set up or we use a standard python command
    # Try running pytest directly if available, else python -m pytest
    
    # Check if we are in a venv
    if [[ "$VIRTUAL_ENV" == "" ]]; then
        # Try to activate if .venv exists
        if [ -d ".venv" ]; then
             source .venv/bin/activate
        fi
    fi

    # Run tests
    PYTHONPATH=backend python3 -m pytest backend/tests || { echo "❌ Backend tests failed!"; exit 1; }
else
    echo "⚠️ Backend directory not found, skipping..."
fi

# 2. Frontend Build Check
echo "----------------------------------------"
echo "⚛️  Checking Frontend Build..."
if [ -d "landing-page" ]; then
    cd landing-page
    # Just run build (this checks types and compilation)
    # Using pnpm if available, else npm
    if command -v pnpm &> /dev/null; then
        pnpm build || { echo "❌ Frontend build failed!"; exit 1; }
    else
        npm run build || { echo "❌ Frontend build failed!"; exit 1; }
    fi
    cd ..
else
    echo "⚠️ Landing Page directory not found, skipping..."
fi

echo "----------------------------------------"
echo "✅ All Validation Checks Passed!"
exit 0
