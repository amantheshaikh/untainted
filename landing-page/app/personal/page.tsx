import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { FeaturesSection } from "@/components/FeaturesSection"
import { ForYouSection } from "@/components/ForYouSection"
import { DemoSection } from "@/components/DemoSection"
import { FAQSection } from "@/components/FAQSection"
import Link from "next/link"

export default function PersonalPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20">
        <section className="relative px-6 lg:px-8 py-24 md:py-32 max-w-7xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              Eat with <span className="text-primary">Confidence</span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto mb-10">
              Stop guessing. Scan any barcode or search any product to instantly know if it fits your diet, allergies, and health goals.
            </p>
             <div className="flex gap-4 justify-center">
               <Link href="/signup" className="bg-primary text-primary-foreground px-8 py-3 rounded-full font-semibold hover:opacity-90 transition-opacity">
                  Get the App
               </Link>
            </div>
        </section>

        <DemoSection />
        <ForYouSection />
        <FeaturesSection />
        <FAQSection />
      </main>
      <Footer />
    </>
  )
}
