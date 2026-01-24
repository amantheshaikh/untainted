"use client"

import { useState } from "react"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ScanBarcode, Camera, Type, Loader2 } from "lucide-react"
import { IngredientScanner } from "./IngredientScanner"
import { IngredientTyper } from "./IngredientTyper"
import { BarcodeScanner } from "./BarcodeScanner"
import { AnalysisResultDisplay } from "./AnalysisResultDisplay"
import { extractIngredientsFromImage, analyzeIngredients, lookupProductByBarcode, AnalysisResult, Product } from "../../lib/untainted-api"
import { supabase } from "../../lib/supabaseClient"

export function FoodAnalyzer() {
    const [ingredientsText, setIngredientsText] = useState("")
    const [isProcessing, setIsProcessing] = useState(false)
    const [result, setResult] = useState<AnalysisResult | null>(null)
    const [error, setError] = useState<string | null>(null)
    const [activeTab, setActiveTab] = useState("scan")
    const [foundProduct, setFoundProduct] = useState<Product | null>(null)

    const handleAnalyze = async (textToAnalyze: string = ingredientsText) => {
        if (!textToAnalyze.trim()) return

        setIsProcessing(true)
        setError(null)
        setResult(null)

        try {
            const { data: { session } } = await supabase.auth.getSession()
            if (!session) throw new Error("You must be logged in to analyze food.")

            const res = await analyzeIngredients(textToAnalyze, session.user.id, session.access_token)
            setResult(res)
        } catch (err: any) {
            setError(err.message || "Failed to analyze ingredients.")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleImageScan = async (base64Image: string) => {
        setIsProcessing(true)
        setError(null)
        try {
            const { data: { session } } = await supabase.auth.getSession()
            const token = session?.access_token

            const extraction = await extractIngredientsFromImage(base64Image, token)
            const text = extraction.text

            if (!text) {
                throw new Error("Could not find any text in the image.")
            }

            setIngredientsText(text)
            setActiveTab("type")
            // await handleAnalyze(text) // User wants to review/edit first

        } catch (err: any) {
            setError(err.message || "Failed to process image.")
        } finally {
            setIsProcessing(false)
        }
    }

    const handleBarcodeLookup = async (barcode: string) => {
        setIsProcessing(true)
        setError(null)
        setFoundProduct(null)

        try {
            const { data: { session } } = await supabase.auth.getSession()
            const token = session?.access_token

            const product = await lookupProductByBarcode(barcode, token)
            setFoundProduct(product)

            // If product has ingredients, pre-fill and analyze
            if (product.ingredients && product.ingredients.length > 0) {
                const text = Array.isArray(product.ingredients) ? product.ingredients.join(", ") : String(product.ingredients)
                setIngredientsText(text)
                // Auto-analyze
                await handleAnalyze(text)
            } else {
                setError("Product found, but no ingredients listed. Please verify/add manually.")
            }

        } catch (err: any) {
            setError(err.message || "Product lookup failed.")
        } finally {
            setIsProcessing(false)
        }
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold mb-1">Ingredient Analysis</h2>
                <p className="text-muted-foreground">Choose how you'd like to input your food's ingredient list.</p>
            </div>

            <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden min-h-[500px]">
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                    <div className="bg-muted/50 border-b border-border p-2">
                        <TabsList className="w-full grid grid-cols-3 h-12 bg-transparent">
                            <TabsTrigger value="barcode" className="data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2">
                                <ScanBarcode className="w-4 h-4" />
                                Scan Barcode
                            </TabsTrigger>
                            <TabsTrigger value="scan" className="data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2">
                                <Camera className="w-4 h-4" />
                                Scan Ingredients
                            </TabsTrigger>
                            <TabsTrigger value="type" className="data-[state=active]:bg-background data-[state=active]:shadow-sm gap-2">
                                <Type className="w-4 h-4" />
                                Type Ingredients
                            </TabsTrigger>
                        </TabsList>
                    </div>

                    <div className="p-6">
                        <TabsContent value="barcode" className="mt-0 space-y-6">
                            <BarcodeScanner
                                isSearching={isProcessing && !foundProduct}
                                onProductFound={handleBarcodeLookup}
                            />

                            {foundProduct && (
                                <div className="flex items-center gap-4 p-4 bg-secondary/20 rounded-xl border border-border animate-in fade-in">
                                    {foundProduct.image_url && (
                                        <img src={foundProduct.image_url} alt={foundProduct.name} className="w-16 h-16 object-cover rounded-lg bg-white shadow-sm" />
                                    )}
                                    <div>
                                        <h4 className="font-semibold text-lg">{foundProduct.name}</h4>
                                        <p className="text-xs text-muted-foreground font-mono">{foundProduct.code}</p>
                                    </div>
                                </div>
                            )}

                            {error && activeTab === 'barcode' && (
                                <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg text-sm flex items-center gap-2">
                                    <span className="font-bold">Error:</span> {error}
                                </div>
                            )}

                            <AnalysisResultDisplay result={result} />
                        </TabsContent>

                        <TabsContent value="scan" className="mt-0 space-y-6">
                            {isProcessing ? (
                                <div className="flex flex-col items-center justify-center py-12 space-y-4 animate-in fade-in">
                                    <Loader2 className="w-10 h-10 text-primary animate-spin" />
                                    <p className="text-muted-foreground">Reading ingredients...</p>
                                </div>
                            ) : (
                                <IngredientScanner
                                    isScanning={isProcessing}
                                    onScanComplete={handleImageScan}
                                />
                            )}
                            {error && activeTab === 'scan' && (
                                <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                                    {error}
                                </div>
                            )}
                        </TabsContent>

                        <TabsContent value="type" className="mt-0">
                            <div className="space-y-6">
                                <IngredientTyper
                                    value={ingredientsText}
                                    onChange={setIngredientsText}
                                    onAnalyze={() => handleAnalyze()}
                                    isAnalyzing={isProcessing}
                                />

                                {error && activeTab === 'type' && (
                                    <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                                        {error}
                                    </div>
                                )}

                                <AnalysisResultDisplay result={result} />
                            </div>
                        </TabsContent>
                    </div>
                </Tabs>
            </div>
        </div>
    )
}
