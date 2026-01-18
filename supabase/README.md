Supabase migrations and Edge Function scaffolds for Untainted

How to apply migrations:

1. Install the Supabase CLI: https://supabase.com/docs/guides/cli
2. Authenticate and connect to your project.
3. Run migrations (example):

```bash
supabase db remote set <YOUR_DB_URL>
psql <YOUR_DB_URL> -f supabase/migrations/001_create_tables.sql
```

Edge Functions:
- The functions in `supabase/functions/*` are Deno-based Edge Function scaffolds that proxy requests to the Supabase REST API.
- They expect the environment variables `SUPABASE_URL` and `SUPABASE_ANON_KEY` to be available in the function environment.
- Deploy with the Supabase CLI:

```bash
supabase functions deploy preferences --project-ref <your-ref>
supabase functions deploy history --project-ref <your-ref>
supabase functions deploy feedback --project-ref <your-ref>
```

Notes:
- These are minimal scaffolds. Configure Row Level Security (RLS) policies in Supabase so that user JWTs can only access their own rows.
- For admin actions, use the service role key server-side (do not expose it to clients).
