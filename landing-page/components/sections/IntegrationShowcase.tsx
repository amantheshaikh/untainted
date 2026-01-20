"use client"

import { motion } from "framer-motion"
import { Database, Smartphone, BarChart3, Cloud, Package, Headphones, Check } from "lucide-react"

export const IntegrationShowcase = () => {
  return (
    <section className="py-16 bg-secondary/30 overflow-hidden relative">
      <div className="container mx-auto px-6 text-center">
        <div className="max-w-3xl mx-auto mb-8">
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-4">
                Works with Your Entire Stack
            </h2>
            <p className="text-xl text-muted-foreground mb-6">
                Untainted sits seamlessly between your product catalog and your user experience, enriching data at every touchpoint.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-foreground/80">
                <span className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border border-border/50">
                    <Check className="w-4 h-4 text-green-500" /> No Database Migration Needed
                </span>
                <span className="flex items-center gap-2 bg-background/50 px-4 py-2 rounded-full border border-border/50">
                    <Check className="w-4 h-4 text-green-500" /> Plug & Play SDKs
                </span>
            </div>
        </div>

        {/* Integration Visual */}
        <div className="relative max-w-7xl mx-auto h-[600px] flex items-center justify-center">
             
             {/* Central Node */}
             <motion.div 
               initial={{ scale: 0.8, opacity: 0 }}
               whileInView={{ scale: 1, opacity: 1 }}
               viewport={{ once: true }}
               className="relative z-20 w-48 h-48 bg-background rounded-full border-[6px] border-primary flex items-center justify-center shadow-[0_0_60px_-15px_rgba(var(--primary-rgb),0.3)]"
             >
                <div className="flex flex-col items-center">
                    <div className="font-bold text-3xl tracking-tighter text-foreground">Untainted</div>
                    <div className="text-[10px] text-primary font-bold tracking-[0.2em] uppercase mt-1">Intelligence</div>
                </div>
             </motion.div>

             {/* Connecting Lines */}
             <svg className="absolute inset-0 w-full h-full z-10 pointer-events-none stroke-border/60" strokeWidth="2" strokeDasharray="6 6">
                 {/* Left Side Lines */}
                 <line x1="50%" y1="50%" x2="30%" y2="10%" />
                 <line x1="50%" y1="50%" x2="10%" y2="50%" />
                 <line x1="50%" y1="50%" x2="30%" y2="90%" />
                 
                 {/* Right Side Lines */}
                 <line x1="50%" y1="50%" x2="70%" y2="10%" />
                 <line x1="50%" y1="50%" x2="90%" y2="50%" />
                 <line x1="50%" y1="50%" x2="70%" y2="90%" />
             </svg>
             
             {/* Left Column */}
             <IntegrationNode 
                icon={Database} label="Catalog / PIM" subLabel="Import Products"
                description="Sync complete product metadata including ingredients and images."
                position="top-[2%] left-[10%] md:left-[25%]" 
                delay={0.1}
             />
             <IntegrationNode 
                icon={Package} label="Inventory System" subLabel="Sync Stock"
                description="Flag non-compliant batches immediately upon arrival."
                position="top-[50%] left-[0%] md:left-[5%] -translate-y-1/2" 
                delay={0.2} 
             />
             <IntegrationNode 
                icon={BarChart3} label="Analytics" subLabel="Track Usage"
                description="Insights into failed search queries and dietary trends."
                position="bottom-[2%] left-[10%] md:left-[25%]" 
                delay={0.3} 
             />

             {/* Right Column */}
             <IntegrationNode 
                icon={Smartphone} label="Web & Mobile App" subLabel="Display Verdicts"
                description="Display 'Safe for You' badges dynamically on PDPs."
                position="top-[2%] right-[10%] md:right-[25%]" 
                delay={0.4} 
             />
              <IntegrationNode 
                icon={Cloud} label="3rd Party APIs" subLabel="Webhooks"
                description="Push verdicts to nutrition apps via real-time webhooks."
                position="top-[50%] right-[0%] md:right-[5%] -translate-y-1/2" 
                delay={0.5} 
             />
             <IntegrationNode 
                icon={Headphones} label="Support / CRM" subLabel="Resolve Queries"
                description="Empower agents with instant allergen info for tickets."
                position="bottom-[2%] right-[10%] md:right-[25%]" 
                delay={0.6} 
             />

             {/* Floating Particles */}
             <div className="absolute inset-0 z-0 opacity-40">
                 <div className="absolute top-1/2 left-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2" />
             </div>
        </div>

      </div>
    </section>
  )
}

const IntegrationNode = ({ icon: Icon, label, subLabel, description, position, delay }: { icon: any, label: string, subLabel: string, description: string, position: string, delay: number }) => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, type: "spring", duration: 0.6 }}
      className={`absolute ${position} z-20 flex flex-col items-center gap-3 w-52 md:w-64`}
    >
        <div className="w-14 h-14 bg-card rounded-xl shadow-lg border border-border/50 flex items-center justify-center group hover:scale-110 transition-transform duration-300">
            <Icon className="w-6 h-6 text-muted-foreground group-hover:text-primary transition-colors" />
        </div>
        <div className="text-center rounded-xl bg-background/80 backdrop-blur-sm p-4 border border-border/30 shadow-sm w-full">
            <div className="font-semibold text-sm whitespace-nowrap">{label}</div>
            <div className="text-[10px] text-primary font-bold uppercase tracking-wide mt-0.5 mb-1.5">{subLabel}</div>
            <p className="text-xs text-muted-foreground leading-relaxed">{description}</p>
        </div>
    </motion.div>
)
