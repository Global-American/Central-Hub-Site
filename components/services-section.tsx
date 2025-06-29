"use client"

import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plane, Ship, Truck, Package, Globe2, Warehouse, ArrowRight } from "lucide-react"
import { useEffect, useRef, useState } from "react"

const services = [
  {
    icon: <Plane className="h-8 w-8" />,
    title: "Air Freight",
    description: "Fast, reliable air cargo solutions for urgent shipments with global reach and real-time tracking.",
    highlight: "Express",
  },
  {
    icon: <Ship className="h-8 w-8" />,
    title: "Ocean Freight",
    description: "Cost-effective sea freight solutions for large volumes with LCL and FCL options worldwide.",
    highlight: "Economical",
  },
  {
    icon: <Truck className="h-8 w-8" />,
    title: "Express Courier",
    description: "US domestic + international express delivery with premium handling and expedited service.",
    highlight: "Premium",
  },
  {
    icon: <Package className="h-8 w-8" />,
    title: "Returns",
    description: "Streamlined returns processing and reverse logistics that enhance customer satisfaction.",
    highlight: "Efficient",
  },
  {
    icon: <Globe2 className="h-8 w-8" />,
    title: "Global Last Mile",
    description: "UK + Europe & US last-mile delivery with local expertise in every destination market.",
    highlight: "Local Expertise",
  },
  {
    icon: <Warehouse className="h-8 w-8" />,
    title: "3PL",
    description: "Complete third-party logistics with warehousing, fulfillment, and inventory management.",
    highlight: "Complete Solution",
  },
]

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
    <section ref={sectionRef} id="services" className="py-16 md:py-20 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <Badge variant="outline" className="text-xs border-accent text-accent bg-accent/10 mb-4">
            Our Services
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Smart Logistics <span className="text-accent">Solutions</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            From air freight to fulfillment, we deliver intelligent logistics solutions that power your business growth.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {services.map((service, index) => (
            <Card
              key={service.title}
              className={`group border-0 shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${
                isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
              }`}
              style={{ transitionDelay: `${index * 50}ms` }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center justify-center w-12 h-12 bg-accent/10 rounded-xl text-accent group-hover:scale-110 transition-transform duration-300">
                    {service.icon}
                  </div>
                  <span className="text-xs font-medium text-accent bg-accent/10 px-2 py-1 rounded-full">
                    {service.highlight}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-3">{service.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{service.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
