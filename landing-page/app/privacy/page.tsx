"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export default function PrivacyPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: January 2026</p>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-12">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Introduction</h2>
              <p className="text-muted-foreground leading-relaxed">
                At Untainted ("we," "our," or "us"), we believe that what you eat is personal, and your data should be too. 
                This Privacy Policy explains how we collect, use, disclosure, and safeguard your information when you visit our website 
                untainted.io or use our food intelligence services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">2. Information We Collect</h2>
              <div className="space-y-4 text-muted-foreground leading-relaxed">
                <p>We collect information that you provide directly to us:</p>
                <ul className="list-disc pl-6 space-y-2">
                  <li><strong>Profile Data:</strong> Dietary preferences (e.g., Vegan, Gluten-Free), allergies, and health goals you explicitly select.</li>
                  <li><strong>Account Information:</strong> Name, email address, and authentication credentials.</li>
                  <li><strong>Usage Data:</strong> Products you scan or search for, to improve our food database accuracy.</li>
                </ul>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">3. How We Use Your Information</h2>
              <p className="text-muted-foreground leading-relaxed mb-4">
                We use your data solely to provide and improve our services:
              </p>
              <ul className="list-disc pl-6 space-y-2 text-muted-foreground leading-relaxed">
                <li>To generate personalized "Safe/Unsafe" verdicts for food products.</li>
                <li>To sync your preferences across partner apps (only with your explicit permission).</li>
                <li>To analyze trends in food safety and ingredients to improve our Intelligence Engine.</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Data Protection</h2>
              <p className="text-muted-foreground leading-relaxed">
                We implement enterprise-grade security measures. Your personal health profile is encrypted at rest and in transit. 
                We do not sell your personal data to advertisers. When you use Untainted with third-party apps (like grocery delivery), 
                we share only the necessary "Verdict" (Safe/Unsafe) and not your detailed health profile, unless you authorize otherwise.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">5. Contact Us</h2>
              <p className="text-muted-foreground leading-relaxed">
                If you have questions about this privacy policy, please contact us at: <br/>
                <a href="mailto:hello@untainted.io" className="text-primary hover:underline">hello@untainted.io</a>
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
