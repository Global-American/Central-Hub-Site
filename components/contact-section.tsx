"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import ContactModal from "./contact-modal"
import { useState, useEffect, useRef } from "react"
import { Phone, Mail, MessageSquare, Send } from "lucide-react"

export default function ContactSection() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    message: ""
  })
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Reset form
    setFormData({ name: "", email: "", company: "", message: "" })
    setIsSubmitting(false)
    
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData)
  }

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
      <section ref={sectionRef} id="contact" className="py-20 md:py-28 lg:py-36 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section */}
          <div
            className={`text-center mb-12 lg:mb-20 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <Badge variant="outline" className="text-xs border-accent text-accent bg-accent/10 mb-4">
              Get Started
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Let's <span className="text-accent">connect</span>
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Tell us about your logistics needs and we'll get back to you within 2 hours.
            </p>
          </div>

          {/* Contact Form Section */}
          <div
            className={`max-w-5xl lg:max-w-6xl mx-auto mb-16 lg:mb-24 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
            style={{ transitionDelay: "100ms" }}
          >
            <div className="bg-[#f6fdfe] rounded-2xl p-6 sm:p-8 lg:p-12 xl:p-16">
              <form onSubmit={handleSubmit} className="space-y-8 lg:space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                  <div className="space-y-3">
                    <Label htmlFor="name" className="text-base lg:text-lg font-medium text-foreground">
                      Full Name *
                    </Label>
                    <Input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="bg-white border-gray-200 focus:border-accent focus:ring-accent/20 rounded-md text-base lg:text-lg py-3 lg:py-4"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="space-y-3">
                    <Label htmlFor="email" className="text-base lg:text-lg font-medium text-foreground">
                      Email Address *
                    </Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleInputChange}
                      className="bg-white border-gray-200 focus:border-accent focus:ring-accent/20 rounded-md text-base lg:text-lg py-3 lg:py-4"
                      placeholder="Enter your email address"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <Label htmlFor="company" className="text-base lg:text-lg font-medium text-foreground">
                    Company Name
                  </Label>
                  <Input
                    id="company"
                    name="company"
                    type="text"
                    value={formData.company}
                    onChange={handleInputChange}
                    className="bg-white border-gray-200 focus:border-accent focus:ring-accent/20 rounded-md text-base lg:text-lg py-3 lg:py-4"
                    placeholder="Enter your company name"
                  />
                </div>

                <div className="space-y-3">
                  <Label htmlFor="message" className="text-base lg:text-lg font-medium text-foreground">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    name="message"
                    required
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    className="bg-white border-gray-200 focus:border-accent focus:ring-accent/20 rounded-md resize-none text-base lg:text-lg py-3 lg:py-4"
                    placeholder="Tell us about your logistics needs, shipping volume, or any specific requirements..."
                  />
                </div>

                <div className="text-center pt-6">
                  <Button
                    type="submit"
                    disabled={isSubmitting}
                    size="lg"
                    className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 lg:px-12 py-4 lg:py-5 text-lg lg:text-xl"
                  >
                    {isSubmitting ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-accent-foreground mr-2"></div>
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send className="h-4 w-4 mr-2" />
                        Send Message
                      </>
                    )}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-10 max-w-5xl lg:max-w-6xl mx-auto">
            {contactOptions.map((option, index) => (
              <Card
                key={option.key}
                className={`group border-0 shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer bg-[#f6fdfe] ${
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
                <CardContent className="p-6 lg:p-8 text-center">
                  <div className="inline-flex items-center justify-center w-14 h-14 lg:w-16 lg:h-16 bg-accent/10 rounded-xl text-accent mb-6 group-hover:scale-110 transition-transform duration-300">
                    <div className="w-6 h-6 lg:w-7 lg:h-7">
                      {option.icon}
                    </div>
                  </div>
                  <h3 className="text-xl lg:text-2xl font-semibold text-foreground mb-3 lg:mb-4">{option.title}</h3>
                  <p className="text-base lg:text-lg text-muted-foreground mb-4 lg:mb-5">{option.description}</p>
                  <p className="text-base lg:text-lg font-medium text-accent">{option.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>


        </div>
      </section>
      <ContactModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
    </>
  )
}
