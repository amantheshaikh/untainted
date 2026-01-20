"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Plus } from "lucide-react"

type FAQItem = {
  question: string
  answer: string
}

const faqs: FAQItem[] = [
  {
    question: "Is the app really free for individuals?",
    answer:
      "Yes! The Untainted mobile app includes unlimited barcode scans, personalized food profiles, and basic allergen alerts completely free of charge. We believe food safety should be accessible to everyone.",
  },
  {
    question: "Do you offer a free trial for the API?",
    answer:
      "Absolutely. The 'Starter API' plan comes with a 14-day free trial allowing up to 1,000 calls so you can test our data quality and integration ease before committing.",
  },
  {
    question: "What counts as an API call?",
    answer:
      "An API call is counted whenever your application requests data from our endpoints. This includes product lookups by barcode, text search queries, and ingredient analysis requests.",
  },
  {
    question: "Can I upgrade or downgrade my plan later?",
    answer:
      "Yes, you can change your plan at any time from your developer dashboard. Usage is prorated for the remainder of the billing cycle.",
  },
  {
    question: "Do you offer custom enterprise contracts?",
    answer:
      "For large-volume needs (over 1M calls/month) or custom taxonomy requirements, we offer Enterprise plans with dedicated support, SLAs, and volume discounts. Please contact us for a quote.",
  },
  {
      question: "What happens if I exceed my monthly API limit?",
      answer: "We will notify you when you reach 80% and 100% of your limit. Overage charges apply for calls beyond your plan's limit, or we can pause access until the next cycle depending on your preference settings."
  }
]

export function PricingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <section className="w-full px-6 lg:px-8 bg-background py-16">
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
              <h2 className="text-3xl lg:text-4xl font-medium text-foreground mb-4">Pricing FAQs</h2>
              <p className="text-muted-foreground">
                Common questions about billing, plans, and limits.
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
                        <div className="pb-6 pr-12">
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
