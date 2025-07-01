"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel"
import { Star, Quote } from "lucide-react"
import Autoplay from "embla-carousel-autoplay"

export default function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const [count, setCount] = useState(0)
  const sectionRef = useRef<HTMLElement>(null)
  
  const autoplay = useRef(
    Autoplay({ 
      delay: 3000, 
      stopOnInteraction: false,
      stopOnMouseEnter: true,
      playOnInit: true
    })
  )

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

  useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  const testimonials = [
    {
      id: 1,
      name: "Sarah Chen",
      title: "Supply Chain Director",
      company: "TechFlow Industries",
      rating: 5,
      content: "Global American transformed our shipping operations completely. Their ShipItSmart platform reduced our logistics costs by 35% while improving delivery times. The team's expertise in international freight is unmatched.",
      avatar: "SC"
    },
    {
      id: 2,
      name: "Michael Rodriguez",
      title: "Operations Manager",
      company: "Coastal Manufacturing",
      rating: 5,
      content: "Working with Global American has been a game-changer for our business. Their FreightItSmart solution streamlined our supply chain, and their customer service is exceptional. Highly recommend their services.",
      avatar: "MR"
    },
    {
      id: 3,
      name: "Emily Thompson",
      title: "Logistics Coordinator",
      company: "Prime Retailers",
      rating: 5,
      content: "The FulfillItSmart platform exceeded our expectations. From order processing to final delivery, everything runs smoothly. Their technology integration saved us countless hours and significantly improved our customer satisfaction.",
      avatar: "ET"
    },
    {
      id: 4,
      name: "David Kim",
      title: "CEO",
      company: "Innovation Labs",
      rating: 5,
      content: "Global American's expertise in international shipping helped us expand into new markets seamlessly. Their ReturnItSmart service handles all our reverse logistics efficiently. Couldn't ask for a better partner.",
      avatar: "DK"
    },
    {
      id: 5,
      name: "Lisa Martinez",
      title: "Procurement Manager",
      company: "Global Ventures",
      rating: 5,
      content: "The level of service and attention to detail from Global American is outstanding. They've consistently delivered on their promises and helped optimize our entire supply chain. Truly a reliable logistics partner.",
      avatar: "LM"
    },
    {
      id: 6,
      name: "James Wilson",
      title: "Distribution Director",
      company: "Apex Solutions",
      rating: 5,
      content: "Their comprehensive approach to logistics management has been invaluable. From air freight to ground shipping, Global American handles everything with precision. Our shipping times have improved by 40%.",
      avatar: "JW"
    },
    {
      id: 7,
      name: "Amanda Foster",
      title: "VP of Operations",
      company: "NextGen Enterprises",
      rating: 5,
      content: "Global American's technology stack is impressive. The real-time tracking and analytics have given us complete visibility into our supply chain. Their API integration was seamless and their support team is top-notch.",
      avatar: "AF"
    },
    {
      id: 8,
      name: "Robert Chang",
      title: "Logistics Manager",
      company: "Pacific Trade Co.",
      rating: 5,
      content: "Managing international shipments has never been easier. Global American's customs clearance expertise saved us weeks of delays. Their comprehensive documentation and compliance support is exceptional.",
      avatar: "RC"
    },
    {
      id: 9,
      name: "Jennifer Davis",
      title: "E-commerce Director",
      company: "Urban Fashion Hub",
      rating: 5,
      content: "The FulfillItSmart solution transformed our e-commerce operations. Same-day processing, accurate inventory management, and fast shipping have increased our customer satisfaction scores by 60%.",
      avatar: "JD"
    },
    {
      id: 10,
      name: "Carlos Mendez",
      title: "Supply Chain Lead",
      company: "Industrial Solutions Inc.",
      rating: 5,
      content: "Global American's freight consolidation services have been a game-changer. We've reduced shipping costs by 45% while maintaining delivery speed. Their network coverage is truly global.",
      avatar: "CM"
    },
    {
      id: 11,
      name: "Rachel Johnson",
      title: "Operations Director",
      company: "Sustainable Goods Co.",
      rating: 5,
      content: "Their commitment to sustainable logistics aligns perfectly with our values. Carbon-neutral shipping options and detailed environmental impact reports help us meet our sustainability goals.",
      avatar: "RJ"
    },
    {
      id: 12,
      name: "Kevin Park",
      title: "Founder & CEO",
      company: "StartUp Dynamics",
      rating: 5,
      content: "As a growing startup, we needed a logistics partner that could scale with us. Global American's flexible solutions and competitive pricing have been crucial to our expansion into new markets.",
      avatar: "KP"
    },
    {
      id: 13,
      name: "Maria Santos",
      title: "Import/Export Manager",
      company: "Global Trade Partners",
      rating: 5,
      content: "The ReturnItSmart system has revolutionized our reverse logistics. Processing returns is now automated and efficient, saving us 30+ hours per week while improving customer experience.",
      avatar: "MS"
    },
    {
      id: 14,
      name: "Thomas Anderson",
      title: "Warehouse Manager",
      company: "Distribution Plus",
      rating: 5,
      content: "Global American's warehouse management integration is flawless. Real-time inventory updates, automated reordering, and seamless pick-and-pack operations have increased our efficiency by 50%.",
      avatar: "TA"
    },
    {
      id: 15,
      name: "Sophie Williams",
      title: "Chief Technology Officer",
      company: "Digital Innovations",
      rating: 5,
      content: "The API documentation and developer support are outstanding. We integrated their shipping APIs into our platform in just two days. The webhook notifications keep our customers informed in real-time.",
      avatar: "SW"
    }
  ]

  return (
    <section ref={sectionRef} id="testimonials" className="py-20 md:py-28 lg:py-36 bg-background">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div
          className={`text-center mb-12 lg:mb-20 transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <Badge variant="outline" className="text-xs border-accent text-accent bg-accent/10 mb-4">
            Customer Stories
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            What Our <span className="text-accent">Clients Say</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            Don't just take our word for it. Hear from the businesses that trust Global American 
            to power their logistics operations worldwide.
          </p>
        </div>

        {/* Testimonials Carousel */}
        <div
          className={`transition-all duration-1000 ease-out ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
          style={{ transitionDelay: "300ms" }}
        >
          <Carousel
            setApi={setApi}
            plugins={[autoplay.current]}
            opts={{
              align: "start",
              loop: true,
              dragFree: true,
              containScroll: "trimSnaps",
            }}
            className="w-full max-w-7xl mx-auto"
          >
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={testimonial.id} className="pl-2 md:pl-4 md:basis-1/2 lg:basis-1/3">
                  <Card
                    className={`h-full border-0 shadow-sm hover:shadow-xl transition-all duration-500 ease-out bg-[#f6fdfe] hover:scale-105 ${
                      isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                    }`}
                    style={{ transitionDelay: `${index * 100}ms` }}
                  >
                    <CardContent className="p-6 lg:p-8 h-full flex flex-col">
                      {/* Quote Icon */}
                      <div className="mb-4 flex items-center justify-between">
                        <Quote className="h-8 w-8 text-accent/30" />
                        <div className="flex items-center space-x-1">
                          {Array.from({ length: testimonial.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                          ))}
                        </div>
                      </div>

                      {/* Testimonial Content */}
                      <blockquote className="text-base lg:text-lg text-foreground mb-6 flex-grow leading-relaxed">
                        "{testimonial.content}"
                      </blockquote>

                      {/* Author Info */}
                      <div className="flex items-center space-x-4 mt-auto">
                        <div className="flex-shrink-0 w-12 h-12 bg-accent/10 rounded-full flex items-center justify-center">
                          <span className="text-sm font-semibold text-accent">
                            {testimonial.avatar}
                          </span>
                        </div>
                        <div>
                          <div className="font-semibold text-foreground text-base lg:text-lg">
                            {testimonial.name}
                          </div>
                          <div className="text-sm lg:text-base text-muted-foreground">
                            {testimonial.title}
                          </div>
                          <div className="text-sm lg:text-base font-medium text-accent">
                            {testimonial.company}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Progress Indicators Only */}
          <div className="flex justify-center mt-8">
            <div className="flex space-x-2">
              {Array.from({ length: count }).map((_, index) => (
                <button
                  key={index}
                  className={`h-2 rounded-full transition-all duration-500 ease-out ${
                    index === current - 1 ? "bg-accent w-8" : "bg-accent/30 hover:bg-accent/50 w-2"
                  }`}
                  onClick={() => api?.scrollTo(index)}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
} 