"use client"

import { motion } from "framer-motion"
import { useRouter } from "next/navigation"
import {
  TrendingUp,
  Users,
  Shield,
  Zap,
  HeartPulse,
  ShoppingBag,
  BadgeCheck,
  Truck,
  UtensilsCrossed,
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

const useCases = [
  {
    icon: Truck,
    platform: "Quick Commerce",
    description: "10-minute grocery delivery apps",
    useCase:
      "Show 'Safe for You' badges on products. Filter search results by dietary needs. Flag allergens before checkout.",
  },
  {
    icon: UtensilsCrossed,
    platform: "Food Delivery",
    description: "Restaurant and meal delivery platforms",
    useCase:
      "Display allergen info for menu items. Match dishes to dietary preferences. Enable safe filtering for cuisines.",
  },
  {
    icon: ShoppingBag,
    platform: "Grocery & Retail",
    description: "Online supermarkets and e-grocery",
    useCase: "Personalized product recommendations. Ingredient-based search. Dietary preference filters.",
  },
  {
    icon: HeartPulse,
    platform: "Health & Fitness Apps",
    description: "Diet tracking and wellness platforms",
    useCase: "Recommend foods that match health goals. Track ingredient intake. Power meal planning features.",
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
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <BadgeCheck className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">For Businesses</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-medium text-foreground mb-4 text-balance">
            Why India's Top Platforms Choose Untainted
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Help your users make safer food decisions. Increase trust, reduce friction, and stand out in India's
            competitive food delivery market.
          </p>
        </motion.div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
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
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-semibold text-foreground text-center mb-10">Built for India's Food Platforms</h3>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {useCases.map((useCase, index) => (
              <motion.div
                key={useCase.platform}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card rounded-2xl border border-border overflow-hidden hover:border-primary/30 transition-colors"
              >
                {/* Header */}
                <div className="bg-secondary/50 px-6 py-4 border-b border-border">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                      <useCase.icon className="w-5 h-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{useCase.platform}</h4>
                      <p className="text-xs text-muted-foreground">{useCase.description}</p>
                    </div>
                  </div>
                </div>

                {/* Use Case */}
                <div className="p-6">
                  <p className="text-sm text-muted-foreground leading-relaxed">{useCase.useCase}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
            <div className="inline-flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => router.push("/contact")}
                className="inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-sm font-medium hover:opacity-90 transition-all duration-200"
              >
                Request API Access
              </button>
              <button
                onClick={() => router.push("/docs")}
                className="inline-flex items-center justify-center gap-2 border border-border bg-card text-foreground px-6 py-3 rounded-full text-sm font-medium hover:border-primary/50 transition-all duration-200"
              >
                View Documentation
              </button>
            </div>
        </motion.div>
      </div>
    </section>
  )
}
