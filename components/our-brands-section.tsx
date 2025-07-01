"use client"

import { useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2 } from "lucide-react"
import Link from "next/link"

const brands = [
  {
    id: 1,
    name: "ShipItSmart",
    tagline: "GLOBAL SHIPPING. SIMPLIFIED.",
    description: "The world's leading brands trust ShipItSmart to streamline their shipping operations with unparalleled speed and precision. Our platform connects you to global carriers, optimizes routes, and provides real-time tracking—making international shipping smarter and more efficient.",
    color: "bg-gradient-to-br from-[#EB993C] to-[#d88730]",
    textColor: "text-white"
  },
  {
    id: 2,
    name: "FreightItSmart",
    tagline: "FREIGHT MANAGEMENT. REINVENTED.",
    description: "FreightItSmart is revolutionizing freight logistics, connecting businesses to top freight carriers and services with a single integration. Smart routing algorithms, advanced optimization, and comprehensive tracking make heavy cargo transportation faster, leaner, and more cost-effective.",
    color: "bg-gradient-to-br from-[#14529f] to-[#0f3c75]",
    textColor: "text-white"
  },
  {
    id: 3,
    name: "ReturnItSmart",
    tagline: "REVERSE LOGISTICS. PERFECTED.",
    description: "ReturnItSmart transforms the returns process into a competitive advantage. Our intelligent reverse logistics platform streamlines return authorization, optimizes return routing, and maximizes recovery value—turning returns from a cost center into a customer satisfaction driver.",
    color: "bg-gradient-to-br from-[#EB993C] to-[#d88730]",
    textColor: "text-white"
  },
  {
    id: 4,
    name: "FulfillItSmart",
    tagline: "END-TO-END FULFILLMENT. EXCELLENCE.",
    description: "FulfillItSmart is the ultimate fulfillment solution, seamlessly integrating order processing, inventory management, and distribution. From order to delivery, our platform ensures accurate, fast, and cost-effective fulfillment that scales with your business growth.",
    color: "bg-gradient-to-br from-[#14529f] to-[#0f3c75]",
    textColor: "text-white"
  }
]

export default function OurBrandsSection() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section ref={sectionRef} id="brands" className="py-24 md:py-32 lg:py-40 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-20 lg:mb-28">
          <Badge variant="secondary" className="mb-6 text-primary">
            <Building2 size={16} className="mr-2" />
            Our Services
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-8">
            Smart <span className="text-accent">Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We offer comprehensive logistics solutions through our specialized service platforms, 
            each designed to optimize specific aspects of your supply chain and drive operational excellence.
          </p>
        </div>

        {/* Stacked Brand Cards */}
        <div className="relative max-w-6xl xl:max-w-7xl mx-auto space-y-20 lg:space-y-24">
          {brands.map((brand, index) => (
            <div
              key={brand.id}
              className="relative rounded-3xl overflow-hidden shadow-xl hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1"
            >
              <div className={`${brand.color}`}>
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  {/* Content Side */}
                  <div className="p-6 sm:p-8 md:p-12 lg:p-16 xl:p-20 z-10 relative">
                    <div className={brand.textColor}>
                      <div className="mb-8 lg:mb-12">
                        <h3 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">
                          {brand.name}
                        </h3>
                        <p className="text-xs sm:text-sm font-semibold tracking-[0.15em] sm:tracking-[0.2em] opacity-90 uppercase mt-1">
                          {brand.tagline}
                        </p>
                      </div>
                      
                      <p className="text-sm md:text-base leading-relaxed opacity-90 mb-8">
                        {brand.description}
                      </p>
                      
                      <Link href="#contact">
                        <Button 
                          variant="outline" 
                          size="lg"
                          className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm text-base lg:text-lg px-6 lg:px-8 py-3 lg:py-4 font-semibold"
                        >
                          Learn More <ArrowRight className="ml-2 h-5 w-5 lg:h-6 lg:w-6" />
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  {/* Visual Side */}
                  <div className="relative hidden lg:block h-full min-h-[400px] xl:min-h-[500px]">
                    {/* Abstract Decoration */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="relative w-full h-full">
                        <div className="absolute top-1/4 right-1/4 w-40 h-40 xl:w-48 xl:h-48 rounded-full border-4 border-white/10 backdrop-blur-sm"></div>
                        <div className="absolute bottom-1/4 right-1/3 w-56 h-56 xl:w-64 xl:h-64 rounded-full border-2 border-white/5"></div>
                        <div className="absolute top-1/3 right-1/2 w-32 h-32 xl:w-40 xl:h-40 rounded-full bg-white/5 backdrop-blur-sm"></div>
                      </div>
                    </div>
                    
                    {/* Gradient overlay */}
                    <div className="absolute inset-0 bg-gradient-to-l from-transparent to-black/30"></div>
                    
                    {/* Caption Section */}
                    <div className="absolute bottom-0 left-0 right-0 bg-black/20 backdrop-blur-sm border-t border-white/10">
                      <div className="px-6 py-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <h5 className="text-white font-semibold text-sm mb-1">
                              {brand.name === 'ShipItSmart' && 'International Shipping Platform'}
                              {brand.name === 'FreightItSmart' && 'Heavy Cargo Management'}
                              {brand.name === 'ReturnItSmart' && 'Reverse Logistics Solution'}
                              {brand.name === 'FulfillItSmart' && 'Complete Order Fulfillment'}
                            </h5>
                            <p className="text-white/80 text-xs">
                              {brand.name === 'ShipItSmart' && 'Global carrier network • Real-time tracking'}
                              {brand.name === 'FreightItSmart' && 'Optimization algorithms • Cost reduction'}
                              {brand.name === 'ReturnItSmart' && 'Return authorization • Value recovery'}
                              {brand.name === 'FulfillItSmart' && 'Inventory management • Distribution'}
                            </p>
                          </div>
                          <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                            brand.name === 'ShipItSmart' || brand.name === 'ReturnItSmart'
                              ? 'bg-orange-500/20 text-orange-200 border border-orange-400/30'
                              : 'bg-blue-500/20 text-blue-200 border border-blue-400/30'
                          }`}>
                            {brand.name === 'ShipItSmart' && 'Global'}
                            {brand.name === 'FreightItSmart' && 'Enterprise'}
                            {brand.name === 'ReturnItSmart' && 'Smart'}
                            {brand.name === 'FulfillItSmart' && 'Complete'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Card number indicator */}
              <div className="absolute top-0 right-0 w-12 h-12 flex items-center justify-center bg-white/10 backdrop-blur-sm rounded-bl-xl">
                <span className={`text-xl font-bold ${brand.textColor}`}>{index + 1}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
