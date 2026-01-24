import { CheckCircle, Ban, Leaf, ShieldAlert } from "lucide-react"
import { AnalysisResult } from "../../lib/untainted-api"
import { Badge } from "@/components/ui/badge"

interface AnalysisResultProps {
    result: AnalysisResult | null
}

export function AnalysisResultDisplay({ result }: AnalysisResultProps) {
    if (!result) return null

    // Aggregate all conflicts into a unified list
    const conflicts: string[] = []

    // 1. Diet Conflicts (Already formatted as "Honey (Vegan)" by backend)
    if (result.diet_hits) {
        conflicts.push(...result.diet_hits)
    }

    // 2. Custom Blocklist (Now formatted as "Mango (Custom Selection)" by backend)
    if (result.flagged_ingredients) {
        // Filter out duplicates if any
        result.flagged_ingredients.forEach(hit => {
            // Avoid double adding if diet hits somehow cover it
            if (!conflicts.includes(hit)) {
                conflicts.push(hit)
            }
        })
    }

    // 3. Allergies (Backend returns "Milk". We format to "Milk (Allergy)")
    if (result.allergy_hits) {
        result.allergy_hits.forEach(hit => {
            const label = `${hit} (Allergy)`
            if (!conflicts.includes(label)) {
                conflicts.push(label)
            }
        })
    }

    // De-duplicate if needed
    const uniqueConflicts = Array.from(new Set(conflicts))
    const isSafe = uniqueConflicts.length === 0

    // Overall Verdict Color
    const verdictColor = !isSafe ? "bg-red-50 text-red-900 border-red-200" : "bg-green-50 text-green-900 border-green-200"
    const verdictIcon = !isSafe ? <Ban className="w-8 h-8 text-red-600" /> : <CheckCircle className="w-8 h-8 text-green-600" />

    // Determine header title based on state
    // "Custom Blocklist" was confusing when it contained Diet items.
    // If unsafe -> "Avoid" or "Conflict Found"
    // But user seemingly wants a cleaner look.

    return (
        <div className="space-y-6 animate-in slide-in-from-bottom-4 duration-500">

            {/* 1. Hero Verdict */}
            <div className={`rounded-xl border p-6 flex items-center gap-4 ${verdictColor}`}>
                <div className="p-3 bg-white/50 rounded-full shadow-sm">
                    {verdictIcon}
                </div>
                <div>
                    <h2 className="text-xl font-bold">{result.verdict_title}</h2>
                    <p className="opacity-90">{result.verdict_description}</p>
                </div>
            </div>

            <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                    <ShieldAlert className="w-4 h-4" />
                    Preference Check
                </h3>

                {/* Unified Conflict Card */}
                <div className={`border rounded-xl p-6 ${isSafe ? 'border-green-200 bg-green-50/30' : 'border-red-200 bg-red-50/30'}`}>

                    {/* Header: User disliked "Custom Blocklist" appearing. 
                        If unsafe, we can just say "Conflicts Found" or rely on body text.
                        Let's use a generic title that covers all cases.
                    */}
                    <div className="flex items-center gap-2 mb-4">
                        {isSafe ? (
                            <Leaf className="w-5 h-5 text-green-600" />
                        ) : (
                            <Ban className="w-5 h-5 text-red-600" />
                        )}
                        <h4 className={`text-lg font-semibold ${isSafe ? 'text-green-900' : 'text-red-900'}`}>
                            {isSafe ? "All Clear!" : "Analysis Report"}
                        </h4>
                    </div>

                    <div className="bg-white border rounded-lg p-5 shadow-sm">
                        {isSafe ? (
                            <p className="text-green-800">
                                This product matches your preferences (
                                {[
                                    ...(result.active_diets || []),
                                    ...(result.allergy_preferences || []),
                                    (result.flagged_ingredients?.length ?? 0) > 0 ? "Custom Avoidance" : null
                                ].filter(Boolean).join(", ")}
                                ).
                            </p>
                        ) : (
                            <div>
                                <p className="text-red-800 font-medium mb-3">
                                    This product conflicts with your preference:
                                </p>
                                <ul className="space-y-2">
                                    {uniqueConflicts.map((c, i) => (
                                        <li key={i} className="flex items-center gap-2 text-red-700 font-medium">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 shrink-0" />
                                            <span className="capitalize">{c}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* 3. Parsed Ingredients List (Bottom for reference) */}
            {(result.ingredients?.length ?? 0) > 0 && (
                <div>
                    <h3 className="text-sm font-semibold mb-3 text-muted-foreground uppercase tracking-wider">Full Ingredient List</h3>
                    <div className="flex flex-wrap gap-2">
                        {result.ingredients?.map((ing, i) => {
                            // Highlight flagged ingredients in the list too
                            const isFlagged = !isSafe && uniqueConflicts.some(h => {
                                // "Honey (Vegan)" includes "Honey"
                                const ingredientName = h.split('(')[0].trim().toLowerCase()
                                return ing.toLowerCase().includes(ingredientName)
                            })

                            // Find confidence score for this ingredient
                            const confidenceData = result.confidence?.ingredients.find(
                                i => i.ingredient.toLowerCase() === ing.toLowerCase() ||
                                    i.ingredient.toLowerCase().includes(ing.toLowerCase())
                            )

                            // Determine confidence color (High > 0.9 = Green, Medium > 0.7 = Yellow, Low = Orange)
                            const confScore = confidenceData?.confidence ?? 1.0;
                            let confColor = "bg-green-500";
                            let confTitle = "High Confidence";

                            if (confScore < 0.8) {
                                confColor = "bg-orange-500";
                                confTitle = "Low Confidence (Check spelling)";
                            } else if (confScore < 0.95) {
                                confColor = "bg-yellow-500";
                                confTitle = "Medium Confidence";
                            }

                            return (
                                <Badge
                                    key={i}
                                    variant={isFlagged ? "destructive" : "outline"}
                                    title={`${ing} - ${confTitle} (${Math.round(confScore * 100)}%)`}
                                    className={`text-sm py-1 px-3 bg-white gap-2 ${isFlagged ? 'border-red-200 text-red-700 hover:bg-red-50' : 'text-foreground'}`}
                                >
                                    {/* Confidence Dot */}
                                    <span className={`w-1.5 h-1.5 rounded-full ${confColor}`} />
                                    {ing}
                                </Badge>
                            )
                        })}
                    </div>
                    {result.confidence && (
                        <div className="mt-2 flex gap-4 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-green-500" /> Verified Match</div>
                            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-yellow-500" /> Fuzzy Match</div>
                            <div className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-orange-500" /> Uncertain</div>
                        </div>
                    )}
                </div>
            )}
        </div>
    )
}

