"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ForYouSection } from "@/components/sections/ForYouSection"
import { FAQSection } from "@/components/sections/FAQSection"
import Link from "next/link"
import { motion } from "framer-motion"
import { ChevronRight, User, ScanLine, Camera, Keyboard, Shield, Bell, CheckCircle2, Sparkles, ArrowDown } from "lucide-react"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"

export default function PersonalPage() {
  const [email, setEmail] = useState("")
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')

  const handleJoinWaitlist = async () => {
    if (!email || !email.includes("@")) return

    setStatus('loading')

    // Check if email already exists to prevent duplicate errors if table has unique constraint
    // Or just let insert fail/succeed. Let's try insert.
    const { error } = await supabase.from("waitlist").insert([{ email, source: 'personal_page' }])

    if (error) {
      // If error code is unique violation (23505), treat as success (user already registered)
      if (error.code === '23505') {
        setStatus('success')
      } else {
        console.error(error)
        setStatus('error')
      }
    } else {
      setStatus('success')
      setEmail("")
    }
  }

  return (
    <main className="min-h-screen bg-background pt-20">
      <Navbar />

      {/* Hero Section */}
      <section className="relative px-6 lg:px-8 py-10 lg:py-10">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-sm font-medium text-accent">App Coming Soon</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6 text-balance">
              The Untainted App
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto mb-10">
              Create your food profile once, use it everywhere. Shop confidently across any app, website, or store
              with your personalized food intelligence companion.
            </p>

            {/* Waitlist Input */}
            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto mb-12">
              {status === 'success' ? (
                <div className="flex-1 bg-primary/10 text-primary border border-primary/20 px-5 py-3 rounded-full text-center font-medium animate-in fade-in zoom-in duration-300">
                  🎉 You're on the list! We'll be in touch.
                </div>
              ) : (
                <>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email for early access"
                    className="flex-1 px-5 py-3 rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
                    disabled={status === 'loading'}
                    onKeyDown={(e) => e.key === 'Enter' && handleJoinWaitlist()}
                  />
                  <button
                    onClick={handleJoinWaitlist}
                    disabled={status === 'loading' || !email}
                    className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity whitespace-nowrap disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {status === 'loading' ? 'Joining...' : 'Join Waitlist'}
                  </button>
                </>
              )}
            </div>
            <p className="text-xs text-muted-foreground">We'll notify you when iOS & Android apps launch.</p>
          </motion.div>

          {/* Phone Mockups */}
          <div className="grid lg:grid-cols-3 gap-8 lg:gap-12 items-start">
            {/* Profile Screen Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative mx-auto"
            >
              <div className="text-center mb-4">
                <span className="text-sm font-medium text-muted-foreground">Your Profile</span>
              </div>
              <div className="relative w-64 mx-auto">
                {/* Phone frame */}
                <div className="bg-card rounded-[2.5rem] border-8 border-foreground/10 shadow-2xl overflow-hidden">
                  <div className="bg-background min-h-[480px]">
                    {/* Status bar */}
                    <div className="bg-primary px-4 py-2 flex justify-between items-center">
                      <span className="text-xs text-primary-foreground/80">9:41</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-2 bg-primary-foreground/80 rounded-sm"></div>
                      </div>
                    </div>

                    {/* Header */}
                    <div className="px-4 py-4 border-b border-border">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-accent/20 flex items-center justify-center">
                          <User className="w-6 h-6 text-accent" />
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-sm">My Food Profile</div>
                          <div className="text-xs text-muted-foreground">8 preferences active</div>
                        </div>
                      </div>
                    </div>

                    {/* Profile content */}
                    <div className="p-4 space-y-4">
                      <div>
                        <div className="text-xs font-medium text-muted-foreground uppercase mb-2">
                          Dietary Preferences
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {["Jain", "No Onion-Garlic", "Gluten-Free"].map((pref) => (
                            <span
                              key={pref}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-chart-3/10 text-chart-3 rounded-full text-xs"
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              {pref}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Allergies</div>
                        <div className="flex flex-wrap gap-1.5">
                          {["Peanuts", "Shellfish"].map((allergy) => (
                            <span
                              key={allergy}
                              className="inline-flex items-center gap-1 px-2 py-1 bg-destructive/10 text-destructive rounded-full text-xs"
                            >
                              <Shield className="w-3 h-3" />
                              {allergy}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div>
                        <div className="text-xs font-medium text-muted-foreground uppercase mb-2">
                          Avoid Ingredients
                        </div>
                        <div className="flex flex-wrap gap-1.5">
                          {["Maida", "Palm Oil", "MSG"].map((ing) => (
                            <span key={ing} className="px-2 py-1 bg-secondary text-foreground rounded-full text-xs">
                              {ing}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border">
                        <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Connected Apps</div>
                        <div className="flex gap-2">
                          {[1, 2, 3].map((i) => (
                            <div key={i} className="w-8 h-8 rounded-lg bg-secondary flex items-center justify-center">
                              <div className="w-4 h-4 rounded bg-muted-foreground/20"></div>
                            </div>
                          ))}
                          <div className="w-8 h-8 rounded-lg bg-accent/10 flex items-center justify-center text-accent text-xs font-medium">
                            +5
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Scanner Screen Mockup - Main/Center */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="relative mx-auto lg:scale-110 lg:-mt-4"
            >
              <div className="text-center mb-4">
                <span className="text-sm font-medium text-accent">Scan Products</span>
              </div>
              <div className="relative w-64 mx-auto">
                {/* Phone frame */}
                <div className="bg-card rounded-[2.5rem] border-8 border-foreground/10 shadow-2xl overflow-hidden">
                  <div className="bg-background min-h-[480px]">
                    {/* Status bar */}
                    <div className="bg-foreground px-4 py-2 flex justify-between items-center">
                      <span className="text-xs text-background/80">9:41</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-2 bg-background/80 rounded-sm"></div>
                      </div>
                    </div>

                    {/* Camera viewfinder */}
                    <div className="relative bg-foreground/90 h-56 flex items-center justify-center">
                      {/* Scan frame */}
                      <div className="w-40 h-28 border-2 border-accent rounded-lg relative">
                        <div className="absolute -top-0.5 -left-0.5 w-4 h-4 border-t-2 border-l-2 border-accent rounded-tl"></div>
                        <div className="absolute -top-0.5 -right-0.5 w-4 h-4 border-t-2 border-r-2 border-accent rounded-tr"></div>
                        <div className="absolute -bottom-0.5 -left-0.5 w-4 h-4 border-b-2 border-l-2 border-accent rounded-bl"></div>
                        <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 border-b-2 border-r-2 border-accent rounded-br"></div>

                        {/* Scan line animation */}
                        <motion.div
                          className="absolute left-1 right-1 h-0.5 bg-accent"
                          animate={{ top: ["10%", "90%", "10%"] }}
                          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                        />
                      </div>

                      <div className="absolute bottom-3 left-0 right-0 text-center">
                        <span className="text-xs text-background/80">Align barcode within frame</span>
                      </div>
                    </div>

                    {/* Scan options */}
                    <div className="p-4 space-y-3">
                      <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Scan Method</div>
                      <div className="grid grid-cols-3 gap-2">
                        <div className="bg-accent/10 border border-accent/30 rounded-xl p-3 text-center">
                          <ScanLine className="w-5 h-5 text-accent mx-auto mb-1" />
                          <span className="text-xs text-accent font-medium">Barcode</span>
                        </div>
                        <div className="bg-secondary rounded-xl p-3 text-center">
                          <Camera className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                          <span className="text-xs text-muted-foreground">Label OCR</span>
                        </div>
                        <div className="bg-secondary rounded-xl p-3 text-center">
                          <Keyboard className="w-5 h-5 text-muted-foreground mx-auto mb-1" />
                          <span className="text-xs text-muted-foreground">Manual</span>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border">
                        <div className="text-xs text-muted-foreground text-center">
                          Works offline for recently scanned products
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Results Screen Mockup */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="relative mx-auto"
            >
              <div className="text-center mb-4">
                <span className="text-sm font-medium text-muted-foreground">Instant Results</span>
              </div>
              <div className="relative w-64 mx-auto">
                {/* Phone frame */}
                <div className="bg-card rounded-[2.5rem] border-8 border-foreground/10 shadow-2xl overflow-hidden">
                  <div className="bg-background min-h-[480px]">
                    {/* Status bar */}
                    <div className="bg-chart-3 px-4 py-2 flex justify-between items-center">
                      <span className="text-xs text-white/80">9:41</span>
                      <div className="flex gap-1">
                        <div className="w-4 h-2 bg-white/80 rounded-sm"></div>
                      </div>
                    </div>

                    {/* Result header */}
                    <div className="bg-chart-3/10 px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-14 h-14 rounded-xl bg-white shadow-sm flex items-center justify-center">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-xs text-muted-foreground">Img</div>
                        </div>
                        <div className="flex-1">
                          <div className="font-semibold text-foreground text-sm">Multigrain Muesli</div>
                          <div className="text-xs text-muted-foreground">No Added Sugar, 400g</div>
                        </div>
                      </div>

                      {/* Verdict badge */}
                      <div className="mt-3 bg-chart-3 rounded-xl px-4 py-3 flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-white" />
                        <span className="text-white font-semibold">Safe for Your Profile</span>
                      </div>
                    </div>

                    {/* Details */}
                    <div className="p-4 space-y-3">
                      <div>
                        <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Analysis Summary</div>
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Ingredients checked</span>
                            <span className="text-foreground font-medium">24</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Flagged items</span>
                            <span className="text-chart-3 font-medium">0</span>
                          </div>
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">Profile match</span>
                            <span className="text-chart-3 font-medium">100%</span>
                          </div>
                        </div>
                      </div>

                      <div className="pt-3 border-t border-border">
                        <div className="text-xs font-medium text-muted-foreground uppercase mb-2">Verified Against</div>
                        <div className="flex flex-wrap gap-1.5">
                          {["Jain", "No Onion-Garlic", "Gluten-Free"].map((pref) => (
                            <span key={pref} className="px-2 py-1 bg-chart-3/10 text-chart-3 rounded-full text-xs">
                              {pref}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* What You'll Get Section */}
      <section className="py-20 bg-secondary/20">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4">What You'll Get</h2>
            <p className="text-muted-foreground">
              Everything you need to take control of your food choices.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-4 text-orange-600">
                <User className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">One Profile, Everywhere</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Define your dietary needs once. We apply them automatically to every grocery app, website, and physical store you visit.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-4 text-orange-600">
                <ScanLine className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Multiple Scan Options</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Scan barcodes, photograph ingredient labels, or manually enter ingredients for instant analysis.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-4 text-orange-600">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Instant Safety Verdicts</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Get real-time analysis with clear explanations of what's flagged and why—no confusing scores.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-card p-6 rounded-xl border border-border shadow-sm">
              <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center mb-4 text-orange-600">
                <Bell className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Smart Notifications</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Receive alerts when your favorite products change formulations or when new suitable products launch.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Feature Spotlight: Natural Language Intelligence */}
      <section className="py-24 bg-primary/5 border-y border-primary/10">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Nutrition Intelligence
              </div>
              <h2 className="text-3xl lg:text-4xl font-bold mb-6 text-balance">
                Just say: <br />
                <span className="text-primary">"I'm vegan and allergic to peanuts."</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8">
                No more endless checkboxes. Our AI understands your health profile in plain English.
                Whether you have complex medical conditions or simple lifestyle choices, just type it out.
              </p>
              <div className="flex flex-col gap-4">
                <div className="flex items-start gap-4 p-4 bg-background rounded-xl border border-border shadow-sm">
                  <div className="bg-chart-3/10 p-2 rounded-lg text-chart-3 mt-1">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Smart Parsing</div>
                    <div className="text-sm text-muted-foreground">Instantly maps "high blood pressure" to "Low Sodium" logic.</div>
                  </div>
                </div>
                <div className="flex items-start gap-4 p-4 bg-background rounded-xl border border-border shadow-sm">
                  <div className="bg-accent/10 p-2 rounded-lg text-accent mt-1">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-semibold text-foreground">Conflict Resolution</div>
                    <div className="text-sm text-muted-foreground">Automatically handles overlapping diet rules (e.g. Jain vs Vegan).</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Visual Demo */}
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/20 to-accent/20 rounded-3xl blur-3xl transform rotate-3 scale-95" />
              <div className="relative bg-card border border-border rounded-2xl shadow-2xl p-6 lg:p-10 space-y-6">
                {/* Input State */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase">You Type</div>
                  <div className="p-4 rounded-xl bg-background border border-primary/30 text-foreground font-medium shadow-sm">
                    "I follow a <span className="text-primary bg-primary/10 px-1 rounded">Keto</span> diet but I absolutely cannot have <span className="text-destructive bg-destructive/10 px-1 rounded">Dairy</span> or <span className="text-destructive bg-destructive/10 px-1 rounded">Soy</span>."
                  </div>
                </div>

                {/* Arrow */}
                <div className="flex justify-center text-muted-foreground">
                  <ArrowDown className="w-6 h-6 animate-bounce" />
                </div>

                {/* Result State */}
                <div className="space-y-2">
                  <div className="text-xs font-medium text-muted-foreground uppercase">We Build</div>
                  <div className="grid gap-3">
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <span className="text-sm font-medium">Dietary Type</span>
                      <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full border border-primary/20">Keto</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-secondary/50 rounded-lg">
                      <span className="text-sm font-medium">Allergens</span>
                      <div className="flex gap-2">
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full border border-destructive/20">Dairy</span>
                        <span className="text-xs bg-destructive/10 text-destructive px-2 py-1 rounded-full border border-destructive/20">Soy</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <ForYouSection />
      <FAQSection /> {/* Reusing FAQ Section */}

      <Footer />
    </main>
  )
}
