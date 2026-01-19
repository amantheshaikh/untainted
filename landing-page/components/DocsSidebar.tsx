"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    title: "Getting Started",
    items: [
      { title: "Introduction", href: "/docs" }, // or /docs/introduction
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

interface DocsSidebarProps {
  apiNavigation?: ApiSection[]
}

export function DocsSidebar({ apiNavigation = [] }: DocsSidebarProps) {
  const pathname = usePathname()

  // Merge static "Getting Started" with dynamic "API Reference"
  const navigation = [
    ...sidebarItems.slice(0, 1), // Getting Started
    {
      title: "API Reference",
      items: [
        { title: "Full API Spec", href: "/docs/api-reference" },
        // Add dynamic items if present
        ...apiNavigation.flatMap(section => [
           // We can render sections as subheaders or flattened.
           // For now, let's flatten them with section dividers or just list endpoints?
           // The user wanted nested. Let's try to keep sections.
           // But our sidebarItems structure is flat lists under headers.
           // Let's just append the endpoints for now.
        ])
      ], 
    }
  ]
  // Wait, I should restructure this better.
  // The user wants:
  // API REFERENCE
  //   Shared
  //     Health Check
  return (
    <nav className="w-64 shrink-0 border-r border-border h-full min-h-[calc(100vh-5rem)] sticky top-20 hidden lg:block py-8 pr-6 overflow-y-auto">
      <div className="space-y-8">
        {/* Static Sections */}
        {sidebarItems.map((section) => (
          <div key={section.title}>
            <h4 className="font-semibold text-foreground mb-3 px-2 text-sm uppercase tracking-wider">{section.title}</h4>
            <ul className="space-y-1">
              {section.items.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
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
                             className="block px-2 py-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
                          >
                            {item.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                 </div>
               ))}
               
               {/* Fallback link to full spec */}
               <div className="pt-2">
                 <Link href="/docs/api-reference" className="block px-2 py-1.5 text-sm font-medium text-primary hover:underline">
                    View Full Spec &rarr;
                 </Link>
               </div>
             </div>
           </div>
        )}
      </div>
    </nav>
  )
}
