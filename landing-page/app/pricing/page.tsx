import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { PricingSection } from "@/components/sections/PricingSection"
import { PricingFAQ } from "@/components/sections/PricingFAQ"

export default function PricingPage() {
  return (
    <>
      <Navbar />
      <main className="pt-20">
        <PricingSection />
        <PricingFAQ />
      </main>
      <Footer />
    </>
  )
}
