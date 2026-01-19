import { RedocWrapper } from "@/components/RedocWrapper"
import { openApiSpec } from "@/lib/openapi"

export const metadata = {
  title: "API Reference - Untainted Docs",
  description: "Complete API reference for Untainted's product intelligence platform.",
}

export default function ApiReferencePage() {
  return <RedocWrapper spec={openApiSpec} />
}
