import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { Check, Database, Brain, ShieldCheck } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container max-w-5xl mx-auto px-6">
          <div className="text-center mb-20">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              How Untainted Works
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              From raw ingredient lists to personalized safety verdicts. A look under the hood of our Food Intelligence Engine.
            </p>
          </div>

          {/* Step 1: Ingest */}
          <div className="flex flex-col md:flex-row gap-12 items-center mb-24">
            <div className="flex-1 space-y-4">
              <div className="w-12 h-12 bg-blue-100 rounded-2xl flex items-center justify-center text-blue-600 mb-4">
                <Database className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold">1. Ingestion & Normalization</h2>
              <p className="text-lg text-muted-foreground">
                We ingest data via barcode scans (UPC/EAN) or direct text input. Our NLP engine then parses messy ingredient strings.
              </p>
              <ul className="space-y-2 mt-4 text-muted-foreground">
                <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-primary" /> OCR text extraction from package photos</li>
                <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-primary" /> Synonym mapping (e.g., "B1" &rarr; "Thiamine")</li>
                <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-primary" /> Additive code decoding (INS/E-numbers)</li>
              </ul>
            </div>
            <div className="flex-1 bg-secondary/30 p-8 rounded-2xl border border-border">
               <pre className="text-xs font-mono bg-background p-4 rounded-lg overflow-x-auto text-foreground">
{`// Input
"Ingredients: Enriched Flour, Sugar, Yellow 5"

// Output
[
  { "id": "wheat_flour", "name": "Wheat Flour", "type": "grain" },
  { "id": "sugar", "name": "Sugar", "type": "sweetener" },
  { "id": "tartrazine", "name": "Yellow 5", "type": "additive" }
]`}
               </pre>
            </div>
          </div>

          {/* Step 2: Analyze */}
           <div className="flex flex-col md:flex-row-reverse gap-12 items-center mb-24">
            <div className="flex-1 space-y-4">
              <div className="w-12 h-12 bg-purple-100 rounded-2xl flex items-center justify-center text-purple-600 mb-4">
                <Brain className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold">2. Contextual Analysis</h2>
              <p className="text-lg text-muted-foreground">
                The core of Untainted. We cross-reference normalized ingredients against the user's specific health profile constraints.
              </p>
               <ul className="space-y-2 mt-4 text-muted-foreground">
                <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-primary" /> Allergy cross-checking</li>
                <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-primary" /> Diet compliance (Vegan, Keto, Jain, etc.)</li>
                <li className="flex gap-2 items-center"><Check className="w-4 h-4 text-primary" /> Micro-nutrient threshold calculation</li>
              </ul>
            </div>
            <div className="flex-1 bg-secondary/30 p-8 rounded-2xl border border-border">
                <pre className="text-xs font-mono bg-background p-4 rounded-lg overflow-x-auto text-foreground">
{`// User Profile
{ "allergies": ["gluten"], "diet": "low_sugar" }

// Analysis Logic
if (ingredient.is_gluten) -> FLAG
if (product.sugar_per_100g > 10) -> WARN`}
               </pre>
            </div>
          </div>

          {/* Step 3: Verdict */}
           <div className="flex flex-col md:flex-row gap-12 items-center">
            <div className="flex-1 space-y-4">
              <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-bold">3. The Verdict</h2>
              <p className="text-lg text-muted-foreground">
                We deliver a clear, explainable result. Not just "Yes" or "No", but "Why".
              </p>
            </div>
             <div className="flex-1 bg-secondary/30 p-8 rounded-2xl border border-border">
               <div className="bg-background p-6 rounded-xl border border-border">
                  <div className="flex items-center gap-3 mb-4">
                     <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold">NOT SAFE</span>
                     <span className="text-foreground font-medium">Gluten Detected</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                     This product contains <strong>Wheat Flour</strong>, which conflicts with your <strong>Gluten Free</strong> requirement.
                  </p>
               </div>
            </div>
          </div>

        </div>
      </main>
      <Footer />
    </>
  )
}
