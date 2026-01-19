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
          hideDownloadButton: true,
          expandResponses: "200,201",
          requiredPropsFirst: true,
          nativeScrollbars: true,
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
      <main className="min-h-screen bg-background pt-16 pb-0">
        <div className="w-full">
          <div className="bg-card border-t border-border shadow-sm overflow-hidden" role="main" aria-label="API Documentation Content">
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
