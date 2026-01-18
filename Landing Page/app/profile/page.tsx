"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"

type Profile = {
  id?: string
  name?: string
  profile_json?: any
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    async function load() {
      setLoading(true)
      const user = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null
      if (!user) {
        setError("Not signed in")
        setLoading(false)
        return
      }
      const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).limit(1).single()
      if (error && error.code !== "PGRST100") {
        setError(error.message)
      } else if (data) {
        setProfile(data)
      }
      setLoading(false)
    }
    load()
    return () => {
      mounted = false
    }
  }, [])

  async function saveProfile(updated: any) {
    const user = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null
    if (!user) return setError("Not signed in")
    const payload = {
      user_id: user.id,
      name: updated.name,
      profile_json: updated.profile_json,
    }
    if (profile && profile.id) {
      await supabase.from("profiles").update(payload).eq("id", profile.id)
    } else {
      await supabase.from("profiles").insert(payload)
    }
  }

  if (loading) return <div className="p-6">Loading...</div>
  if (error) return <div className="p-6 text-destructive">{error}</div>
  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-sm font-semibold text-[#F58220] tracking-wider">Sign up for Untainted</h2>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold text-[#5D4632]">Know what’s safe. Instantly.</h1>
        <p className="mt-4 text-lg text-[#7C6145]">Personalized food intelligence for people and platforms.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#E8DFD4] mb-8">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          <div className="p-6 rounded-2xl border border-[#E8DFD4] bg-white">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F58220] flex items-center justify-center text-white font-bold">👤</div>
              <div>
                <h3 className="text-2xl font-semibold text-[#5D4632]">Individual</h3>
                <p className="text-sm text-[#7C6145] mt-1">Eat with confidence. Made just for you.</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-[#7C6145]">Understand whether a food product is safe for YOU.</p>
            <ul className="mt-4 space-y-2 text-sm text-[#7C6145]">
              <li>✔ Check products against your diet, allergies, and sensitivities</li>
              <li>✔ Get clear ingredient-level explanations</li>
              <li>✔ Save preferences and scan history</li>
              <li>✔ Alerts when formulations change</li>
            </ul>

            <div className="mt-6">
              <a href="#profile-form" className="inline-block bg-[#F58220] text-white px-4 py-2 rounded-full">Edit your profile</a>
            </div>
          </div>

          <div className="p-6 rounded-2xl border border-[#E8DFD4] bg-white">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[#F58220] flex items-center justify-center text-white font-bold">🏢</div>
              <div>
                <h3 className="text-2xl font-semibold text-[#5D4632]">Business</h3>
                <p className="text-sm text-[#7C6145] mt-1">Build food trust into your product.</p>
              </div>
            </div>

            <p className="mt-4 text-sm text-[#7C6145]">Integrate real-time food safety and personalization into your app or platform.</p>
            <ul className="mt-4 space-y-2 text-sm text-[#7C6145]">
              <li>✔ Generate and manage API keys</li>
              <li>✔ Ingredient-level risk evaluation at scale</li>
              <li>✔ Personalization based on user preferences</li>
              <li>✔ Usage analytics and monitoring</li>
              <li>✔ Built for q-commerce, food delivery, and retail</li>
            </ul>

            <div className="mt-6">
              <button onClick={() => (window.location.href = "/contact")} className="inline-block bg-[#F58220] text-white px-4 py-2 rounded-full">Contact Sales</button>
            </div>
          </div>
        </div>
      </div>

      <div id="profile-form" className="max-w-3xl mx-auto p-6 bg-white rounded-2xl border border-[#E8DFD4] shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Your Dietary Profile</h2>
        <p className="mb-4 text-sm text-[#8B7355]">Manage your allergies, dietary preferences, and restrictions here.</p>
        <div className="space-y-4">
          <label className="block">
            <div className="text-sm text-[#7C6145] mb-1">Name</div>
            <input defaultValue={profile?.name || ""} className="w-full p-3 rounded-lg border border-[#E8DFD4]" id="profile-name" />
          </label>
          <label className="block">
            <div className="text-sm text-[#7C6145] mb-1">Profile JSON (preferences & allergies)</div>
            <textarea defaultValue={JSON.stringify(profile?.profile_json || {}, null, 2)} id="profile-json" className="w-full p-3 rounded-lg border border-[#E8DFD4] font-mono text-sm" rows={10} />
          </label>
          <div className="flex gap-2">
            <button
              onClick={async () => {
                const name = (document.getElementById("profile-name") as HTMLInputElement).value
                let parsed = {}
                try {
                  parsed = JSON.parse((document.getElementById("profile-json") as HTMLTextAreaElement).value)
                } catch (e) {
                  return setError("Invalid JSON in profile")
                }
                await saveProfile({ name, profile_json: parsed })
                setError(null)
              }}
              className="bg-[#F58220] text-white px-4 py-2 rounded-full"
            >
              Save profile
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
