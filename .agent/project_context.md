# Project Context for AI Agents

## 📚 Deep-Dive Documentation
**Agencies & Developers**: Refer to these files for granular details:
- **[System Map](../docs/SYSTEM_MAP.md)**: Holographic code map. Connects features -> endpoints -> functions -> state. **Read this to find where code lives.**
- **[Database Schema](../docs/DATABASE_SCHEMA.md)**: Full reference of all tables (profiles, history) and JSON structures.

## Tech Stack
- **Frontend**: Next.js 14 (App Router), TypeScript, Tailwind CSS, Lucide React (Icons).
- **Backend**: Python 3.x, FastAPI.
- **Database**: Supabase (PostgreSQL).
- **Hosting**: Vercel (Frontend), Fly.io (Backend).

## Project Structure
```text
/
├── landing-page/       # Next.js Frontend
│   ├── app/            # App Router pages & layouts
│   ├── components/     # React components (shadcn/ui style)
│   ├── lib/            # Utilities (Supabase client, utils)
│   └── public/         # Static assets
├── backend/            # FastAPI Backend
│   ├── app.py          # Entry point
│   ├── server.py       # Core logic (Taxonomy, Normalization)
│   ├── vlm.py          # Vision Logic (Barcode/OCR)
│   ├── logging_config.py # Logging setup
│   ├── ingredients.txt # Taxonomy definitions
│   └── additives.txt   # E-number database
├── supabase/           # Database
│   └── migrations/     # SQL migrations
├── docs/               # Detailed Documentation
│   ├── ARCHITECTURE.md # High-level design
│   ├── SYSTEM_MAP.md   # Feature-to-Code mapping
│   └── DATABASE_SCHEMA.md # DB Reference
└── .agent/             # AI-specific context & guidelines
```

## Key Conventions
- **Server Actions**: Used for mutations in Next.js.
- **API Communication**: The frontend communicates with the FastAPI backend via standard HTTP requests (fetch).
- **Styling**: Tailwind CSS with utility classes. Avoid custom CSS files where possible.
- **State Management**: React Server Components for data fetching where possible.

## Data Models (High-Level)
*Consult `docs/DATABASE_SCHEMA.md` for exact fields.*

- **Product**: Represents a food item (Barcode, Name, Brand, Ingredients List).
- **Ingredient**: Individual component of a product (Name, Safety Rating, Description).
- **Scan**: User activity record (User ID, Product ID, Timestamp, Result).
