"use client"

import { motion } from "framer-motion"
import { ArrowRight, Target, Layers, Shield, ChevronRight } from "lucide-react"
import Link from "next/link"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
            >
              <ChevronRight className="w-4 h-4 rotate-180" />
              Back to Home
            </Link>

            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold text-foreground leading-tight mb-6 text-balance">
              Building the Intelligence Layer for India&apos;s Consumption Economy
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              A system that understands what&apos;s right for you—and applies it everywhere.
            </p>
          </motion.div>
        </div>
      </section>

      {/* The Vision Section */}
      <section className="py-16 px-6 lg:px-8 bg-secondary/30">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-semibold text-foreground">The Beginning</h2>

            <div className="prose prose-lg text-muted-foreground space-y-6">
              <p className="text-lg leading-relaxed">
                Untainted is just the start. We&apos;re creating a personalized intelligence layer for India&apos;s
                consumption economy—beginning with food, where consequences are immediate and personal, and expanding to
                all home products.
              </p>

              <p className="text-lg leading-relaxed">
                Just as PayPal became the default layer for online payments—used by millions of consumers and businesses globally, we aim to become the{" "}
                <span className="text-foreground font-medium">default layer for identifying what&apos;s right for you</span>.
                Create your profile once, and let every product decision be evaluated through it—automatically,
                instantly, and personally.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Ambition Section */}
      <section className="px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <h2 className="text-3xl font-semibold text-foreground">Our Goal</h2>
            <p className="text-2xl md:text-3xl font-medium leading-tight text-foreground/90 max-w-2xl">
              We aim to power intelligence behind <span className="text-primary">1 out of every 3 purchases</span> made digitally.
            </p>

            <div className="grid md:grid-cols-2 gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="bg-card border border-border rounded-2xl p-8"
              >
                <div className="w-12 h-12 bg-accent/10 rounded-xl flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-accent" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Is it ambitious?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Absolutely. Most category-defining platforms are. We&apos;re not building another app—we&apos;re
                  building infrastructure for a more informed India.
                </p>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-card border border-border rounded-2xl p-8"
              >
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Shield className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold text-foreground mb-3">Is it necessary?</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Even more so. With millions of products and complex ingredient lists, consumers deserve clarity—and
                  platforms need the tools to provide it.
                </p>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* The Roadmap Section */}
      <section className="px-6 lg:px-8 bg-secondary/30 py-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <h2 className="text-3xl font-semibold text-foreground">The Journey</h2>

            <div className="space-y-6">
              {[
                {
                  phase: "Now",
                  title: "Food Intelligence",
                  description:
                    "Normalizing ingredients, evaluating against dietary preferences, and delivering real-time verdicts for packaged food products across India.",
                  active: true,
                },
                {
                  phase: "Next",
                  title: "Beauty & Personal Care",
                  description:
                    "Expanding our taxonomy to cover cosmetics, skincare, and personal care products with allergen and ingredient safety analysis.",
                  active: false,
                },
                {
                  phase: "Beyond",
                  title: "Household Essentials",
                  description:
                    "Building intelligence for cleaning products, baby care, and other regulated consumer categories.",
                  active: false,
                },
                {
                  phase: "Vision",
                  title: "Universal Product Intelligence",
                  description:
                    "A complete system for safer, smarter choices across every product category—evaluated through your personal profile.",
                  active: false,
                },
              ].map((item, index) => (
                <motion.div
                  key={item.phase}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className={`flex gap-6 ${item.active ? "" : "opacity-60"}`}
                >
                  <div className="flex flex-col items-center">
                    <div className={`w-4 h-4 rounded-full ${item.active ? "bg-accent" : "bg-border"}`} />
                    {index < 3 && <div className="w-0.5 h-full bg-border mt-2" />}
                  </div>
                  <div className="pb-8">
                    <span
                      className={`text-xs font-medium uppercase tracking-wider ${item.active ? "text-accent" : "text-muted-foreground"}`}
                    >
                      {item.phase}
                    </span>
                    <h3 className="text-xl font-semibold text-foreground mt-1 mb-2">{item.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Core Principles Section */}
      <section className="px-6 lg:px-8 py-10">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-10"
          >
            <h2 className="text-3xl font-semibold text-foreground">What We Believe</h2>

            <div className="grid gap-8">
              {[
                {
                  title: "Transparency is non-negotiable",
                  description:
                    "Every verdict comes with an explanation. We show you exactly what was flagged and why, never hiding behind black-box decisions.",
                },
                {
                  title: "Your preferences are yours",
                  description:
                    "We don't tell you what's good or bad—we evaluate products against what matters to you. Your dietary choices, your restrictions, your standards.",
                },
                {
                  title: "Infrastructure over apps",
                  description:
                    "The real impact comes from being embedded everywhere, not from building another standalone app. We're API-first because that's how we scale trust.",
                },
                {
                  title: "India-first, India-specific",
                  description:
                    "Built for Indian products, Indian dietary preferences, and Indian regulatory standards. We understand that Jain, Sattvic, and regional food preferences aren't edge cases—they're the mainstream.",
                },
              ].map((principle, index) => (
                <motion.div
                  key={principle.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="flex gap-4"
                >
                  <div className="w-1 bg-accent rounded-full flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{principle.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{principle.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Closing Statement */}
      <section className="py-20 px-6 lg:px-8 bg-primary/5">
        <div className="max-w-3xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <Layers className="w-12 h-12 text-primary mx-auto" />
            <blockquote className="text-2xl md:text-3xl font-medium text-foreground leading-relaxed text-balance">
              &ldquo;Untainted is the first step in a larger vision: a universal system for safer, smarter choices at
              scale.&rdquo;
            </blockquote>
          </motion.div>
        </div>
      </section>

      {/* CTA Section - Updated personal CTA to link to /download */}
      <section className="py-20 px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-card border border-border rounded-3xl p-8 md:p-12 text-center"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">Join Us in Building This Future</h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              Whether you&apos;re a platform looking to integrate product intelligence, or an individual who wants to
              take control of your food choices.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/#pricing"
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full font-medium hover:opacity-90 transition-opacity"
              >
                Integrate with Your Platform
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/download"
                className="inline-flex items-center justify-center gap-2 bg-secondary text-secondary-foreground px-6 py-3 rounded-full font-medium hover:bg-secondary/80 transition-colors"
              >
                Get the App
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  )
}