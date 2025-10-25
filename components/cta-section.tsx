"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import { Package } from "lucide-react";

export default function CTASection() {
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <>
      <section
        ref={sectionRef}
        className="relative py-20 md:py-28 lg:py-36 overflow-hidden"
      >
        {/* Hero-matching Gradient Background */}
        <div className="absolute inset-0">
          <div className="absolute inset-0 bg-gradient-to-r from-[#1e3a8a] via-[#3b82f6] to-[#60a5fa]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#ea8339] via-transparent to-transparent opacity-60" />
        </div>

        {/* Dark overlay for improved text contrast */}
        <div className="absolute inset-0 bg-black/20 z-10" />

        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-10 z-10">
          <div className="absolute top-10 left-10 w-20 h-20 border-2 border-white rounded-lg transform rotate-12"></div>
          <div className="absolute top-20 right-20 w-16 h-16 border-2 border-white rounded-lg transform -rotate-6"></div>
          <div className="absolute bottom-20 left-20 w-24 h-24 border-2 border-white rounded-lg transform rotate-45"></div>
          <div className="absolute bottom-10 right-10 w-18 h-18 border-2 border-white rounded-lg transform -rotate-12"></div>
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Content Column */}
            <div
              className={`transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 translate-y-4"
              }`}
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-6">
                Ready to Transform Your{" "}
                <span className="text-[#EB993C]">Logistics</span>?
              </h2>
              <p className="text-lg md:text-xl text-white/90 mb-8 leading-relaxed">
                Join businesses that trust Global American with their smart
                logistics solutions. Be smart, ship smarter with our intelligent
                platforms.
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  className="bg-[#EB993C] hover:bg-[#d88730] text-white font-semibold px-8 py-4 text-lg rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Get Started →
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="border-2 border-white text-white bg-transparent hover:bg-white hover:text-[#1F447B] font-semibold px-8 py-4 text-lg rounded-lg shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300"
                >
                  Contact Sales
                </Button>
              </div>
            </div>

            {/* Illustration Column */}
            <div
              className={`relative transition-all duration-700 ${
                isVisible
                  ? "opacity-100 translate-x-0"
                  : "opacity-0 translate-x-8"
              }`}
              style={{ transitionDelay: "200ms" }}
            >
              <div className="relative">
                {/* Delivery Person Illustration */}
                <div className="relative mx-auto w-80 h-80 lg:w-96 lg:h-96">
                  {/* Person */}
                  <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
                    <div className="w-16 h-16 bg-gray-800 rounded-full mb-2"></div>
                    <div className="w-20 h-24 bg-[#EB993C] rounded-lg mx-auto mb-2"></div>
                    <div className="w-18 h-20 bg-white rounded-lg mx-auto"></div>
                    <div className="w-4 h-8 bg-gray-800 rounded mx-auto mt-1"></div>
                    <div className="w-4 h-8 bg-gray-800 rounded mx-auto mt-1"></div>
                  </div>

                  {/* Packages Stack */}
                  <div className="absolute bottom-0 right-0">
                    {/* Global Delivery Label */}
                    <div className="absolute -top-8 -right-2 bg-[#1F447B] text-white px-3 py-1 rounded text-sm font-semibold">
                      GLOBAL DELIVERY
                    </div>

                    {/* Local Market Label */}
                    <div className="absolute top-12 -left-8 bg-[#1F447B] text-white px-3 py-1 rounded text-sm font-semibold">
                      LOCAL MARKET
                    </div>

                    {/* Package Stack */}
                    <div className="grid grid-cols-4 gap-1">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <div
                          key={i}
                          className={`w-8 h-8 rounded border-2 border-gray-700 ${
                            i % 4 === 0
                              ? "bg-[#1F447B]"
                              : i % 4 === 1
                              ? "bg-[#EB993C]"
                              : i % 4 === 2
                              ? "bg-[#3b82f6]"
                              : "bg-white"
                          }`}
                        >
                          <div className="w-full h-full flex items-center justify-center">
                            <div className="w-2 h-2 bg-gray-700 rounded"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
