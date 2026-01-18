"use client"

import { motion } from "framer-motion"
import { Layers, Network, Scale, ScanBarcode, Camera, FileText, ArrowRight, Cpu } from "lucide-react"

const engineSteps = [
  {
    icon: Layers,
    title: "Normalize",
    description: "Converts messy labels, INS/E-codes, and synonyms into standardized ingredients",
    example: {
      input: '"INS 211", "Sodium Benzoate", "E211"',
      output: "sodium_benzoate",
    },
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Network,
    title: "Classify",
    description: "Maps ingredients to a structured food taxonomy for accurate categorization",
    example: {
      input: '"Ghee", "Paneer", "Curd"',
      output: "category: dairy",
    },
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Scale,
    title: "Evaluate",
    description: "Compares against dietary preferences, allergies, restrictions, or preset standards",
    example: {
      input: "User Profile: Jain, No Dairy",
      output: 'verdict: "NOT_SAFE"',
    },
    color: "text-chart-3",
    bgColor: "bg-chart-3/10",
  },
]

const inputModes = [
  {
    icon: ScanBarcode,
    title: "Barcode Scan",
    description: "Scan any product barcode to instantly fetch ingredient data from our database of 2L+ Indian products",
  },
  {
    icon: Camera,
    title: "Image / OCR Scan",
    description: "Photograph the ingredient label and our OCR extracts text accurately from product packaging",
  },
  {
    icon: FileText,
    title: "Direct Text Input",
    description: "Paste or type ingredient lists directly for products not in our database or for recipe analysis",
  },
]

export const IntelligenceEngine = () => {
  return (
    <section id="how-it-works" className="w-full bg-secondary/20 py-10">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
            <Cpu className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Intelligence Engine</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-medium text-foreground mb-4 text-balance">
            How Untainted Analyzes Food
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Our engine processes ingredient data through three stages to deliver accurate, explainable verdicts in under
            50ms.
          </p>
        </motion.div>

        {/* Engine Pipeline */}
        <div className="mb-20">
          <div className="grid lg:grid-cols-3 gap-6">
            {engineSteps.map((step, index) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.15 }}
                className="relative"
              >
                <div className="bg-card rounded-2xl border border-border p-6 h-full hover:shadow-lg hover:border-primary/30 transition-all duration-300">
                  {/* Step number */}
                  <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-foreground text-background flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </div>

                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-xl ${step.bgColor} flex items-center justify-center mb-4`}>
                    <step.icon className={`w-7 h-7 ${step.color}`} />
                  </div>

                  {/* Content */}
                  <h3 className="text-xl font-semibold text-foreground mb-2">{step.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-4">{step.description}</p>

                  {/* Example */}
                  <div className="bg-secondary/50 rounded-lg p-4 font-mono text-xs">
                    <div className="text-muted-foreground mb-2">
                      <span className="text-foreground/50">Input:</span> {step.example.input}
                    </div>
                    <div className="flex items-center gap-2">
                      <ArrowRight className="w-3 h-3 text-primary" />
                      <span className={step.color}>{step.example.output}</span>
                    </div>
                  </div>
                </div>

                {/* Connector arrow (except last) */}
                {index < engineSteps.length - 1 && (
                  <div className="hidden lg:flex absolute top-1/2 -right-3 transform -translate-y-1/2 z-10">
                    <div className="w-6 h-6 rounded-full bg-card border border-border flex items-center justify-center">
                      <ArrowRight className="w-3 h-3 text-muted-foreground" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Input Modes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <h3 className="text-2xl font-semibold text-foreground text-center mb-4">Three Ways to Input Data</h3>
          <p className="text-muted-foreground text-center max-w-xl mx-auto mb-10">
            Whether through your app, our API, or manual entry—we accept product data in multiple formats.
          </p>

          <div className="grid md:grid-cols-3 gap-6">
            {inputModes.map((mode, index) => (
              <motion.div
                key={mode.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="bg-card rounded-xl border border-border p-5 text-center hover:border-primary/30 transition-colors"
              >
                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <mode.icon className="w-6 h-6 text-primary" />
                </div>
                <h4 className="text-base font-semibold text-foreground mb-2">{mode.title}</h4>
                <p className="text-sm text-muted-foreground leading-relaxed">{mode.description}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* API Response Preview */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-16"
        >
          <div className="bg-card rounded-2xl border border-border overflow-hidden max-w-3xl mx-auto">
            <div className="bg-foreground/5 px-4 py-3 border-b border-border flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-destructive/50" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/50" />
                <div className="w-3 h-3 rounded-full bg-chart-3/50" />
              </div>
              <span className="text-xs text-muted-foreground font-mono ml-2">API Response Example</span>
            </div>
            <pre className="p-6 text-sm font-mono text-foreground overflow-x-auto">
              <code>{`{
  "product": "Multigrain Cookies",
  "verdict": "NOT_SAFE",
  "confidence": 0.98,
  "flagged_ingredients": [
    "Refined Wheat Flour (Maida)",
    "Butter"
  ],
  "reasons": [
    {
      "ingredient": "Refined Wheat Flour (Maida)",
      "category": "refined_grain",
      "conflicts_with": ["no_maida", "gluten_free"]
    },
    {
      "ingredient": "Butter",
      "category": "dairy",
      "conflicts_with": ["dairy_free", "vegan"]
    }
  ],
  "safe_alternatives": ["Ragi Cookies", "Oats Digestive"],
  "processing_time_ms": 42
}`}</code>
            </pre>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
