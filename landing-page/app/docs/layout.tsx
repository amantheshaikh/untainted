import Link from "next/link"
import yaml from "js-yaml"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { DocsSidebar } from "@/components/DocsSidebar"
import { DocsMobileNav } from "@/components/DocsMobileNav"

async function getApiNavigation() {
  try {
     const specUrl = process.env.NEXT_PUBLIC_API_BASE 
        ? `${process.env.NEXT_PUBLIC_API_BASE.replace(/\/$/, "")}/openapi.yaml` 
        : "https://api.untainted.io/openapi.yaml"
    
    // Cache for 1 hour to avoid hitting backend on every nav render, but allow updates
    const res = await fetch(specUrl, { next: { revalidate: 3600 } })
    if (!res.ok) return []

    const text = await res.text()
    const spec = yaml.load(text) as any
    
    if (!spec.paths) return []

    const groups: Record<string, any[]> = {}
    
    // Helper to process operations
    Object.entries(spec.paths).forEach(([path, methods]: [string, any]) => {
      Object.entries(methods).forEach(([method, op]: [string, any]) => {
        if (method === 'parameters' || method === 'summary') return
        
        // Use first tag or 'Other'
        const tag = op.tags?.[0] || 'Other'
        const operationId = op.operationId
        const title = op.summary || path
        
        if (!groups[tag]) groups[tag] = []
        
        if (operationId) {
             groups[tag].push({
                title,
                href: `/docs/api-reference#operation/${operationId}`
             })
        }
      })
    })

    // Fixed order for tags? Or just Object.entries
    // Let's define a priority order if we want, otherwise alphabetize or random
    const preferredOrder = ["Analysis", "Products", "System"]
    
    return Object.entries(groups)
        .sort(([a], [b]) => {
             const idxA = preferredOrder.indexOf(a)
             const idxB = preferredOrder.indexOf(b)
             if (idxA !== -1 && idxB !== -1) return idxA - idxB
             if (idxA !== -1) return -1
             if (idxB !== -1) return 1
             return a.localeCompare(b)
        })
        .map(([title, items]) => ({
            title,
            items
        }))

  } catch (e) {
    console.error("Failed to build docs navigation", e)
    return []
  }
}

export default async function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const apiNavigation = await getApiNavigation()

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-8 pt-20">
        <div className="lg:flex lg:gap-12">
          <DocsSidebar apiNavigation={apiNavigation} />
          <DocsMobileNav apiNavigation={apiNavigation} />
          <main className="flex-1 py-8 min-w-0">
             <div className="prose prose-stone dark:prose-invert max-w-none">
                {children}
             </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
