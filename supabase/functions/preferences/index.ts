// Supabase Edge Function (Deno) - preferences
import { serve } from "https://deno.land/std@0.201.0/http/server.ts"

const SUPABASE_URL = Deno.env.get("SUPABASE_URL") || ""
const SUPABASE_ANON_KEY = Deno.env.get("SUPABASE_ANON_KEY") || ""

serve(async (req: Request) => {
  try {
    const auth = req.headers.get("authorization") || ""
    const headers: Record<string,string> = {
      "Authorization": auth,
      "apikey": SUPABASE_ANON_KEY,
      "Content-Type": "application/json",
    }

    const url = new URL(req.url)
    if (req.method === "GET") {
      // Proxy GET to Supabase REST; RLS will ensure users only see their rows
      const res = await fetch(`${SUPABASE_URL}/rest/v1/preferences?select=*`, { headers })
      const body = await res.text()
      return new Response(body, { status: res.status, headers: { 'Content-Type': 'application/json' } })
    }

    if (req.method === "POST") {
      const payload = await req.text()
      const res = await fetch(`${SUPABASE_URL}/rest/v1/preferences`, { method: 'POST', headers, body: payload })
      const body = await res.text()
      return new Response(body, { status: res.status, headers: { 'Content-Type': 'application/json' } })
    }

    return new Response(JSON.stringify({ message: 'method not allowed' }), { status: 405 })
  } catch (err) {
    return new Response(JSON.stringify({ error: String(err) }), { status: 500 })
  }
})
