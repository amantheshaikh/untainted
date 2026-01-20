"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ScanLine, AlertTriangle, CheckCircle2, Info, Apple } from "lucide-react"

const mockProducts = [
  {
    name: "Organic Granola Bar",
    image: "/granola-bar-healthy-snack.jpg",
    ingredients: ["oats", "honey", "almonds", "coconut oil", "dark chocolate chips"],
    verdict: "SAFE",
    confidence: 0.96,
    flags: [],
    explanation: "All ingredients match your profile. No allergens or restricted items detected.",
    details: { calories: 180, sugar: "8g", protein: "4g" },
  },
  {
    name: "Strawberry Yogurt",
    image: "/strawberry-yogurt-cup.jpg",
    ingredients: ["milk", "strawberries", "sugar", "pectin", "natural flavors", "red 40"],
    verdict: "CAUTION",
    confidence: 0.89,
    flags: ["artificial_colors", "dairy"],
    explanation: "Contains Red 40 (artificial color) and dairy, which are on your avoid list.",
    details: { calories: 150, sugar: "22g", protein: "5g" },
  },
  {
    name: "Sparkling Water",
    image: "/sparkling-water-can-lime.jpg",
    ingredients: ["carbonated water", "natural lime flavor"],
    verdict: "SAFE",
    confidence: 0.99,
    flags: [],
    explanation: "Simple, clean ingredients. Perfectly matches your clean label preferences.",
    details: { calories: 0, sugar: "0g", protein: "0g" },
  },
]

const userProfile = {
  avoid: ["artificial_colors", "high_fructose_corn_syrup"],
  preferences: ["clean_label", "low_sugar"],
  allergies: ["dairy"],
}

export const DemoSection = () => {
  const [selectedProduct, setSelectedProduct] = useState(0)
  const product = mockProducts[selectedProduct]

  return (
    <section className="w-full bg-background py-12">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted border border-border mb-4">
            <Info className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Interactive Demo</span>
          </div>
          <h2 className="text-3xl lg:text-4xl font-medium text-foreground mb-4">See How It Works</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Try scanning a product against a sample food profile. This is exactly how it works in the app and via our
            API.
          </p>
        </motion.div>

        {/* Demo Interface */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="max-w-5xl mx-auto"
        >
          <div className="grid lg:grid-cols-3 gap-6">
            {/* User Profile Panel */}
            <div className="bg-card rounded-2xl border border-border p-5">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 rounded-full bg-accent/10 flex items-center justify-center">
                  <Apple className="w-4 h-4 text-accent" />
                </div>
                <span className="font-medium text-foreground">Sample Profile</span>
              </div>

              <div className="space-y-4 text-sm">
                <div>
                  <div className="text-muted-foreground mb-2">Avoiding</div>
                  <div className="flex flex-wrap gap-1.5">
                    {userProfile.avoid.map((item) => (
                      <span key={item} className="px-2 py-1 bg-destructive/10 text-destructive rounded text-xs">
                        {item.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-2">Allergies</div>
                  <div className="flex flex-wrap gap-1.5">
                    {userProfile.allergies.map((item) => (
                      <span key={item} className="px-2 py-1 bg-accent/10 text-accent rounded text-xs font-medium">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="text-muted-foreground mb-2">Preferences</div>
                  <div className="flex flex-wrap gap-1.5">
                    {userProfile.preferences.map((item) => (
                      <span key={item} className="px-2 py-1 bg-chart-3/10 text-chart-3 rounded text-xs">
                        {item.replace(/_/g, " ")}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Product Selection & Result */}
            <div className="lg:col-span-2 bg-card rounded-2xl border border-border overflow-hidden">
              {/* Product Selector */}
              <div className="p-5 border-b border-border bg-secondary/30">
                <div className="flex items-center gap-2 mb-4">
                  <ScanLine className="w-5 h-5 text-primary" />
                  <span className="font-medium text-foreground">Select a Product to Scan</span>
                </div>
                <div className="flex flex-wrap gap-3">
                  {mockProducts.map((p, index) => (
                    <button
                      key={p.name}
                      onClick={() => setSelectedProduct(index)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer ${
                        selectedProduct === index
                          ? "bg-primary text-primary-foreground"
                          : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                      }`}
                    >
                      <img src={p.image || "/placeholder.svg"} alt={p.name} className="w-6 h-6 rounded object-cover" />
                      {p.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Verdict Display */}
              <div className="p-6">
                <div className="flex items-start gap-5">
                  {/* Product Image */}
                  <img
                    src={product.image || "/placeholder.svg"}
                    alt={product.name}
                    className="w-20 h-20 rounded-xl object-cover bg-secondary"
                  />

                  {/* Verdict Details */}
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-semibold text-foreground">{product.name}</h3>
                      <span
                        className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                          product.verdict === "SAFE" ? "bg-chart-3/10 text-chart-3" : "bg-accent/10 text-accent"
                        }`}
                      >
                        {product.verdict === "SAFE" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <AlertTriangle className="w-4 h-4" />
                        )}
                        {product.verdict}
                      </span>
                    </div>

                    <p className="text-muted-foreground mb-4">{product.explanation}</p>

                    {/* Ingredients */}
                    <div className="mb-4">
                      <div className="text-xs text-muted-foreground mb-2">Ingredients</div>
                      <div className="flex flex-wrap gap-1.5">
                        {product.ingredients.map((ing) => {
                          const isFlagged = product.flags.some(
                            (f) =>
                              ing.toLowerCase().includes(f.replace(/_/g, " ")) ||
                              (f === "dairy" && ["milk", "cream", "butter", "cheese"].includes(ing.toLowerCase())) ||
                              (f === "artificial_colors" && ing.toLowerCase().includes("red")),
                          )
                          return (
                            <span
                              key={ing}
                              className={`px-2 py-0.5 rounded text-xs ${
                                isFlagged
                                  ? "bg-accent/10 text-accent font-medium"
                                  : "bg-secondary text-muted-foreground"
                              }`}
                            >
                              {ing}
                            </span>
                          )
                        })}
                      </div>
                    </div>

                    {/* Flags & Confidence */}
                    <div className="flex flex-wrap items-center gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Confidence:</span>
                        <span className="font-mono text-foreground">{(product.confidence * 100).toFixed(0)}%</span>
                      </div>

                      {product.flags.length > 0 && (
                        <div className="flex items-center gap-2">
                          <span className="text-muted-foreground">Flags:</span>
                          <div className="flex gap-1.5">
                            {product.flags.map((flag) => (
                              <span
                                key={flag}
                                className="px-2 py-0.5 rounded bg-accent/10 text-accent text-xs font-mono"
                              >
                                {flag}
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
