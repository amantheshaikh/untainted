import { Navbar } from "@/components/layout/Navbar"
import { HeroSection } from "@/components/sections/HeroSection"
import { BuiltForPlatforms } from "@/components/sections/BuiltForPlatforms"
import { BusinessBenefits } from "@/components/sections/BusinessBenefits"
import { BusinessUseCases } from "@/components/sections/BusinessUseCases"

import { IntelligenceEngine } from "@/components/sections/IntelligenceEngine"
import { CaseStudiesCarousel } from "@/components/sections/CaseStudiesCarousel"
import { DemoSection } from "@/components/sections/DemoSection"
import { PricingSection } from "@/components/sections/PricingSection"
import { FAQSection } from "@/components/sections/FAQSection"
import { FeaturesSection } from "@/components/sections/FeaturesSection"
import { ForYouSection } from "@/components/sections/ForYouSection"
import { Footer } from "@/components/layout/Footer"

export default function Page() {
  return (
    <>
      <Navbar />
      <HeroSection />
      <BuiltForPlatforms />
      <BusinessUseCases />
      <BusinessBenefits />
      <IntelligenceEngine />
      <FeaturesSection />
      <ForYouSection />
      <DemoSection />
      {/* <PricingSection /> removed as per request */}
      <FAQSection />
      <Footer />
    </>
  )
}
