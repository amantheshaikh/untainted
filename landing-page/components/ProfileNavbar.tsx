"use client"

import { useRouter } from "next/navigation"
import { supabase } from "../lib/supabaseClient"
import { Button } from "./ui/button"

export const ProfileNavbar = () => {
  const router = useRouter()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push("/")
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background border-b border-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <button
              onClick={() => router.push("/")}
              className="flex items-center gap-2 hover:opacity-80 transition-opacity duration-200"
            >
              <img src="/images/full-20logo.png" alt="Untainted" className="h-8" />
            </button>
          </div>

          {/* Sign Out Button */}
          <div>
            <Button 
              variant="outline" 
              onClick={handleSignOut}
              className="border-primary text-primary hover:bg-primary hover:text-primary-foreground"
            >
              Sign Out
            </Button>
          </div>
        </div>
      </div>
    </nav>
  )
}
