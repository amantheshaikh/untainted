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
  {
    title: "API Reference",
    items: [
      { title: "Full API Spec", href: "/docs/api-reference" },
    ],
  },
]

export function DocsSidebar() {
  const pathname = usePathname()

  return (
    <nav className="w-64 shrink-0 border-r border-border h-full min-h-[calc(100vh-5rem)] sticky top-20 hidden lg:block py-8 pr-6">
      <div className="space-y-8">
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
                      (pathname === item.href || (item.href === "/docs" && pathname === "/docs/introduction"))
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
      </div>
    </nav>
  )
}
