"use client"

import { motion } from "framer-motion"
import { ShieldAlert, Users, MousePointerClick } from "lucide-react"

export const CoreValueProp = () => {
  return (
    <section className="py-8 bg-background">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold tracking-tight mb-4 text-foreground">
                Turn Safety Into Your <span className="text-primary">Competitive Advantage</span>
            </h2>
            <p className="text-muted-foreground text-lg">
                Untainted helps you drive higher conversion rates, reduce risk and build trust.
            </p>
        </div>
        <div className="grid lg:grid-cols-3 gap-12">
            {/* 1. Liability */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               className="text-center md:text-left"
            >
                <div className="inline-flex p-3 rounded-2xl bg-red-100 text-red-600 mb-6">
                    <ShieldAlert className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Reduce Operational Liability</h3>
                <p className="text-muted-foreground leading-relaxed">
                    Mislabeling allergens is a massive risk. We automate verification, flagging conflicts before an order is placed, protecting you from costly claims.
                </p>
            </motion.div>

            {/* 2. Retention */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.1 }}
               className="text-center md:text-left"
            >
                <div className="inline-flex p-3 rounded-2xl bg-blue-100 text-blue-600 mb-6">
                    <Users className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Build Unshakeable Trust</h3>
                <p className="text-muted-foreground leading-relaxed">
                    When you tell a user "This is safe for you," you create loyalty. 60% of users with restrictions switch apps if they feel unsafe.
                </p>
            </motion.div>

            {/* 3. Conversion */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               whileInView={{ opacity: 1, y: 0 }}
               viewport={{ once: true }}
               transition={{ delay: 0.2 }}
               className="text-center md:text-left"
            >
                <div className="inline-flex p-3 rounded-2xl bg-green-100 text-green-600 mb-6">
                    <MousePointerClick className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-bold mb-3">Eliminate Checkout Friction</h3>
                <p className="text-muted-foreground leading-relaxed">
                   "Is this really vegan?" creates hesitation. Clear, personalized verdicts remove doubt, leading to higher cart completion rates.
                </p>
            </motion.div>
        </div>
      </div>
    </section>
  )
}
