"use client"
import { CheckIcon } from "@radix-ui/react-icons"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"
import { User, Building2 } from "lucide-react"
import { useRouter } from "next/navigation"

interface PricingPlan {
  name: string
  audience: "personal" | "business"
  price: string
  period?: string
  description: string
  features: string[]
  popular?: boolean
  cta: string
}

const plans: PricingPlan[] = [
  {
    name: "Personal",
    audience: "personal",
    price: "Free",
    description: "For individuals who want to make safer food choices",
    features: [
      "Unlimited product scans",
      "Create your food profile",
      "Allergen & ingredient alerts",
      "Use across connected apps",
      "iOS & Android apps",
    ],
    cta: "Download App",
  },
  {
    name: "Starter API",
    audience: "business",
    price: "$99",
    period: "/month",
    description: "For platforms testing food intelligence",
    features: [
      "10,000 API calls/month",
      "Basic ingredient analysis",
      "Standard decision frameworks",
      "Email support",
      "API documentation",
    ],
    cta: "Start Free Trial",
  },
  {
    name: "Growth API",
    audience: "business",
    price: "$499",
    period: "/month",
    description: "For platforms scaling personalized food features",
    features: [
      "100,000 API calls/month",
      "Advanced normalization engine",
      "Custom decision frameworks",
      "User profile evaluations",
      "Priority support",
      "Analytics dashboard",
    ],
    popular: true,
    cta: "Contact Us",
  },
  {
    name: "Enterprise",
    audience: "business",
    price: "Custom",
    description: "Volume pricing with dedicated support and SLAs",
    features: [
      "Unlimited API calls",
      "Custom taxonomy development",
      "Dedicated account manager",
      "99.99% uptime SLA",
      "SOC 2 compliance",
      "24/7 support",
    ],
    cta: "Contact Us",
  },
]

    export function PricingSection() {
      const router = useRouter()
      const personalPlan = plans.filter((p) => p.audience === "personal")
      const businessPlans = plans.filter((p) => p.audience === "business")

      return (
        <section id="pricing" className="bg-secondary/20 py-12">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.5 }}
              className="text-center mb-16"
            >
              <h2 className="text-3xl lg:text-4xl font-medium text-foreground mb-4">Simple, Transparent Pricing</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Free for individuals. Usage-based for businesses.
              </p>
            </motion.div>

            {/* Personal Plan */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="mb-12"
            >
              <div className="flex items-center gap-2 mb-6">
                <User className="w-5 h-5 text-accent" />
                <h3 className="text-lg font-semibold text-foreground">For You</h3>
              </div>

              {personalPlan.map((plan) => (
                <div
                  key={plan.name}
                  className="bg-card rounded-2xl border border-accent/30 p-8 flex flex-col md:flex-row md:items-center md:justify-between gap-6"
                >
                  <div>
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-4xl font-semibold text-foreground">{plan.price}</span>
                      <span className="text-accent font-medium">Forever</span>
                    </div>
                    <p className="text-muted-foreground mb-4">{plan.description}</p>
                    <div className="flex flex-wrap gap-3">
                      {plan.features.map((feature) => (
                        <span key={feature} className="inline-flex items-center gap-1.5 text-sm text-foreground">
                          <CheckIcon className="w-4 h-4 text-accent" />
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                  <button
                    className="flex-shrink-0 bg-accent text-white py-3 px-8 rounded-full font-medium hover:opacity-90 transition-all duration-200"
                    onClick={() => {
                      if (plan.cta && plan.cta.toLowerCase().includes("download")) {
                        router.push('/download')
                      }
                    }}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </motion.div>

            {/* Business Plans */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="flex items-center gap-2 mb-6">
                <Building2 className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-foreground">For Business</h3>
              </div>

              <div className="grid md:grid-cols-3 gap-6">
                {businessPlans.map((plan, index) => (
                  <motion.div
                    key={plan.name}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className={cn(
                      "relative bg-card rounded-2xl border p-8 flex flex-col",
                      plan.popular ? "border-primary shadow-lg" : "border-border",
                    )}
                  >
                    {plan.popular && (
                      <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-medium">
                        Most Popular
                      </span>
                    )}

                    <div className="mb-6">
                      <h3 className="text-xl font-semibold text-foreground mb-2">{plan.name}</h3>
                      <div className="flex items-baseline gap-1 mb-2">
                        <span className="text-3xl font-semibold text-foreground">{plan.price}</span>
                        {plan.period && <span className="text-muted-foreground text-sm">{plan.period}</span>}
                      </div>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>

                    <ul className="space-y-3 mb-8 flex-1">
                      {plan.features.map((feature) => (
                        <li key={feature} className="flex items-start gap-3">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                            <CheckIcon className="w-3 h-3 text-primary" />
                          </div>
                          <span className="text-sm text-foreground">{feature}</span>
                        </li>
                      ))}
                    </ul>

                    <button
                      className={cn(
                        "w-full py-3 px-6 rounded-full font-medium transition-all duration-200",
                        plan.popular
                          ? "bg-primary text-primary-foreground hover:opacity-90"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80 border border-border",
                      )}
                      onClick={() => {
                        if (plan.cta && plan.cta.toLowerCase().includes("contact")) {
                          router.push('/contact')
                        }
                      }}
                    >
                      {plan.cta}
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </section>
      )
    }
