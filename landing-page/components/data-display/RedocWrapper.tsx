"use client"

import { RedocStandalone } from 'redoc';

interface RedocWrapperProps {
  specUrl?: string
  spec?: object
}

export const RedocWrapper = ({ spec, specUrl = "/openapi.yaml" }: RedocWrapperProps) => {
  return (
    <main className="min-h-screen bg-background">
      <div className="w-full">
        <div className="bg-card w-full" role="main" aria-label="API Documentation Content">
           <RedocStandalone
              spec={spec}
              specUrl={specUrl}
              options={{
                scrollYOffset: 80,
                hideDownloadButton: false,
                expandResponses: "200,201",
                requiredPropsFirst: true,
                sortPropsAlphabetically: false,
                nativeScrollbars: true,
                pathInMiddlePanel: true,
                hideHostname: false,
                expandSingleSchemaField: true,
                jsonSampleExpandLevel: 2,
                hideSingleRequestSampleTab: true,
                theme: {
                    spacing: {
                        unit: 5,
                        sectionHorizontal: 40,
                        sectionVertical: 40,
                    },
                    breakpoints: {
                        small: '50rem',
                        medium: '75rem',
                        large: '105rem',
                    },
                    colors: {
                      primary: {
                        main: "#D65D26",
                        light: "#E87A4A",
                        dark: "#B84A1C",
                        contrastText: "#ffffff",
                      },
                      success: {
                        main: "#10b981",
                        light: "#34d399",
                        dark: "#059669",
                        contrastText: "#ffffff",
                      },
                      warning: {
                        main: "#f59e0b",
                        light: "#fbbf24",
                        dark: "#d97706",
                        contrastText: "#000000",
                      },
                      error: {
                        main: "#ef4444",
                        light: "#f87171",
                        dark: "#dc2626",
                        contrastText: "#ffffff",
                      },
                      text: {
                        primary: "#1a1a1a",
                        secondary: "#525252",
                      },
                      border: {
                        dark: "#e5e5e5",
                        light: "#f5f5f5",
                      },
                      responses: {
                        success: {
                          color: "#059669",
                          backgroundColor: "#ecfdf5",
                          tabTextColor: "#065f46",
                        },
                        error: {
                          color: "#dc2626",
                          backgroundColor: "#fef2f2",
                          tabTextColor: "#991b1b",
                        },
                        redirect: {
                          color: "#d97706",
                          backgroundColor: "#fffbeb",
                          tabTextColor: "#92400e",
                        },
                        info: {
                          color: "#2563eb",
                          backgroundColor: "#eff6ff",
                          tabTextColor: "#1e40af",
                        },
                      },
                      http: {
                        get: "#3b82f6",
                        post: "#10b981",
                        put: "#f59e0b",
                        options: "#6b7280",
                        patch: "#8b5cf6",
                        delete: "#ef4444",
                        basic: "#6b7280",
                        link: "#0ea5e9",
                        head: "#6b7280",
                      },
                    },
                    sidebar: {
                        width: "280px",
                        backgroundColor: "#fafafa",
                        textColor: "#404040",
                        activeTextColor: "#D65D26",
                        groupItems: {
                          activeBackgroundColor: "#fff7ed",
                          activeTextColor: "#D65D26",
                          textTransform: "none",
                        },
                        level1Items: {
                          activeBackgroundColor: "#fff7ed",
                          activeTextColor: "#D65D26",
                          textTransform: "none",
                        },
                        arrow: {
                          size: "1.2em",
                          color: "#9ca3af",
                        },
                    },
                    rightPanel: {
                        backgroundColor: "#18181b",
                        textColor: "#fafafa",
                        width: "40%",
                        servers: {
                          overlay: {
                            backgroundColor: "#27272a",
                            textColor: "#fafafa",
                          },
                          url: {
                            backgroundColor: "#3f3f46",
                          },
                        },
                    },
                    codeBlock: {
                        backgroundColor: "#27272a",
                    },
                    typography: {
                      fontFamily: "var(--font-inter), -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                      fontSize: "15px",
                      lineHeight: "1.6",
                      fontWeightRegular: "400",
                      fontWeightBold: "600",
                      fontWeightLight: "300",
                      headings: {
                        fontFamily: "var(--font-figtree), -apple-system, BlinkMacSystemFont, system-ui, sans-serif",
                        fontWeight: "700",
                        lineHeight: "1.3",
                      },
                      code: {
                        fontFamily: "var(--font-mono), 'SF Mono', 'Fira Code', Menlo, monospace",
                        fontSize: "13px",
                        fontWeight: "400",
                        color: "#D65D26",
                        backgroundColor: "#fff7ed",
                        wrap: true,
                      },
                      links: {
                        color: "#D65D26",
                        visited: "#B84A1C",
                        hover: "#E87A4A",
                        textDecoration: "none",
                        hoverTextDecoration: "underline",
                      },
                    },
                    logo: {
                      maxHeight: "48px",
                      maxWidth: "200px",
                      gutter: "20px",
                    },
                  },
              }}
           />
        </div>
      </div>
    </main>
  )
}
