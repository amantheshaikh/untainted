import dynamic from 'next/dynamic'
import { Navbar } from "@/components/layout/Navbar"
import { HeroSection } from "@/components/sections/HeroSection"
import { Footer } from "@/components/layout/Footer"

// Lazy load below-the-fold components to reduce initial bundle size
const BuiltForPlatforms = dynamic(() => import("@/components/sections/BuiltForPlatforms").then(mod => mod.BuiltForPlatforms))
const BusinessBenefits = dynamic(() => import("@/components/sections/BusinessBenefits").then(mod => mod.BusinessBenefits))
const BusinessUseCases = dynamic(() => import("@/components/sections/BusinessUseCases").then(mod => mod.BusinessUseCases))
const IntelligenceEngine = dynamic(() => import("@/components/sections/IntelligenceEngine").then(mod => mod.IntelligenceEngine))
const EndingCTASection = dynamic(() => import("@/components/sections/EndingCTASection").then(mod => mod.EndingCTASection))
const FAQSection = dynamic(() => import("@/components/sections/FAQSection").then(mod => mod.FAQSection))
const FeaturesSection = dynamic(() => import("@/components/sections/FeaturesSection").then(mod => mod.FeaturesSection))
const ForYouSection = dynamic(() => import("@/components/sections/ForYouSection").then(mod => mod.ForYouSection))

import { Metadata } from 'next'

export const metadata: Metadata = {
  title: {
    absolute: "Untainted: Hyper-Personalized Food Intelligence for Platforms"
  },
  description: "Analyze ingredients, detect allergens, and provide personalized food choices for your consumers. The API-first platform for modern food commerce."
}

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
      <EndingCTASection />
      <FAQSection />
      <Footer />
    </>
  )
}
