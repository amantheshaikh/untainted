"use client"

import { motion } from "framer-motion"
import { ShoppingBag, UtensilsCrossed, Truck, HeartPulse, ArrowRight } from "lucide-react"

const verticals = [
  {
    icon: Truck,
    title: "Quick Commerce",
    description: "In the 10-minute race, don't let safety slip.",
    benefits: [
      "Highlight allergen-free snacks",
      "Instant feedback on new inventory",
      "Reduce returns from 'accidental' non-veg orders"
    ],
    color: "from-blue-500/20 to-blue-600/20"
  },
  {
    icon: UtensilsCrossed,
    title: "Food Delivery",
    description: "Give users confidence to order from new restaurants.",
    benefits: [
      "Standardize dietary tags across thousands of menus",
      "Warn users if a dish conflicts with their profile",
      "Liability protection for platforms"
    ],
    color: "from-orange-500/20 to-red-600/20"
  },
  {
    icon: ShoppingBag,
    title: "E-Commerce and Grocery",
    description: "Recreate the careful aisle-shopping experience online.",
    benefits: [
       "Personalized 'Safe Aisle' filters",
       "Better substitutions for out-of-stock items",
       "Nutri-score sorting for health categories"
    ],
    color: "from-green-500/20 to-emerald-600/20"
  },
  {
    icon: HeartPulse,
    title: "Health & Fitness",
    description: "Power your diet tracking with precise data.",
    benefits: [
       "Automated macro calculation",
       "Ultra-processed food detection",
       "Ingredient quality scoring"
    ],
    color: "from-purple-500/20 to-pink-600/20"
  }
]

export const BusinessVerticals = () => {
  return (
    <section id="verticals" className="py-24 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-12">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Built for Every Food Platform
          </h2>
          <p className="text-lg text-muted-foreground">
            Whether you deliver groceries in minutes or track calories for millions, Untainted fits your flow.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 leading-normal">
          {verticals.map((v, i) => (
            <motion.div
              key={v.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="group relative overflow-hidden bg-background border border-border rounded-2xl p-6 hover:border-primary/40 transition-colors"
            >
              <div className={`absolute top-0 right-0 w-48 h-48 bg-gradient-to-br ${v.color} blur-[60px] rounded-full translate-x-1/3 -translate-y-1/3 pointer-events-none group-hover:opacity-100 transition-opacity`} />
              
              <div className="relative z-10">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                   <v.icon className="w-5 h-5" />
                </div>
                
                <h3 className="text-xl font-bold mb-2">{v.title}</h3>
                <p className="text-muted-foreground text-sm mb-4 leading-relaxed">{v.description}</p>
                
                <ul className="space-y-2 mb-6">
                  {v.benefits.map((benefit) => (
                    <li key={benefit} className="flex items-start gap-2.5 text-sm text-foreground/80">
                      <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5 shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>

                <button 
                  onClick={() => document.getElementById('use-cases')?.scrollIntoView({ behavior: 'smooth' })}
                  className="flex items-center text-primary font-semibold text-xs uppercase tracking-wide group-hover:gap-2 transition-all"
                >
                  Explore Solutions <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
