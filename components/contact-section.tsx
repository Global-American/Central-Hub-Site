"use client"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import { useState, useEffect, useRef } from "react"
import { Send, Building2, Truck, Ship, Package, RotateCcw } from "lucide-react"

const brands = [
  {
    id: "shipitsmart",
    name: "ShipItSmart",
    description: "Global Shipping Simplified",
    icon: <Ship className="h-4 w-4" />
  },
  {
    id: "freightitsmart", 
    name: "FreightItSmart",
    description: "Freight Management Reinvented",
    icon: <Truck className="h-4 w-4" />
  },
  {
    id: "returnitsmart",
    name: "ReturnItSmart", 
    description: "Reverse Logistics Perfected",
    icon: <RotateCcw className="h-4 w-4" />
  },
  {
    id: "fulfillitsmart",
    name: "FulfillItSmart",
    description: "End-to-End Fulfillment Excellence", 
    icon: <Package className="h-4 w-4" />
  }
]

export default function ContactSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
    selectedBrands: [] as string[]
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

  const handleBrandSelection = (brandId: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      selectedBrands: checked 
        ? [...prev.selectedBrands, brandId]
        : prev.selectedBrands.filter(id => id !== brandId)
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Reset form
    setFormData({ 
      name: "", 
      email: "", 
      phone: "",
      company: "", 
      message: "",
      selectedBrands: []
    })
    setIsSubmitting(false)
    
    // Here you would typically send the data to your backend
    console.log("Form submitted:", formData)
  }

  return (
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
          className={`max-w-5xl lg:max-w-6xl mx-auto transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          style={{ transitionDelay: "100ms" }}
        >
          <div className="bg-[#f6fdfe] rounded-2xl p-6 sm:p-8 lg:p-12 xl:p-16">
            <form onSubmit={handleSubmit} className="space-y-8 lg:space-y-10">
              {/* Name and Company Row */}
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
              </div>

              {/* Phone and Email Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
                <div className="space-y-3">
                  <Label htmlFor="phone" className="text-base lg:text-lg font-medium text-foreground">
                    Phone Number
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="bg-white border-gray-200 focus:border-accent focus:ring-accent/20 rounded-md text-base lg:text-lg py-3 lg:py-4"
                    placeholder="Enter your phone number"
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

              {/* Services of Interest Section */}
              <div className="space-y-4">
                <div className="flex items-center gap-2 mb-3">
                  <Building2 className="h-5 w-5 text-accent" />
                  <Label className="text-base lg:text-lg font-medium text-foreground">
                    Services of Interest
                  </Label>
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Select the services you'd like to learn more about (optional)
                </p>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {brands.map((brand) => (
                    <div
                      key={brand.id}
                      className="group relative bg-white rounded-xl border border-gray-200 p-4 hover:border-accent/30 hover:shadow-sm transition-all duration-200"
                    >
                      <div className="flex items-start space-x-3">
                        <Checkbox
                          id={brand.id}
                          checked={formData.selectedBrands.includes(brand.id)}
                          onCheckedChange={(checked) => handleBrandSelection(brand.id, checked as boolean)}
                          className="mt-0.5 data-[state=checked]:bg-accent data-[state=checked]:border-accent"
                        />
                        <div className="flex-1 min-w-0">
                          <label
                            htmlFor={brand.id}
                            className="cursor-pointer block"
                          >
                            <div className="flex items-center gap-2 mb-1">
                              <div className="text-accent">
                                {brand.icon}
                              </div>
                              <span className="font-medium text-foreground text-sm lg:text-base group-hover:text-accent transition-colors">
                                {brand.name}
                              </span>
                            </div>
                            <p className="text-xs lg:text-sm text-muted-foreground leading-relaxed">
                              {brand.description}
                            </p>
                          </label>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Message Field */}
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

              {/* Submit Button */}
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
      </div>
    </section>
  )
}
