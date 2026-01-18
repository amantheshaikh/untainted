"use client"

import ContactForm from "../../components/ContactForm"

export default function ContactPage() {
  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-4">Contact Sales / Request API Access</h1>
      <p className="text-muted-foreground mb-4">Tell us about your platform and API needs. We'll follow up within 2 business days.</p>
      <ContactForm subject="API access request" />
    </div>
  )
}
