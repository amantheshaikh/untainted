"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import ContactForm from "@/components/ContactForm"

export function ContactDialog({ children }: { children: React.ReactNode }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] md:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Contact Us</DialogTitle>
          <DialogDescription>
            Have a question about our enterprise solutions or API? Send us a message.
          </DialogDescription>
        </DialogHeader>
        <div className="pt-4">
            <ContactForm subject="Inquiry from Website Navbar" />
        </div>
      </DialogContent>
    </Dialog>
  )
}
