"use client"

import { useEffect, useState } from "react"
import { supabase } from "../../lib/supabaseClient"
import { ProfileNavbar } from "@/components/layout/ProfileNavbar"
import { Footer } from "@/components/layout/Footer"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { MultiSelectIngredients, Ingredient } from "@/components/ui/multi-select-ingredients"

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

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)

  // Local state for form fields
  const [name, setName] = useState("")
  const [selectedDiets, setSelectedDiets] = useState<string[]>([])
  const [selectedHealth, setSelectedHealth] = useState<string[]>([])
  const [selectedAllergies, setSelectedAllergies] = useState<string[]>([])
  const [customAvoidance, setCustomAvoidance] = useState<Ingredient[]>([])

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
          // Initialize local state from profile_json
          setName(data.name || "")
          const json = data.profile_json || {}
          setSelectedDiets(Array.isArray(json.dietary_preferences) ? json.dietary_preferences : [])
          setSelectedHealth(Array.isArray(json.health_restrictions) ? json.health_restrictions : [])
          setSelectedAllergies(Array.isArray(json.allergies) ? json.allergies : [])
          setCustomAvoidance(Array.isArray(json.custom_avoidance) ? json.custom_avoidance : [])
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
        alert("Profile saved!")
    }
    setSaving(false)
  }

  if (loading) return (
    <>
      <ProfileNavbar />
      <div className="min-h-screen pt-32 px-6 flex justify-center text-muted-foreground">Loading profile...</div>
      <Footer />
    </>
  )

  if (error && error !== "Not signed in") return (
    <>
      <ProfileNavbar />
      <div className="min-h-screen pt-32 px-6 flex justify-center text-destructive">{error}</div>
      <Footer />
    </>
  )

  return (
    <>
      <ProfileNavbar />
      <div className="min-h-screen pt-32 pb-20 bg-background">
        <div className="max-w-3xl mx-auto px-6">
          <div className="mb-10">
            <h1 className="text-3xl font-bold text-foreground mb-2">Your Food Profile</h1>
            <p className="text-muted-foreground">
              Customize your dietary needs. This data is used to personalize your food analysis across platforms.
            </p>
          </div>

          <div className="bg-card rounded-2xl border border-border p-8 shadow-sm space-y-8">
            
            {/* Name Section */}
            <div className="space-y-3">
              <Label htmlFor="name" className="text-base">Display Name</Label>
              <Input 
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="How should we address you?" 
                className="max-w-md"
              />
            </div>

            <div className="h-px bg-border my-6" />

            {/* Dietary Preferences */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <span className="text-xl">🥗</span>
                 <h2 className="text-lg font-semibold">Dietary Preferences</h2>
              </div>
              <p className="text-sm text-muted-foreground">Select all that apply to your lifestyle.</p>
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

            <div className="h-px bg-border my-6" />

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

            <div className="h-px bg-border my-6" />

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

            <div className="h-px bg-border my-6" />

            {/* Custom Ingredients */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                 <span className="text-xl">🚫</span>
                 <h2 className="text-lg font-semibold">Custom Avoidance List</h2>
              </div>
              <p className="text-sm text-muted-foreground">Search and add specific ingredients or additives you want to avoid (e.g., "Red 40", "Palm Oil").</p>
              <MultiSelectIngredients 
                 selected={customAvoidance}
                 onChange={setCustomAvoidance}
              />
            </div>

            <div className="pt-6 flex justify-end">
              <Button 
                onClick={saveProfile} 
                disabled={saving}
                className="px-8 text-base py-6 rounded-xl"
              >
                {saving ? "Saving..." : "Save Profile"}
              </Button>
            </div>

          </div>
        </div>
      </div>
      <Footer />
    </>
  )
}
