"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowRight, Mail } from "lucide-react"

export const EndingCTASection = () => {
    return (
        <section className="w-full py-24 lg:py-32 bg-secondary/30 relative overflow-hidden">
            {/* Background decoration */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px]" />
            </div>

            <div className="max-w-4xl mx-auto px-6 lg:px-8 text-center relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.5 }}
                >
                    <h2 className="text-4xl lg:text-5xl font-medium tracking-tight text-foreground mb-6">
                        Ready to Transform <span className="text-primary">Food Commerce?</span>
                    </h2>
                    <p className="text-xl text-muted-foreground mb-10 max-w-2xl mx-auto leading-relaxed">
                        Join the leading platforms using Untainted to deliver personalized, safe, and transparent food choices to millions of users.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link
                            href="/how-it-works"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-background border-2 border-primary/20 text-foreground font-medium hover:border-primary/50 transition-all duration-200 group"
                        >
                            See Us In Action
                            <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                        </Link>

                        <Link
                            href="/contact"
                            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-primary text-primary-foreground font-medium hover:opacity-90 transition-all duration-200 shadow-md hover:shadow-lg"
                        >
                            <Mail className="w-4 h-4" />
                            Contact Us
                        </Link>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
