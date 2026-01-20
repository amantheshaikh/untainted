import { Navbar } from "@/components/layout/Navbar"
import { Footer } from "@/components/layout/Footer"
import { DocsSidebar } from "@/components/layout/DocsSidebar"
import { DocsMobileNav } from "@/components/layout/DocsMobileNav"

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
