"use client"

import { motion } from "framer-motion"
import {
  HeartPulse,
  ShoppingBag,
  Truck,
  UtensilsCrossed,
  BadgeCheck,
} from "lucide-react"

const useCases = [
  {
    icon: Truck,
    platform: "Quick Commerce",
    description: "10-minute grocery delivery platforms",
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
    description: "Online supermarkets and e-commerce platforms",
    useCase: "Personalized product recommendations. Ingredient-based search. Dietary preference filters.",
  },
  {
    icon: HeartPulse,
    platform: "Health & Fitness",
    description: "Diet tracking and wellness platforms",
    useCase: "Recommend foods that match health goals. Track ingredient intake. Power meal planning features.",
  },
]

export const BuiltForPlatforms = () => {
  return (
    <section className="w-full bg-background py-8">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <BadgeCheck className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">For Businesses</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-medium text-foreground mb-4 text-balance">Built for India's Food Platforms</h2>

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
      </div>
    </section>
  )
}
