"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  TrendingUp,
  Users,
  Shield,
  Zap,
  BadgeCheck,
} from "lucide-react"

const benefits = [
  {
    icon: TrendingUp,
    title: "Increase Conversions",
    description:
      "Users buy with confidence when they know a product is safe for them. Reduce cart abandonment from dietary uncertainty.",
    stat: "23%",
    statLabel: "higher checkout rates",
  },
  {
    icon: Users,
    title: "Build User Trust",
    description:
      "Show users you care about their health. Differentiate your platform with personalized safety information.",
    stat: "4.2x",
    statLabel: "higher retention",
  },
  {
    icon: Shield,
    title: "Reduce Liability",
    description: "Clear allergen warnings and ingredient transparency protect your platform and your users.",
    stat: "89%",
    statLabel: "fewer complaints",
  },
  {
    icon: Zap,
    title: "Fast Integration",
    description: "Simple REST API. Go live in days, not months. We handle the complexity of ingredient analysis.",
    stat: "<3 days",
    statLabel: "to integrate",
  },
]



export const BusinessBenefits = () => {
  const router = useRouter()
  return (
    <section id="for-business" className="w-full bg-background py-10">
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
            Why India's Top Platforms Choose Untainted
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help your users make safer food decisions. Increase trust, reduce friction, and stand out in India's
            competitive food delivery market.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-1">
          {benefits.map((benefit, index) => (
            <motion.div
              key={benefit.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className="bg-card rounded-2xl border border-border p-6 hover:shadow-lg hover:border-primary/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
                <benefit.icon className="w-6 h-6 text-primary" />
              </div>
              <div className="mb-4">
                <span className="text-3xl font-bold text-primary">{benefit.stat}</span>
                <span className="text-sm text-muted-foreground ml-2">{benefit.statLabel}</span>
              </div>
              <h3 className="text-lg font-semibold text-foreground mb-2">{benefit.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Use Cases for Indian Platforms */}


        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
            {/* CTA Removed */}
        </motion.div>
      </div>
    </section>
  )
}
