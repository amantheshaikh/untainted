
export type ParsedProfile = {
  diets: string[]
  health: string[]
  allergies: string[]
  customTerms: string[]
  novaPreference?: string
}

export function parseDietaryProfile(text: string): ParsedProfile {
  const t = text.toLowerCase()
  const result: ParsedProfile = {
    diets: [],
    health: [],
    allergies: [],
    customTerms: [],
    novaPreference: "no_preference",
  }

  // --- Dietary Preferences ---
  if (t.includes("vegan") || t.includes("plant based") || t.includes("plant-based")) {
    result.diets.push("Vegan")
  } else if (t.includes("vegetarian") || t.includes("meat free") || t.includes("no meat")) {
    result.diets.push("Vegetarian")
  }

  if (t.includes("jain")) result.diets.push("Jain")
  if (t.includes("keto") || t.includes("ketogenic")) result.diets.push("Keto")
  if (t.includes("paleo")) result.diets.push("Paleo")
  if (t.includes("sattvic")) result.diets.push("Sattvic")
  if (t.includes("aip") || t.includes("auto immune") || t.includes("autoimmune")) result.diets.push("Auto Immune Protocol")

  // --- Allergies ---
  if (t.includes("gluten") || t.includes("celiac") || t.includes("wheat")) result.allergies.push("Gluten")
  if (t.includes("dairy") || t.includes("lactose") || t.includes("milk")) result.allergies.push("Dairy")
  if (t.includes("nut") || t.includes("peanut") || t.includes("almond")) result.allergies.push("Nut")
  if (t.includes("soy") || t.includes("soya")) result.allergies.push("Soy")
  if (t.includes("egg")) result.allergies.push("Egg")
  if (t.includes("shellfish") || t.includes("shrimp") || t.includes("crab")) result.allergies.push("Shellfish")
  if (t.includes("fish") || t.includes("seafood")) result.allergies.push("Fish")
  if (t.includes("sesame") || t.includes("til")) result.allergies.push("Sesame")

  // --- Health Restrictions ---
  if (t.includes("diabet") || t.includes("sugar") || t.includes("insulin")) result.health.push("Diabetic-Friendly")
  if (t.includes("fodmap") || t.includes("ibs")) result.health.push("Low FODMAP")
  if (t.includes("maida") || t.includes("refined flour")) result.health.push("No Maida")
  if (t.includes("onion") || t.includes("garlic")) result.health.push("No Onion-Garlic")
  // Note: Jain implies No Onion-Garlic, but we'll let the user verify specific checks or handle it in UI logic if needed.
  // For now, explicit "Jain" sets Jain diet.

  // --- NOVA / Clean Eating ---
  if (t.includes("clean eating") || t.includes("ultra processed") || t.includes("processed food") || t.includes("nova 4") || t.includes("junk food")) {
    result.novaPreference = "avoid_nova_4"
  }

  // --- Custom Extraction ---
  // Simple heuristic to catch "avoid [x]", "allergic to [x]", "no [x]"
  // This is a naive implementation; a real NLP model would be better.
  const customPatterns = [
    /avoid\s+([a-z\s]+?)(?:$|[.,;]|\s+(?:and|because|due))/g,
    /allergic to\s+([a-z\s]+?)(?:$|[.,;]|\s+(?:and|because|due))/g,
    /no\s+([a-z\s]+?)(?:$|[.,;]|\s+(?:and|because|due))/g,
  ]

  const knownKeywords = new Set([
    "meat", "dairy", "gluten", "sugar", "salt", "onion", "garlic", "maida", "wheat", "milk", "egg", "fish", "shellfish", "soy", "treenut", "peanut", "sesame"
  ])

  const customTerms: string[] = []

  customPatterns.forEach(pattern => {
    let match
    while ((match = pattern.exec(t)) !== null) {
      const term = match[1].trim()
      // Filter out short words and known keywords that we already handled with checkboxes
      if (term.length > 2 && !knownKeywords.has(term) && !term.includes("added sugar")) {
        customTerms.push(term)
      }
    }
  })

  // Deduplicate
  result.customTerms = Array.from(new Set(customTerms))

  return result
}
