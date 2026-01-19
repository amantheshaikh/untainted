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
    // In Next.js, 'public' files are served at root path. 
    // During build/SSR, we might need absolute URL, but relative fetch often works or we use FS.
    // Ideally, for Redoc, we might just pass the URL specUrl to RedocWrapper if it supports it, 
    // but RedocWrapper takes an object.
    
    // Let's rely on the deployed URL structure.
    // If running reliably on Vercel, we can assume https://<domain>/openapi.yaml
    // BUT we don't know the domain at build time easily.
    
    // BETTER approach: Read file directly using fs since we are in a Server Component!
    // This avoids network fetch issues during build/runtime for local files.
    const fs = await import('fs')
    const path = await import('path')
    const filePath = path.join(process.cwd(), 'public', 'openapi.yaml')
    const text = fs.readFileSync(filePath, 'utf-8')
    spec = yaml.load(text) as object

  } catch (error) {
    console.error("Failed to load OpenAPI spec from public/openapi.yaml:", error)
    spec = { 
        openapi: "3.0.0", 
        info: { title: "Error Loading Spec", version: "1.0.0" },
        paths: {} 
    }
  }

  return <RedocWrapper spec={spec} />
}
