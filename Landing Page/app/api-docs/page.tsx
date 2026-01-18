"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

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
    <div className="w-full bg-background min-h-screen">
      <header className="w-full border-b border-border bg-card">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-3 flex items-center gap-4">
          <button
            onClick={() => router.push('/')}
            className="inline-flex items-center gap-3 text-sm font-medium"
            aria-label="Go to Untainted home"
          >
            <img src="/images/full-20logo.png" alt="Untainted" className="h-8" />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 lg:px-8 py-8">
        <div id="redoc-root" style={{ minHeight: 400 }} />
      </main>
    </div>
  )
}

export default ApiDocsPage
