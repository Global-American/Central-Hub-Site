"use client"

import type React from "react"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"

interface ContactModalProps {
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export default function ContactModal({ isOpen, onOpenChange }: ContactModalProps) {
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    // Handle form submission
    console.log("Contact form submitted")
    onOpenChange(false) // Close modal on submit
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px] bg-white dark:bg-zinc-900 shadow-xl rounded-lg p-0">
        <div className="relative">
          {/* Optional: Add a subtle background pattern or image here */}
          {/* <div className="absolute inset-0 bg-gradient-to-br from-yellow-50 via-orange-50 to-red-50 dark:from-zinc-800 dark:via-zinc-800/50 dark:to-zinc-900 opacity-50 rounded-lg" /> */}
          <div className="relative p-6 md:p-8 backdrop-blur-sm">
            <DialogHeader className="text-left mb-6">
              <DialogTitle className="text-2xl md:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
                Start the Conversation
              </DialogTitle>
              <DialogDescription className="text-zinc-600 dark:text-zinc-400 mt-1">
                Your transformation starts here. Fill out the form below, and one of our logistics experts will be in
                touch shortly.
              </DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="firstName" className="text-zinc-700 dark:text-zinc-300">
                    First Name
                  </Label>
                  <Input
                    id="firstName"
                    placeholder="John"
                    required
                    className="mt-1 bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>
                <div>
                  <Label htmlFor="lastName" className="text-zinc-700 dark:text-zinc-300">
                    Last Name
                  </Label>
                  <Input
                    id="lastName"
                    placeholder="Doe"
                    required
                    className="mt-1 bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:border-accent focus:ring-1 focus:ring-accent"
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="email" className="text-zinc-700 dark:text-zinc-300">
                  Email Address
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  required
                  className="mt-1 bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-zinc-700 dark:text-zinc-300">
                  Phone Number
                </Label>
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  className="mt-1 bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <Label htmlFor="company" className="text-zinc-700 dark:text-zinc-300">
                  Company
                </Label>
                <Input
                  id="company"
                  placeholder="Your Company Inc."
                  className="mt-1 bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <Label htmlFor="subject" className="text-zinc-700 dark:text-zinc-300">
                  Subject
                </Label>
                <Input
                  id="subject"
                  placeholder="e.g., Inquiry about Air Freight"
                  required
                  className="mt-1 bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
              <div>
                <Label htmlFor="message" className="text-zinc-700 dark:text-zinc-300">
                  Message
                </Label>
                <Textarea
                  id="message"
                  placeholder="Tell us more about your logistics needs..."
                  rows={4}
                  required
                  className="mt-1 bg-zinc-50 dark:bg-zinc-800 border-zinc-300 dark:border-zinc-700 focus:border-accent focus:ring-1 focus:ring-accent"
                />
              </div>
              <DialogFooter className="pt-4">
                <Button
                  type="submit"
                  size="lg"
                  className="w-full sm:w-auto bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-6 py-3 text-base"
                >
                  Send Message →
                </Button>
              </DialogFooter>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
