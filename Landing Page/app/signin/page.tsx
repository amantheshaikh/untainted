"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "../../lib/supabaseClient"
import { useRouter } from "next/navigation"

export default function SignInPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  async function handleNext(e?: React.FormEvent) {
    e?.preventDefault()
    setError(null)
    if (!email) {
      setError("Please enter your email")
      return
    }
    setStep(2)
  }

  async function handleSignInPassword(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError(null)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    setLoading(false)
    if (error) {
      setError(error.message)
      return
    }
    router.push("/profile")
  }

  return (
    <div className="max-w-md mx-auto p-6">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.45, ease: "easeOut" }}
        className="bg-white rounded-2xl border border-[#E8DFD4] p-6 shadow-lg"
      >
        <div className="flex justify-center mb-6">
          <img src="/images/full-20logo.png" alt="Untainted" className="h-10" />
        </div>

        {step === 1 && (
          <form onSubmit={handleNext} className="space-y-4 font-dm-sans text-[#7C6145]">
            <h1 className="text-3xl font-bold text-center text-[#5D4632]">Log in</h1>
            <p className="text-lg text-[#8B7355] text-center">Enter your email to continue</p>
            <label className="sr-only">Email or mobile number</label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email or mobile number"
              type="email"
              className="w-full p-3 rounded-lg border border-[#E8DFD4] text-[#7C6145] placeholder:text-[#A89580] focus:outline-none focus:ring-2 focus:ring-[#F58220]/30"
            />
            {error && <div className="text-sm text-[#EF4444]">{error}</div>}
            <button
              type="submit"
              className="w-full bg-[#F58220] hover:bg-[#E07010] text-white px-6 py-3 rounded-full font-semibold shadow-sm"
            >
              Continue
            </button>

            <div className="flex items-center gap-3">
              <div className="flex-1 border-t border-[#E8DFD4]" />
              <div className="text-sm text-[#8B7355]">or</div>
              <div className="flex-1 border-t border-[#E8DFD4]" />
            </div>

            <button
              type="button"
              onClick={() => router.push("/signup")}
              className="w-full rounded-full border-2 border-[#7C6145] text-[#7C6145] py-3 text-sm font-medium hover:bg-[#7C6145] hover:text-white transition-colors"
            >
              Sign Up
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleSignInPassword} className="space-y-4 font-dm-sans text-[#7C6145]">
            <h1 className="text-3xl font-bold text-center text-[#5D4632]">Welcome back</h1>
            <p className="text-lg text-[#8B7355] text-center">{email}</p>
            <label className="sr-only">Password</label>
            <input
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              type="password"
              className="w-full p-3 rounded-lg border border-[#E8DFD4] text-[#7C6145] placeholder:text-[#A89580] focus:outline-none focus:ring-2 focus:ring-[#F58220]/30"
            />
            {error && <div className="text-sm text-[#EF4444]">{error}</div>}
            <button
              disabled={loading}
              className="w-full bg-[#F58220] hover:bg-[#E07010] text-white px-6 py-3 rounded-full font-semibold shadow-sm"
            >
              {loading ? "Signing in..." : "Continue"}
            </button>

            <div className="flex justify-between text-sm">
              <button type="button" onClick={() => setStep(1)} className="text-[#8B7355]">
                Back
              </button>
              <button type="button" onClick={() => router.push("/signup")} className="text-[#F58220] font-medium">
                Sign Up
              </button>
            </div>
          </form>
        )}
      </motion.div>
    </div>
  )
}
