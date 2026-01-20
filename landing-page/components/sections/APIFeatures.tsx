"use client"

import { motion } from "framer-motion"
import { Zap, Shield, Database, Webhook, Lock, Activity } from "lucide-react"

const features = [
  {
    icon: Zap,
    title: "Ultra-low Latency",
    description: "Sub-50ms response times ensure your user experience stays snappy and seamless."
  },
  {
    icon: Database,
    title: "Comprehensive Database",
    description: "Access over 1M+ evaluated products across Indian retail and quick commerce."
  },
  {
    icon: Webhook,
    title: "Webhooks & Events",
    description: "Real-time updates when product formulations or safety verdicts change."
  },
  {
    icon: Shield,
    title: "Enterprise Grade",
    description: "SOC 2 Type II ready with encrypted data handling and strict privacy controls."
  },
  {
    icon: Activity,
    title: "99.99% Uptime SLA",
    description: "Reliability you can bank on for mission-critical checkout flows."
  },
  {
    icon: Lock,
    title: "Secure by Design",
    description: "We never store PII. Analyze user preferences without compromising privacy."
  }
]

export const APIFeatures = () => {
  return (
    <section className="py-16 bg-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
            Built for Scale & Reliability
          </h2>
          <p className="text-xl text-muted-foreground">
            Everything you need to integrate sophisticated food intelligence into your production stack.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="bg-background border border-border p-8 rounded-2xl hover:border-primary/30 transition-colors"
            >
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-6 text-primary">
                <feature.icon className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
