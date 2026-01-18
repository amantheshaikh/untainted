import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/HeroSection"
import { BusinessBenefits } from "@/components/BusinessBenefits"
import { BusinessUseCases } from "@/components/BusinessUseCases"
import { IntelligenceEngine } from "@/components/IntelligenceEngine"
import { FeaturesSection } from "@/components/FeaturesSection"
import { ForYouSection } from "@/components/ForYouSection"
import { DemoSection } from "@/components/DemoSection"
import { PricingSection } from "@/components/PricingSection"
import { FAQSection } from "@/components/FAQSection"
import { Footer } from "@/components/Footer"

export default function Page() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <BusinessBenefits />
      <BusinessUseCases />
      <IntelligenceEngine />
      <FeaturesSection />
      <ForYouSection />
      <DemoSection />
      <PricingSection />
      <FAQSection />
      <Footer />
    </>
  )
}
