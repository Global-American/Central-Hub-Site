"use client"

import { useEffect, useRef, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2 } from "lucide-react"

const brands = [
  {
    id: 1,
    name: "helm",
    tagline: "WAREHOUSE EFFICIENCY. REDEFINED.",
    description: "The world's leading brands trust Helm to supercharge their warehouses with unparalleled speed and precision. Our WMS streamlines inventory tracking, order fulfillment, replenishment, and shipping—powering a smarter, more agile warehouse from end to end.",
    color: "bg-gradient-to-br from-teal-600 to-teal-800",
    textColor: "text-white",
  },
  {
    id: 2,
    name: "voila",
    tagline: "COURIER MANAGEMENT, REINVENTED.",
    description: "Voila is shaking up the shipping industry, connecting businesses to 150+ couriers and 7,000+ services with a single integration. Smart shipping rules, AI-driven automation, and real-time tracking make fulfillment faster, leaner, and more cost-effective.",
    color: "bg-gradient-to-br from-red-600 to-red-800",
    textColor: "text-white",
  },
  {
    id: 3,
    name: "neuro",
    tagline: "THE FUTURE OF E-COMMERCE CONNECTIVITY.",
    description: "Neuro is the ultimate iPaaS solution, effortlessly linking merchants to their entire ecosystem. Seamlessly connect stores, warehouses, suppliers, and logistics partners through one powerful platform. Built for scale, designed for simplicity.",
    color: "bg-gradient-to-br from-slate-600 to-slate-800",
    textColor: "text-white",
  }
]

export default function OurBrandsSection() {
  const [scrollY, setScrollY] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      if (sectionRef.current) {
        const rect = sectionRef.current.getBoundingClientRect()
        const sectionTop = rect.top
        const sectionHeight = rect.height
        const windowHeight = window.innerHeight
        
        // Better scroll progress calculation
        const progress = Math.max(0, Math.min(1, (windowHeight - sectionTop) / (windowHeight + sectionHeight * 0.5)))
        setScrollY(progress)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <section ref={sectionRef} id="brands" className="py-20 md:py-28 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20">
          <Badge variant="secondary" className="mb-6 text-primary">
            <Building2 size={16} className="mr-2" />
            Trusted Partners
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8">
            Our <span className="text-accent">Brands</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We partner with industry leaders across diverse sectors, delivering specialized logistics solutions 
            that drive growth and innovation in every market we serve.
          </p>
        </div>

        {/* Stacked Cards */}
        <div className="relative max-w-6xl mx-auto space-y-6">
          {brands.map((brand, index) => {
            const cardStart = index / brands.length
            const cardEnd = (index + 1) / brands.length
            const cardProgress = Math.max(0, Math.min(1, (scrollY - cardStart) / (cardEnd - cardStart)))
            
            // Improved animations
            const yOffset = cardProgress * 60
            const scale = Math.max(0.92, 1 - cardProgress * 0.08)
            const opacity = Math.max(0.6, 1 - cardProgress * 0.4)

            return (
              <div
                key={brand.id}
                className="relative"
                style={{
                  transform: `translateY(-${yOffset}px) scale(${scale})`,
                  opacity: opacity,
                  zIndex: brands.length - index,
                }}
              >
                <div className={`rounded-3xl overflow-hidden shadow-2xl ${brand.color} h-[350px] md:h-[380px] flex items-center relative group hover:shadow-3xl transition-all duration-500`}>
                  {/* Content */}
                  <div className="flex-1 p-8 md:p-12 z-10 relative">
                    <div className={brand.textColor}>
                      <h1 className="text-4xl md:text-6xl lg:text-7xl font-light mb-6 tracking-wide">
                        {brand.name}
                      </h1>
                      <p className="text-xs md:text-sm font-semibold tracking-[0.2em] mb-8 opacity-90 uppercase">
                        {brand.tagline}
                      </p>
                      <p className="text-sm md:text-base leading-relaxed opacity-85 max-w-2xl">
                        {brand.description}
                      </p>
                    </div>
                  </div>

                  {/* Refined Decorative Elements */}
                  <div className="absolute right-8 top-1/2 transform -translate-y-1/2 opacity-10">
                    <div className="w-32 h-32 md:w-40 md:h-40 rounded-full border border-white"></div>
                  </div>
                  <div className="absolute right-16 top-1/2 transform -translate-y-1/2 opacity-5">
                    <div className="w-20 h-20 md:w-28 md:h-28 rounded-full border border-white"></div>
                  </div>

                  {/* Subtle gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/5 pointer-events-none"></div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
