# Untainted (CleanFoodApp)

This repository contains the Untainted landing frontend (Next.js) and a FastAPI backend for ingredient analysis.

Contents
- `Landing Page/` — Next.js (app directory) frontend
- `backend/` — Python FastAPI backend and Dockerfile
- `supabase/` — migrations and functions for Supabase

This README explains how to push this repository to GitHub, deploy the frontend to Vercel and the backend to Fly.io, and what environment variables are required.

Quick start (local)
1. Frontend
   - cd `Landing Page`
   - pnpm install
   - pnpm dev

2. Backend
   - python -m venv .venv
   - source .venv/bin/activate
   - pip install -r backend/requirements.txt
   - uvicorn backend.app:app --reload --port 8080

Push to GitHub (recommended)
1. Initialize git if needed and commit everything:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: Untainted landing + backend"
   ```
2. Create GitHub repo (two options):
   - Using GitHub CLI (recommended):
     ```bash
     gh repo create <OWNER>/<REPO> --public --source=. --remote=origin --push
     ```
   - Or create via the GitHub web UI and then add remote:
     ```bash
     git remote add origin git@github.com:<OWNER>/<REPO>.git
     git branch -M main
     git push -u origin main
     ```

Environment variables (minimum)

Frontend (Vercel, public):
- NEXT_PUBLIC_SUPABASE_URL
- NEXT_PUBLIC_SUPABASE_ANON_KEY
- NEXT_PUBLIC_API_BASE (set to backend URL once deployed)

Backend (Fly, private):
- SUPABASE_URL
- SUPABASE_SERVICE_ROLE_KEY
- DIABETIC_SUGARS_PER_100G_THRESHOLD (optional)
- KETO_NET_CARBS_PER_100G_THRESHOLD (optional)
- Any OFF_* envs your backend needs

Supabase
- Apply `supabase/migrations/001_create_tables.sql` in the Supabase SQL editor or using the supabase CLI.

Deployments
- Frontend: connect repo to Vercel and set the Root Directory to `Landing Page/` when creating the project.
- Backend: use Fly.io and `backend/Dockerfile` (or use `flyctl launch` from the `backend/` directory).

CI / CD
- A sample GitHub Actions workflow to deploy the backend to Fly is added at `.github/workflows/deploy-backend.yml`. Add `FLY_API_TOKEN` to your GitHub repo secrets to enable it.

If you'd like I can (a) create the remote GitHub repo and push for you (I will need a GitHub token or you can run the `gh` command locally), (b) create the Vercel project (requires your Vercel login/token), and (c) run `flyctl` to create and deploy the backend if you provide a Fly token. Otherwise follow the steps above locally.
