"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabaseClient"
import { ProfileNavbar } from "@/components/layout/ProfileNavbar"
import { Footer } from "@/components/layout/Footer"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { ProfileTab } from "@/components/profile/ProfileTab"
import { FoodAnalyzer } from "@/components/food/FoodAnalyzer"
import { User, Search } from "lucide-react"

export default function ProfilePage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) {
        router.push("/signin")
      } else {
        setLoading(false)
      }
    }
    checkUser()
  }, [router])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <>
      <ProfileNavbar />
      <div className="min-h-screen pt-24 md:pt-32 pb-20 bg-background">
        <div className="max-w-4xl mx-auto px-4 md:px-6">
          <Tabs defaultValue="analyze" className="space-y-8">

            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <h1 className="text-3xl font-bold text-foreground">My Account</h1>
              <TabsList className="grid w-full sm:w-[400px] grid-cols-2 h-12">
                <TabsTrigger value="analyze" className="gap-2 text-base">
                  <Search className="w-4 h-4" />
                  Analyze Food
                </TabsTrigger>
                <TabsTrigger value="profile" className="gap-2 text-base">
                  <User className="w-4 h-4" />
                  Profile
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="analyze" className="outline-none focus-visible:ring-0">
              <FoodAnalyzer />
            </TabsContent>

            <TabsContent value="profile" className="outline-none focus-visible:ring-0">
              <div className="bg-card rounded-2xl border border-border p-8 shadow-sm">
                <ProfileTab />
              </div>
            </TabsContent>

          </Tabs>
        </div>
      </div>
      <Footer />
    </>
  )
}
