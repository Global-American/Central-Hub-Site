"use client"

import { useState, useEffect, useRef, useCallback } from "react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { ScrollArea } from "@/components/ui/scroll-area"
import { 
  MapPin, 
  ExternalLink
} from "lucide-react"
import Image from "next/image"

// Enhanced warehouse location data
const warehouseLocations = [
    {
    id: "new-york",
    city: "New York",
    country: "United States",
    countryCode: "US",
    lat: 40.7128,
    lng: -74.0060,
    address: "Brooklyn Navy Yard, Brooklyn, NY 11205",
    image: "/images/warehouses/new-york.jpg",
    description: "Our flagship North American distribution hub strategically positioned to serve the entire East Coast with advanced logistics capabilities and multimodal transport connections.",
    features: ["Primary Hub", "East Coast Gateway", "Multimodal Transport"]
  },
  {
    id: "belfast",
    city: "Belfast",
    country: "Northern Ireland",
    countryCode: "GB",
    lat: 54.5973,
    lng: -5.9301,
    address: "Belfast Harbour Industrial Estate, Belfast BT3 9JH",
    image: "/images/warehouses/belfast.jpg",
    description: "Northern Ireland operations center providing comprehensive logistics solutions with direct access to UK and EU markets through strategic port connections.",
    features: ["UK-EU Gateway", "Port Access", "Cross-Border Logistics"]
  },
  {
    id: "dublin",
    city: "Dublin",
    country: "Republic of Ireland",
    countryCode: "IE",
    lat: 53.3498,
    lng: -6.2603,
    address: "Dublin Port Industrial Estate, Dublin 3, Ireland",
    image: "/images/warehouses/dublin.jpg",
    description: "European Union distribution hub with advanced automation systems, strategic location for EU market access, and comprehensive logistics capabilities.",
    features: ["EU Distribution Hub", "Automated Systems", "Cold Chain"]
  },
  {
    id: "manchester",
    city: "Manchester",
    country: "United Kingdom",
    countryCode: "GB",
    lat: 53.4808,
    lng: -2.2426,
    address: "Manchester Airport Cargo Centre, Manchester M90 1QX",
    image: "/images/warehouses/manchester.jpg",
    description: "UK headquarters facility with comprehensive e-commerce fulfillment capabilities and direct connections to major UK transport networks.",
    features: ["UK Headquarters", "E-commerce Hub", "Transport Networks"]
  }
]

// Country flag emojis
const countryFlags: { [key: string]: string } = {
  "IE": "🇮🇪",
  "US": "🇺🇸", 
  "AU": "🇦🇺",
  "GB": "🇬🇧",
  "CA": "🇨🇦"
}



export default function WarehouseLocationsSection() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null)
  const [isVisible, setIsVisible] = useState(false)
  const [mapLoaded, setMapLoaded] = useState(false)
  const sectionRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          // Simulate map loading
          setTimeout(() => setMapLoaded(true), 500)
        }
      },
      { threshold: 0.2 }
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => observer.disconnect()
  }, [])

  const handleLocationSelect = useCallback((locationId: string) => {
    setSelectedLocation(locationId)
  }, [])

  const selectedLocationData = warehouseLocations.find(loc => loc.id === selectedLocation)

  // Generate map URL based on selection
  const getMapUrl = useCallback(() => {
    if (!mapLoaded) return ""
    
    if (selectedLocationData) {
      // Individual location view
      return `https://maps.google.com/maps?q=${selectedLocationData.lat},${selectedLocationData.lng}&hl=en&z=15&output=embed`
    } else {
      // Global view with all locations
      const allCoords = warehouseLocations.map(loc => `${loc.lat},${loc.lng}`).join('|')
      return `https://maps.google.com/maps?q=${warehouseLocations[0].lat},${warehouseLocations[0].lng}&hl=en&z=2&output=embed`
    }
  }, [selectedLocationData, mapLoaded])

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

        {/* Main Interface Container */}
        <div className={`relative w-full h-[700px] lg:h-[800px] rounded-2xl overflow-hidden shadow-2xl bg-white transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}>
          <div className="flex h-full">
            
            {/* Left Panel - Interactive Location List */}
            <div className="w-full lg:w-2/5 bg-white border-r border-slate-200">
                            {/* Panel Header */}
              <div className="p-6 border-b border-slate-200 bg-slate-50">
                <div>
                  <h3 className="text-xl font-bold text-foreground">Global Locations</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {warehouseLocations.length} facilities worldwide
                  </p>
                </div>
              </div>
                
              {/* Scrollable Location List */}
              <ScrollArea className="h-full">
                <div className="p-2">
                  {warehouseLocations.map((location, index) => (
                    <Card 
                      key={location.id}
                      className={`mb-3 cursor-pointer transition-all duration-200 border hover:shadow-md ${
                        selectedLocation === location.id 
                          ? 'ring-2 ring-blue-500 bg-blue-50' 
                          : 'hover:bg-slate-50'
                      }`}
                      onClick={() => handleLocationSelect(location.id)}
                    >
                      <CardContent className="p-4">
                                                <div className="flex items-center gap-3 mb-3">
                          <div className="text-2xl">
                            {countryFlags[location.countryCode]}
                          </div>
                          <div>
                            <h4 className="font-semibold text-foreground text-lg">
                              {location.city}
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {location.country}
                            </p>
                          </div>
                        </div>

                                                {/* Simple description */}
                        <p className="text-sm text-muted-foreground leading-relaxed mt-2">
                          {location.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Right Panel - Dynamic Map Interface */}
            <div className="hidden lg:flex lg:w-3/5 flex-col bg-slate-100">
              {/* Map Header */}
              {selectedLocationData && (
                <div className="p-4 bg-white border-b border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3">
                    <div className="text-xl">
                      {countryFlags[selectedLocationData.countryCode]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-lg text-foreground">
                        {selectedLocationData.city}
                      </h4>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" />
                        <span>{selectedLocationData.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Map Container */}
              <div className="flex-1 relative">
                {mapLoaded ? (
                  <iframe
                    src={getMapUrl()}
                    className="w-full h-full border-0"
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={selectedLocationData ? `${selectedLocationData.city} location` : "Global warehouse locations"}
                  />
                ) : (
                  <div className="w-full h-full bg-slate-200 flex items-center justify-center">
                    <div className="text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                      <p className="text-slate-600">Loading map...</p>
                    </div>
                  </div>
                )}
              </div>

              
            </div>
          </div>
        </div>

        {/* Mobile View Enhancement */}
        <div className="lg:hidden mt-6">
          {selectedLocationData && (
            <Card className="bg-white shadow-lg">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="text-xl">
                    {countryFlags[selectedLocationData.countryCode]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg">{selectedLocationData.city}</h4>
                    <p className="text-sm text-muted-foreground">{selectedLocationData.country}</p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4 text-slate-600" />
                    <span className="text-slate-600">{selectedLocationData.address}</span>
                  </div>
                  
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {selectedLocationData.description}
                  </p>
                  
                  <Button
                    className="w-full"
                    onClick={() => window.open(`https://maps.google.com/maps?q=${selectedLocationData.lat},${selectedLocationData.lng}`, '_blank')}
                  >
                    <ExternalLink className="h-4 w-4 mr-2" />
                    View on Map
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </section>
  )
} 