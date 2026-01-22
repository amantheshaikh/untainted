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
        <div className="bg-card w-full" role="main" aria-label="API Documentation Content">
           <RedocStandalone
              spec={spec}
              specUrl={specUrl}
              options={{
                scrollYOffset: 80, // Slightly more offset for breathing room
                hideDownloadButton: true,
                expandResponses: "200,201",
                requiredPropsFirst: true,
                nativeScrollbars: true, // Revert to true, better for window scrolling usually
                disableDeepLinks: false, // Enable deep links for better navigation
                theme: {
                    spacing: {
                        sectionVertical: 32, // More breathing room
                    },
                    colors: {
                      primary: {
                        main: "#D65D26", // Brand Orange
                      },
                      text: {
                        primary: "#1a1a1a",
                        secondary: "#666666",
                      },
                      success: {
                        main: "#10b981", // Emerald 500
                      },
                      http: {
                        get: "#3b82f6", // Blue 500
                        post: "#10b981", // Emerald 500
                        put: "#f59e0b", // Amber 500
                        delete: "#ef4444", // Red 500
                      },
                    },
                    sidebar: {
                        backgroundColor: "#fafafa",
                        textColor: "#333333",
                        activeTextColor: "#D65D26",
                        width: "280px",
                    },
                    rightPanel: {
                        backgroundColor: "#1e1e1e", // Dark code panel
                        textColor: "#ffffff",
                        width: "40%",
                    },
                    codeBlock: {
                        backgroundColor: "#2d2d2d",
                    },
                    typography: {
                      fontFamily: "var(--font-inter), system-ui, sans-serif",
                      fontSize: "15px",
                      lineHeight: "1.6",
                      headings: {
                        fontFamily: "var(--font-figtree), system-ui, sans-serif",
                        fontWeight: "700",
                        lineHeight: "1.3",
                      },
                      code: {
                        fontFamily: "var(--font-mono), monospace",
                        fontSize: "13px",
                      }
                    },
                  },
              }}
           />
        </div>
      </div>
    </main>
  )
}
