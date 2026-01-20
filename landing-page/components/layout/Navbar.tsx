"use client"

import * as React from "react"
import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu"
import { Button } from "@/components/ui/button"
import { Menu, X } from "lucide-react"

export function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false)
  const pathname = usePathname()

  // Close mobile menu on route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false)
  }, [pathname])

  return (
    <div className="fixed top-0 inset-x-0 z-50 bg-background/95 backdrop-blur-md border-b border-border">
      <div className="container mx-auto px-4 lg:px-6 flex h-20 items-center justify-between">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
            <Image src="/images/full-20logo.png" alt="Untainted" width={140} height={32} className="h-8 w-auto" />
        </Link>

        {/* Desktop Navigation */}
        <div className="hidden md:flex">
          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Products</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid gap-3 p-6 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                    <li className="row-span-3">
                      <NavigationMenuLink asChild>
                        <Link
                          className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                          href="/"
                        >
                          <div className="mb-2 mt-4 text-lg font-medium">
                            Untainted
                          </div>
                          <p className="text-sm leading-tight text-muted-foreground">
                            Food intelligence for everyone. Safe, transparent, and personalized.
                          </p>
                        </Link>
                      </NavigationMenuLink>
                    </li>
                    <ListItem href="/business" title="For Business">
                      API and data solutions for enterprise and retail.
                    </ListItem>
                    <ListItem href="/personal" title="For Personal">
                      The app for personalized food safety and diet tracking.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuTrigger>Resources</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                    <ListItem href="/blog" title="Blog">
                      Latest news, updates, and deep dives into food tech.
                    </ListItem>
                    <ListItem href="/docs" title="Documentation">
                      Comprehensive guides and API reference for developers.
                    </ListItem>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/pricing" className={navigationMenuTriggerStyle()}>
                    Pricing
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link href="/how-it-works" className={navigationMenuTriggerStyle()}>
                    How it Works
                  </Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>
        </div>

        {/* Right Actions */}
        <div className="hidden md:flex items-center gap-4">
          <Link href="/signin" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            Log In
          </Link>
          <Button asChild>
            <Link href="/contact">Contact Us</Link>
          </Button>
        </div>

        {/* Mobile Menu Toggle */}
         <button
            className="md:hidden p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
      </div>

       {/* Mobile Menu Content */}
       {isMobileMenuOpen && (
        <div className="md:hidden absolute top-20 inset-x-0 bg-background border-b border-border p-4 shadow-lg flex flex-col gap-4">
             <div className="space-y-4">
                <div className="font-semibold text-muted-foreground px-2">Products</div>
                <Link href="/business" className="block px-4 py-2 hover:bg-muted rounded-md">For Business</Link>
                <Link href="/personal" className="block px-4 py-2 hover:bg-muted rounded-md">For Personal</Link>
             </div>
             <div className="space-y-4">
                <div className="font-semibold text-muted-foreground px-2">Resources</div>
                <Link href="/blog" className="block px-4 py-2 hover:bg-muted rounded-md">Blog</Link>
                <Link href="/docs" className="block px-4 py-2 hover:bg-muted rounded-md">Documentation</Link>
             </div>
             <Link href="/pricing" className="block px-4 py-2 font-medium hover:bg-muted rounded-md">Pricing</Link>
             <Link href="/how-it-works" className="block px-4 py-2 font-medium hover:bg-muted rounded-md">How it Works</Link>
             <hr />
             <Link href="/signin" className="block px-4 py-2 font-medium hover:bg-muted rounded-md">Log In</Link>
             <Button className="w-full" asChild>
               <Link href="/contact">Contact Us</Link>
             </Button>
        </div>
       )}
    </div>
  )
}

const ListItem = React.forwardRef<
  React.ElementRef<"a">,
  React.ComponentPropsWithoutRef<"a">
>(({ className, title, children, ...props }, ref) => {
  return (
    <li>
      <NavigationMenuLink asChild>
        <a
          ref={ref}
          className={cn(
            "block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
            className
          )}
          {...props}
        >
          <div className="text-sm font-medium leading-none">{title}</div>
          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
            {children}
          </p>
        </a>
      </NavigationMenuLink>
    </li>
  )
})
ListItem.displayName = "ListItem"
