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



  useEffect(() => {
     let isMounted = true;
     let redocContainer: HTMLDivElement | null = null;
     
     // Function to safely init redoc
     const safeInit = () => {
         if ((window as any).Redoc && containerRef.current && isMounted) {
             // Create a fresh container for Redoc that React doesn't know about
             // This prevents React from getting confused if Redoc modifies/removes it
             redocContainer = document.createElement('div');
             containerRef.current.appendChild(redocContainer);
             
             (window as any).Redoc.init(
                spec,
                {
                  scrollYOffset: 64,
                  hideDownloadButton: true,
                  expandResponses: "200,201",
                  requiredPropsFirst: true,
                  nativeScrollbars: true,
                  disableDeepLinks: true,
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
                redocContainer
             )
         }
     }

     if ((window as any).Redoc) {
         safeInit()
     } else {
        // Retry once after short delay just in case script onload race condition
        setTimeout(safeInit, 100)
     }

     return () => {
        isMounted = false;
        
        // Cleanup Redoc
        if ((window as any).Redoc && typeof (window as any).Redoc.destroy === 'function') {
           try {
             (window as any).Redoc.destroy();
           } catch (e) {
             console.error("Redoc destroy failed", e);
           }
        }

        // Manually remove the element we added
        if (redocContainer && containerRef.current) {
            try {
                containerRef.current.removeChild(redocContainer);
            } catch (e) {
                // Ignore if already removed
            }
        }
     }
  }, [spec])
  
  useEffect(() => {
    // Intercept history.replaceState/pushState to prevent Redoc from polluting the URL with hashes
    // even if disableDeepLinks is set (as a failsafe).
    const originalPushState = history.pushState
    const originalReplaceState = history.replaceState

    const allowUrlChange = (url: string | URL | null | undefined): boolean => {
       if (!url) return true
       const urlStr = url.toString()
       // Block Redoc tags/paths
       if (urlStr.includes("#tag") || urlStr.includes("#operation") || urlStr.includes("#model")) {
           return false
       }
       return true
    }

    history.pushState = function(...args) {
      if (allowUrlChange(args[2])) {
        return originalPushState.apply(this, args)
      }
    }

    history.replaceState = function(...args) {
      if (allowUrlChange(args[2])) {
        return originalReplaceState.apply(this, args)
      }
    }

    return () => {
      history.pushState = originalPushState
      history.replaceState = originalReplaceState
      
      // Destroy Redoc instance to remove global event listeners (hashchange, scroll)
      if ((window as any).Redoc && typeof (window as any).Redoc.destroy === 'function') {
        (window as any).Redoc.destroy();
      }
    }
  }, [])

  return (
    <>
      <main className="min-h-screen bg-background pt-0 pb-0">
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
        onLoad={() => {
            // Trigger a re-render or let useEffect pick it up
            // Since useEffect depends on [spec], we can force an update or just rely on the race check
            // Simpler: dispatch a custom event or just set a flag.
            // Actually, best way is to let the component re-render.
            // But for now, we can just manually call the init logic if we were strictly outside React.
            // Since we are inside, best to rely on state or Ref.
            // Let's just force update via state dummy
            setError(null) // This triggers re-render
        }}
        onError={() => setError("Failed to load Redoc script")}
      />
    </>
  )
}
