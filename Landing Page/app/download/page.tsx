"use client"

import { motion } from "framer-motion"
import { ChevronRight, User, ScanLine, Camera, Keyboard, Shield, Bell, CheckCircle2 } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export default function AppComingSoonPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-16 px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Home
            </Link>

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-6">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-accent opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-accent"></span>
              </span>
              <span className="text-sm font-medium text-accent">Coming Soon</span>
            </div>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6 text-balance">
              The Untainted App
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Your personal food intelligence companion. Create your profile, scan products, and make safer food
              choices—whether you're shopping online or in-store.
            </p>
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
                          <img
                            src="/granola-bar-healthy-snack.jpg"
                            alt="Product"
                            className="w-12 h-12 object-cover rounded-lg"
                          />
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

      {/* Features List */}
      <section className="py-16 px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-semibold text-foreground mb-4">What You'll Get</h2>
            <p className="text-muted-foreground">Everything you need to take control of your food choices.</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[
              {
                icon: User,
                title: "Personal Food Profile",
                description:
                  "Set your dietary preferences, allergies, and restrictions. Your profile syncs across all connected platforms.",
              },
              {
                icon: ScanLine,
                title: "Multiple Scan Options",
                description:
                  "Scan barcodes, photograph ingredient labels, or manually enter ingredients for instant analysis.",
              },
              {
                icon: Shield,
                title: "Instant Safety Verdicts",
                description:
                  "Get real-time analysis with clear explanations of what's flagged and why—no confusing scores.",
              },
              {
                icon: Bell,
                title: "Smart Notifications",
                description:
                  "Receive alerts when your favorite products change formulations or when new suitable products launch.",
              },
            ].map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-card border border-border rounded-2xl p-6 flex gap-4"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center flex-shrink-0">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Notify CTA */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <h2 className="text-3xl font-semibold text-foreground">Be the First to Know</h2>
            <p className="text-muted-foreground">
              We're working hard to bring the Untainted app to iOS and Android. Join the waitlist to get early access.
            </p>

            <div className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <input
                type="email"
                placeholder="Enter your email"
                className="flex-1 px-4 py-3 rounded-full border border-border bg-card text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent/50"
              />
              <button className="bg-accent text-white px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity">
                Notify Me
              </button>
            </div>

            <p className="text-xs text-muted-foreground">We'll only email you when the app is ready. No spam, ever.</p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}