"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

const ApiDocsPage = () => {
  const router = useRouter()
  // NEXT_PUBLIC_API_BASE will be inlined at build time by Next.js if set.
  const specBase = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000"
  const specUrl = `${specBase.replace(/\/$/, "")}/openapi.yaml`

  useEffect(() => {
    let mounted = true
    const container = document.getElementById("redoc-root")
    if (!container) return
    // Show a quick loading message while we validate the spec URL
    container.innerHTML = `<div style="padding:16px;color:var(--muted)">Loading API docs from ${specUrl}…</div>`

    // First fetch the spec text so we can parse it to an object and call Redoc.init(specObj, opts, container)
    // This avoids ReDoc trying to fetch the YAML itself and removes CORS-related failures.
    fetch(specUrl, { method: "GET" })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => "")
          if (mounted && container.isConnected) {
            container.innerHTML = `<div style="padding:16px;color:var(--danger)">Failed to load spec: ${res.status} ${res.statusText}<pre style="white-space:pre-wrap;color:var(--muted)">${txt}</pre></div>`
          }
          return Promise.reject(new Error(`spec fetch failed: ${res.status}`))
        }

        const specText = await res.text()

        // Load js-yaml (for parsing YAML to JS object) and Redoc, then initialize Redoc with the parsed object.
        const loadScript = (id: string, src: string) => {
          return new Promise<void>((resolve, reject) => {
            const existing = document.getElementById(id) as HTMLScriptElement | null
            if (existing) {
              if ((existing as any)._ready) return resolve()
              existing.addEventListener('load', () => resolve())
              existing.addEventListener('error', () => reject(new Error('script load error')))
              return
            }
            const s = document.createElement('script')
            s.id = id
            s.src = src
            s.async = true
            s.onload = () => { (s as any)._ready = true; resolve() }
            s.onerror = () => reject(new Error(`failed to load ${src}`))
            document.head.appendChild(s)
          })
        }

        try {
          // Load js-yaml then Redoc
          await loadScript('js-yaml', 'https://cdn.jsdelivr.net/npm/js-yaml@4.1.0/dist/js-yaml.min.js')
          await loadScript('redoc-script', 'https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js')

          // Parse YAML to object
          const specObj = (window as any).jsyaml.load(specText)

          // Initialize Redoc directly with the parsed spec object
          if (!mounted) return
          if ((window as any).Redoc && typeof (window as any).Redoc.init === 'function') {
            // clear container only if still connected
            if (container.isConnected) container.innerHTML = ''
            try {
              if (container.isConnected) {
                ;(window as any).Redoc.init(specObj, { scrollYOffset: 64 }, container)
              }
            } catch (err) {
              // ensure we don't throw during navigation
              console.warn('ReDoc.init error (ignored):', err)
            }
          } else {
            if (mounted && container.isConnected) {
              container.innerHTML = "<div style='color:var(--danger);padding:16px'>ReDoc library not available.</div>"
            }
          }
        } catch (err) {
          if (mounted && container.isConnected) {
            container.innerHTML = `<div style="padding:16px;color:var(--danger)">Failed to initialize ReDoc: ${String(err)}</div>`
          }
        }
      })
      .catch((err) => {
        if (mounted && container.isConnected) {
          container.innerHTML = `<div style="padding:16px;color:var(--danger)">Error loading API docs: ${String(err)}</div>`
        }
      })
    
    return () => {
      mounted = false
      // Attempt a safe cleanup: if the container still exists, clear it
      try {
        const c = document.getElementById('redoc-root')
        if (c && c.isConnected) c.innerHTML = ''
      } catch (e) {
        // ignore cleanup errors
      }
    }
  }, [specUrl])

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight text-foreground">API Documentation</h1>
                <p className="text-muted-foreground mt-2">
                    Complete reference for the Untainted API. For access keys, please <a href="/contact" className="text-primary hover:underline">contact sales</a>.
                </p>
            </div>
            <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
                <div id="redoc-root" style={{ minHeight: 600 }} />
            </div>
        </div>
      </div>
      <Footer />
    </>
  )
}

export default ApiDocsPage
