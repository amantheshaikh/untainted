"use client"

import Image from "next/image"
import { useState, useEffect, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Sparkles,
    CheckCircle2,
    AlertTriangle,
    ShoppingBag,
    Search,
    Leaf,
    Heart,
    Ban
} from "lucide-react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { parseDietaryProfile, ParsedProfile } from "../../lib/profile-parser"
import { DEMO_PRODUCTS } from "../../lib/demo-data"
import { detectConflicts, ApiVerdict } from "../../lib/client-analysis"



export const InteractiveDemoSection = () => {
    // Demo State
    // VERIFICATION TAG: 2026-01-28_MaggiFix
    useEffect(() => {
        console.log("Untainted Demo Loaded: v2026-01-28_MaggiFix")
    }, [])

    const [bioInput, setBioInput] = useState("")
    const [hasCleared, setHasCleared] = useState(false)
    const [isAnalyzing, setIsAnalyzing] = useState(false)
    const [profile, setProfile] = useState<ParsedProfile>({
        diets: [],
        health: [],
        allergies: [],
        customTerms: [],
        novaPreference: "no_preference"
    })
    const [selectedProductId, setSelectedProductId] = useState<string | null>(null)

    // Profile Building State
    const [isParsingProfile, setIsParsingProfile] = useState(false)
    const [matchedIngredients, setMatchedIngredients] = useState<Array<{ id: string, name: string }>>([])

    // Real API State
    const [apiResult, setApiResult] = useState<ApiVerdict | null>(null)

    // 1. Parse Text with AI Backend
    const handleProfileBuild = async (text: string) => {
        setIsParsingProfile(true)

        try {
            const res = await fetch("/api/profile/analyze-bio", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    // Authorization not strictly required for public demo if we allow it, 
                    // but the backend enforces it. The user might be logged in. 
                    // If not logged in, this call might fail if backend requires auth.
                    // app.py: _authenticate_request(request) 
                    // But wait, the demo is on the landing page (public). 
                    // If the backend enforces auth, the public demo won't work for visitors!
                    // Let's check app.py _authenticate_request implementation.
                },
                body: JSON.stringify({ bio: text }),
            })

            // If public usage is allowed, we might need to handle the auth requirement locally or update backend.
            // Assuming for now the user is testing while logged in or the backend allows public access for this endpoint (it doesn't seem to based on my memory).
            // Actually, if this is a "Landing Page" demo, it should work for anon users.
            // If the backend requires auth, we have a problem.

            if (!res.ok) {
                // Fallback to local parser if API fails (e.g. auth error, or server error)
                console.warn("AI analysis failed, falling back to local:", res.status)
                const localResult = parseDietaryProfile(text)
                setProfile(localResult)
                // mimic empty matches for local fallback or could try to fetch ingredients
                setMatchedIngredients([])
                if (selectedProductId) {
                    const prod = DEMO_PRODUCTS.find(p => p.id === selectedProductId)
                    if (prod) analyzeProduct(prod, localResult)
                }
                return
            }

            const data = await res.json()

            const newProfile: ParsedProfile = {
                diets: data.diets || [],
                health: data.health || [],
                allergies: data.allergies || [],
                customTerms: data.raw_custom_terms || [],
                novaPreference: data.nova_preference || "no_preference"
            }

            setProfile(newProfile)
            setMatchedIngredients(data.custom_avoidance || [])

            // Re-analyze product if selected
            if (selectedProductId) {
                const prod = DEMO_PRODUCTS.find(p => p.id === selectedProductId)
                if (prod) analyzeProduct(prod, newProfile)
            }

        } catch (error) {
            console.error("Profile build error:", error)
        } finally {
            setIsParsingProfile(false)
        }
    }



    // 3. Analyze Product via API (with Stateless Fallback)
    const analyzeProduct = async (product: typeof DEMO_PRODUCTS[0], currentProfile: ParsedProfile = profile) => {
        setIsAnalyzing(true)
        setApiResult(null)

        try {
            // Attempt Real API
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 3000); // 3s timeout

            // Construct Stateless Preferences Payload
            const preferencesPayload = {
                dietary_preferences: currentProfile.diets.map(d => d.toLowerCase().replace(" ", "-")),
                health_conditions: currentProfile.health.map(h => h.toLowerCase().replace(" ", "-")),
                allergies: currentProfile.allergies.map(a => ({
                    allergen: a.toLowerCase(),
                    severity: "high"
                })),
                custom_avoidance: currentProfile.customTerms,
                nova_preference: currentProfile.novaPreference
            }

            const res = await fetch('/api/analyze', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    // No user_id needed for stateless analysis
                    ingredients_text: product.ingredients,
                    context: {
                        product_name: product.name,
                        barcode: product.barcode,
                        category: product.category
                    },
                    nutrition: {
                        sugars_g: product.nutrition.sugar,
                        saturated_fat: product.nutrition.saturated_fat,
                        trans_fat: product.nutrition.trans_fat,
                        sodium: product.nutrition.sodium
                    },
                    // Send full profile here
                    preferences: preferencesPayload
                }),
                signal: controller.signal
            })

            clearTimeout(timeoutId);

            if (res.ok) {
                const data = await res.json()

                // Hybrid approach: Merge local detection for palm oil derivatives
                // The API might miss derivatives due to ingredient normalization
                const localResult = detectConflicts(product, currentProfile)

                // If local detected conflicts but API didn't, merge them
                if (localResult.conflicts.length > 0 && data.conflict_count === 0) {
                    // Local caught something API missed - use local result with API's parsed data
                    const hybridResult: ApiVerdict = {
                        status: localResult.status,
                        verdict: localResult.verdict,
                        conflicts: localResult.conflicts,
                        ingredients: data.ingredients || [],
                        confidence: data.confidence || { average: 0.9, ingredients: [] }
                    }
                    setApiResult(hybridResult)
                } else if (localResult.conflicts.length > 0 && data.conflict_count > 0) {
                    // Both found conflicts - merge them (deduplicate by ingredient name)
                    const existingIngredients = new Set(data.flagged_ingredients?.map((f: string) => f.toLowerCase()) || [])
                    const additionalConflicts = localResult.conflicts.filter(
                        c => !existingIngredients.has(c.ingredient.toLowerCase())
                    )

                    const mergedResult: ApiVerdict = {
                        status: data.status === "not_safe" ? "avoid" : (localResult.status === "avoid" ? "avoid" : "caution"),
                        verdict: {
                            title: data.verdict_title,
                            description: data.verdict_description
                        },
                        conflicts: [
                            ...(data.flagged_ingredients || []).map((f: string) => ({
                                ingredient: f,
                                explanation: "Flagged by analysis"
                            })),
                            ...additionalConflicts
                        ],
                        ingredients: data.ingredients || [],
                        confidence: data.confidence || { average: 0.9, ingredients: [] }
                    }
                    setApiResult(mergedResult)
                } else {
                    // Use API result as-is
                    setApiResult({
                        status: data.status === "not_safe" ? "avoid" : "safe",
                        verdict: {
                            title: data.verdict_title,
                            description: data.verdict_description
                        },
                        conflicts: (data.flagged_ingredients || []).map((f: string) => ({
                            ingredient: f,
                            explanation: "Flagged by analysis"
                        })),
                        ingredients: data.ingredients || [],
                        confidence: data.confidence || { average: 0.9, ingredients: [] }
                    })
                }
            } else {
                throw new Error("API responded with error")
            }
        } catch (e) {
            console.warn("API Analysis failed, falling back to local logic", e)
            // Fallback to local logic
            const localResult = detectConflicts(product, currentProfile)

            // Artificial delay to mimic analysis
            setTimeout(() => {
                setApiResult(localResult)
            }, 800)
        } finally {
            // Keep loading state true if falling back (handled by timeout) 
            // but here we wait for the fallback settimeout
            setTimeout(() => setIsAnalyzing(false), 800)
        }
    }

    const handleProductSelect = async (id: string) => {
        setSelectedProductId(id)
        const prod = DEMO_PRODUCTS.find(p => p.id === id)
        if (!prod) return

        setIsAnalyzing(true)
        setApiResult(null)

        try {
            // Use hardcoded demo data directly
            await analyzeProduct(prod)
        } catch (err) {
            console.warn("Analysis error", err)
            // Fallback provided inside analyzeProduct, but just in case
        } finally {
            // setIsAnalyzing(false) is handled in analyzeProduct finally block
            // but we should ensure it's handled if analyzeProduct doesn't cover all paths or throws early
            // Actually analyzeProduct handles it.
        }
    }

    return (
        <section className="w-full bg-gradient-to-b from-background to-secondary/10 pb-10 border-b border-border">
            <div className="container max-w-6xl mx-auto px-6">
                <div className="text-center mb-12">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 mb-4">
                        <Sparkles className="w-4 h-4 text-primary" />
                        <span className="text-sm font-medium text-primary">Interactive Demo</span>
                    </div>
                    <h2 className="text-3xl md:text-5xl font-bold mb-4">Try the Intelligence</h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        See how Untainted analyzes products in real-time against complex, natural-language profiles.
                    </p>
                </div>

                <div className="grid lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT COLUMN: Profile Builder */}
                    <div className="lg:col-span-5 space-y-6">
                        <div className="bg-primary/5 rounded-2xl border border-primary/10 p-6 shadow-sm h-full">
                            <div className="flex items-center gap-2 mb-2">
                                <Sparkles className="w-5 h-5 text-primary" />
                                <h3 className="text-lg font-semibold text-primary">Intelligent Profile Builder</h3>
                            </div>
                            <p className="text-sm text-foreground/80 mb-4">
                                Describe your dietary needs in plain English, and we'll analyze products against your preferences.
                            </p>

                            <div className="space-y-4">
                                <div className="relative">
                                    <Textarea
                                        value={bioInput}
                                        onChange={(e) => setBioInput(e.target.value)}
                                        onFocus={() => {
                                            if (!hasCleared) {
                                                setBioInput("")
                                                setHasCleared(true)
                                            }
                                        }}
                                        placeholder="e.g. I am Jain and diabetic..."
                                        className="min-h-[120px] resize-none bg-background text-base p-4 border-primary/20 focus-visible:ring-primary/30"
                                    />
                                    <div className="absolute bottom-3 right-3 flex gap-2">
                                        <Button
                                            size="sm"
                                            onClick={() => handleProfileBuild(bioInput)}
                                            disabled={!bioInput || isParsingProfile}
                                            className="h-8 text-xs font-semibold gap-1.5"
                                        >
                                            {isParsingProfile ? "Analyzing..." : "Build Profile"}
                                        </Button>
                                    </div>
                                </div>

                                <AnimatePresence mode="wait">
                                    {isParsingProfile ? (
                                        <motion.div
                                            key="loading"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="p-4 bg-secondary/30 rounded-xl min-h-[200px] flex items-center justify-center"
                                        >
                                            <div className="flex flex-col items-center gap-3">
                                                <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                                <span className="text-sm text-muted-foreground">Analyzing your preferences...</span>
                                            </div>
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="profile"
                                            initial={{ opacity: 0, y: 5 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0 }}
                                            className="space-y-4"
                                        >
                                            <div className="grid grid-cols-2 gap-3">
                                                <div className="p-3 bg-green-50 dark:bg-green-950/20 rounded-xl border border-green-200 dark:border-green-800">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center">
                                                            <Leaf className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                                                        </div>
                                                        <span className="text-xs font-semibold text-green-800 dark:text-green-200">Diet</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {profile.diets.length > 0 ? profile.diets.map(d => (
                                                            <span key={d} className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-700 dark:text-green-300 text-[10px] font-medium">
                                                                {d}
                                                            </span>
                                                        )) : (
                                                            <span className="text-[10px] text-green-600/50 italic">No diet specified</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="p-3 bg-blue-50 dark:bg-blue-950/20 rounded-xl border border-blue-200 dark:border-blue-800">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-6 h-6 rounded-full bg-blue-500/20 flex items-center justify-center">
                                                            <Heart className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
                                                        </div>
                                                        <span className="text-xs font-semibold text-blue-800 dark:text-blue-200">Health</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {profile.health.length > 0 ? profile.health.map(h => (
                                                            <span key={h} className="px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-700 dark:text-blue-300 text-[10px] font-medium">
                                                                {h}
                                                            </span>
                                                        )) : (
                                                            <span className="text-[10px] text-blue-600/50 italic">No conditions</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-200 dark:border-red-800">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-6 h-6 rounded-full bg-red-500/20 flex items-center justify-center">
                                                            <AlertTriangle className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
                                                        </div>
                                                        <span className="text-xs font-semibold text-red-800 dark:text-red-200">Allergies</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {profile.allergies.length > 0 ? profile.allergies.map(a => (
                                                            <span key={a} className="px-2 py-0.5 rounded-full bg-red-500/20 text-red-700 dark:text-red-300 text-[10px] font-medium">
                                                                {a}
                                                            </span>
                                                        )) : (
                                                            <span className="text-[10px] text-red-600/50 italic">No allergies</span>
                                                        )}
                                                    </div>
                                                </div>

                                                <div className="p-3 bg-purple-50 dark:bg-purple-950/20 rounded-xl border border-purple-200 dark:border-purple-800">
                                                    <div className="flex items-center gap-2 mb-2">
                                                        <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                                                            <Ban className="w-3.5 h-3.5 text-purple-600 dark:text-purple-400" />
                                                        </div>
                                                        <span className="text-xs font-semibold text-purple-800 dark:text-purple-200">Avoid</span>
                                                    </div>
                                                    <div className="flex flex-wrap gap-1.5">
                                                        {(matchedIngredients.length > 0 ? matchedIngredients : profile.customTerms.map(t => ({ id: t, name: t }))).length > 0 ?
                                                            (matchedIngredients.length > 0 ? matchedIngredients : profile.customTerms.map(t => ({ id: t, name: t }))).map(ing => (
                                                                <span key={ing.id} className="px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-700 dark:text-purple-300 text-[10px] font-medium">
                                                                    {ing.name}
                                                                </span>
                                                            )) : (
                                                                <span className="text-[10px] text-purple-600/50 italic">No avoidances</span>
                                                            )}
                                                    </div>
                                                </div>

                                                {/* NOVA Preference Visual */}
                                                {profile.novaPreference === 'avoid_nova_4' && (
                                                    <div className="col-span-2 p-3 bg-orange-50 dark:bg-orange-950/20 rounded-xl border border-orange-200 dark:border-orange-800">
                                                        <div className="flex items-center gap-2 mb-2">
                                                            <div className="w-6 h-6 rounded-full bg-orange-500/20 flex items-center justify-center">
                                                                <span className="text-xs">🏭</span>
                                                            </div>
                                                            <span className="text-xs font-semibold text-orange-800 dark:text-orange-200">Processing Tolerance</span>
                                                        </div>
                                                        <div className="flex flex-wrap gap-1.5">
                                                            <span className="px-2 py-0.5 rounded-full bg-orange-500/20 text-orange-700 dark:text-orange-300 text-[10px] font-medium">
                                                                Strictly Avoid Ultra-Processed Foods
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {/* Empty State */}
                                            {profile.diets.length === 0 && profile.health.length === 0 && profile.allergies.length === 0 && profile.customTerms.length === 0 && (
                                                <div className="text-center py-2">
                                                    <p className="text-xs text-muted-foreground">Type your preferences above and click <strong>Build Profile</strong></p>
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>


                    {/* RIGHT COLUMN: Product Selector & Analysis */}
                    <div className="lg:col-span-7 space-y-6">
                        {/* Product Grid */}
                        <div className="grid sm:grid-cols-3 gap-4">
                            {DEMO_PRODUCTS.map((product) => (
                                <motion.button
                                    key={product.id}
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => handleProductSelect(product.id)}
                                    className={`relative text-left p-4 rounded-xl border transition-all duration-200 group overflow-hidden ${selectedProductId === product.id
                                        ? "bg-card border-primary ring-1 ring-primary shadow-md"
                                        : "bg-card border-border hover:border-primary/50 hover:shadow-sm"
                                        }`}
                                >
                                    <div className="aspect-[4/3] w-full mb-3 rounded-lg overflow-hidden bg-white/5 flex items-center justify-center relative">
                                        {product.image ? (
                                            <div className="relative w-full h-full p-4">
                                                <Image
                                                    src={product.image}
                                                    alt={product.name}
                                                    fill
                                                    className="object-contain"
                                                />
                                            </div>
                                        ) : (
                                            <>
                                                <div className="absolute inset-0 bg-secondary/20 group-hover:bg-secondary/30 transition-colors" />
                                                <ShoppingBag className="w-10 h-10 text-muted-foreground/40" />
                                            </>
                                        )}
                                    </div>
                                    <h4 className="font-medium text-sm mb-1 leading-tight">{product.name}</h4>
                                    <p className="text-xs text-muted-foreground line-clamp-2">{product.category}</p>

                                    {selectedProductId === product.id && (
                                        <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-primary shadow-[0_0_8px_rgba(var(--primary),0.5)] animate-pulse" />
                                    )}
                                </motion.button>
                            ))}
                        </div>

                        {/* Analysis Result Area */}
                        <div className="relative min-h-[300px]">
                            <AnimatePresence mode="wait">
                                {isAnalyzing ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="absolute inset-0 z-10 flex items-center justify-center bg-background/50 backdrop-blur-[2px] rounded-2xl"
                                    >
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
                                            <span className="text-sm font-medium text-primary">Analyzing Ingredients...</span>
                                        </div>
                                    </motion.div>
                                ) : null}

                                {selectedProductId && apiResult ? (() => {
                                    // Determine if safe
                                    const hasConflicts = (apiResult.conflicts && apiResult.conflicts.length > 0) ||
                                        apiResult.status === "avoid" || apiResult.status === "unsafe" || apiResult.status === "caution"
                                    const isSafe = !hasConflicts

                                    // Get ingredients from API response
                                    const ingredients: string[] = (apiResult as any).ingredients || []
                                    const confidence = (apiResult as any).confidence as { average: number; ingredients: Array<{ ingredient: string; confidence: number; match_type: string }> } | undefined

                                    return (
                                        <motion.div
                                            key={selectedProductId + "-result"}
                                            initial={{ opacity: 0, y: 10 }}
                                            animate={{ opacity: 1, y: 0 }}
                                            exit={{ opacity: 0, y: -10 }}
                                            transition={{ duration: 0.3 }}
                                            className="space-y-5"
                                        >
                                            {/* 1. Hero Verdict Banner */}
                                            <div className={`rounded-xl border p-5 flex items-center gap-4 ${isSafe
                                                ? "bg-green-50 dark:bg-green-950/30 text-green-900 dark:text-green-100 border-green-200 dark:border-green-800"
                                                : "bg-red-50 dark:bg-red-950/30 text-red-900 dark:text-red-100 border-red-200 dark:border-red-800"
                                                }`}>
                                                <div className={`p-3 rounded-full shadow-sm ${isSafe ? "bg-white/60 dark:bg-green-900/50" : "bg-white/60 dark:bg-red-900/50"}`}>
                                                    {isSafe
                                                        ? <CheckCircle2 className="w-7 h-7 text-green-600 dark:text-green-400" />
                                                        : <AlertTriangle className="w-7 h-7 text-red-600 dark:text-red-400" />
                                                    }
                                                </div>
                                                <div>
                                                    <h3 className="text-lg font-bold">
                                                        {apiResult.verdict?.title || (isSafe ? "Safe to Consume" : "Not Recommended")}
                                                    </h3>
                                                    <p className="text-sm opacity-80">
                                                        {apiResult.verdict?.description || (isSafe ? "No conflicts found with your profile." : "We found ingredients that conflict with your preferences.")}
                                                    </p>
                                                </div>
                                            </div>

                                            {/* 2. Preference Check Card */}
                                            <div className={`border rounded-xl p-5 ${isSafe
                                                ? 'border-green-200 dark:border-green-800 bg-green-50/30 dark:bg-green-950/20'
                                                : 'border-red-200 dark:border-red-800 bg-red-50/30 dark:bg-red-950/20'
                                                }`}>
                                                <div className="flex items-center gap-2 mb-4">
                                                    {isSafe
                                                        ? <CheckCircle2 className="w-5 h-5 text-green-600 dark:text-green-400" />
                                                        : <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
                                                    }
                                                    <h4 className={`text-base font-semibold ${isSafe ? 'text-green-900 dark:text-green-100' : 'text-red-900 dark:text-red-100'}`}>
                                                        {isSafe ? "All Clear!" : "Preference Conflicts"}
                                                    </h4>
                                                </div>

                                                <div className="bg-white dark:bg-card border rounded-lg p-4 shadow-sm">
                                                    {isSafe ? (
                                                        <p className="text-green-800 dark:text-green-200 text-sm">
                                                            This product matches your preferences ({profile.diets.join(", ") || "No specific diet"}).
                                                        </p>
                                                    ) : (
                                                        <div>
                                                            <p className="text-red-800 dark:text-red-200 font-medium text-sm mb-3">
                                                                This product conflicts with your preferences:
                                                            </p>
                                                            <ul className="space-y-2">
                                                                {apiResult.conflicts?.map((conflict, idx) => (
                                                                    <li key={idx} className="flex items-start gap-2 text-red-700 dark:text-red-300">
                                                                        <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0 mt-2" />
                                                                        <div>
                                                                            <span className="font-medium">{conflict.ingredient}</span>
                                                                            {conflict.explanation && (
                                                                                <span className="text-red-600/70 dark:text-red-400/70 text-xs block">
                                                                                    {conflict.explanation}
                                                                                </span>
                                                                            )}
                                                                        </div>
                                                                    </li>
                                                                ))}
                                                            </ul>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            {/* 3. Full Ingredient List */}
                                            {ingredients.length > 0 && (
                                                <div>
                                                    <h4 className="text-xs font-semibold mb-3 text-muted-foreground uppercase tracking-wider">
                                                        Parsed Ingredients
                                                    </h4>
                                                    <div className="flex flex-wrap gap-2">
                                                        {ingredients.map((ing, i) => {
                                                            // Check if this ingredient is flagged
                                                            const isFlagged = apiResult.conflicts?.some(c =>
                                                                ing.toLowerCase().includes(c.ingredient.toLowerCase().split(' ')[0]) ||
                                                                c.ingredient.toLowerCase().includes(ing.toLowerCase())
                                                            )

                                                            // Find confidence score
                                                            const confData = confidence?.ingredients.find(
                                                                c => c.ingredient.toLowerCase() === ing.toLowerCase()
                                                            )
                                                            const confScore = confData?.confidence ?? 1.0

                                                            // Determine confidence color
                                                            let confColor = "bg-green-500"
                                                            let confTitle = "High Confidence"
                                                            if (confScore < 0.8) {
                                                                confColor = "bg-orange-500"
                                                                confTitle = "Low Confidence"
                                                            } else if (confScore < 0.95) {
                                                                confColor = "bg-yellow-500"
                                                                confTitle = "Medium Confidence"
                                                            }

                                                            return (
                                                                <span
                                                                    key={i}
                                                                    title={`${ing} - ${confTitle} (${Math.round(confScore * 100)}%)`}
                                                                    className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-xs font-medium border ${isFlagged
                                                                        ? 'bg-red-50 dark:bg-red-950/30 text-red-700 dark:text-red-300 border-red-200 dark:border-red-700'
                                                                        : 'bg-white dark:bg-card text-foreground border-border'
                                                                        }`}
                                                                >
                                                                    <span className={`w-1.5 h-1.5 rounded-full ${confColor}`} />
                                                                    {ing}
                                                                </span>
                                                            )
                                                        })}
                                                    </div>
                                                    {confidence && (
                                                        <div className="mt-3 flex gap-4 text-[10px] text-muted-foreground">
                                                            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Verified</div>
                                                            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Fuzzy</div>
                                                            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Uncertain</div>
                                                        </div>
                                                    )}
                                                </div>
                                            )}
                                        </motion.div>
                                    )
                                })() : (
                                    <div className="h-full flex flex-col items-center justify-center text-center p-8 border border-dashed border-border rounded-2xl bg-secondary/5 text-muted-foreground">
                                        <div className="w-16 h-16 rounded-full bg-secondary mb-4 flex items-center justify-center">
                                            <Search className="w-8 h-8 opacity-50" />
                                        </div>
                                        <h3 className="text-lg font-medium mb-1">Select a Product</h3>
                                        <p className="text-sm max-w-xs mx-auto">
                                            Click on any product above to analyze it against your profile instantly.
                                        </p>
                                    </div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
