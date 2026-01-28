# Untainted Architecture

## High-Level Overview

Untainted is a distributed web application composed of three primary services:
1.  **Frontend**: A Next.js (App Router) application hosted on Vercel. It handles the UI, user authentication context, and core client interactions.
2.  **Backend**: A FastAPI (Python) service hosted on Fly.io. It handles complex business logic, third-party API integration (Open Food Facts), and computer vision tasks (barcode/ingredient scanning).
3.  **Database**: Supabase (PostgreSQL) serves as the persistent data store and handles user authentication (Auth).

## Data Flow

### 1. Product Scanning Flow
1.  **User Action**: User takes a photo of a barcode or inputs it manually.
2.  **Frontend**:
    -   If manual: Sends barcode string to Backend API.
    -   If photo: Uses client-side libraries (or VLM service) to extract barcode, then sends to Backend.
3.  **Backend (`/product/lookup`)**:
    -   Checks local DB (Supabase) for existing product data.
    -   If missing: Queries Open Food Facts API.
    -   Parses result into `Product` model.
    -   Analyses ingredients for "tainted" status (diabetic/keto compliance).
    -   Returns enriched JSON to frontend.
4.  **Frontend**: Displays product rating and ingredient breakdown.

### 2. Ingredient Analysis Flow
1.  **User Action**: User uploads/captures photo of ingredient label.
2.  **Backend (`/analyze`)**:
    -   Receives image.
    -   Uses VLM (Vision Language Model) or OCR to extract text.
    -   Parses text against `ingredients.txt` and `additives.txt` database.
    -   Flags harmful ingredients based on safety ratings.
3.  **Frontend**: Highlights risky ingredients in the UI.

## Authentication
-   **Provider**: Supabase Auth (Email/Password, Socials).
-   **Mechanism**:
    -   Frontend uses `@supabase/ssr` to manage sessions via cookies.
    -   Backend validates requests using JWT tokens passed in the `Authorization` header.
    -   **Important**: The Backend uses the `SUPABASE_SERVICE_ROLE_KEY` for privileged access but validates the user's *User ID* claims from the request token.

## Deployment Strategy
-   **Frontend**: Git-push to `main` triggers Vercel build. Environment variables must be synced in Vercel project settings.
-   **Backend**: `fly deploy` builds the Dockerfile. Secrets are managed via `fly secrets`.
