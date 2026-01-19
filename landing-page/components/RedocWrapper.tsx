"use client"

import { useEffect, useRef, useState } from "react"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

interface RedocWrapperProps {
  spec: object
}

export const RedocWrapper = ({ spec }: RedocWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const loadRedoc = async () => {
      try {
        // Load Redoc script dynamically if not present
        if (!document.getElementById("redoc-script")) {
          const script = document.createElement("script")
          script.id = "redoc-script"
          script.src = "https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"
          script.async = true
          document.head.appendChild(script)

          await new Promise((resolve, reject) => {
            script.onload = resolve
            script.onerror = () => reject(new Error("Failed to load Redoc script"))
          })
        } else if (!(window as any).Redoc) {
            // Script exists but might not be ready, wait a bit
             await new Promise((resolve) => setTimeout(resolve, 500))
        }

        if ((window as any).Redoc) {
          (window as any).Redoc.init(
            spec,
            {
              scrollYOffset: 64,
              theme: {
                colors: {
                  primary: {
                    main: "hsl(var(--primary))",
                  },
                },
                typography: {
                  fontFamily: "var(--font-inter)",
                  headings: {
                    fontFamily: "var(--font-figtree)",
                  },
                },
              },
            },
            containerRef.current
          )
        }
      } catch (err) {
        setError(String(err))
      }
    }

    loadRedoc()
  }, [spec])

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-background pt-24 pb-12">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold tracking-tight text-foreground">API Documentation</h1>
            <p className="text-muted-foreground mt-2">
              Complete reference for the Untainted API. For access keys, please{" "}
              <a href="/contact" className="text-primary hover:underline">
                contact sales
              </a>
              .
            </p>
          </div>
          
          <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden" role="main" aria-label="API Documentation Content">
             {error ? (
                <div className="p-4 text-destructive">Failed to load API docs: {error}</div>
             ) : (
                <div ref={containerRef} style={{ minHeight: 600 }} />
             )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
