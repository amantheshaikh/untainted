import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { ScanBarcode, Camera, FileText, Database, Share2, Scale, ShieldCheck, FileSearch, Filter, ArrowRight, Zap } from "lucide-react"

export default function HowItWorksPage() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-24 pb-16 bg-background">
        <div className="container max-w-6xl mx-auto px-6">
          
          {/* Hero Section */}
          <div className="text-center mb-24">
             <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-6">
                <Database className="w-4 h-4 text-primary" />
                <span className="text-sm font-medium text-primary">The Food Intelligence Engine</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              From Labelling to Logic.
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Untainted transforms unstructured packaging data into a structured food ontology. 
              We combine computer vision, NLP, and regulatory rules to deliver a definitive safety verdict.
            </p>
          </div>

          {/* Section 1: Data Ingestion (Three Ways) */}
          <div className="mb-32">
             <div className="text-center mb-12">
                 <h2 className="text-3xl font-bold mb-4">1. Data Ingestion</h2>
                 <p className="text-muted-foreground max-w-2xl mx-auto">
                     Our engine is agnostic to the input source. We ingest product data through three primary automated channels.
                 </p>
             </div>
             <div className="grid md:grid-cols-3 gap-8">
                {/* Mode 1 */}
                <div className="bg-card rounded-2xl border border-border p-8 hover:border-primary/50 transition-colors">
                    <div className="w-14 h-14 bg-blue-500/10 rounded-xl flex items-center justify-center text-blue-600 mb-6">
                        <ScanBarcode className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Barcode Lookup</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Instant retrieval from our indexed database of 200,000+ Indian products (GS1/EAN standards).
                    </p>
                </div>
                 {/* Mode 2 */}
                <div className="bg-card rounded-2xl border border-border p-8 hover:border-primary/50 transition-colors">
                    <div className="w-14 h-14 bg-purple-500/10 rounded-xl flex items-center justify-center text-purple-600 mb-6">
                         <Camera className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">OCR Image Scan</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Vision models trained on 50k+ curved/crinkled packaging labels extracts Ingredient lists with 99.8% accuracy.
                    </p>
                </div>
                 {/* Mode 3 */}
                <div className="bg-card rounded-2xl border border-border p-8 hover:border-primary/50 transition-colors">
                    <div className="w-14 h-14 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                        <FileText className="w-7 h-7" />
                    </div>
                    <h3 className="text-xl font-semibold mb-3">Direct Text</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                        Raw text processing via API for R&D teams, recipe analysis, or supply chain auditing.
                    </p>
                </div>
             </div>
          </div>

          {/* The Analysis Pipeline */}
          <div className="mb-32">
              <div className="text-center mb-16">
                 <h2 className="text-3xl font-bold mb-4">2. The Analysis Pipeline</h2>
                 <p className="text-muted-foreground max-w-2xl mx-auto">
                     Once data is ingested, it passes through our core processing stages: Normalization, Classification, and Evaluation.
                 </p>
             </div>

             {/* Step 2.1: Normalization */}
             <div className="grid md:grid-cols-2 gap-16 items-center mb-24 border-b border-border pb-24">
                 <div>
                     <div className="w-12 h-12 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 mb-6">
                        <Filter className="w-6 h-6" />
                     </div>
                     <h2 className="text-3xl font-bold mb-4">Stage 1: Normalization</h2>
                     <p className="text-lg text-muted-foreground mb-6">
                         We convert messy, non-standard text into canonical IDs.
                     </p>
                     <ul className="space-y-4">
                         <li className="flex gap-3">
                             <div className="mt-1"><Zap className="w-5 h-5 text-primary" /></div>
                             <div>
                                 <h4 className="font-semibold text-foreground">Synonym Mapping</h4>
                                 <p className="text-sm text-muted-foreground">"Vit B1", "Thiamin", and "Thiamine Mononitrate" &rarr; <code className="bg-secondary px-1 py-0.5 rounded text-xs">en:thiamine</code></p>
                             </div>
                         </li>
                         <li className="flex gap-3">
                             <div className="mt-1"><Zap className="w-5 h-5 text-primary" /></div>
                             <div>
                                 <h4 className="font-semibold text-foreground">Code Decoding</h4>
                                 <p className="text-sm text-muted-foreground">"INS 211", "E211", "Preservative (211)" &rarr; <code className="bg-secondary px-1 py-0.5 rounded text-xs">en:sodium-benzoate</code></p>
                             </div>
                         </li>
                     </ul>
                 </div>
                 <div className="bg-secondary/20 p-8 rounded-3xl border border-border font-mono text-sm">
                      <div className="mb-4 text-xs text-muted-foreground uppercase tracking-widest">Input Raw Text</div>
                      <div className="bg-background p-4 rounded-lg border border-border mb-6 text-muted-foreground">
                          "Ingredients: Refined Wheat Flour, Edible Veg Oil (Palm), E322, Sugar"
                      </div>
                      <div className="flex justify-center mb-6">
                          <ArrowRight className="w-6 h-6 text-muted-foreground rotate-90 md:rotate-0" />
                      </div>
                      <div className="mb-4 text-xs text-muted-foreground uppercase tracking-widest">Output Normalized IDs</div>
                      <div className="bg-background p-4 rounded-lg border border-border text-primary">
                          [<br/>
                          &nbsp;&nbsp;"en:wheat-flour",<br/>
                          &nbsp;&nbsp;"en:palm-oil",<br/>
                          &nbsp;&nbsp;"en:lecithin",<br/>
                          &nbsp;&nbsp;"en:sugar"<br/>
                          ]
                      </div>
                 </div>
             </div>

             {/* Step 2.2: Classification */}
             <div className="grid md:grid-cols-2 gap-16 items-center mb-24 md:flex-row-reverse border-b border-border pb-24">
                 <div className="order-2 md:order-1 bg-secondary/20 p-8 rounded-3xl border border-border">
                      {/* Visualization of Tree */}
                      <div className="font-mono text-sm space-y-2">
                          <div className="flex items-center gap-2 text-muted-foreground">
                              <span className="w-2 h-2 rounded-full bg-foreground"></span>
                              <span>en:plant-based-food</span>
                          </div>
                          <div className="pl-6 border-l border-border space-y-2">
                               <div className="flex items-center gap-2 text-muted-foreground">
                                    <span className="w-2 h-1 bg-border"></span>
                                    <span>en:cereal</span>
                               </div>
                               <div className="pl-6 border-l border-border space-y-2">
                                    <div className="flex items-center gap-2">
                                         <span className="w-2 h-1 bg-border"></span>
                                         <span className="text-primary font-semibold bg-primary/10 px-2 rounded">en:wheat-flour</span>
                                    </div>
                                    <div className="pl-8 text-xs text-muted-foreground text-amber-600">
                                         └─ contains: gluten<br/>
                                         └─ type: grain
                                    </div>
                               </div>
                          </div>
                          <div className="pt-4 flex items-center gap-2 text-muted-foreground">
                              <span className="w-2 h-2 rounded-full bg-foreground"></span>
                              <span>en:additive</span>
                          </div>
                          <div className="pl-6 border-l border-border space-y-2">
                               <div className="flex items-center gap-2">
                                    <span className="w-2 h-1 bg-border"></span>
                                    <span className="text-primary font-semibold bg-primary/10 px-2 rounded">en:sodium-benzoate</span>
                               </div>
                               <div className="pl-8 text-xs text-muted-foreground text-red-500">
                                    └─ risk: high<br/>
                                    └─ origin: synthetic
                               </div>
                          </div>
                      </div>
                 </div>
                 <div className="order-1 md:order-2">
                     <div className="w-12 h-12 bg-pink-100 rounded-2xl flex items-center justify-center text-pink-600 mb-6">
                        <Share2 className="w-6 h-6" />
                     </div>
                     <h2 className="text-3xl font-bold mb-4">Stage 2: Classification</h2>
                     <p className="text-lg text-muted-foreground mb-6">
                         We map normalized IDs to a hierarchical food ontology to understand relationships and properties.
                     </p>
                     <p className="text-muted-foreground mb-4">
                         Our database understands that <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">wheat-flour</code> is a child of <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">cereal</code>, which contains <code className="font-mono text-xs bg-secondary px-1 py-0.5 rounded">gluten</code>.
                     </p>
                     <p className="text-muted-foreground">
                         This inheritance model allows us to flag "Hidden Allergens" even if the specific allergen word isn't explicitly on the label.
                     </p>
                 </div>
             </div>

             {/* Step 2.3: Evaluation */}
             <div className="grid md:grid-cols-2 gap-16 items-center">
                 <div>
                     <div className="w-12 h-12 bg-green-100 rounded-2xl flex items-center justify-center text-green-600 mb-6">
                        <Scale className="w-6 h-6" />
                     </div>
                     <h2 className="text-3xl font-bold mb-4">Stage 3: Evaluation</h2>
                     <p className="text-lg text-muted-foreground mb-6">
                         The final verdict. We cross-reference product data against the user's specific health profile and regulatory standards.
                     </p>
                     <ul className="space-y-4">
                         <li className="flex gap-3">
                             <div className="mt-1"><ShieldCheck className="w-5 h-5 text-primary" /></div>
                             <div>
                                 <h4 className="font-semibold text-foreground">Rule Engine</h4>
                                 <p className="text-sm text-muted-foreground">Checks for conflicts (e.g. Diabetics &rarr; Sugar &gt; <span className="font-mono text-primary">5g/100g</span>).</p>
                             </div>
                         </li>
                         <li className="flex gap-3">
                             <div className="mt-1"><FileSearch className="w-5 h-5 text-primary" /></div>
                             <div>
                                 <h4 className="font-semibold text-foreground">FSSAI/FDA Compliance</h4>
                                 <p className="text-sm text-muted-foreground">Validates label claims like "No Added Sugar" against the actual ingredient list.</p>
                             </div>
                         </li>
                     </ul>
                 </div>
                 <div className="bg-secondary/20 p-8 rounded-3xl border border-border">
                      <div className="bg-background p-6 rounded-xl border border-border shadow-sm">
                           <div className="flex justify-between items-center border-b border-border pb-4 mb-4">
                                <span className="font-bold text-sm text-muted-foreground">USER: JAIN + DIABETIC</span>
                                <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-xs font-bold">NOT SAFE</span>
                           </div>
                           <div className="space-y-3">
                                <div className="flex gap-3 items-start">
                                     <div className="w-1 h-12 bg-red-500 rounded-full"></div>
                                     <div>
                                         <p className="font-medium text-red-700">Egg Content</p>
                                         <p className="text-xs text-muted-foreground">Product contains <span className="font-bold">Egg Powder</span>. Conflicts with <span className="font-bold">Jain (Vegetarian)</span>.</p>
                                     </div>
                                </div>
                                <div className="flex gap-3 items-start">
                                     <div className="w-1 h-12 bg-yellow-500 rounded-full"></div>
                                     <div>
                                         <p className="font-medium text-yellow-700">High Sugar</p>
                                         <p className="text-xs text-muted-foreground">12g Sugar/100g exceeds your threshold of <span className="font-bold">5g/100g</span>.</p>
                                     </div>
                                </div>
                           </div>
                      </div>
                 </div>
             </div>


             {/* Final Output: API Response */}
             <div className="mt-24 pt-24 border-t border-border">
                <div className="text-center mb-12">
                     <h2 className="text-3xl font-bold mb-4">4. The Output</h2>
                     <p className="text-muted-foreground max-w-2xl mx-auto">
                         The result of this pipeline is a rich JSON payload delivered in under 50ms, ready for your application.
                     </p>
                </div>
                <div className="bg-card rounded-2xl border border-border overflow-hidden max-w-3xl mx-auto shadow-sm">
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
             </div>

              {/* Database Stats Section */}
             <div className="mt-32 mb-24">
                 <div className="text-center mb-16">
                     <h2 className="text-3xl font-bold mb-4">Powered by Massive Intelligence</h2>
                     <p className="text-muted-foreground max-w-2xl mx-auto">
                         Our rules engine is built on one of the world's most comprehensive ingredient databases.
                     </p>
                 </div>
                 <div className="grid md:grid-cols-3 gap-8">
                     <div className="bg-secondary/20 p-8 rounded-2xl border border-border text-center">
                         <div className="text-4xl font-bold text-foreground mb-2">93,000+</div>
                         <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Unique Ingredients</div>
                         <p className="text-muted-foreground text-sm">Indexed and classified from raw manufacturing data.</p>
                     </div>
                     <div className="bg-secondary/20 p-8 rounded-2xl border border-border text-center">
                         <div className="text-4xl font-bold text-foreground mb-2">26,000+</div>
                         <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Additives Analyzed</div>
                         <p className="text-muted-foreground text-sm">Including full INS/E-number decoding and risk profiles.</p>
                     </div>
                     <div className="bg-secondary/20 p-8 rounded-2xl border border-border text-center">
                         <div className="text-4xl font-bold text-foreground mb-2">50ms</div>
                         <div className="text-sm font-semibold text-primary uppercase tracking-wide mb-3">Average Latency</div>
                         <p className="text-muted-foreground text-sm">Real-time analysis optimized for retail checkout speeds.</p>
                     </div>
                 </div>
             </div>

          </div>

        </div>

        {/* Closing CTA */}
        <section className="py-24 bg-primary text-primary-foreground">
            <div className="container mx-auto px-6 text-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-6">Experience the Intelligence</h2>
                <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto mb-10">
                    Whether you're building a platform or shopping for your family, Untainted provides the clarity you need.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                     <a href="/business" className="bg-background text-foreground px-8 py-3.5 rounded-full font-bold text-lg hover:bg-secondary transition-colors shadow-lg">
                        For Business
                    </a>
                     <a href="/personal" className="bg-transparent border-2 border-primary-foreground text-primary-foreground px-8 py-3.5 rounded-full font-bold text-lg hover:bg-primary-foreground/10 transition-colors">
                        For You
                    </a>
                </div>
            </div>
        </section>
      </main>
      <Footer />
    </>
  )
}
