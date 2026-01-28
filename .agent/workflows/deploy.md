---
description: Deployment workflow
---

# Deployment Workflow

## 1. Optimization
Run pre-flight optimization.

```bash
claude-code --agent optimize "Pre-deployment checklist"
```

## 2. Validation (End-to-End Testing)
Run backend tests and frontend build checks.
// turbo
```bash
chmod +x scripts/test_e2e.sh && ./scripts/test_e2e.sh
```
*If validation fails, the workflow stops here. Please fix errors effectively.*

## 3. Deployment (Only if Validation Passes)

### Frontend (Vercel)
// turbo
```bash
# Automatic on push to main
git push origin main
```

### Backend (Fly.io)
// turbo
```bash
# Automatic via GitHub Actions
git push origin main
```

## 4. Documentation Sync (Smart Update)
Update System Map and AI context to match the deployed code.
// turbo
```bash
python3 scripts/enhance_docs.py
```

## Rollback (If needed)

```bash
# Frontend
vercel rollback

# Backend
fly deploy --image [previous-version]
```
