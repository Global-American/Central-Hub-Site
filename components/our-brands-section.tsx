"use client"

import { useRef, useEffect, useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ArrowRight, Building2 } from "lucide-react"
import { gsap } from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"
import Image from "next/image"

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger)
}

// Data for the brand cards
const brands = [
  {
    id: 1,
    name: "ShipItSmart",
    tagline: "GLOBAL SHIPPING. SIMPLIFIED.",
    description: "The world's leading brands trust ShipItSmart to streamline their shipping operations with unparalleled speed and precision. Our platform connects you to global carriers, optimizes routes, and provides real-time tracking—making international shipping smarter and more efficient.",
    color: "bg-gradient-to-br from-[#EB993C] to-[#d88730]",
    textColor: "text-white",
    image: "/images/card-thumbnails/holo-shipit.png"
  },
  {
    id: 2,
    name: "FreightItSmart",
    tagline: "FREIGHT MANAGEMENT. REINVENTED.",
    description: "FreightItSmart is revolutionizing freight logistics, connecting businesses to top freight carriers and services with a single integration. Smart routing algorithms, advanced optimization, and comprehensive tracking make heavy cargo transportation faster, leaner, and more cost-effective.",
    color: "bg-gradient-to-br from-[#14529f] to-[#0f3c75]",
    textColor: "text-white",
    image: "/images/card-thumbnails/holo-frieghtit.png"
  },
  {
    id: 3,
    name: "ReturnItSmart",
    tagline: "REVERSE LOGISTICS. PERFECTED.",
    description: "ReturnItSmart transforms the returns process into a competitive advantage. Our intelligent reverse logistics platform streamlines return authorization, optimizes return routing, and maximizes recovery value—turning returns from a cost center into a customer satisfaction driver.",
    color: "bg-gradient-to-br from-[#EB993C] to-[#d88730]",
    textColor: "text-white",
    image: "/images/card-thumbnails/returnit.png"
  },
  {
    id: 4,
    name: "FulfillItSmart",
    tagline: "END-TO-END FULFILLMENT. EXCELLENCE.",
    description: "FulfillItSmart is the ultimate fulfillment solution, seamlessly integrating order processing, inventory management, and distribution. From order to delivery, our platform ensures accurate, fast, and cost-effective fulfillment that scales with your business growth.",
    color: "bg-gradient-to-br from-[#14529f] to-[#0f3c75]",
    textColor: "text-white",
    image: "/images/card-thumbnails/holo-fufillit.png"
  }
]



export default function OurBrandsSection() {
  const sectionRef = useRef<HTMLElement>(null)
  const cardsContainerRef = useRef<HTMLDivElement>(null)


  const handleLearnMoreClick = (e: React.MouseEvent) => {
    e.preventDefault()
    console.log("Learn More clicked!")
  }

  useEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLDivElement>(".brand-card-item")
      if (cards.length <= 1) return

      // Animate the first card in on page load
      gsap.from(cards[0], {
        opacity: 0,
        y: 100,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3,
      })

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${(cards.length - 1) * window.innerHeight}`,
        },
      })

      // Animation logic for a cleaner stack
      cards.slice(0, -1).forEach((card, index) => {
        const nextCard = cards[index + 1];

        // Animate the next card coming up from the bottom
        timeline.fromTo(
          nextCard,
          { yPercent: 100 },
          { yPercent: 0, ease: "power2.inOut" }
        )
          // At the same time, scale down the current card to create the stacking effect
          .to(
            card,
            { scale: 0.95, ease: "power2.inOut" },
            "<" // The "<" ensures this animation starts at the same time as the previous one
          )
      })

    }, sectionRef)

    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} id="brands" className="relative h-screen overflow-hidden">
      <div ref={cardsContainerRef} className="absolute inset-0 flex items-center justify-center">
        {brands.map((brand, i) => (
          <div
            key={brand.id}
            className="brand-card-item absolute flex h-full w-full items-center justify-center p-4 md:p-8"
            style={{ zIndex: i }}
          >
            {/* Inner wrapper for border and styling */}
            <div className={`relative w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl ${brand.color} border border-white/10`}>


              <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10">
                <div className="p-8 md:p-12 lg:p-16 flex flex-col justify-center">
                  <div className={brand.textColor}>
                    <div className="mb-6">
                      <Badge variant="outline" className="border-white/20 bg-white/10 text-white mb-4 backdrop-blur-sm">
                        {brand.tagline}
                      </Badge>
                      <div className="flex items-center gap-4">
                        <Building2 className="h-10 w-10 opacity-80" />
                        <h3 className="text-4xl md:text-5xl font-bold tracking-tight">{brand.name}</h3>
                      </div>
                    </div>
                    <p className="text-base md:text-lg leading-relaxed opacity-90 mb-8">{brand.description}</p>
                    <div>
                      <Button
                        size="lg"
                        onClick={handleLearnMoreClick}
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm text-lg px-8 py-6 font-semibold transition-all hover:scale-105"
                      >
                        Learn More <ArrowRight className="ml-2 h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="relative hidden lg:block h-full min-h-[400px]">
                  {/* Brand Image Container */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    {brand.image ? (
                      <div className={`relative ${brand.name === 'ReturnItSmart' ? 'w-3/4 h-3/4' : 'w-full h-full'}`}>
                        <Image
                          src={brand.image}
                          alt={`${brand.name} illustration`}
                          fill
                          className="object-contain opacity-80 hover:opacity-100 transition-opacity duration-300"
                          sizes="(max-width: 1024px) 100vw, 50vw"
                        />

                      </div>
                    ) : (
                      // Fallback decorative elements if no image
                      <div className="relative w-full h-full">
                        <div className="absolute top-1/4 right-1/4 w-48 h-48 rounded-full border-4 border-white/10 backdrop-blur-sm animate-spin-slow"></div>
                        <div className="absolute bottom-1/4 right-1/3 w-64 h-64 rounded-full border-2 border-white/5 animate-pulse"></div>
                        <div className="absolute top-1/3 right-1/2 w-40 h-40 rounded-full bg-white/5 backdrop-blur-sm"></div>
                      </div>
                    )}
                  </div>
                  
                  {/* Subtitle Section with Tagline */}
                  <div className="absolute bottom-6 left-6 right-6 z-20">
                    <div className="bg-white/10 backdrop-blur-md rounded-lg p-4 border border-white/20">
                      <div className="text-center">
                        <h4 className="text-white text-sm md:text-base font-bold tracking-tight leading-tight">
                          {brand.tagline}
                        </h4>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}