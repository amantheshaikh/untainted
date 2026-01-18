"use client"

import { useState } from "react"
import { supabase } from "../lib/supabaseClient"

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
    const payload = {
      name,
      email,
      company,
      message,
      subject,
    }
    // Insert into feedback table
    try {
      await supabase.from("feedback").insert([{ context: { subject }, message: JSON.stringify(payload) }])
      setSuccess(true)
    } catch (err) {
      console.error(err)
    }
    setLoading(false)
  }

  if (success) return <div className="p-4 bg-card rounded">Thanks — we&apos;ll be in touch.</div>

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-2 gap-2">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className="p-2 rounded border" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="p-2 rounded border" />
      </div>
      <input value={company} onChange={(e) => setCompany(e.target.value)} placeholder="Company (optional)" className="w-full p-2 rounded border" />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Tell us about your needs" className="w-full p-2 rounded border" rows={6} />
      <div className="flex gap-2">
        <button disabled={loading} className="bg-primary text-primary-foreground px-4 py-2 rounded">
          {loading ? "Sending..." : "Send"}
        </button>
      </div>
    </form>
  )
}
