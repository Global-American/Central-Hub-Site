"use client";

import { useState, useEffect, useRef, useCallback } from "react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MapPin, ExternalLink, RotateCcw } from "lucide-react";
import LogisticsGlobe from "@/components/logistics-globe";
import {
  warehouseLocations,
  globeHubs,
  mapsSearchUrl,
  mapsEmbedUrl,
} from "@/lib/warehouse-locations";

// Country flag emojis
const countryFlags: { [key: string]: string } = {
  IE: "🇮🇪",
  US: "🇺🇸",
  AU: "🇦🇺",
  GB: "🇬🇧",
  CA: "🇨🇦",
};

export default function WarehouseLocationsSection() {
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  // Check for URL parameters to preselect location and scroll into view
  useEffect(() => {
    if (typeof window !== "undefined") {
      const urlParams = new URLSearchParams(window.location.search);
      const locationParam = urlParams.get("location");
      if (
        locationParam &&
        warehouseLocations.find((loc) => loc.id === locationParam)
      ) {
        setSelectedLocation(locationParam);

        // Scroll to the section after a brief delay to ensure content is loaded
        setTimeout(() => {
          const section = document.getElementById("warehouse-locations");
          if (section) {
            const headerOffset = 100; // Height of fixed header + some padding
            const elementPosition = section.getBoundingClientRect().top;
            const offsetPosition =
              elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
              top: offsetPosition,
              behavior: "smooth",
            });
          }
        }, 300);
      }
    }
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const handleLocationSelect = useCallback((locationId: string) => {
    setSelectedLocation(locationId);
  }, []);

  const selectedLocationData = warehouseLocations.find(
    (loc) => loc.id === selectedLocation
  );


  return (
    <section
      ref={sectionRef}
      id="warehouse-locations"
      className="mt-0 pt-6 md:pt-8 lg:pt-10 pb-20 md:pb-24 lg:pb-28"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={`text-center mb-8 transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
          }`}
        >
          <h2 className="text-2xl md:text-3xl font-bold mb-3" style={{ color: "#1F447B" }}>
            Unlimited capacity, <span className="text-[#EB993C]">Global reach</span>
          </h2>
          <p className="text-base max-w-2xl mx-auto" style={{ color: "#324A6D" }}>
            Our strategically positioned warehouses across three continents
            ensure your goods are always close to your customers.
          </p>
        </div>

        {/* Main Interface Container */}
        <div
          className={`relative w-full h-[500px] lg:h-[600px] rounded-2xl overflow-hidden shadow-sm border-2 border-[#1F447B] transition-all duration-700 ${
            isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          } bg-background`}
        >
          <div className="flex h-full">
            {/* Left Panel - Interactive Location List */}
            <div className="w-full lg:w-2/5 border-r-2 border-[#1F447B] bg-background">
              {/* Panel Header */}
              <div className="p-4 border-b-2 border-[#1F447B] bg-background">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-lg font-bold" style={{ color: "#1F447B" }}>
                      Global Locations
                    </h3>
                    <p className="text-xs mt-1" style={{ color: "#324A6D" }}>
                      {warehouseLocations.length} facilities worldwide
                    </p>
                  </div>
                  {selectedLocation && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setSelectedLocation(null)}
                      className="border-2 border-[#1F447B] text-[#1F447B] hover:bg-[#EB993C] hover:text-white hover:border-[#EB993C] transition-all duration-200"
                    >
                      <RotateCcw className="h-4 w-4 mr-2" />
                      Reset
                    </Button>
                  )}
                </div>
              </div>

              {/* Scrollable Location List */}
              <ScrollArea className="h-full">
                <div className="p-2">
                  {warehouseLocations.map((location, index) => (
                    <Card
                      key={location.id}
                      className={`mb-2 cursor-pointer transition-all duration-200 border-2 hover:shadow-md ${
                        selectedLocation === location.id
                          ? "border-[#1F447B] ring-2 ring-[#EB993C]/30 bg-gradient-to-br from-[#EBF4FF] to-[#D6E9FF]"
                          : "border-[#1F447B]/20 hover:bg-slate-50 hover:border-[#EB993C]/50"
                      }`}
                      onClick={() => handleLocationSelect(location.id)}
                    >
                      <CardContent className="p-3">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="text-xl">
                            {countryFlags[location.countryCode]}
                          </div>
                          <div>
                            <h4 className="font-semibold text-base" style={{ color: "#1F447B" }}>
                              {location.city}
                            </h4>
                            <p className="text-xs" style={{ color: "#324A6D" }}>
                              {location.country}
                            </p>
                          </div>
                        </div>

                        {/* Simple description */}
                        <p className="text-xs leading-relaxed mt-1" style={{ color: "#324A6D" }}>
                          {location.description}
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </ScrollArea>
            </div>

            {/* Right Panel - Dynamic Map Interface */}
            <div className="hidden lg:flex lg:w-3/5 flex-col bg-background">
              {/* Map Header */}
              {selectedLocationData && (
                <div className="p-3 border-b-2 border-[#1F447B] shadow-sm bg-background">
                  <div className="flex items-center gap-2">
                    <div className="text-lg">
                      {countryFlags[selectedLocationData.countryCode]}
                    </div>
                    <div>
                      <h4 className="font-semibold text-base" style={{ color: "#1F447B" }}>
                        {selectedLocationData.city}
                      </h4>
                      <div className="flex items-center gap-1 text-xs" style={{ color: "#324A6D" }}>
                        <MapPin className="h-3 w-3" />
                        <span>{selectedLocationData.address}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Globe + street-level inset */}
              <div className="flex-1 relative overflow-hidden">
                <LogisticsGlobe
                  hubs={globeHubs}
                  selectedId={selectedLocation}
                  onHubSelect={handleLocationSelect}
                  className="absolute inset-0"
                  fallback={
                    <iframe
                      src={`https://maps.google.com/maps?q=${warehouseLocations[0].lat},${warehouseLocations[0].lng}&hl=en&z=2&output=embed&iwloc=near`}
                      className="w-full h-full border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Global warehouse locations"
                    />
                  }
                />

                {!selectedLocationData && (
                  <div
                    className="pointer-events-none absolute left-4 top-4 rounded-full bg-white/80 px-3 py-1 text-xs font-medium shadow-sm backdrop-blur"
                    style={{ color: "#324A6D" }}
                  >
                    Drag to rotate · click a facility to zoom in
                  </div>
                )}

                {selectedLocationData && (
                  <div
                    key={selectedLocationData.id}
                    className="globe-inset absolute bottom-4 right-4 w-[46%] max-w-[380px] overflow-hidden rounded-xl border-2 border-[#1F447B] bg-white shadow-xl"
                  >
                    <div className="flex items-center justify-between border-b border-[#1F447B]/15 px-3 py-1.5">
                      <span className="text-xs font-semibold" style={{ color: "#1F447B" }}>
                        Street map
                      </span>
                      <a
                        href={mapsSearchUrl(selectedLocationData.address)}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1 text-xs font-medium text-[#EB993C] hover:underline"
                      >
                        Open in Google Maps
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    </div>
                    <iframe
                      src={mapsEmbedUrl(selectedLocationData.address)}
                      className="block w-full aspect-[4/3] border-0"
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title={`${selectedLocationData.city} street map`}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Mobile View Enhancement */}
        <div className="lg:hidden mt-6">
          {selectedLocationData && (
            <Card className="shadow-sm border-2 border-[#1F447B] bg-background">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="text-xl">
                    {countryFlags[selectedLocationData.countryCode]}
                  </div>
                  <div>
                    <h4 className="font-semibold text-lg" style={{ color: "#1F447B" }}>
                      {selectedLocationData.city}
                    </h4>
                    <p className="text-sm" style={{ color: "#324A6D" }}>
                      {selectedLocationData.country}
                    </p>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center gap-2 text-sm">
                    <MapPin className="h-4 w-4" style={{ color: "#324A6D" }} />
                    <span style={{ color: "#324A6D" }}>
                      {selectedLocationData.address}
                    </span>
                  </div>

                  <p className="text-sm leading-relaxed" style={{ color: "#324A6D" }}>
                    {selectedLocationData.description}
                  </p>

                  <Button
                    className="w-full"
                    onClick={() =>
                      window.open(
                        mapsSearchUrl(selectedLocationData.address),
                        "_blank"
                      )
                    }
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
  );
}
