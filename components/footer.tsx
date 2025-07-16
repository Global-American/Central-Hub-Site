"use client"

import Link from "next/link"
import Image from "next/image"
import { Mail, Phone, MapPin } from "lucide-react"
import { useState, useEffect } from "react"

// Main 4 solutions with taglines
const partnerSolutions = [
  {
    name: "ShipItSmart",
    tagline: "Be Smart, Ship itSmart"
  },
  {
    name: "FreightItSmart", 
    tagline: "Be Smart, Freight itSmart"
  },
  {
    name: "ReturnItSmart",
    tagline: "Be Smart, Return itSmart"
  },
  {
    name: "FulfillItSmart",
    tagline: "Be Smart, Fulfill itSmart"
  }
]

export default function Footer() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 }
    )

    const footer = document.querySelector('#footer')
    if (footer) {
      observer.observe(footer)
    }

    return () => observer.disconnect()
  }, [])

  // Auto-advance carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % partnerSolutions.length)
    }, 3000)

    return () => clearInterval(interval)
  }, [])



  const getCurrentSolution = () => {
    return partnerSolutions[currentIndex]
  }

  return (
    <footer id="footer" className="bg-gradient-to-br from-slate-50 via-[#f6fdfe] to-slate-100 text-foreground">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Main Footer Content */}
        <div className="py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Logo and Partnership Section */}
            <div className={`lg:col-span-1 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
              <div className="mb-4 text-left">
              <Image
                src="/images/logo.png"
                alt="Global American LLC"
                  width={200}
                  height={60}
                  className="h-12 w-auto hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* In Partnership with Section */}
              <div className="mb-4 text-left">
                <h4 className="text-base font-semibold mb-3">
                  In <span className="text-accent">Partnership</span> with
                </h4>
                
                {/* Solutions Carousel - Single Item */}
                <div className="relative">
                  <div className="min-h-[60px] flex items-center">
                    <div
                      key={`${getCurrentSolution().name}-${currentIndex}`}
                      className={`text-left transition-all duration-500 w-full ${
                        isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                      }`}
                    >
                      <p className="text-base font-medium text-foreground leading-tight mb-1">
                        {getCurrentSolution().name}
                      </p>
                      <p className="text-sm text-accent font-medium">
                        {getCurrentSolution().tagline}
                      </p>
                    </div>
                  </div>
                  

                </div>


              </div>
            </div>

            {/* Quick Links - Compact */}
            <div className={`lg:col-span-1 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "200ms" }}>
              <h4 className="text-base font-semibold mb-3">
                <span className="text-accent">Quick</span> Links
              </h4>
              <div className="space-y-1">
                {[
                  { label: "About Us", href: "#about" },
                  { label: "Solutions", href: "#brands" },
                  { label: "Services", href: "#services" },
                  { label: "Testimonials", href: "#testimonials" },
                  { label: "Get a Quote", href: "#contact" },
                  { label: "Contact Us", href: "#contact" }
                ].map((link, index) => (
                  <Link
                    key={link.label}
                    href={link.href}
                    className="group flex items-center space-x-2 py-1 px-2 rounded hover:bg-white/30 transition-all duration-200"
                  >
                    <div className="w-1 h-1 bg-accent rounded-full opacity-60 group-hover:opacity-100 transition-opacity"></div>
                    <span className="text-sm text-muted-foreground group-hover:text-accent transition-colors">
                      {link.label}
                    </span>
                  </Link>
                ))}
              </div>
            </div>

            {/* Contact Info - Compact */}
            <div className={`lg:col-span-1 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "300ms" }}>
              <h4 className="text-base font-semibold mb-3">
                <span className="text-accent">Contact</span> Info
              </h4>
              <div className="space-y-2">
                <div className="flex items-start space-x-2">
                  <MapPin className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">Global American LLC</p>
                    <p className="text-sm text-muted-foreground">
                      1234 Logistics Avenue<br />
                      Miami, FL 33101
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">+1 (555) 123-4567</span>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Mail className="h-4 w-4 text-accent flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">info@globalamerican.com</span>
                </div>
              </div>
            </div>

            {/* Google Map - Compact */}
            <div className={`lg:col-span-1 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`} style={{ transitionDelay: "400ms" }}>
              <h4 className="text-base font-semibold mb-3">
                <span className="text-accent">Find</span> Us
              </h4>
              <div className="relative rounded-lg overflow-hidden shadow-md border border-accent/10 hover:shadow-lg transition-shadow duration-300">
                <div className="aspect-video bg-gradient-to-br from-accent/5 to-accent/10">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3592.2758089830347!2d-80.19659892470353!3d25.776450007672104!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x88d9b48425b6eb65%3A0x6d9b8d4e5b6f4b8e!2sMiami%2C%20FL%2C%20USA!5e0!3m2!1sen!2sus!4v1645123456789!5m2!1sen!2sus"
                    width="100%"
                    height="100%"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="grayscale hover:grayscale-0 transition-all duration-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Compact Bottom Bar */}
        <div className={`border-t border-accent/10 py-3 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`} style={{ transitionDelay: "500ms" }}>
          <div className="text-center">
            <p className="text-sm text-muted-foreground">
              &copy; {new Date().getFullYear()} Global American LLC. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  )
}
