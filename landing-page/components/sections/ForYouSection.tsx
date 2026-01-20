"use client"

import { motion } from "framer-motion"
import { User, ScanLine, Shield, Globe, Smartphone, CheckCircle2 } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

const features = [
  {
    icon: User,
    title: "Create Your Food Profile",
    description: "Set your dietary needs - from Jain/Sattvic to gluten-free, diabetes-friendly, or keto.",
  },
  {
    icon: ScanLine,
    title: "Scan Any Product",
    description: "Scan barcodes at any store or online platform to instantly check if it's safe for you.",
  },
  {
    icon: Globe,
    title: "Works Across Apps",
    description: "Your profile syncs to connected quick-commerce, grocery, and health platforms automatically.",
  },
  {
    icon: Shield,
    title: "Your Data, Your Control",
    description: "Profile is encrypted and private. Apps see only safe/unsafe verdicts, never your health details.",
  },
]

const profilePreferences = [
  "Jain",
  "No Onion-Garlic",
  "Gluten-Free",
  "Dairy-Free",
  "Diabetic-Friendly",
  "No Maida",
  "Nut Allergy",
  "Vegan",
]

export const ForYouSection = () => {
  const router = useRouter()

  return (
    <section id="for-personal" className="w-full bg-background py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent/10 border border-accent/20 mb-4">
            <User className="w-4 h-4 text-accent" />
            <span className="text-sm font-medium text-accent">For Individuals</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-medium text-foreground mb-4 text-balance">
            One Profile. Every Grocery App in India.
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Create your food profile once. Use it on any quick-commerce app, grocery platform, or health app where you
            shop.
          </p>
        </motion.div>

        {/* Main content grid */}
        <div className="grid lg:grid-cols-2 gap-12 items-center mb-16">
          {/* Left - Profile visualization */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <div className="bg-card rounded-2xl border border-border p-6 shadow-lg">
              {/* Profile header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-accent/10 flex items-center justify-center">
                  <User className="w-8 h-8 text-accent" />
                </div>
                <div>
                  <div className="text-lg font-semibold text-foreground">Your Food Profile</div>
                  <div className="text-sm text-muted-foreground">Dietary preferences & restrictions</div>
                </div>
              </div>

              {/* Preferences grid */}
              <div className="space-y-4">
                <div className="text-sm font-medium text-foreground">Active Preferences</div>
                <div className="flex flex-wrap gap-2">
                  {profilePreferences.map((pref, index) => (
                    <motion.span
                      key={pref}
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileInView={{ opacity: 1, scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-secondary rounded-full text-sm"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-chart-3" />
                      {pref}
                    </motion.span>
                  ))}
                </div>
              </div>

              <div className="mt-6 pt-6 border-t border-border">
                <div className="text-sm font-medium text-foreground mb-3">Auto-syncs With</div>
                <div className="flex gap-3 flex-wrap">
                  {["Quick Commerce Apps", "Online Grocery", "Health & Fitness Apps", "Local Stores"].map(
                    (platform) => (
                      <div
                        key={platform}
                        className="px-3 py-1.5 bg-chart-3/10 text-chart-3 text-xs font-medium rounded-lg"
                      >
                        {platform}
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>

            {/* Decorative background */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-accent/5 rounded-full blur-3xl" />
          </motion.div>

          {/* Right - Features list */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="space-y-6"
          >
            {features.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                className="flex gap-4"
              >
                <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-accent" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-foreground mb-1">{feature.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="inline-flex flex-wrap gap-4 justify-center">
            <button
              onClick={() => router.push('/personal')}
              className="inline-flex items-center gap-2 bg-accent text-white px-6 py-3 rounded-full text-base font-medium hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md"
            >
              <Smartphone className="w-4 h-4" />
              Download App
            </button>
            <Link 
              href="/signup"
              className="inline-flex items-center justify-center bg-card border border-border text-foreground px-8 py-4 rounded-full text-base font-semibold hover:border-primary/50 transition-all duration-200"
            >
              Create Profile on Web
            </Link>
          </div>
          <p className="text-sm text-muted-foreground mt-4">Free forever. No credit card required.</p>
        </motion.div>
      </div>
    </section>
  )
}
