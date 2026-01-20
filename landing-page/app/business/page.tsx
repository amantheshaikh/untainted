"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { BusinessHero } from "@/components/sections/BusinessHero"
import { BusinessVerticals } from "@/components/sections/BusinessVerticals"
import { VerticalsDemo } from "@/components/sections/VerticalsDemo"
import { CoreValueProp } from "@/components/sections/CoreValueProp"
import { IntegrationShowcase } from "@/components/sections/IntegrationShowcase"
import { APIFeatures } from "@/components/sections/APIFeatures"
import Link from "next/link"

export default function BusinessPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen">


        <BusinessHero />
        <BusinessVerticals />
        <CoreValueProp />
        <IntegrationShowcase />
        <VerticalsDemo />
        <APIFeatures />

        {/* Bottom CTA Section */}
        <section className="py-24 bg-secondary/30 border-t border-border">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl font-bold tracking-tight mb-4">Ready to Integrate?</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10">
                    Join the leading food platforms using Untainted to deliver safer, smarter food choices.
                </p>
                <div className="flex justify-center">
                    <Link href="/contact" className="bg-primary text-primary-foreground px-10 py-4 rounded-full font-bold text-lg hover:opacity-90 transition-all shadow-lg hover:shadow-xl">
                        Contact Us
                    </Link>
                </div>
            </div>
        </section>

      </main>
      <Footer />
    </>
  )
}
