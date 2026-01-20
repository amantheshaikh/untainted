"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { supabase } from "../../lib/supabaseClient"
import { useRouter, useSearchParams } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import Link from "next/link"

import { Suspense } from "react"

function SignInContent() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [step, setStep] = useState<1 | 2>(1)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()

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
    // Respect an optional redirect (e.g. /signin?next=/checkout). Default to profile.
    const redirectTo = searchParams?.get("next") || searchParams?.get("redirectTo") || "/profile"
    router.push(redirectTo)
  }

  return (
    <>
  <Navbar />
      <div className="min-h-screen pt-32 pb-20 bg-background flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="w-full max-w-md bg-card rounded-2xl border border-border p-8 shadow-lg"
        >
          <div className="flex justify-center mb-8">
            <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-2xl">
              🔑
            </div>
          </div>

          {step === 1 && (
            <form onSubmit={handleNext} className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Welcome back</h1>
                <p className="text-muted-foreground">Enter your email to sign in to your account</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email address</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  type="email"
                  autoComplete="email"
                  className="bg-background"
                />
              </div>

              {error && <div className="text-sm text-destructive font-medium">{error}</div>}

              <Button type="submit" className="w-full" size="lg">
                Continue
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-card px-2 text-muted-foreground">Or</span>
                </div>
              </div>

              <div className="text-center text-sm text-muted-foreground">
                Don&apos;t have an account?{" "}
                <Link href="/signup" className="text-primary hover:underline font-medium">
                  Sign up
                </Link>
              </div>
            </form>
          )}

          {step === 2 && (
            <form onSubmit={handleSignInPassword} className="space-y-6">
              <div className="text-center space-y-2">
                <h1 className="text-2xl font-bold text-foreground">Enter password</h1>
                <p className="text-muted-foreground">for {email}</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  type="password"
                  autoComplete="current-password"
                  className="bg-background"
                />
              </div>

              {error && <div className="text-sm text-destructive font-medium">{error}</div>}

              <div className="flex flex-col gap-3">
                <Button type="submit" disabled={loading} className="w-full" size="lg">
                  {loading ? "Signing in..." : "Sign in"}
                </Button>
                <Button 
                  type="button" 
                  variant="ghost" 
                  onClick={() => setStep(1)}
                  className="w-full"
                >
                  Back
                </Button>
              </div>
            </form>
          )}
        </motion.div>
      </div>
      <Footer />
    </>
  )
}

export default function SignInPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SignInContent />
    </Suspense>
  )
}
