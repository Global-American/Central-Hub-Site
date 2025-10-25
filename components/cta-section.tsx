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

          {/* Illustration Column */}
          <div
            className={`relative transition-all duration-700 ${
              isVisible ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"
            }`}
            style={{ transitionDelay: "200ms" }}
          >
            <div className="relative flex justify-end items-center">
              {/* Globe Puzzle Image */}
              <div className="relative w-96 h-96 lg:w-[500px] lg:h-[500px] xl:w-[550px] xl:h-[550px]">
                <img
                  src="/images/globe-jig.png"
                  alt="Global Logistics Solutions"
                  className="w-full h-full object-contain drop-shadow-2xl"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
