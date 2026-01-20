"use client"

import { useState } from "react"
import { supabase } from "@/lib/supabaseClient"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"

import { sendContactEmail } from "@/app/actions"

export default function ContactForm({ subject = "General inquiry" }: { subject?: string }) {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [company, setCompany] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    
    // 1. Send Email
    const emailResult = await sendContactEmail({
      name,
      email,
      company,
      message,
      subject,
    })

    if (emailResult.success) {
      // 2. Optional: Still save to Supabase for redundancy/analytics
      const payload = { name, email, company, message, subject }
      try {
        await supabase.from("feedback").insert([{ context: { subject }, message: JSON.stringify(payload) }])
      } catch (err) {
        console.error("Supabase backup failed:", err)
      }
      
      setSuccess(true)
    } else {
      console.error("Email failed:", emailResult.error)
      // Ideally show an error message to user, but for now we fallback or just log
      alert("Something went wrong. Please try again.")
    }

    setLoading(false)
  }

  if (success) return (
    <div className="p-8 bg-green-50 text-green-800 rounded-xl border border-green-100 text-center">
      <h3 className="text-lg font-semibold mb-2">Message Sent!</h3>
      <p>Thanks for reaching out. We&apos;ll be in touch within 2 business days.</p>
    </div>
  )

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input 
                id="name"
                value={name} 
                onChange={(e) => setName(e.target.value)} 
                placeholder="Jane Doe" 
                required
            />
        </div>
        <div className="space-y-2">
            <Label htmlFor="email">Work Email</Label>
            <Input 
                id="email"
                type="email"
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                placeholder="jane@company.com" 
                required
            />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="company">Company Name</Label>
        <Input 
            id="company"
            value={company} 
            onChange={(e) => setCompany(e.target.value)} 
            placeholder="Acme Corp (Optional)" 
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">How can we help?</Label>
        <Textarea 
            id="message"
            value={message} 
            onChange={(e) => setMessage(e.target.value)} 
            placeholder="Tell us about your project/needs..." 
            className="min-h-[120px]"
            required
        />
      </div>

      <Button disabled={loading} size="lg" className="w-full sm:w-auto">
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  )
}
