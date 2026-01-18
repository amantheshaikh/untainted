"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"

type FAQItem = {
  question: string
  answer: string
  category: "personal" | "business" | "general"
}

const faqs: FAQItem[] = [
  {
    question: "What is Untainted?",
    answer:
      "Untainted is India's food intelligence platform. For individuals, it's an app where you create your dietary profile and scan products to check if they're safe for you. For businesses like quick-commerce apps, grocery platforms, or health apps, it's an API that powers personalized food safety recommendations for their users.",
    category: "general",
  },
  {
    question: "How does the personal app work?",
    answer:
      "Download our app, create your profile by setting dietary needs (Jain, gluten-free, diabetic-friendly, etc.), allergies, and ingredients to avoid. Then scan any packaged food's barcode—whether at a supermarket, local kirana, or while browsing online—to instantly see if it matches your profile with a clear verdict and ingredient breakdown.",
    category: "personal",
  },
  {
    question: "Does it support Indian dietary preferences like Jain or Sattvic?",
    answer:
      "Yes! We've built Untainted specifically for India. We support Jain (no root vegetables, no eggs), Sattvic, no onion-garlic, regional preferences, and common Indian health concerns like diabetes management and 'no maida' diets alongside global standards like gluten-free, keto, and vegan.",
    category: "personal",
  },
  {
    question: "What does 'works everywhere' mean?",
    answer:
      "Like UPI for payments, Untainted lets you create your food profile once and use it across all connected platforms. Instead of re-entering your allergies on every grocery app separately, your profile travels with you—delivering personalized food safety anywhere you shop in India.",
    category: "personal",
  },
  {
    question: "How do businesses integrate Untainted?",
    answer:
      "Integration is simple via REST API. Send product data (barcode, image, or ingredient text), include the user's Untainted profile ID, and receive a real-time verdict with explanation in under 50ms. We provide SDKs for popular languages, comprehensive docs, and dedicated integration support.",
    category: "business",
  },
  {
    question: "What are Decision Frameworks?",
    answer:
      "Decision Frameworks are pre-built evaluation standards. Examples include 'FSSAI Clean Label', 'Jain-Friendly', 'Diabetic Safe', 'Allergen Free', or 'No Artificial Colors'. Platforms can use these presets or create custom frameworks tailored to their user base.",
    category: "business",
  },
  {
    question: "How many Indian products do you cover?",
    answer:
      "Our database includes 2 lakh+ Indian packaged food products and 50,000+ mapped ingredients including regional additives, masalas, and FSSAI-regulated substances. We continuously expand coverage and understand ingredient relationships (e.g., 'paneer' is dairy, 'asafoetida' contains gluten).",
    category: "general",
  },
  {
    question: "Is the personal app free?",
    answer:
      "Yes, the personal app is completely free with unlimited product scans. We monetize through our B2B API for platforms, not from individual users. Your data is never sold.",
    category: "personal",
  },
]

export const FAQSection = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  const getCategoryBadge = (category: FAQItem["category"]) => {
    const styles = {
      personal: "bg-accent/10 text-accent",
      business: "bg-primary/10 text-primary",
      general: "bg-secondary text-muted-foreground",
    }
    const labels = {
      personal: "Personal",
      business: "Business",
      general: "General",
    }
    return <span className={`px-2 py-0.5 rounded text-xs font-medium ${styles[category]}`}>{labels[category]}</span>
  }

  return (
    <section className="w-full px-6 lg:px-8 bg-background py-10">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-12 gap-16">
          {/* Left Column - Title */}
          <div className="lg:col-span-4">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="sticky top-24"
            >
              <h2 className="text-3xl lg:text-4xl font-medium text-foreground mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground">
                Questions about using Untainted for yourself or integrating it into your platform.
              </p>
            </motion.div>
          </div>

          {/* Right Column - FAQ Items */}
          <div className="lg:col-span-8">
            <div className="space-y-0">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="border-b border-border last:border-b-0"
                >
                  <button
                    onClick={() => toggleFAQ(index)}
                    className="w-full flex items-center justify-between py-6 text-left group hover:opacity-70 transition-opacity duration-150"
                    aria-expanded={openIndex === index}
                  >
                    <div className="flex items-center gap-3 pr-8">
                      {getCategoryBadge(faq.category)}
                      <span className="text-lg text-foreground font-medium">{faq.question}</span>
                    </div>
                    <motion.div
                      animate={{ rotate: openIndex === index ? 45 : 0 }}
                      transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                      className="flex-shrink-0"
                    >
                      <Plus className="w-5 h-5 text-foreground" strokeWidth={1.5} />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {openIndex === index && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                      >
                        <div className="pb-6 pr-12 pl-[72px]">
                          <p className="text-muted-foreground leading-relaxed">{faq.answer}</p>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
