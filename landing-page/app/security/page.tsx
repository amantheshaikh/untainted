"use client"

import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Shield, Lock, Server, Eye } from "lucide-react"

export default function SecurityPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-32 pb-20">
        <div className="max-w-4xl mx-auto px-6 lg:px-8">
          <div className="mb-12">
            <h1 className="text-4xl font-bold tracking-tight text-foreground mb-4">Data Security</h1>
            <p className="text-xl text-muted-foreground">
              Built with security first. We protect your dietary data like it’s our own.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-16">
            <div className="bg-card border border-border p-6 rounded-2xl">
              <Shield className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Enterprise Grade</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We use industry-standard encryption protocols (TLS 1.3) for data in transit and AES-256 encryption for data at rest.
              </p>
            </div>
            <div className="bg-card border border-border p-6 rounded-2xl">
              <Lock className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Privacy by Design</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Our architecture separates Personal Identifiable Information (PII) from health preferences. Apps only get the "fit/misfit" signal.
              </p>
            </div>
            <div className="bg-card border border-border p-6 rounded-2xl">
              <Server className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Secure Infrastructure</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                Hosted on secure cloud providers with strict access controls, regular vulnerability scans, and automated backups.
              </p>
            </div>
            <div className="bg-card border border-border p-6 rounded-2xl">
              <Eye className="w-8 h-8 text-primary mb-4" />
              <h3 className="text-lg font-semibold mb-2">Transparency</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                We log all API access. You have full visibility into which apps are accessing your profile and when.
              </p>
            </div>
          </div>

          <div className="prose prose-lg dark:prose-invert max-w-none space-y-12 border-t border-border pt-12">
            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Vulnerability Disclosure</h2>
              <p className="text-muted-foreground leading-relaxed">
                We take security seriously. If you believe you have found a security vulnerability in Untainted, 
                please report it to us immediately at <a href="mailto:security@untainted.io" className="text-primary hover:underline">security@untainted.io</a>.
                We appreciate your help in keeping our platform safe.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold mb-4 text-foreground">Compliance</h2>
              <p className="text-muted-foreground leading-relaxed">
                We are committed to complying with GDPR, CCPA, and other global data protection regulations. 
                Users have the right to request deletion of their data at any time via the API or user dashboard.
              </p>
            </section>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
