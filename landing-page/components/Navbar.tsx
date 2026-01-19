"use client"

import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Menu, X } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { supabase } from "../lib/supabaseClient"
import { LogOut } from "lucide-react"

const navigationLinks = [
  { name: "For Business", href: "#for-business" },
  { name: "For Personal", href: "#for-personal" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Documentation", href: "/docs" },
  { name: "Pricing", href: "#pricing" },
]

export const Navbar = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  const router = useRouter()
  const pathname = usePathname()
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    // Check auth state
    const checkAuth = async () => {
      if (!supabase || !supabase.auth || !supabase.auth.getUser) return setIsAuthenticated(false)
      const { data: { user } } = await supabase.auth.getUser()
      setIsAuthenticated(!!user)
    }
    checkAuth()

    // Listen for auth changes
    let subscription: any
    if (supabase && supabase.auth && supabase.auth.onAuthStateChange) {
      const { data } = supabase.auth.onAuthStateChange((_event: any, session: any) => {
        setIsAuthenticated(!!session?.user)
      })
      subscription = data?.subscription || data
    }

    return () => {
      if (subscription && subscription.unsubscribe) subscription.unsubscribe()
    }
  }, [])


  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen)
  }

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false)
  }

  const handleLinkClick = (e: React.MouseEvent, href: string) => {
    closeMobileMenu()
    
    if (href.startsWith("#")) {
      e.preventDefault()
      // If we're not on the home page, navigate to home with the hash
      if (pathname !== "/") {
        router.push("/" + href)
        return
      }
      
      // If we are on home page, scroll to element
      const element = document.querySelector(href)
      if (element) {
        element.scrollIntoView({ behavior: "smooth" })
      }
    }
    // For non-hash links, let next/link handle it normally
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? "bg-background/95 backdrop-blur-md shadow-sm" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200">
              <Image src="/images/full-20logo.png" alt="Untainted" width={140} height={32} className="h-8 w-auto" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline gap-8">
              {navigationLinks.map((link) => {
                const isHash = link.href.startsWith("#")
                
                if (isHash) {
                  return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="text-foreground/80 hover:text-foreground px-3 py-2 text-base font-medium transition-colors duration-200 relative group cursor-pointer"
                    >
                      <span>{link.name}</span>
                      <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                    </a>
                  )
                }

                return (
                  <Link
                    key={link.name}
                    href={link.href}
                    className="text-foreground/80 hover:text-foreground px-3 py-2 text-base font-medium transition-colors duration-200 relative group"
                  >
                    <span>{link.name}</span>
                    <div className="absolute bottom-0 left-0 w-0 h-0.5 bg-primary transition-all duration-300 group-hover:w-full" />
                  </Link>
                )
              })}
            </div>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {/* Only show Sign Out when authenticated and not on auth pages */}
            {isAuthenticated && !["/signin", "/signup"].includes(pathname || "") ? (
              <button
                onClick={async () => {
                  await supabase.auth.signOut()
                  router.push("/")
                  router.refresh()
                }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border-2 border-border text-foreground font-medium bg-transparent hover:bg-secondary transition-all duration-150"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            ) : (
              <>
                <Link
                  href="/signin"
                  className="px-4 py-2 rounded-full border-2 border-primary text-primary font-medium bg-transparent hover:opacity-90 transition-all duration-150"
                >
                  Log In
                </Link>

                <Link
                  href="/signup"
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-5 py-2.5 rounded-full text-base font-medium hover:opacity-90 transition-all duration-200 shadow-sm"
                >
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-foreground hover:text-primary p-2 rounded-md transition-colors duration-200"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="md:hidden bg-background/95 backdrop-blur-md border-t border-border"
          >
            <div className="px-6 py-6 space-y-4">
              {navigationLinks.map((link) => {
                 const isHash = link.href.startsWith("#")
                 
                 if (isHash) {
                   return (
                    <a
                      key={link.name}
                      href={link.href}
                      onClick={(e) => handleLinkClick(e, link.href)}
                      className="block w-full text-left text-foreground hover:text-primary py-3 text-lg font-medium transition-colors duration-200 cursor-pointer"
                    >
                      <span>{link.name}</span>
                    </a>
                   )
                 }

                 return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className="block w-full text-left text-foreground hover:text-primary py-3 text-lg font-medium transition-colors duration-200"
                      onClick={closeMobileMenu}
                    >
                      <span>{link.name}</span>
                    </Link>
                 )
              })}

              <div className="pt-4 border-t border-border space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Account</p>
                <Link
                  href="/signin"
                  onClick={closeMobileMenu}
                  className="w-full flex items-center gap-3 border-2 border-primary text-primary px-4 py-3 rounded-xl font-medium hover:opacity-90 transition-all duration-200"
                >
                  Log In
                </Link>
                <Link
                  href="/signup"
                  onClick={closeMobileMenu}
                  className="w-full flex items-center gap-3 bg-primary text-primary-foreground px-4 py-3 rounded-xl font-medium hover:opacity-90 transition-all duration-200"
                >
                  Sign Up
                </Link>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  )
}
