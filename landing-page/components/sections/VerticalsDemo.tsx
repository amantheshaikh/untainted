"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Truck, UtensilsCrossed, ShoppingBag, HeartPulse, AlertTriangle, Check, Search, ScanLine } from "lucide-react"

const tabs = [
  {
    id: "q-comm",
    label: "Quick Commerce",
    icon: Truck,
    title: "Zero-Latency Safety Checks",
    description: "In <10min delivery, users don't read labels. Flash warnings instantly on the 'Add to Cart' action to prevent returns.",
    color: "bg-blue-500",
    mockup: (
      <div className="bg-white p-4 rounded-xl shadow-sm border border-border space-y-3">
        <div className="flex gap-3">
          <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center text-2xl">🍫</div>
          <div className="flex-1">
            <div className="h-4 w-3/4 bg-gray-100 rounded mb-2" />
            <div className="h-3 w-1/2 bg-gray-100 rounded" />
          </div>
          <div className="flex flex-col items-end gap-2">
            <div className="h-4 w-12 bg-gray-100 rounded" />
            <button className="px-3 py-1 bg-primary text-primary-foreground text-xs font-bold rounded-full">ADD</button>
          </div>
        </div>
        
        {/* The "Interaction" */}
        <div className="flex gap-3 relative">
             <div className="w-16 h-16 bg-gray-100 rounded-lg shrink-0 flex items-center justify-center text-2xl">🥜</div>
             <div className="flex-1">
                <div className="font-semibold text-sm text-gray-800">Peanut Butter Bar</div>
                <div className="text-xs text-gray-400">Energy Snack</div>
             </div>
             <div className="flex flex-col items-end gap-2">
                <span className="font-bold text-sm">₹40</span>
                <button className="px-3 py-1 bg-red-100 text-red-600 text-xs font-bold rounded-full border border-red-200 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> Unsafe
                </button>
             </div>
             
             {/* Tooltip */}
             <motion.div 
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="absolute top-full right-0 mt-2 bg-gray-900 text-white text-xs p-2 rounded shadow-xl z-10 w-48"
             >
                Contains <strong>Peanuts</strong> (Your Profile Warning)
                <div className="absolute -top-1 right-4 w-2 h-2 bg-gray-900 rotate-45" />
             </motion.div>
        </div>
      </div>
    )
  },
  {
    id: "delivery",
    label: "Food Delivery",
    icon: UtensilsCrossed,
    title: "Unified Dietary Filters",
    description: "Every restaurant formats menus differently. We standardize data so your 'Vegan' filter works 100% of the time.",
    color: "bg-orange-500",
    mockup: (
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        {/* Filter Bar */}
        <div className="flex gap-2 p-3 border-b border-gray-100 overflow-x-auto">
            <span className="px-3 py-1 rounded-full bg-green-100 text-green-700 text-xs font-bold ring-1 ring-green-500/20 flex items-center gap-1">
                <Check className="w-3 h-3" /> Vegan Mode
            </span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">Gluten Free</span>
            <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-500 text-xs font-medium">Spicy</span>
        </div>
        {/* Menu */}
        <div className="p-3 space-y-3">
             <div className="flex justify-between items-center opacity-40 grayscale">
                <div>
                    <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
                    <div className="h-3 w-32 bg-gray-100 rounded" />
                </div>
                 <div className="w-12 h-12 bg-gray-100 rounded-lg opacity-50" />
             </div>
             <div className="flex justify-between items-center bg-green-50/50 p-2 rounded-lg -mx-2">
                <div>
                    <div className="font-semibold text-sm text-gray-800 flex items-center gap-2">
                        Tofu Stir Fry <span className="text-[10px] bg-green-200 text-green-800 px-1.5 rounded">VEGAN</span>
                    </div>
                    <div className="text-xs text-gray-500">Broccoli, Soy Sauce, Rice</div>
                </div>
                 <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center text-lg">🥗</div>
             </div>
              <div className="flex justify-between items-center opacity-40 grayscale">
                <div>
                    <div className="h-4 w-24 bg-gray-200 rounded mb-1" />
                    <div className="h-3 w-32 bg-gray-100 rounded" />
                </div>
                 <div className="w-12 h-12 bg-gray-100 rounded-lg opacity-50" />
             </div>
        </div>
      </div>
    )
  },
  {
    id: "grocery",
    label: "E-Commerce and Grocery",
    icon: ShoppingBag,
    title: "The 'Safe Aisle' Experience",
    description: "Allow users to lock their dietary profile. The entire store adapts to show only what they can eat.",
    color: "bg-green-500",
    mockup: (
      <div className="bg-white rounded-xl shadow-sm border border-border overflow-hidden">
        <div className="p-3 border-b border-gray-100 flex gap-2 items-center bg-gray-50">
            <Search className="w-4 h-4 text-gray-400" />
            <span className="text-sm text-gray-500">Search "Milk"</span>
        </div>
        <div className="p-4 grid grid-cols-2 gap-3">
            {/* Safe Item */}
            <div className="p-3 border border-green-200 bg-green-50/30 rounded-lg relative">
                <div className="absolute top-2 right-2 bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded">MATCH</div>
                <div className="w-full h-20 bg-gray-100 rounded mb-2 flex items-center justify-center text-2xl">🥛</div>
                <div className="text-xs font-bold text-gray-800">Oat Milk</div>
                <div className="text-[10px] text-gray-500">Lactose Free</div>
            </div>
            {/* Unsafe Item */}
            <div className="p-3 border border-gray-100 rounded-lg opacity-50 grayscale relative">
                 <div className="absolute top-2 right-2 bg-gray-100 text-gray-500 text-[10px] font-bold px-1.5 py-0.5 rounded">AVOID</div>
                <div className="w-full h-20 bg-gray-100 rounded mb-2 flex items-center justify-center text-2xl">🥛</div>
                <div className="text-xs font-bold text-gray-800">Whole Milk</div>
                <div className="text-[10px] text-gray-500">Dairy</div>
            </div>
        </div>
      </div>
    )
  },
  {
    id: "health",
    label: "Health Apps",
    icon: HeartPulse,
    title: "Beyond Calorie Counting",
    description: "Flag inflammatory ingredients or ultra-processed additives alongside macro data.",
    color: "bg-purple-500",
    mockup: (
      <div className="bg-white rounded-xl shadow-sm border border-border p-4">
         <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                 <ScanLine className="w-5 h-5 text-purple-600" />
             </div>
             <div>
                 <div className="text-sm font-bold text-gray-800">Scanned: Protein Shake</div>
                 <div className="text-xs text-gray-500">12:30 PM • Snack</div>
             </div>
         </div>
         
         <div className="space-y-2">
             <div className="flex justify-between text-xs mb-1">
                 <span className="text-gray-500">Macros</span>
                 <span className="text-gray-900 font-medium">Good</span>
             </div>
             <div className="flex gap-1 h-1.5 mb-4">
                 <div className="w-1/3 bg-blue-400 rounded-full" />
                 <div className="w-1/4 bg-red-400 rounded-full" />
                 <div className="w-1/3 bg-yellow-400 rounded-full" />
             </div>
             
             <div className="bg-red-50 border border-red-100 rounded-lg p-2.5 flex gap-2 items-start">
                 <AlertTriangle className="w-4 h-4 text-red-500 shrink-0 mt-0.5" />
                 <div>
                     <div className="text-xs font-bold text-red-700">Ultra-Processed Additive</div>
                     <div className="text-[10px] text-red-600 leading-tight mt-0.5">Contains <span className="font-semibold">Carrageenan</span> which may cause inflammation.</div>
                 </div>
             </div>
         </div>
      </div>
    )
  }
]

export const VerticalsDemo = () => {
  const [activeTab, setActiveTab] = useState(tabs[0])

  return (
    <section id="use-cases" className="py-16 bg-gradient-to-b from-background to-secondary/20">
      <div className="container mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-balance">
            Flexible Integration for Every Model
          </h2>
          <p className="text-xl text-muted-foreground">
            See how Untainted adapts to your specific user journey.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20 items-stretch">
          
          {/* Tabs Navigation */}
          <div className="flex-1 space-y-4">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab)}
                className={`w-full flex items-center gap-4 p-4 rounded-xl text-left transition-all duration-300 border ${
                  activeTab.id === tab.id
                    ? "bg-white border-primary/20 shadow-lg shadow-primary/5 scale-[1.02]"
                    : "bg-transparent border-transparent hover:bg-secondary/50 text-muted-foreground"
                }`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                  activeTab.id === tab.id ? "bg-primary text-primary-foreground" : "bg-secondary text-muted-foreground"
                }`}>
                  <tab.icon className="w-5 h-5" />
                </div>
                <div>
                  <div className={`font-semibold ${activeTab.id === tab.id ? "text-foreground" : ""}`}>
                    {tab.label}
                  </div>
                  {activeTab.id === tab.id && (
                     <motion.div 
                        layoutId="active-desc"
                        className="text-xs text-muted-foreground mt-1 line-clamp-1"
                     >
                        {tab.title}
                     </motion.div>
                  )}
                </div>
              </button>
            ))}
          </div>

          {/* Interactive Preview */}
          <div className="flex-1 lg:max-w-xl">
            <AnimatePresence mode="wait">
                <motion.div
                    key={activeTab.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                    className="relative"
                >
                    {/* Phone Frame / Container */}
                    <div className="bg-gray-900 rounded-[2.5rem] p-4 shadow-2xl relative z-10">
                         {/* Dynamic Header based on vertical */}
                         <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-900 rounded-b-xl z-20" />
                         
                         <div className="bg-white rounded-[2rem] overflow-hidden min-h-[400px] flex flex-col">
                            {/* App Header */}
                            <div className="bg-white p-4 pt-8 border-b border-gray-100 flex justify-between items-center">
                                <span className="font-bold text-lg text-gray-800">{activeTab.label} App</span>
                                <div className="w-8 h-8 rounded-full bg-gray-100" />
                            </div>
                            
                            {/* Main Canvas */}
                            <div className="flex-1 bg-gray-50 p-4 flex items-center justify-center">
                                {activeTab.mockup}
                            </div>
                            
                            {/* Context Caption */}
                            <div className="p-4 bg-white border-t border-gray-100">
                                <h4 className="font-bold text-primary mb-1">{activeTab.title}</h4>
                                <p className="text-xs text-gray-500 leading-relaxed">
                                    {activeTab.description}
                                </p>
                            </div>
                         </div>
                    </div>

                    {/* Background Blob */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-gradient-to-tr ${activeTab.color} to-primary rounded-full blur-[100px] opacity-20 -z-10`} />

                </motion.div>
            </AnimatePresence>
          </div>

        </div>
      </div>
    </section>
  )
}
