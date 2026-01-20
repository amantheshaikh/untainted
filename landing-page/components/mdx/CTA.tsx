import Link from 'next/link'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

interface CTAProps {
  heading: string
  text: string
  buttonText: string
  buttonLink: string
  className?: string
}

export function CTA({ heading, text, buttonText, buttonLink, className }: CTAProps) {
  return (
    <div className={cn("my-12 p-8 rounded-xl bg-secondary/50 border border-border text-center not-prose", className)}>
      <h3 className="text-2xl font-bold mb-3 text-foreground">{heading}</h3>
      <p className="text-muted-foreground mb-6 max-w-lg mx-auto">{text}</p>
      <Button asChild size="lg" className="rounded-full font-semibold">
        <Link href={buttonLink}>
          {buttonText}
        </Link>
      </Button>
    </div>
  )
}
