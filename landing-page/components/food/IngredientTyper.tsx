"use client"

import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

interface IngredientTyperProps {
    value: string
    onChange: (val: string) => void
    onAnalyze: () => void
    isAnalyzing: boolean
}

export function IngredientTyper({ value, onChange, onAnalyze, isAnalyzing }: IngredientTyperProps) {
    return (
        <div className="space-y-4">
            <Textarea
                placeholder="Paste ingredients here... e.g. 'Whole Wheat Flour, Water, Sugar, Yeast, Salt'"
                className="min-h-[150px] p-4 text-base leading-relaxed resize-none"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
            <div className="flex justify-end">
                <Button
                    onClick={onAnalyze}
                    disabled={!value.trim() || isAnalyzing}
                    size="lg"
                    className="w-full sm:w-auto"
                >
                    {isAnalyzing ? "Analyzing..." : (
                        <>
                            <Search className="w-4 h-4 mr-2" />
                            Analyze Ingredients
                        </>
                    )}
                </Button>
            </div>
        </div>
    )
}
