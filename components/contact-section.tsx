"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import ContactModal from "./contact-modal"
import { useState, useEffect, useRef } from "react"
import { Phone, Mail, MessageSquare } from "lucide-react"

export default function ContactSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.3 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const contactOptions = [
    {
      key: "call",
      icon: <Phone className="h-5 w-5" />,
      title: <>Call <span className="text-accent">Now</span></>,
      description: "Speak with an expert",
      action: "tel:+12125551234",
      label: "+1 (212) 555-1234",
    },
    {
      key: "email",
      icon: <Mail className="h-5 w-5" />,
      title: <>Email <span className="text-accent">Us</span></>,
      description: "Get a response in 2 hours",
      action: "mailto:hello@globalamerican.com",
      label: "hello@globalamerican.com",
    },
    {
      key: "chat",
      icon: <MessageSquare className="h-5 w-5" />,
      title: <>Live <span className="text-accent">Chat</span></>,
      description: "Instant support available",
      action: () => setIsModalOpen(true),
      label: "Start conversation",
    },
  ]

  return (
    <>
      <section ref={sectionRef} id="contact" className="py-16 md:py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Badge variant="outline" className="text-xs border-accent text-accent bg-accent/10 mb-4">
              Get Started
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ready to <span className="text-accent">ship smarter?</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Get a personalized quote or speak with our logistics experts today.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            {contactOptions.map((option, index) => (
              <Card
                key={option.key}
                className={`group border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{ transitionDelay: `${index * 100}ms` }}
                onClick={() => {
                  if (typeof option.action === "function") {
                    option.action()
                  } else {
                    window.location.href = option.action
                  }
                }}
              >
                <CardContent className="p-6 text-center">
                  <div className="inline-flex items-center justify-center w-12 h-12 bg-accent/10 rounded-xl text-accent mb-4 group-hover:scale-110 transition-transform duration-300">
                    {option.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-foreground mb-2">{option.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">{option.description}</p>
                  <p className="text-sm font-medium text-accent">{option.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <div className="bg-secondary rounded-2xl p-8 max-w-2xl mx-auto">
              <h3 className="text-xl font-bold text-foreground mb-4">Need a <span className="text-accent">custom solution?</span></h3>
              <p className="text-muted-foreground mb-6">
                Our logistics experts will design a solution that fits your specific needs and budget.
              </p>
              <Button
                size="lg"
                onClick={() => setIsModalOpen(true)}
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold px-8"
              >
                Get Custom Quote →
              </Button>
            </div>
          </div>
        </div>
      </section>
      <ContactModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}
