"use client"

import ContactForm from "../../components/ContactForm"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Mail, MapPin } from "lucide-react"

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <div className="min-h-screen pt-32 pb-20 bg-background">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            
            {/* Left Column: Content */}
            <div className="space-y-8">
              <div className="space-y-4">
                <h2 className="text-sm font-semibold text-primary tracking-wider uppercase">Contact Us</h2>
                <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-foreground">
                  Partner with Untainted
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed">
                  Whether you're a quick-commerce platform, a health app, or a retail chain — we help you build trust with your users through cleaner data.
                </p>
              </div>

              <div className="space-y-6 pt-4">
                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <Mail className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Email us</h3>
                    <p className="text-muted-foreground text-sm mb-1">For general inquiries and partnerships</p>
                    <a href="mailto:hello@untainted.io" className="text-primary hover:underline font-medium">hello@untainted.io</a>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center text-primary shrink-0">
                    <MapPin className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">Our Office</h3>
                    <p className="text-muted-foreground text-sm">
                      Mumbai, India
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 bg-secondary/30 rounded-2xl border border-secondary">
                <blockquote className="text-sm text-muted-foreground italic">
                  "We know users care about what they eat, but we don't have the tools to evaluate ingredients at checkout. Labels aren't built for digital decisions."
                </blockquote>
                <div className="mt-4 flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-200"></div>
                  <div className="text-xs font-medium text-foreground">Product Lead @ Leading Grocery App</div>
                </div>
              </div>
            </div>

            {/* Right Column: Form */}
            <div className="bg-card rounded-3xl border border-border p-8 shadow-sm">
                <h3 className="text-xl font-semibold mb-6">Send us a message</h3>
                <ContactForm subject="General/Sales Inquiry" />
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
