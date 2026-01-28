import type React from "react"
import type { Metadata } from "next"
import { Figtree, Inter, Geist_Mono } from "next/font/google"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

const figtree = Figtree({
  subsets: ["latin"],
  variable: "--font-figtree",
  weight: ["400", "500", "600", "700"],
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

const geistMono = Geist_Mono({
  subsets: ["latin"],
  variable: "--font-geist-mono",
  weight: ["400", "500", "600"],
})

export const metadata: Metadata = {
  metadataBase: new URL("https://www.untainted.io"),
  title: {
    default: "Untainted – Hyper-Personalized Food Intelligence For Modern Food Platforms",
    template: "%s | Untainted"
  },
  description:
    "An API-first food intelligence platform enabling personalized, safer food decisions for commerce and delivery apps through advanced ingredient analysis.",
  keywords: ["food intelligence api", "ingredient analysis", "clean label", "food safety API", "allergen detection", "personalized nutrition", "grocery api", "FSSAI compliance"],
  authors: [{ name: "Untainted Team" }],
  creator: "Untainted",
  publisher: "Untainted",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://www.untainted.io",
    title: "Untainted – Hyper-Personalized Food Intelligence For Modern Food Platforms",
    description: "Build safer, smarter food experiences for your consumers with the Untainted API stack.",
    siteName: "Untainted",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Untainted Food Intelligence API",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Untainted – Hyper-Personalized Food Intelligence For Modern Food Platforms",
    description: "Build safer, smarter food experiences for your consumers with the Untainted API stack.",
    images: ["/opengraph-image.png"],
    creator: "@untainted_io",
  },
  icons: {
    icon: [
      { url: "/favicon.png", type: "image/png" },
      { url: "/favicon.svg", type: "image/svg+xml" },
    ],
    apple: "/apple-icon.png",
  },
  alternates: {
    canonical: "./",
  },
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Untainted",
  "applicationCategory": "HealthApplication",
  "operatingSystem": "All",
  "offers": {
    "@type": "Offer",
    "price": "0",
    "priceCurrency": "USD",
  },
  "description": "An API-first food intelligence platform enabling personalized, safer food decisions for commerce and delivery apps through advanced ingredient analysis.",
  "image": "https://www.untainted.io/opengraph-image",
  "url": "https://www.untainted.io",
  "sameAs": [
    "https://twitter.com/untainted_io",
    "https://linkedin.com/company/untainted-io"
  ],
  "author": {
    "@type": "Organization",
    "name": "Untainted",
    "url": "https://www.untainted.io"
  }
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${figtree.variable} ${geistMono.variable} font-sans antialiased`}
        suppressHydrationWarning
      >
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <main>{children}</main>
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
