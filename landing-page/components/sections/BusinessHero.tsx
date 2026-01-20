"use client"

import { motion } from "framer-motion"
import Link from "next/link"
import { Check, ShieldCheck, TrendingUp, Terminal, Zap } from "lucide-react"



export const BusinessHero = () => {
  return (
    <section className="relative pt-32 pb-20 overflow-hidden bg-background">
      <div className="container mx-auto px-6">
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="flex-1 max-w-2xl"
          >
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-full text-sm font-medium mb-6">
              <ShieldCheck className="w-4 h-4" />
              <span>Powering India's Leading Food Platforms</span>
            </div>

            <h1 className="text-4xl lg:text-6xl font-bold tracking-tight mb-6 text-foreground text-balance">
              Make Your Platform Feel <span className="text-primary">Safe & Personal</span>
            </h1>

            <p className="text-xl text-muted-foreground mb-8 leading-relaxed">
              Untainted acts as your platform's intelligence layer. We help you flag allergens, match dietary preferences, and protect your users in real-time.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/contact"
                className="bg-primary text-white px-8 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-lg shadow-primary/20 text-center"
              >
                Book a Demo
              </Link>
              <button
                onClick={() => document.getElementById('verticals')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-secondary text-foreground px-8 py-4 rounded-full font-bold text-lg hover:bg-secondary/80 transition-colors border border-border"
              >
                See Use Cases
              </button>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-x-8 gap-y-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-primary" />
                <span>Boost Conversion</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-primary" />
                <span>Increase Retention</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" />
                <span>Reduce Liability</span>
              </div>
            </div>
          </motion.div>

          {/* Visual: Intelligence Layer */}
          {/* Visual: Live Decision Flow */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex-1 w-full max-w-lg relative"
          >
            {/* Main Interface Card - Consumer App Style */}
            <div className="relative z-10 bg-gray-50 rounded-3xl shadow-2xl overflow-hidden border border-border/50 max-w-[340px] mx-auto">
                {/* Status Bar */}
                <div className="bg-white px-5 py-2.5 flex justify-between items-center text-[10px] font-medium text-gray-500">
                    <span>9:41</span>
                    <div className="flex gap-1.5">
                        <div className="w-3.5 h-2 bg-gray-900 rounded-[1px]" />
                        <div className="w-0.5 h-2 bg-gray-900/30 rounded-[1px]" />
                    </div>
                </div>

                {/* App Header */}
                <div className="bg-white px-4 pt-1.5 pb-3 border-b border-gray-100 sticky top-0 z-20">
                    <div className="flex justify-between items-center mb-3">
                        <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-600">
                             <span className="text-sm">☰</span>
                        </div>
                        <div className="flex flex-col items-center">
                            <span className="text-[8px] text-gray-400 font-bold tracking-widest uppercase">DELIVER TO</span>
                            <span className="text-xs font-bold text-gray-800 flex items-center gap-1">Home • Mumbai <span className="text-[8px]">▼</span></span>
                        </div>
                         <div className="w-7 h-7 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 relative">
                             <span className="text-xs">🛍️</span>
                             <div className="absolute -top-1 -right-1 w-3 h-3 bg-primary text-[7px] text-white flex items-center justify-center rounded-full border border-white">2</div>
                        </div>
                    </div>

                    {/* Smart Filters - Active */}
                    <div className="flex gap-1.5 overflow-x-auto pb-1 scrollbar-hide">
                         <div className="flex-shrink-0 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm shadow-primary/20">
                            <span>🌱 Vegan</span>
                         </div>
                         <div className="flex-shrink-0 bg-primary text-white text-[10px] font-bold px-2.5 py-1 rounded-full flex items-center gap-1 shadow-sm shadow-primary/20">
                            <span>🥜 Nut-Free</span>
                         </div>
                          <div className="flex-shrink-0 bg-white border border-gray-200 text-gray-500 text-[10px] font-medium px-2.5 py-1 rounded-full">
                            <span>🌶️ Spicy</span>
                         </div>
                    </div>
                </div>

                {/* Feed Content */}
                <div className="p-3 space-y-4 bg-gray-50">
                    
                    {/* Hero Product Card */}
                    <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-gray-100 relative group overflow-hidden">
                        {/* Food Image Placeholder */}
                        <div className="h-32 bg-orange-100 rounded-xl relative mb-2.5 overflow-hidden flex items-center justify-center">
                           <div className="text-5xl group-hover:scale-110 transition-transform duration-500">🥙</div>
                           
                           {/* UNTAINTED BADGE - The Hero Feature */}
                           <div className="absolute bottom-2 left-2 bg-white/95 backdrop-blur-sm px-2 py-1 rounded-md flex items-center gap-1.5 shadow-lg border border-green-100/50">
                                <div className="w-3.5 h-3.5 bg-green-500 rounded-full flex items-center justify-center">
                                    <Check className="w-2 h-2 text-white" strokeWidth={4} />
                                </div>
                                <div className="flex flex-col">
                                    <span className="text-[9px] font-bold text-green-700 leading-none">Safe Match</span>
                                    <span className="text-[7px] text-green-600/80 font-medium leading-none mt-0.5">Ingredients Verified</span>
                                </div>
                           </div>
                        </div>

                        <div className="flex justify-between items-start">
                            <div>
                                <h3 className="font-bold text-gray-900 text-sm">Falafel Hummus Bowl</h3>
                                <p className="text-[10px] text-gray-500 mt-0.5">Chickpeas, tahini, cucumber...</p>
                            </div>
                            <span className="font-bold text-gray-900 text-sm">₹240</span>
                        </div>
                        <button className="w-full mt-2.5 py-1.5 bg-gray-900 text-white rounded-lg text-[10px] font-bold hover:bg-gray-800 transition-colors">
                            Add to Cart
                        </button>
                    </div>

                      {/* Secondary Product (Cut off) */}
                    <div className="bg-white rounded-2xl p-2.5 shadow-sm border border-gray-100 opacity-60">
                         <div className="h-24 bg-yellow-50 rounded-xl mb-2.5 flex items-center justify-center">
                              <div className="text-4xl grayscale opacity-50">🍰</div>
                         </div>
                          <div className="h-3 w-2/3 bg-gray-100 rounded mb-1.5"></div>
                          <div className="h-2.5 w-1/2 bg-gray-50 rounded"></div>
                    </div>

                </div>
            </div>

            {/* Floating Notification Badge */}
            <motion.div 
               animate={{ y: [0, -6, 0] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               className="absolute -right-6 top-1/3 z-20 bg-white p-3 rounded-2xl shadow-xl border border-gray-100 max-w-[180px]"
            >
                <div className="flex items-start gap-3">
                    <div className="w-8 h-8 shrink-0 bg-primary/10 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4 text-primary" fill="currentColor" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-gray-900">Personalized!</div>
                        <div className="text-[10px] text-gray-500 leading-relaxed mt-0.5">
                            Menu auto-filtered for <span className="font-medium text-gray-900">Sarah's</span> preferences.
                        </div>
                    </div>
                </div>
            </motion.div>

            {/* Background Decorations */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr from-primary/10 to-accent/10 rounded-full blur-[80px]" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}

