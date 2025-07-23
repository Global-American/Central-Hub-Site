"use client"

import { useState, useEffect, useRef } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { X, Plus, Minus, ExternalLink, MapPin } from "lucide-react"
import Image from "next/image"

// Warehouse location data
const warehouseLocations = [
  {
    id: "dublin",
    city: "Dublin",
    country: "Ireland",
    lat: 53.3498,
    lng: -6.2603,
    image: "/images/warehouses/dublin.jpg",
    description: "Our European distribution hub spans 200,000 sq ft with advanced automation systems, strategic location for EU market access, and comprehensive cold chain capabilities for temperature-sensitive goods.",
    features: ["200,000 sq ft", "EU Distribution Hub", "Cold Chain", "Automated Systems"]
  },
  {
    id: "atlanta",
    city: "Atlanta",
    country: "United States",
    lat: 33.7490,
    lng: -84.3880,
    image: "/images/warehouses/atlanta.jpg", 
    description: "Southeast regional facility featuring 350,000 sq ft of modern warehouse space, rail connectivity, and proximity to Hartsfield-Jackson Airport for rapid air freight distribution.",
    features: ["350,000 sq ft", "Rail Connected", "Airport Proximity", "Southeast Hub"]
  },
  {
    id: "los-angeles",
    city: "Los Angeles", 
    country: "United States",
    lat: 34.0522,
    lng: -118.2437,
    image: "/images/warehouses/los-angeles.jpg",
    description: "Pacific Rim gateway with 450,000 sq ft capacity, direct port access, cross-docking capabilities, and specialized handling for high-value electronics and automotive parts.",
    features: ["450,000 sq ft", "Port Access", "Cross-Docking", "Pacific Gateway"]
  },
  {
    id: "sydney",
    city: "Sydney",
    country: "Australia", 
    lat: -33.8688,
    lng: 151.2093,
    image: "/images/warehouses/sydney.jpg",
    description: "Asia-Pacific distribution center offering 180,000 sq ft of flexible storage, pharmaceutical-grade facilities, and integration with major Australian transport networks.",
    features: ["180,000 sq ft", "APAC Center", "Pharma Grade", "Transport Hub"]
  },
  {
    id: "london",
    city: "London",
    country: "United Kingdom", 
    lat: 51.5074,
    lng: -0.1278,
    image: "/images/warehouses/london.jpg",
    description: "UK headquarters facility with 275,000 sq ft including e-commerce fulfillment center, returns processing hub, and direct connections to major UK motorway networks.",
    features: ["275,000 sq ft", "E-commerce Hub", "Returns Center", "UK Headquarters"]
  },
  {
    id: "toronto",
    city: "Toronto",
    country: "Canada",
    lat: 43.6532,
    lng: -79.3832, 
    image: "/images/warehouses/toronto.jpg",
    description: "Canadian operations center spanning 225,000 sq ft with bilingual staff, customs brokerage services, and strategic position for North American distribution networks.",
    features: ["225,000 sq ft", "Bilingual Staff", "Customs Services", "Canadian Gateway"]
  }
]

export default function WarehouseLocationsSection() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [mapZoom, setMapZoom] = useState(2)
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)
  const mapRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handlePinClick = (locationId: string) => {
    setSelectedLocation(locationId)
  }

  const handleCloseCard = () => {
    setSelectedLocation(null)
  }

  const handleZoomIn = () => {
    setMapZoom(prev => Math.min(prev + 1, 6))
  }

  const handleZoomOut = () => {
    setMapZoom(prev => Math.max(prev - 1, 1))
  }

  const selectedLocationData = warehouseLocations.find(loc => loc.id === selectedLocation)

  return (
    <section ref={sectionRef} id="warehouse-locations" className="py-16 md:py-20 bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className={`text-center mb-12 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-light text-foreground mb-4">
            <span className="font-bold">Unlimited capacity</span>, global reach
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Our strategically positioned warehouses across three continents ensure your goods are always close to your customers.
          </p>
        </div>

        {/* Map Container */}
        <div className={`relative w-full h-[600px] md:h-[700px] rounded-2xl overflow-hidden shadow-2xl transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          {/* World Map Background */}
          <div 
            ref={mapRef}
            className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 1200 600'%3E%3Cpath d='M200 300 Q300 250 400 300 T600 300 Q700 350 800 300 T1000 300' fill='none' stroke='%23e5e7eb' stroke-width='2'/%3E%3Ccircle cx='300' cy='200' r='3' fill='%23d1d5db'/%3E%3Ccircle cx='600' cy='180' r='3' fill='%23d1d5db'/%3E%3Ccircle cx='900' cy='220' r='3' fill='%23d1d5db'/%3E%3Cpath d='M100 400 Q200 350 300 400 Q400 450 500 400 Q600 350 700 400' fill='none' stroke='%23e5e7eb' stroke-width='1'/%3E%3C/svg%3E")`,
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            {/* Location Pins */}
            {warehouseLocations.map((location, index) => (
              <button
                key={location.id}
                onClick={() => handlePinClick(location.id)}
                className={`absolute transform -translate-x-1/2 -translate-y-full transition-all duration-300 hover:scale-110 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-50 ${
                  isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                }`}
                style={{
                  left: `${((location.lng + 180) / 360) * 100}%`,
                  top: `${((90 - location.lat) / 180) * 100}%`,
                  transitionDelay: `${index * 100}ms`
                }}
                aria-label={`View ${location.city} warehouse details`}
              >
                <div className="relative">
                  <div className="w-6 h-6 bg-purple-600 rounded-full shadow-lg border-2 border-white flex items-center justify-center">
                    <MapPin className="h-3 w-3 text-white" />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-purple-600 rotate-45"></div>
                </div>
                
                {/* Location Label */}
                <div className="absolute top-8 left-1/2 transform -translate-x-1/2 whitespace-nowrap">
                  <span className="text-xs font-medium text-slate-700 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md shadow-sm">
                    {location.city}
                  </span>
                </div>
              </button>
            ))}
          </div>

          {/* Zoom Controls */}
          <div className="absolute bottom-6 right-6 flex flex-col space-y-2 z-30">
            <Button
              size="sm"
              variant="outline"
              onClick={handleZoomIn}
              className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white border-slate-200"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <Button
              size="sm" 
              variant="outline"
              onClick={handleZoomOut}
              className="w-10 h-10 p-0 bg-white/90 backdrop-blur-sm hover:bg-white border-slate-200"
            >
              <Minus className="h-4 w-4" />
            </Button>
          </div>

          {/* Location Card Popup */}
          {selectedLocationData && (
            <div className="absolute inset-0 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm z-40">
              <Card className="w-full max-w-md bg-white shadow-2xl border-0 rounded-2xl overflow-hidden transform transition-all duration-300 scale-100">
                <div className="relative">
                  {/* Warehouse Image */}
                  <div className="relative h-48 bg-gradient-to-br from-slate-200 to-slate-300">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-slate-500">
                        <div className="w-16 h-16 bg-slate-400 rounded-lg mx-auto mb-2 flex items-center justify-center">
                          <MapPin className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-sm">Warehouse Image</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Close Button */}
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={handleCloseCard}
                    className="absolute top-3 right-3 w-8 h-8 p-0 bg-white/80 backdrop-blur-sm hover:bg-white rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <CardContent className="p-6">
                  {/* Country Badge */}
                  <Badge variant="outline" className="mb-3 text-xs font-medium">
                    {selectedLocationData.country}
                  </Badge>
                  
                  {/* City Title */}
                  <h3 className="text-2xl font-bold text-foreground mb-3">
                    {selectedLocationData.city}
                  </h3>
                  
                  {/* Description */}
                  <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                    {selectedLocationData.description}
                  </p>
                  
                  {/* Features */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {selectedLocationData.features.map((feature, index) => (
                      <span
                        key={index}
                        className="text-xs bg-slate-100 text-slate-700 px-2 py-1 rounded-md"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                  
                  {/* View All Locations Link */}
                  <Button
                    variant="outline"
                    className="w-full text-sm font-medium"
                    onClick={() => console.log('View all locations clicked')}
                  >
                    View all locations
                    <ExternalLink className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </section>
  )
} 