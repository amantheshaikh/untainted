"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function SignUpPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [accountType, setAccountType] = useState<"personal" | "business">("personal")
  const router = useRouter()

  async function handleSignUp(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signUp({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    // For now send user to profile page (email confirm flows handled by Supabase)
    router.push("/profile")
  }

  return (
    <div className="max-w-6xl mx-auto px-6 py-12">
      <div className="max-w-3xl mx-auto text-center mb-10">
        <h2 className="text-sm font-semibold text-[#F58220] tracking-wider">Sign up for Untainted</h2>
        <h1 className="mt-4 text-4xl md:text-5xl font-bold text-[#5D4632]">Know what’s safe. Instantly.</h1>
        <p className="mt-4 text-lg text-[#7C6145]">Personalized food intelligence for people and platforms.</p>
      </div>

      <div className="bg-white rounded-3xl p-8 shadow-lg border border-[#E8DFD4]">
        <div className="grid md:grid-cols-2 gap-6 items-start">
          {/* Persona: Individual */}
          <div className={`p-6 rounded-2xl border ${accountType === "personal" ? "border-[#F58220] bg-[#FFF8F2] shadow-sm" : "border-[#E8DFD4] bg-white"}`}>
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

            <p className="mt-4 text-sm text-[#8B7355]">No medical jargon. Just clarity.</p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setAccountType("personal")}
                className={`px-4 py-2 rounded-full font-medium ${accountType === "personal" ? "bg-[#F58220] text-white" : "border border-[#7C6145] text-[#7C6145] bg-white"}`}
              >
                Choose Personal
              </button>
            </div>
          </div>

          {/* Persona: Business */}
          <div className={`p-6 rounded-2xl border ${accountType === "business" ? "border-[#F58220] bg-[#FFF8F2] shadow-sm" : "border-[#E8DFD4] bg-white"}`}>
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

            <p className="mt-4 text-sm text-[#8B7355]">Designed for production. Ready to scale.</p>

            <div className="mt-6 flex gap-3">
              <button
                onClick={() => setAccountType("business")}
                className={`px-4 py-2 rounded-full font-medium ${accountType === "business" ? "bg-[#F58220] text-white" : "border border-[#7C6145] text-[#7C6145] bg-white"}`}
              >
                Request API Access
              </button>
            </div>
          </div>
        </div>

        {/* CTA row */}
        <div className="mt-8 flex justify-center">
          {accountType === "personal" ? (
            <button onClick={() => router.push("/signup?type=personal")} className="bg-[#F58220] text-white px-6 py-3 rounded-full shadow-md font-semibold">
              Get Started
            </button>
          ) : (
            <button onClick={() => router.push("/contact")} className="bg-[#F58220] text-white px-6 py-3 rounded-full shadow-md font-semibold">
              Contact Sales
            </button>
          )}
        </div>

        {/* Inline personal form (optional) */}
        {accountType === "personal" && (
          <div className="mt-8 max-w-md mx-auto">
            <form onSubmit={handleSignUp} className="space-y-4">
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" type="email" className="w-full p-3 rounded-lg border border-[#E8DFD4]" />
              <input value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" type="password" className="w-full p-3 rounded-lg border border-[#E8DFD4]" />
              {error && <div className="text-sm text-[#EF4444]">{error}</div>}
              <button disabled={loading} className="w-full bg-[#F58220] text-white px-4 py-3 rounded-full">{loading ? "Creating..." : "Create account"}</button>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}
