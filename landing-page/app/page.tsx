import { Navbar } from "@/components/Navbar"
import { Footer } from "@/components/Footer"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, Building2, User } from "lucide-react"

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen pt-20 flex flex-col">
        <section className="flex-1 flex flex-col justify-center items-center px-6 lg:px-8 py-20 text-center max-w-7xl mx-auto w-full">
           
           <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
             Food Intelligence <br />
             <span className="text-primary bg-clip-text">For Everyone.</span>
           </h1>
           <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto mb-16">
             Untainted decodes the world's food data to deliver personalized safety verdicts. Who are you?
           </p>

           <div className="grid md:grid-cols-2 gap-8 w-full max-w-4xl">
              {/* Business Card */}
              <Link href="/business" className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 hover:border-primary/50 transition-all hover:shadow-2xl hover:shadow-primary/10 text-left">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <Building2 className="w-32 h-32" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center text-primary mb-6">
                        <Building2 className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">For Business</h2>
                    <p className="text-muted-foreground mb-6">
                        Integrate our API into your grocery, delivery, or health platform. Ensure compliance and safety at scale.
                    </p>
                    <span className="inline-flex items-center font-semibold text-primary group-hover:gap-2 transition-all">
                        Explore Enterprise Solutions <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                  </div>
              </Link>

              {/* Personal Card */}
              <Link href="/personal" className="group relative overflow-hidden rounded-3xl border border-border bg-card p-8 hover:border-emerald-500/50 transition-all hover:shadow-2xl hover:shadow-emerald-500/10 text-left">
                  <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
                      <User className="w-32 h-32" />
                  </div>
                  <div className="relative z-10">
                    <div className="w-12 h-12 bg-emerald-500/10 rounded-xl flex items-center justify-center text-emerald-600 mb-6">
                        <User className="w-6 h-6" />
                    </div>
                    <h2 className="text-2xl font-bold mb-3">For Personal</h2>
                    <p className="text-muted-foreground mb-6">
                        Download the app to scan products, track allergies, and find safe food for your specific diet.
                    </p>
                    <span className="inline-flex items-center font-semibold text-emerald-600 group-hover:gap-2 transition-all">
                        Get the App <ArrowRight className="w-4 h-4 ml-2" />
                    </span>
                  </div>
              </Link>
           </div>
           
           <div className="mt-20 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
               <p className="text-sm font-semibold uppercase tracking-widest text-muted-foreground mb-8">Trusted technology foundation</p>
               <div className="flex gap-12 justify-center items-center flex-wrap">
                   {/* Placeholder logos, replace with real ones if available */}
                   <div className="font-bold text-xl">Next.js</div>
                   <div className="font-bold text-xl">Vercel</div>
                   <div className="font-bold text-xl">Supabase</div>
                   <div className="font-bold text-xl">Tailwind</div>
               </div>
           </div>

        </section>
      </main>
      <Footer />
    </>
  )
}
