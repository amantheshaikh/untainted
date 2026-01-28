
import { ParsedProfile } from "./profile-parser"
import { DEMO_PRODUCTS } from "./demo-data"

export type ApiVerdict = {
    status: "safe" | "unsafe" | "caution" | "avoid"
    verdict: {
        title: string
        description: string
    }
    conflicts: Array<{
        ingredient: string
        explanation: string
    }>
    ingredients?: string[]
    confidence?: {
        average: number
        ingredients: Array<{
            ingredient: string
            confidence: number
            match_type: string
        }>
    }
}

const INGREDIENT_DERIVATIVES: Record<string, string[]> = {
    "palm oil": ["palmolein", "palm olein", "palm kernel oil", "palm kernel", "palm fat", "edible vegetable oil (palmolein)", "vegetable oil (palmolein)"],
    "sugar": ["sucrose", "glucose", "fructose", "high fructose corn syrup", "invert sugar syrup", "cane sugar"],
    "msg": ["monosodium glutamate", "e621", "flavour enhancer (e621)"],
    "maida": ["refined wheat flour", "refined flour", "white flour", "all purpose flour", "all-purpose flour"],
}

export const detectConflicts = (product: typeof DEMO_PRODUCTS[0], p: ParsedProfile): ApiVerdict => {
    let status: ApiVerdict["status"] = "safe"
    const conflicts: ApiVerdict["conflicts"] = []

    // Convert ingredients to lowercase set
    const ingredients = product.ingredients.toLowerCase()

    // 1. Check Diets
    if (p.diets.some(d => d.toLowerCase().includes("vegan"))) {
        if (ingredients.includes("milk") || ingredients.includes("ghee") || ingredients.includes("honey")) {
            status = "avoid"
            conflicts.push({
                ingredient: "Milk/Dairy",
                explanation: "Contains animal-derived ingredients."
            })
        }
    }
    if (p.diets.some(d => d.toLowerCase().includes("jain"))) {
        if (ingredients.includes("onion") || ingredients.includes("garlic") || ingredients.includes("potato")) {
            status = "avoid"
            conflicts.push({
                ingredient: "Root Vegetables",
                explanation: "Contains onion, garlic, or root vegetables forbidden in Jain diet."
            })
        }
    }

    // 2. Check Health
    if (p.health.some(h => h.toLowerCase().includes("diabetic"))) {
        if ((product.nutrition.sugar || 0) > 5) {
            status = status === "avoid" ? "avoid" : "caution"
            conflicts.push({
                ingredient: "High Sugar",
                explanation: `${product.nutrition.sugar}g sugar per 100g exceeds recommended daily limits.`
            })
        }
    }

    // 3. Custom Avoidances (with derivative matching)
    p.customTerms.forEach(term => {
        const termLower = term.toLowerCase()

        // Direct match
        if (ingredients.includes(termLower)) {
            status = "avoid"
            conflicts.push({
                ingredient: term,
                explanation: `Direct match for your avoidance of "${term}".`
            })
            return
        }

        // Check derivatives
        const derivatives = INGREDIENT_DERIVATIVES[termLower] || []
        for (const derivative of derivatives) {
            if (ingredients.includes(derivative)) {
                status = "avoid"
                conflicts.push({
                    ingredient: derivative.charAt(0).toUpperCase() + derivative.slice(1),
                    explanation: `Contains "${derivative}" which is derived from ${term}.`
                })
                return
            }
        }
    })

    if (p.allergies.some(a => a.toLowerCase().includes("nut") || a.toLowerCase().includes("peanut"))) {
        if (ingredients.includes("nut") || ingredients.includes("peanut") || ingredients.includes("almond")) {
            status = "avoid"
            conflicts.push({
                ingredient: "Nuts",
                explanation: "Contains nut-based ingredients."
            })
        }
    }

    return {
        status,
        verdict: {
            title: status === "safe" ? "Green Light" : (status === "caution" ? "Proceed with Caution" : "Not Recommended"),
            description: status === "safe"
                ? "Based on our analysis, this product matches your profile."
                : "We found ingredients that conflict with your preferences."
        },
        conflicts
    }
}
