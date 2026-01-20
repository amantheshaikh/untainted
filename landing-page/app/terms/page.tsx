"use client"

import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"

export default function TermsPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Terms of Service</h1>
            <p className="text-muted-foreground">Last updated: January 2026</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using Untainted, you accept and agree to be bound by the terms and provision of this agreement. 
                In addition, when using these particular services, you shall be subject to any posted guidelines or rules applicable to such services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Description of Service</h2>
              <p className="text-muted-foreground leading-relaxed">
                Untainted provides a food intelligence API and platform that analyzes food products against user-defined dietary profiles. 
                We use algorithmic analysis to interpret ingredient lists and nutritional data.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Important Medical Disclaimer</h2>
              <div className="p-6 bg-secondary/30 rounded-2xl border border-secondary mb-4">
                <p className="text-foreground font-medium leading-relaxed">
                  The content and analysis provided by Untainted are for informational purposes only and do not constitute medical advice, diagnosis, or treatment. 
                  Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition or dietary restriction. 
                  Never disregard professional medical advice or delay in seeking it because of something you have read on Untainted.
                </p>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                While we strive for accuracy, food manufacturing formulations change frequently. We cannot guarantee 100% accuracy of third-party product data or our analysis.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. API Usage</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you are accessing Untainted via our API for business purposes, you agree to our API Usage Guidelines. 
                You may not scrape content, reverse engineer the API, or use the data to train competing machine learning models.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Termination</h2>
              <p className="text-muted-foreground leading-relaxed">
                We reserve the right to terminate or suspend access to our service immediately, without prior notice or liability, 
                for any reason whatsoever, including without limitation if you breach the Terms.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
