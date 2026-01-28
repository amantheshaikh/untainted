"use client"

import { useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"
import Link from "next/link"

export default function SignUpPage() {
  const [accountType, setAccountType] = useState<"personal" | "business" | null>(null)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("+91 ")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const router = useRouter()

  async function handlePersonalSignUp(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    // Basic validation
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setLoading(false)
      return
    }

    if (!name.trim()) {
      setError("Please enter your name")
      setLoading(false)
      return
    }

    // Sign up with Supabase
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          full_name: name,
          phone: phone // Store in metadata as backup
        }
      }
    })

    if (authError) {
      if (authError.message.includes("User already registered") || authError.message.includes("already registered")) {
        setError("This email is already in use. Please sign in instead.")
      } else {
        setError(authError.message)
      }
      setLoading(false)
      return
    }

    // If signup successful, we might want to manually insert/update profile to ensure name is sync'd
    // if using Supabase triggers, this might be automatic. But to be safe for "Personal" aesthetic:
    if (authData.user) {
      // Double check/ensure profile row exists or update it
      // We'll trust the trigger or subsequent profile load, but updating here ensures immediate availability
      await supabase.from("profiles").upsert({
        user_id: authData.user.id,
        name: name,
        phone: phone
      })
    }

    setLoading(false)
    router.push("/profile")
  }

  const handleBusinessClick = () => {
    router.push("/contact")
  }

  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 pb-20 bg-background flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-4xl space-y-8">

          <div className="text-center space-y-4">
            <h2 className="text-sm font-semibold text-primary tracking-wider uppercase">Sign up for Untainted</h2>
            <h1 className="text-4xl font-bold tracking-tight text-foreground">
              Know what’s safe. Instantly.
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Personalized food intelligence for people and platforms.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 w-full">

            {/* Personal Option */}
            <button
              onClick={() => setAccountType("personal")}
              className={cn(
                "group relative p-8 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-lg h-full",
                accountType === "personal"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <div className="h-12 w-12 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center text-2xl mb-6">
                👤
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Individual</h3>
              <p className="text-muted-foreground text-sm font-medium mb-3">
                Eat with confidence. Made just for you.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Understand whether a food product is safe for your body, not just “generally safe.”
              </p>

              <ul className="space-y-2 text-sm text-foreground/80 mb-6">
                <li>✔ Check products against your diet, allergies, and sensitivities</li>
                <li>✔ Get clear ingredient-level explanations</li>
                <li>✔ Save preferences and scan history</li>
                <li>✔ Alerts when formulations change</li>
              </ul>

              <p className="text-sm font-medium text-foreground/60 italic">
                No medical jargon. Just clarity.
              </p>

              <div className={cn(
                "absolute top-6 right-6 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                accountType === "personal" ? "border-primary bg-primary" : "border-muted-foreground/30"
              )}>
                {accountType === "personal" && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
              </div>
            </button>

            {/* Business Option */}
            <button
              onClick={() => {
                setAccountType("business")
              }}
              className={cn(
                "group relative p-8 rounded-2xl border-2 text-left transition-all duration-200 hover:shadow-lg h-full",
                accountType === "business"
                  ? "border-primary bg-primary/5 ring-1 ring-primary"
                  : "border-border bg-card hover:border-primary/50"
              )}
            >
              <div className="h-12 w-12 rounded-xl bg-blue-100 text-blue-600 flex items-center justify-center text-2xl mb-6">
                🏢
              </div>
              <h3 className="text-xl font-semibold mb-2 text-foreground">Business</h3>
              <p className="text-muted-foreground text-sm font-medium mb-3">
                Build food trust into your product.
              </p>
              <p className="text-muted-foreground text-sm leading-relaxed mb-4">
                Integrate real-time food safety and personalization into your app or platform.
              </p>

              <ul className="space-y-2 text-sm text-foreground/80 mb-6">
                <li>✔ Generate and manage API keys</li>
                <li>✔ Ingredient-level risk evaluation at scale</li>
                <li>✔ Personalization based on user preferences</li>
                <li>✔ Usage analytics and monitoring</li>
                <li>✔ Built for q-commerce, food delivery, and retail</li>
              </ul>

              <p className="text-sm font-medium text-foreground/60 italic">
                Designed for production. Ready to scale.
              </p>

              <div className={cn(
                "absolute top-6 right-6 h-6 w-6 rounded-full border-2 flex items-center justify-center transition-colors",
                accountType === "business" ? "border-primary bg-primary" : "border-muted-foreground/30"
              )}>
                {accountType === "business" && <div className="h-2.5 w-2.5 rounded-full bg-white" />}
              </div>
            </button>
          </div>

          {/* Dynamic Content Area */}
          <div className="max-w-md mx-auto w-full transition-all duration-300 min-h-[100px]">

            {/* Case: No Selection */}
            {!accountType && (
              <div className="text-center text-sm text-muted-foreground py-8">
                Select an option above to continue.
              </div>
            )}

            {/* Case: Business Selected */}
            {accountType === "business" && (
              <div className="text-center animate-in fade-in slide-in-from-bottom-4 duration-300 pt-8">
                <Button
                  size="lg"
                  onClick={handleBusinessClick}
                  className="w-full text-lg h-12"
                >
                  Contact Us
                </Button>
              </div>
            )}

            {/* Case: Personal Selected */}
            {accountType === "personal" && (
              <form onSubmit={handlePersonalSignUp} className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-300 bg-card p-6 rounded-2xl border border-border shadow-sm">

                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="John Doe"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="john@example.com"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Mobile Number</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Create a password"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm your password"
                    required
                  />
                </div>

                {error && (
                  <div className="text-destructive text-sm font-medium px-2">
                    {error}
                  </div>
                )}

                <Button type="submit" className="w-full mt-2" size="lg" disabled={loading}>
                  {loading ? "Creating Account..." : "Create Personal Account"}
                </Button>

                <p className="text-center text-sm text-foreground/60 mt-4">
                  Already have an account?{" "}
                  <Link href="/signin" className="text-primary hover:underline font-medium">Log in</Link>
                </p>
              </form>
            )}

          </div>

        </div>
      </div>
      <Footer />
    </>
  )
}
