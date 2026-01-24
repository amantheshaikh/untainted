import { RedocWrapper } from "@/components/data-display/RedocWrapper"
import { Navbar } from "@/components/layout/Navbar"

export const metadata = {
  title: "API Documentation | Untainted",
  description: "Complete API reference for Untainted's Food Intelligence API. Learn how to integrate product safety analysis, barcode lookup, and AI-powered ingredient extraction.",
  openGraph: {
    title: "API Documentation | Untainted",
    description: "Complete API reference for Untainted's Food Intelligence API.",
    type: "website",
  },
}

export default function ApiReferencePage() {
  return (
    <>
      <Navbar />
      <div className="pt-16">
        <RedocWrapper />
      </div>
    </>
  )
}
