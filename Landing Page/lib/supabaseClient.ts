"use client"

import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || ""
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""

if (!SUPABASE_URL || !SUPABASE_ANON_KEY) {
  // In dev, remind developer to set env vars. We avoid calling createClient when missing so Next dev can boot.
  console.warn(
    "Supabase URL or Key missing. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY in your env."
  )
}

// Only create a real client when both values are present. Otherwise export a thin shim that surfaces helpful errors when used.
let supabase: any
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
} else {
  const notConfigured = () => ({ error: new Error("Supabase not configured. Set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY.") })
  supabase = {
    auth: {
      signInWithPassword: async () => notConfigured(),
      signUp: async () => notConfigured(),
      getUser: async () => notConfigured(),
    },
    from: (_: string) => ({
      select: async () => notConfigured(),
      insert: async () => notConfigured(),
      update: async () => notConfigured(),
      upsert: async () => notConfigured(),
      delete: async () => notConfigured(),
    }),
  }
}

export { supabase }
export default supabase
