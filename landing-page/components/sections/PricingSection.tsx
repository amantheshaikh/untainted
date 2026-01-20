"use client"

import { motion } from "framer-motion"
import { Check, ArrowRight, Sparkles, Building2 } from "lucide-react"
import Link from "next/link"

export const PricingSection = () => {
  return (
    <section id="pricing" className="py-24 bg-background relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
          <div className="absolute top-40 left-10 w-72 h-72 bg-primary/5 rounded-full blur-[100px]" />
          <div className="absolute bottom-40 right-10 w-72 h-72 bg-accent/5 rounded-full blur-[100px]" />
      </div>

      <div className="container px-6 mx-auto relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-6 text-balance">
             Simple, transparent pricing
          </h2>
          <p className="text-xl text-muted-foreground">
            Start for free as an individual, or scale with our flexible pay-as-you-go model for platforms.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {/* Personal Plan */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="flex flex-col p-8 rounded-3xl bg-card border border-border shadow-sm hover:shadow-xl transition-shadow duration-300 relative overflow-hidden group"
          >
             <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-accent" />
             
             <div className="mb-8">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                    <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Personal</h3>
                <p className="text-muted-foreground">For individuals who want to eat cleaner.</p>
             </div>

             <div className="mb-8">
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tight">Free</span>
                    <span className="text-muted-foreground font-medium">/ forever</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">No credit card required</p>
             </div>

             <ul className="space-y-4 mb-8 flex-1">
                {[
                    "Unlimited product scans",
                    "Personalized food profile",
                    "Allergen warnings",
                    "Ingredient analysis",
                    "Mobile app access (iOS & Android)"
                ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-foreground/80">{feature}</span>
                    </li>
                ))}
             </ul>

             <Link href="/personal" className="w-full">
                <button className="w-full py-4 rounded-xl font-semibold bg-secondary hover:bg-secondary/80 text-foreground transition-colors flex items-center justify-center gap-2 group-hover:bg-primary/5 group-hover:text-primary">
                    Get Started Free
                    <ArrowRight className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" />
                </button>
             </Link>
          </motion.div>

          {/* Business Plan */}
           <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="flex flex-col p-8 rounded-3xl bg-[#0A0A0A] text-white border border-gray-800 shadow-2xl hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)] transition-shadow duration-300 relative overflow-hidden"
          >
             {/* Subtle gradient overlay */}
             <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-primary/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />

             <div className="mb-8 relative z-10">
                <div className="w-12 h-12 bg-gray-800 rounded-xl flex items-center justify-center mb-6 text-white border border-gray-700">
                    <Building2 className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold mb-2">Platform & Business</h3>
                <p className="text-gray-400">For apps integrating food intelligence.</p>
             </div>

             <div className="mb-8 relative z-10">
                <div className="flex items-baseline gap-1">
                    <span className="text-5xl font-bold tracking-tight">Pay as you go</span>
                </div>
                 <p className="text-sm text-gray-400 mt-2">Volume discounts available</p>
             </div>

             <ul className="space-y-4 mb-8 flex-1 relative z-10">
                {[
                    "Full API Access",
                    "Real-time product scoring",
                    "Bulk catalog analysis",
                    "Custom dietary profiles",
                    "Dedicated support & SLAs",
                    "Usage analytics dashboard"
                ].map((feature) => (
                    <li key={feature} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary shrink-0" />
                        <span className="text-gray-300">{feature}</span>
                    </li>
                ))}
             </ul>

             <Link href="/contact" className="w-full relative z-10">
                <button className="w-full py-4 rounded-xl font-semibold bg-primary hover:bg-primary/90 text-white transition-all shadow-[0_0_20px_rgba(214,93,38,0.3)] hover:shadow-[0_0_30px_rgba(214,93,38,0.5)] flex items-center justify-center gap-2">
                    Contact Us
                    <ArrowRight className="w-4 h-4 ml-1" />
                </button>
             </Link>
          </motion.div>
        </div>
        
        {/* Enterprise Banner */}
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="mt-12 max-w-5xl mx-auto rounded-2xl bg-secondary/30 border border-border p-6 flex flex-col md:flex-row items-center justify-between gap-6"
        >
            <div className="flex items-center gap-4">
               <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary shrink-0">
                  <Sparkles className="w-5 h-5" />
               </div>
               <div>
                  <h4 className="font-semibold text-foreground">Need a custom solution?</h4>
                  <p className="text-sm text-muted-foreground">We offer on-premise deployment and custom model training for large enterprises.</p>
               </div>
            </div>
            <Link href="/contact" className="text-primary font-semibold hover:underline decoration-primary/30 underline-offset-4 whitespace-nowrap">
                Talk to experts &rarr;
            </Link>
        </motion.div>

      </div>
    </section>
  )
}
