"use client"

import { useState } from "react"
import { Menu, X } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" },
      { title: "Authentication", href: "/docs/authentication" },
    ],
  },
]


interface NavItem {
  title: string
  href: string
}

interface ApiSection {
  title: string
  items: NavItem[]
}

interface DocsMobileNavProps {
  apiNavigation?: ApiSection[]
}

export function DocsMobileNav({ apiNavigation = [] }: DocsMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false)
  const pathname = usePathname()

  return (
    <div className="lg:hidden mb-8">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-sm font-medium text-foreground border border-border rounded-md px-4 py-2 hover:bg-muted/50 w-full"
      >
        <Menu className="h-4 w-4" />
        Menu
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
          <div className="fixed inset-y-0 left-0 w-full max-w-xs bg-background border-r border-border p-6 shadow-lg animate-in slide-in-from-left overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="font-semibold text-lg">Documentation</h2>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-muted rounded-md">
                 <X className="h-5 w-5" />
              </button>
            </div>
            
             <nav className="space-y-8">
                {sidebarItems.map((section) => (
                  <div key={section.title}>
                    <h4 className="font-semibold text-foreground mb-3 px-2 text-sm uppercase tracking-wider">{section.title}</h4>
                    <ul className="space-y-1">
                      {section.items.map((item) => (
                        <li key={item.href}>
                          <Link
                            href={item.href}
                            onClick={() => setIsOpen(false)}
                            className={cn(
                              "block px-2 py-1.5 text-sm rounded-md transition-colors duration-200 hover:bg-muted/50",
                              (pathname === item.href)
                                ? "bg-secondary text-primary font-medium"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}

                {/* Dynamic API Reference Section */}
                {apiNavigation.length > 0 && (
                   <div>
                     <h4 className="font-semibold text-foreground mb-3 px-2 text-sm uppercase tracking-wider">API Reference</h4>
                     <div className="space-y-6">
                       {apiNavigation.map(section => (
                         <div key={section.title}>
                            <h5 className="px-2 text-xs font-semibold text-muted-foreground mb-2 uppercase">{section.title}</h5>
                            <ul className="space-y-1 border-l ml-2 pl-2 border-border">
                              {section.items.map(item => (
                                <li key={item.href}>
                                  <Link
                                     href={item.href}
                                     onClick={() => setIsOpen(false)}
                                     className="block px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                                  >
                                    {item.title}
                                  </Link>
                                </li>
                              ))}
                            </ul>
                         </div>
                       ))}
                       <div className="pt-2">
                         <Link href="/docs/api-reference" onClick={() => setIsOpen(false)} className="block px-2 py-1.5 text-sm font-medium text-primary hover:underline">
                            View Full Spec &rarr;
                         </Link>
                       </div>
                     </div>
                   </div>
                )}
              </nav>
          </div>
        </div>
      )}
    </div>
  )
}
