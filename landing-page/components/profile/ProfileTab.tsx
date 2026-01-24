"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MultiSelectIngredients, Ingredient } from "@/components/ui/multi-select-ingredients"
import { Textarea } from "@/components/ui/textarea"
import { Sparkles, Save } from "lucide-react"
import { parseDietaryProfile } from "../../lib/profile-parser"

type Profile = {
    id?: string
    name?: string
    profile_json?: any
}

// Full list of options derived from landing page analysis
const DIETARY_PREFERENCES = [
    "Vegan",
    "Vegetarian",
    "Jain",
    "Sattvic",
    "Keto",
    "Paleo",
]

const HEALTH_RESTRICTIONS = [
    "Clean Eating",
    "Diabetic-Friendly",
    "Low FODMAP",
    "No Maida",
    "No Onion-Garlic",
]

const ALLERGIES = [
    "Gluten",
    "Dairy",
    "Nut",
    "Soy",
    "Egg",
    "Shellfish",
    "Fish",
    "Sesame",
]

export function ProfileTab() {
    const [profile, setProfile] = useState<Profile | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)

    // Local state for form fields
    const [name, setName] = useState("")
    const [bioInput, setBioInput] = useState("")
    const [isAnalyzing, setIsAnalyzing] = useState(false)

    const [selectedDiets, setSelectedDiets] = useState<string[]>([])
    const [selectedHealth, setSelectedHealth] = useState<string[]>([])
    const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])
    const [customAvoidance, setCustomAvoidance] = useState<Ingredient[]>([])

    const handleAnalyzeBio = async () => {
        setIsAnalyzing(true)

        // Simulate initial parsing delay
        await new Promise(r => setTimeout(r, 600))

        const result = parseDietaryProfile(bioInput)

        // 1. Reset & Set structured tags
        // Overwrite previous selections to ensure clean state as requested
        setSelectedDiets(result.diets)
        setSelectedHealth(result.health)
        setSelectedAllergies(result.allergies)

        // 2. Process Custom Terms (Async Ingredient Match)
        if (result.customTerms.length > 0) {
            const matchedIngredients: Ingredient[] = []

            for (const term of result.customTerms) {
                try {
                    // Fetch from our API
                    const res = await fetch(`/api/ingredients/search?q=${encodeURIComponent(term)}`)
                    if (res.ok) {
                        const data = await res.json()
                        // If we find a good match (results[0]), add it.
                        // We only take the first result as the "best guess".
                        if (data.results && data.results.length > 0) {
                            const topMatch = data.results[0]
                            matchedIngredients.push(topMatch)
                        }
                    }
                } catch (err) {
                    console.error("Error matching ingredient:", term, err)
                }
            }

            // Set custom avoidance list
            setCustomAvoidance(matchedIngredients)
        } else {
            // If no custom terms, clear the list (part of the "reset" requirement)
            setCustomAvoidance([])
        }

        setIsAnalyzing(false)
    }

    useEffect(() => {
        let mounted = true
        async function load() {
            setLoading(true)
            const user = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null
            if (!user) {
                setError("Not signed in")
                setLoading(false)
                return
            }
            const { data, error } = await supabase.from("profiles").select("*").eq("user_id", user.id).limit(1).single()

            if (mounted) {
                if (error && error.code !== "PGRST100") {
                    setError(error.message)
                } else if (data) {
                    setProfile(data)
                    // Prioritize profile name, fallback to auth metadata, then email
                    const displayName = data.name || user.user_metadata?.full_name || user.email?.split('@')[0] || "Friend"
                    setName(displayName)

                    const json = data.profile_json || {}
                    setSelectedDiets(Array.isArray(json.dietary_preferences) ? json.dietary_preferences : [])
                    setSelectedHealth(Array.isArray(json.health_restrictions) ? json.health_restrictions : [])
                    setSelectedAllergies(Array.isArray(json.allergies) ? json.allergies : [])
                    setCustomAvoidance(Array.isArray(json.custom_avoidance) ? json.custom_avoidance : [])
                } else {
                    // New profile case
                    const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || "Friend"
                    setName(displayName)
                }
                setLoading(false)
            }
        }
        load()
        return () => {
            mounted = false
        }
    }, [])

    const toggleSelection = (item: string, list: string[], setList: (l: string[]) => void) => {
        if (list.includes(item)) {
            setList(list.filter((i) => i !== item))
        } else {
            setList([...list, item])
        }
    }

    async function saveProfile() {
        setSaving(true)
        const user = supabase.auth.getUser ? (await supabase.auth.getUser()).data.user : null
        if (!user) {
            setError("Not signed in")
            setSaving(false)
            return
        }

        const profileJson = {
            dietary_preferences: selectedDiets,
            health_restrictions: selectedHealth,
            allergies: selectedAllergies,
            custom_avoidance: customAvoidance
        }

        const payload = {
            user_id: user.id,
            name: name,
            profile_json: profileJson,
        }

        let err = null
        if (profile && profile.id) {
            const { error } = await supabase.from("profiles").update(payload).eq("id", profile.id)
            err = error
        } else {
            const { error } = await supabase.from("profiles").insert(payload)
            err = error
        }

        if (err) {
            setError(err.message)
        } else {
            // Optional: Toast or feedback?
        }
        setSaving(false)
    }

    if (loading) return <div className="p-12 text-center text-muted-foreground">Loading profile...</div>

    if (error && error !== "Not signed in") return <div className="p-12 text-center text-destructive">{error}</div>

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">

            {/* Header inside tab */}
            <div>
                <h2 className="text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                    {name ? `Welcome back, ${name}!` : 'Welcome back!'}
                </h2>
                <p className="text-muted-foreground text-lg">Manage your dietary preferences and health goals.</p>
            </div>

            <div className="h-px bg-border/50" />

            {/* AI Builder Section */}
            <div className="space-y-4 bg-primary/5 p-6 rounded-xl border border-primary/10">
                <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-primary" />
                    <h2 className="text-lg font-semibold text-primary">Nutrition Intelligence Builder</h2>
                </div>
                <p className="text-sm text-foreground/80">
                    Describe your needs in plain English, and we'll build your profile automatically.
                </p>
                <div className="space-y-3">
                    <Textarea
                        value={bioInput}
                        onChange={(e) => setBioInput(e.target.value)}
                        placeholder='e.g., "I am a vegan with a severe peanut allergy. I also try to avoid gluten and high sugar foods because of a family history of diabetes."'
                        className="bg-background min-h-[100px] border-primary/20 focus-visible:ring-primary"
                    />
                    <Button
                        onClick={handleAnalyzeBio}
                        disabled={!bioInput || isAnalyzing}
                        variant="secondary"
                        className="w-full sm:w-auto"
                    >
                        {isAnalyzing ? "Analyzing..." : "Auto-Fill Profile ✨"}
                    </Button>
                </div>
            </div>

            <div className="h-px bg-border/50" />

            {/* Dietary Preferences */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🥗</span>
                    <h2 className="text-lg font-semibold">Dietary Preferences</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {DIETARY_PREFERENCES.map((pref) => (
                        <div key={pref} className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:bg-secondary/50 transition-colors">
                            <Checkbox
                                id={`diet-${pref}`}
                                checked={selectedDiets.includes(pref)}
                                onCheckedChange={() => toggleSelection(pref, selectedDiets, setSelectedDiets)}
                            />
                            <Label htmlFor={`diet-${pref}`} className="font-normal cursor-pointer flex-1">{pref}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-px bg-border/50" />

            {/* Health Goals/Restrictions */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-xl">❤️</span>
                    <h2 className="text-lg font-semibold">Health Goals & Restrictions</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {HEALTH_RESTRICTIONS.map((res) => (
                        <div key={res} className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:bg-secondary/50 transition-colors">
                            <Checkbox
                                id={`health-${res}`}
                                checked={selectedHealth.includes(res)}
                                onCheckedChange={() => toggleSelection(res, selectedHealth, setSelectedHealth)}
                            />
                            <Label htmlFor={`health-${res}`} className="font-normal cursor-pointer flex-1">{res}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-px bg-border/50" />

            {/* Allergies */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-xl">⚠️</span>
                    <h2 className="text-lg font-semibold">Allergies & Sensitivities</h2>
                </div>
                <p className="text-sm text-muted-foreground">Ingredients you absolutely need to avoid.</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {ALLERGIES.map((allergy) => (
                        <div key={allergy} className="flex items-center space-x-3 p-3 rounded-lg border border-transparent hover:bg-secondary/50 transition-colors">
                            <Checkbox
                                id={`allergy-${allergy}`}
                                checked={selectedAllergies.includes(allergy)}
                                onCheckedChange={() => toggleSelection(allergy, selectedAllergies, setSelectedAllergies)}
                            />
                            <Label htmlFor={`allergy-${allergy}`} className="font-normal cursor-pointer flex-1">{allergy}</Label>
                        </div>
                    ))}
                </div>
            </div>

            <div className="h-px bg-border/50" />

            {/* Custom Ingredients */}
            <div className="space-y-4">
                <div className="flex items-center gap-2">
                    <span className="text-xl">🚫</span>
                    <h2 className="text-lg font-semibold">Custom Avoidance List</h2>
                </div>
                <p className="text-sm text-muted-foreground">Search and add specific ingredients or additives you want to avoid.</p>
                <MultiSelectIngredients
                    selected={customAvoidance}
                    onChange={setCustomAvoidance}
                />
            </div>

            <div className="sticky bottom-4 flex justify-end">
                <Button
                    onClick={saveProfile}
                    disabled={saving}
                    className="px-8 text-base py-6 rounded-xl shadow-lg"
                >
                    <Save className="w-5 h-5 mr-2" />
                    {saving ? "Saving..." : "Save Profile"}
                </Button>
            </div>

        </div>
    )
}
