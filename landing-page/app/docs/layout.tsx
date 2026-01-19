import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-1 w-full pt-16">
           {children}
      </div>
      <Footer />
    </div>
  )
}
