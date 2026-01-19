import { RedocWrapper } from "@/components/RedocWrapper"
import yaml from "js-yaml"

export const metadata = {
  title: "API Reference - Untainted Docs",
  description: "Complete API reference for Untainted's product intelligence platform.",
}

// Ensure this is a server component
export default async function ApiReferencePage() {
  let spec = {}
  
  try {
    const specUrl = process.env.NEXT_PUBLIC_API_BASE 
        ? `${process.env.NEXT_PUBLIC_API_BASE.replace(/\/$/, "")}/openapi.yaml` 
        : "https://api.untainted.io/openapi.yaml"
    
    // Fetch directly from backend to ensure we get the latest
    const res = await fetch(specUrl, { cache: "no-store" })
    if (!res.ok) {
        throw new Error(`Failed to fetch spec: ${res.status}`)
    }
    const text = await res.text()
    spec = yaml.load(text) as object
  } catch (error) {
    console.error("Failed to load OpenAPI spec:", error)
     // Fallback or error state passed to client
    spec = { 
        openapi: "3.0.0", 
        info: { title: "Error Loading Spec", version: "1.0.0" },
        paths: {} 
    }
  }

  return <RedocWrapper spec={spec} />
}
