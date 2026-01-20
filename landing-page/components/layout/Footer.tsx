"use client"

import Image from "next/image"

import { Github, Twitter, Linkedin, Mail, Apple, Smartphone } from "lucide-react"
import { motion } from "framer-motion"
import { useRouter } from "next/navigation"

const sections = [
  {
    title: "Personal",
    links: [
      { label: "Download iOS App", href: "/personal" },
      { label: "Download Android App", href: "/personal" },
      { label: "Create Profile", href: "/signup" },
      { label: "How It Works", href: "#how-it-works" },
    ],
  },
  {
    title: "Business",
    links: [
      { label: "API Documentation", href: "/docs" },
      { label: "Pricing", href: "#pricing" },
      { label: "Case Studies", href: "#cases" },
      { label: "Request Demo", href: "/contact" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Blog", href: "#blog" },
      { label: "Careers", href: "#careers" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Data Security", href: "/security" },
    ],
  },
]

export const Footer = () => {
  const currentYear = new Date().getFullYear()
  const router = useRouter()

  const handleLinkClick = async (href: string) => {
    // If it's a hash anchor, navigate to home + hash then smooth-scroll to target
    if (href.startsWith("#")) {
      const path = `/${href}`

      const doScroll = () => {
        try {
          const el = document.querySelector(href)
          if (el && typeof (el as HTMLElement).scrollIntoView === "function") {
            ;(el as HTMLElement).scrollIntoView({ behavior: "smooth", block: "start" })
            return true
          }
        } catch (e) {
          // ignore
        }
        return false
      }

      // If we're already on the home page, just attempt to scroll (with retries)
      if (typeof window !== "undefined" && window.location.pathname === "/") {
        if (!doScroll()) {
          let attempts = 0
          const id = window.setInterval(() => {
            attempts += 1
            if (doScroll() || attempts > 10) {
              window.clearInterval(id)
            }
          }, 100)
        }
        return
      }

      // Otherwise navigate to home+hash, then attempt to scroll when the page renders.
      try {
        await router.push(path)
      } catch (e) {
        // fallback to full navigation
        window.location.href = path
        return
      }

      // Retry scrolling until the element is present or timeout
      if (typeof window !== "undefined") {
        let attempts = 0
        const id = window.setInterval(() => {
          attempts += 1
          if (doScroll() || attempts > 20) {
            window.clearInterval(id)
          }
        }, 100)
      }
      return
    }

    try {
      await router.push(href)
    } catch (e) {
      window.location.href = href
    }
  }

  return (
    <footer className="w-full bg-secondary/30 border-t border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        {/* Main Footer Content */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-8 mb-12">
          {/* Brand Column */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ duration: 0.5 }}
            className="col-span-2"
          >
            <div className="mb-4">
              <Image src="/images/full-20logo.png" alt="Untainted" width={140} height={32} className="h-8 mb-4 w-auto" />
              <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
                Know what&apos;s really in your food. Create your profile once, use it everywhere you shop.
              </p>
            </div>

            {/* App Download Buttons */}
            <div className="flex gap-2 mt-4 mb-6">
              <button
                onClick={() => router.push('/download')}
                className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Apple className="w-4 h-4" />
                iOS
              </button>
              <button
                onClick={() => router.push('/personal')}
                className="inline-flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-opacity"
              >
                <Smartphone className="w-4 h-4" />
                Android
              </button>
            </div>

            {/* Social Links */}
            <div className="flex items-center gap-3">
              <a
                href="https://twitter.com"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors duration-150"
                aria-label="Twitter"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors duration-150"
                aria-label="LinkedIn"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://github.com"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors duration-150"
                aria-label="GitHub"
              >
                <Github className="w-4 h-4" />
              </a>
              <a
                href="mailto:hello@untainted.io"
                className="w-9 h-9 flex items-center justify-center rounded-full bg-card border border-border text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors duration-150"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </motion.div>

          {/* Link Sections */}
          {sections.map((section, index) => (
            <motion.div
              key={section.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="col-span-1"
            >
              <h3 className="text-sm font-medium text-foreground mb-4 uppercase tracking-wide">{section.title}</h3>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <button
                      type="button"
                      onClick={() => handleLinkClick(link.href)}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
                    >
                      {link.label}
                    </button>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        {/* Bottom Bar */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="pt-8 border-t border-border"
        >
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground">{currentYear} Untainted. All rights reserved.</p>
            <div className="flex items-center gap-6">
              <a
                href="#status"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                System Status
              </a>
              <a
                href="#support"
                className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-150"
              >
                Support
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  )
}
