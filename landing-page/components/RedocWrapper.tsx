"use client"

import { useEffect, useRef, useState } from "react"
import Script from "next/script"
import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

interface RedocWrapperProps {
  spec: object
}

export const RedocWrapper = ({ spec }: RedocWrapperProps) => {
  const containerRef = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)

  const initRedoc = () => {
    if ((window as any).Redoc && containerRef.current) {
      (window as any).Redoc.init(
        spec,
        {
          scrollYOffset: 64,
          theme: {
            colors: {
              primary: {
                main: "#D65D26",
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
  }

  useEffect(() => {
      // If script is already loaded (e.g. navigation between pages), init manually
      if ((window as any).Redoc) {
          initRedoc()
      }
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
      <Script 
        src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"
        strategy="lazyOnload"
        onLoad={initRedoc}
        onError={() => setError("Failed to load Redoc script")}
      />
      <Footer />
    </>
  )
}
