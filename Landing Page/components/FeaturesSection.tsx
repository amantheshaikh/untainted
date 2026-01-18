"use client"

import { motion } from "framer-motion"
import { Shield, Wheat, BookOpen, Apple, Lock, BarChart3 } from "lucide-react"

const features = [
  {
    icon: Wheat,
    title: "Indian Ingredient Database",
    description:
      "50,000+ ingredients including regional Indian food additives, masalas, and traditional ingredients. We normalize messy FSSAI labels into structured data.",
    highlight: "India-First",
  },
  {
    icon: Shield,
    title: "Decision Frameworks",
    description:
      "Pre-built standards like 'Jain-Friendly', 'Sattvic', 'Allergen Safe', 'No Maida', or 'Low FODMAP'. Use them as-is or customize for your platform.",
    highlight: "Preset Standards",
  },
  {
    icon: Apple,
    title: "Profile-Based Verdicts",
    description:
      "Evaluate packaged foods against individual dietary profiles. Perfect for users managing diabetes, allergies, or specific religious dietary needs.",
    highlight: "Personalized",
  },
  {
    icon: BookOpen,
    title: "Explainable Results",
    description:
      "Every verdict comes with clear explanations that you can surface to your users. No black-box decisions.",
    highlight: "Transparency",
  },
  {
    icon: Lock,
    title: "Privacy by Design",
    description:
      "User profiles are encrypted and user-controlled. Platforms see verdicts, not raw health data. DPDPA compliant.",
    highlight: "User Control",
  },
  {
    icon: BarChart3,
    title: "Market Insights",
    description:
      "Understand what Indians are looking for. Track dietary trends, common allergen concerns, and ingredient preferences across your user base.",
    highlight: "Analytics",
  },
]

export const FeaturesSection = () => {
  return (
    <section id="features" className="w-full bg-secondary/20 py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-medium text-foreground mb-4 text-balance">
            Built for India's Food Ecosystem
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deep understanding of Indian packaged foods, FSSAI regulations, and diverse dietary needs from Jain to Keto.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              {/* Icon & Badge */}
              <div className="flex items-start justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <feature.icon className="w-6 h-6 text-primary" />
                </div>
                <span className="px-2 py-1 rounded-md bg-accent/10 text-accent text-xs font-medium">
                  {feature.highlight}
                </span>
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
