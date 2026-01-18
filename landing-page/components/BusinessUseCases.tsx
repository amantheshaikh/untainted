"use client"

import { motion } from "framer-motion"
import { AlertTriangle, ShoppingCart, Sparkles, Check, X } from "lucide-react"

const useCases = [
  {
    id: "last-mile-warning",
    icon: AlertTriangle,
    title: "Last-Mile Warnings",
    description: "Surface ingredient conflicts right before payment to prevent regretful purchases.",
    mockup: (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Checkout Header */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Checkout</span>
            <span className="text-xs text-gray-500">4 items</span>
          </div>
        </div>

        {/* Warning Banner */}
        <div className="bg-amber-50 border-b border-amber-200 px-4 py-3">
          <div className="flex items-start gap-3">
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center flex-shrink-0 mt-0.5">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800">Heads up!</p>
              <p className="text-xs text-amber-700 mt-0.5">
                "Protein Bar" contains <span className="font-semibold">Whey</span> — an ingredient you usually avoid.
              </p>
              <div className="flex gap-2 mt-2">
                <button className="text-xs px-3 py-1 bg-white border border-amber-300 rounded-full text-amber-700 hover:bg-amber-50">
                  Remove Item
                </button>
                <button className="text-xs px-3 py-1 bg-amber-600 rounded-full text-white">Continue Anyway</button>
              </div>
            </div>
          </div>
        </div>

        {/* Order Summary */}
        <div className="p-4">
          <div className="flex justify-between text-sm mb-2">
            <span className="text-gray-600">Subtotal</span>
            <span className="text-gray-900 font-medium">₹847</span>
          </div>
          <button className="w-full bg-[#6B4D30] text-white py-2.5 rounded-lg text-sm font-medium mt-2">
            Place Order
          </button>
        </div>
      </div>
    ),
  },
  {
    id: "cart-score",
    icon: ShoppingCart,
    title: "Cart Suitability Score",
    description: "Show users how well their entire cart matches their dietary preferences at a glance.",
    mockup: (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Cart Header */}
        <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-900">Your Cart</span>
            <span className="text-xs text-gray-500">8 items</span>
          </div>
        </div>

        {/* Suitability Score */}
        <div className="px-4 py-4 border-b border-gray-100">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-gray-700">Cart Suitability</span>
            <span className="text-xs text-amber-600 font-medium">5 of 8 items match</span>
          </div>
          <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 to-amber-400 rounded-full"
              style={{ width: "62.5%" }}
            />
          </div>
        </div>

        {/* Items Preview */}
        <div className="divide-y divide-gray-100">
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Organic Oats</span>
            </div>
            <span className="text-xs text-green-600 font-medium">Safe</span>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-red-50 rounded-lg flex items-center justify-center">
                <X className="w-4 h-4 text-red-500" />
              </div>
              <span className="text-sm text-gray-700">Instant Noodles</span>
            </div>
            <span className="text-xs text-red-500 font-medium">Contains MSG</span>
          </div>
          <div className="px-4 py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-50 rounded-lg flex items-center justify-center">
                <Check className="w-4 h-4 text-green-600" />
              </div>
              <span className="text-sm text-gray-700">Brown Rice</span>
            </div>
            <span className="text-xs text-green-600 font-medium">Safe</span>
          </div>
        </div>
      </div>
    ),
  },
  {
    id: "smart-suggestions",
    icon: Sparkles,
    title: "Smart Product Suggestions",
    description: "Recommend products based on what others with similar preferences frequently buy.",
    mockup: (
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-[#6B4D30]/10 to-[#F58220]/10 px-4 py-3 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#F58220]" />
            <span className="text-sm font-medium text-gray-900">Popular with Jain Preference</span>
          </div>
        </div>

        {/* Product Suggestions */}
        <div className="p-4 space-y-3">
          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-14 h-14 bg-amber-50 rounded-lg flex items-center justify-center text-2xl">🥜</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Roasted Makhana</p>
              <p className="text-xs text-gray-500">No onion, no garlic</p>
              <p className="text-xs text-green-600 font-medium mt-0.5">92% match</p>
            </div>
            <button className="text-xs px-3 py-1.5 bg-[#6B4D30] text-white rounded-full">Add</button>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-14 h-14 bg-green-50 rounded-lg flex items-center justify-center text-2xl">🍪</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Sattvic Cookies</p>
              <p className="text-xs text-gray-500">Pure vegetarian, no root vegetables</p>
              <p className="text-xs text-green-600 font-medium mt-0.5">89% match</p>
            </div>
            <button className="text-xs px-3 py-1.5 bg-[#6B4D30] text-white rounded-full">Add</button>
          </div>

          <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
            <div className="w-14 h-14 bg-orange-50 rounded-lg flex items-center justify-center text-2xl">🧃</div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Fresh Coconut Water</p>
              <p className="text-xs text-gray-500">100% natural, no additives</p>
              <p className="text-xs text-green-600 font-medium mt-0.5">95% match</p>
            </div>
            <button className="text-xs px-3 py-1.5 bg-[#6B4D30] text-white rounded-full">Add</button>
          </div>
        </div>

        {/* Footer */}
        <div className="px-4 py-3 border-t border-gray-100 bg-gray-50">
          <p className="text-xs text-gray-500 text-center">
            Based on purchases by 2,400+ users with similar preferences
          </p>
        </div>
      </div>
    ),
  },
]

export const BusinessUseCases = () => {
  return (
    <section className="w-full bg-secondary/30 py-20">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl lg:text-4xl font-medium text-foreground mb-4 text-balance">
            Power Your Platform with Smart Food Intelligence
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Integrate Untainted to deliver personalized experiences that increase trust and drive conversions.
          </p>
        </motion.div>

        {/* Use Cases */}
        <div className="space-y-20">
          {useCases.map((useCase, index) => (
            <motion.div
              key={useCase.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5 }}
              className={`flex flex-col ${index % 2 === 1 ? "lg:flex-row-reverse" : "lg:flex-row"} items-center gap-12`}
            >
              {/* Content */}
              <div className="flex-1 lg:max-w-md">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                  <useCase.icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="text-2xl font-semibold text-foreground mb-4">{useCase.title}</h3>
                <p className="text-muted-foreground leading-relaxed mb-6">{useCase.description}</p>

                {/* Bullet points for each use case */}
                {useCase.id === "last-mile-warning" && (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Reduce return rates from dietary-related complaints
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Build trust with transparent ingredient alerts
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Users can proceed or remove with one tap
                    </li>
                  </ul>
                )}
                {useCase.id === "cart-score" && (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Gamify healthy shopping with visual scores
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Highlight conflicts before checkout
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Drive engagement with preference tracking
                    </li>
                  </ul>
                )}
                {useCase.id === "smart-suggestions" && (
                  <ul className="space-y-2 text-sm text-muted-foreground">
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Increase AOV with relevant recommendations
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Social proof from similar preference groups
                    </li>
                    <li className="flex items-start gap-2">
                      <Check className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      Match scores show relevance at a glance
                    </li>
                  </ul>
                )}
              </div>

              {/* Mockup */}
              <div className="flex-1 w-full max-w-sm lg:max-w-md">
                <div className="relative">
                  {/* Phone Frame */}
                  <div className="bg-gray-900 rounded-[2.5rem] p-3 shadow-2xl">
                    <div className="bg-gray-900 rounded-[2rem] overflow-hidden">
                      {/* Notch */}
                      <div className="bg-gray-900 h-6 flex items-center justify-center">
                        <div className="w-20 h-5 bg-black rounded-full" />
                      </div>
                      {/* Screen */}
                      <div className="bg-gray-100 p-3">{useCase.mockup}</div>
                      {/* Home Indicator */}
                      <div className="bg-gray-900 h-6 flex items-center justify-center">
                        <div className="w-32 h-1 bg-gray-700 rounded-full" />
                      </div>
                    </div>
                  </div>

                  {/* Decorative Elements */}
                  <div className="absolute -z-10 top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-br from-primary/10 to-accent/10 rounded-full blur-3xl" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
