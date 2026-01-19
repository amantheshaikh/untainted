import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import { DocsSidebar } from "@/components/DocsSidebar"

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex flex-col min-h-screen bg-background">
      <Navbar />
      <div className="flex-1 max-w-7xl mx-auto w-full px-6 lg:px-8 pt-20">
        <div className="flex gap-12">
          <DocsSidebar />
          <main className="flex-1 py-8 min-w-0">
             <div className="prose prose-stone dark:prose-invert max-w-none">
                {children}
             </div>
          </main>
        </div>
      </div>
      <Footer />
    </div>
  )
}
