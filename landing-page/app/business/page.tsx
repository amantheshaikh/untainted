import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { BusinessBenefits } from "@/components/BusinessBenefits"
import { BusinessUseCases } from "@/components/BusinessUseCases"
import { IntelligenceEngine } from "@/components/IntelligenceEngine"
import { PricingSection } from "@/components/PricingSection"
import Link from "next/link"

export default function BusinessPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <section className="relative px-6 lg:px-8 py-24 md:py-32 max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Food Intelligence for <span className="text-primary">Enterprise</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Transform your grocery platform, health app, or delivery service with our powerful API. deliver personalized safety verdicts at scale.
            </p>
            <div className="flex gap-4 justify-center">
               <Link href="/docs" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
                  Read API Docs
               </Link>
               <Link href="#pricing" className="bg-secondary text-secondary-foreground px-8 py-3 rounded-full font-semibold hover:bg-secondary/80 transition-opacity">
                  View Pricing
               </Link>
            </div>
        </section>

        <BusinessBenefits />
        <IntelligenceEngine />
        <BusinessUseCases />
        <PricingSection />
      </main>
      <Footer />
    </>
  )
}
