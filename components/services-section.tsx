"use client"

import Image from "next/image"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { brands } from "@/lib/brands"

export default function ServicesSection() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return (
    <section ref={sectionRef} id="services" className="py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Badge variant="outline" className="text-xs border-accent text-accent bg-accent/10 mb-4">
            Our Services
          </Badge>
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Smart Logistics <span className="text-accent">Solutions</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Four dedicated platforms covering shipping, freight, returns and fulfillment, built to power your
            business growth.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6 lg:gap-8 max-w-6xl mx-auto">
          {brands.map((brand, index) => (
            <Card
              key={brand.id}
              className={`group flex flex-col border-2 border-[#1F447B]/20 hover:border-[#EB993C]/50 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden bg-gradient-to-br from-white to-slate-50 ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 75}ms` }}
            >
              <div className="relative h-48 sm:h-56 bg-[#1F447B]/5 overflow-hidden">
                <Image
                  src={brand.image}
                  alt={`${brand.name} illustration`}
                  fill
                  sizes="(min-width: 768px) 560px, 100vw"
                  className="object-contain scale-110 group-hover:scale-[1.15] transition-transform duration-500"
                />
              </div>
              <CardContent className="flex flex-1 flex-col p-6 md:p-8">
                <h2 className="sr-only">{brand.name}</h2>
                <Image
                  src={brand.logoColor}
                  alt={`${brand.name} logo`}
                  width={1480}
                  height={390}
                  sizes="240px"
                  className="h-10 md:h-12 w-auto object-contain object-left mb-4"
                />
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed mb-6">
                  {brand.summary}
                </p>
                <div className="mt-auto flex flex-wrap items-center justify-between gap-4">
                  <span className="text-sm font-semibold italic text-[#1F447B]">{brand.tagline}</span>
                  <Button
                    asChild
                    className="bg-[#EB993C] hover:bg-[#EB993C]/90 text-white rounded-full px-5"
                  >
                    <a
                      href={brand.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Visit ${brand.name}`}
                    >
                      Visit Site <ArrowRight className="ml-2 h-4 w-4" />
                    </a>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
