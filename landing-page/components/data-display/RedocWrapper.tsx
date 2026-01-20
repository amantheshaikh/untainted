"use client"

import { RedocStandalone } from 'redoc';

interface RedocWrapperProps {
  specUrl?: string
  spec?: object
}

export const RedocWrapper = ({ spec, specUrl = "/openapi.yaml" }: RedocWrapperProps) => {
  return (
    <main className="min-h-screen bg-background pt-0 pb-0">
      <div className="w-full">
        <div className="bg-card border-t border-border shadow-sm overflow-hidden" role="main" aria-label="API Documentation Content">
           <RedocStandalone
              spec={spec}
              specUrl={specUrl}
              options={{
                scrollYOffset: 64,
                hideDownloadButton: true,
                expandResponses: "200,201",
                requiredPropsFirst: true,
                nativeScrollbars: true,
                disableDeepLinks: true,
                theme: {
                    colors: {
                      primary: {
                        main: "#D65D26", // Primary Orange
                      },
                    },
                    typography: {
                      fontFamily: "var(--font-inter)",
                      headings: {
                        fontFamily: "var(--font-figtree)",
                        fontWeight: "700",
                      },
                    },
                  },
              }}
           />
        </div>
      </div>
    </main>
  )
}
