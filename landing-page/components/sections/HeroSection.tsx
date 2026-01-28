"use client"

import Image from "next/image"
import Link from "next/link"
import { motion } from "framer-motion"


import { ArrowRight, Building2, Code2 } from "lucide-react"
export const HeroSection = () => {
  return (
    <section id="home" className="w-full pt-32 pb-20 px-6 lg:px-8 bg-background">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Left Column - Content */}
          <div className="flex flex-col justify-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6 self-start"
            >
              <Code2 className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">Personalized Food Intelligence for India</span>
            </motion.div>

            {/* H1 - Rendered immediately for LCP */}
            <h1 className="text-4xl lg:text-5xl xl:text-6xl font-medium leading-tight tracking-tight text-foreground mb-6 text-balance">
              Hyper-Personalized Food Intelligence. <span className="text-primary">Built Into Your Platform.</span>
            </h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-lg lg:text-xl text-muted-foreground leading-relaxed mb-8 max-w-xl"
            >
              The food intelligence layer for India's leading platforms. We help quick-commerce, grocery, food delivery and health apps deliver personalized, safer food decisions to millions of users.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex flex-wrap gap-4"
            >
              <Link
                href="/docs"
                className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-6 py-3 rounded-full text-base font-medium hover:opacity-90 transition-all duration-200 shadow-sm hover:shadow-md group"
              >
                <Building2 className="w-4 h-4" />
                Get API Access
                <ArrowRight className="w-4 h-4 transition-transform duration-150 group-hover:translate-x-1" />
              </Link>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border"
            >
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-[#8B5E3C]">{"<50ms"}</div>
                <div className="text-sm text-muted-foreground mt-1">Time to Analyze</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-[#8B5E3C]">1.2L+</div>
                <div className="text-sm text-muted-foreground mt-1">Ingredients Mapped</div>
              </div>
              <div>
                <div className="text-2xl lg:text-3xl font-bold text-[#8B5E3C]">4M+</div>
                <div className="text-sm text-muted-foreground mt-1">Product Database</div>
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.645, 0.045, 0.355, 1] }}
            className="relative"
          >
            {/* Phone mockup showing q-commerce integration */}
            <div className="relative mx-auto w-72 lg:w-80">
              {/* Phone frame */}
              <div className="bg-card rounded-[3rem] border-8 border-foreground/10 shadow-2xl overflow-hidden">
                {/* Phone screen */}
                <div className="bg-background min-h-[520px]">
                  <div className="bg-primary px-4 py-3">
                    <div className="flex justify-between items-center text-primary-foreground">
                      <div className="text-sm font-semibold">Quick Commerce App</div>
                      <div className="text-xs">Delivery in 10 mins</div>
                    </div>
                  </div>

                  {/* Search bar */}
                  <div className="p-3 border-b border-border">
                    <div className="bg-secondary rounded-lg px-3 py-2 text-sm text-muted-foreground">
                      Search for groceries...
                    </div>
                  </div>

                  {/* Product card with Untainted integration */}
                  <div className="p-3 space-y-3">
                    <div className="text-xs font-medium text-muted-foreground uppercase">Snacks</div>

                    <div className="bg-card rounded-xl border border-border p-3">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center">
                          <Image
                            src="/granola-bar-healthy-snack.jpg"
                            alt="Muesli"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-lg"
                            priority
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground text-sm">Multigrain Muesli</div>
                          <div className="text-xs text-muted-foreground">No Added Sugar, 400g</div>
                          <div className="text-sm font-semibold text-foreground mt-1">₹299</div>
                        </div>
                      </div>
                      {/* Untainted badge */}
                      <div className="mt-3 flex items-center gap-2 bg-chart-3/10 rounded-lg px-3 py-2">
                        <svg className="w-4 h-4 text-chart-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs font-medium text-chart-3">Safe for your profile</span>
                        <span className="text-xs text-muted-foreground ml-auto">via Untainted</span>
                      </div>
                    </div>

                    {/* Product with warning badge */}
                    {/* Product with warning badge */}
                    <div className="bg-card rounded-xl border border-border p-3 opacity-75">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center">
                          <Image
                            src="/strawberry-yogurt-cup.jpg"
                            alt="Strawberry Yogurt"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground text-sm">Strawberry Yogurt</div>
                          <div className="text-xs text-muted-foreground">Cream Filled, 100g</div>
                          <div className="text-sm font-semibold text-foreground mt-1">₹30</div>
                        </div>
                      </div>
                      {/* Untainted warning badge */}
                      <div className="mt-3 flex items-center gap-2 bg-destructive/10 rounded-lg px-3 py-2">
                        <svg className="w-4 h-4 text-destructive" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                          />
                        </svg>
                        <span className="text-xs font-medium text-destructive">Contains gluten & dairy</span>
                        <span className="text-xs text-muted-foreground ml-auto">via Untainted</span>
                      </div>
                    </div>

                    <div className="bg-card rounded-xl border border-border p-3">
                      <div className="flex gap-3">
                        <div className="w-16 h-16 bg-secondary rounded-lg flex items-center justify-center">
                          <Image
                            src="/sparkling-water-can-lime.jpg"
                            alt="Sparkling Water"
                            width={64}
                            height={64}
                            className="w-full h-full object-cover rounded-lg"
                          />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-foreground text-sm">Sparkling Water</div>
                          <div className="text-xs text-muted-foreground">Lime Flavor, 330ml</div>
                          <div className="text-sm font-semibold text-foreground mt-1">₹45</div>
                        </div>
                      </div>
                      {/* Untainted badge */}
                      <div className="mt-3 flex items-center gap-2 bg-chart-3/10 rounded-lg px-3 py-2">
                        <svg className="w-4 h-4 text-chart-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        <span className="text-xs font-medium text-chart-3">Safe for your profile</span>
                        <span className="text-xs text-muted-foreground ml-auto">via Untainted</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Floating API response card */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="absolute -left-20 top-32 bg-card rounded-xl p-3 shadow-lg border border-border hidden lg:block max-w-[180px]"
              >
                <div className="text-xs font-mono text-muted-foreground mb-1">API Response</div>
                <div className="text-xs font-mono text-chart-3">{'{ verdict: "SAFE" }'}</div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.7 }}
                className="absolute -right-16 bottom-40 bg-card rounded-xl p-3 shadow-lg border border-border hidden lg:block"
              >
                <div className="text-xs text-primary font-medium">Powered by Untainted</div>
                <div className="text-xs text-muted-foreground">Real-time intelligence</div>
              </motion.div>
            </div>

            {/* Background decoration */}
            <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl" />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
