"use client";

import { useRef, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image from "next/image";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Data for the brand cards
const brands = [
  {
    id: 1,
    name: "Ship itSmart",
    tagline: "Be Smart, Ship itSmart !",
    description:
      "The world's leading brands trust ShipItSmart to streamline their shipping operations with unparalleled speed and precision. Our platform connects you to global carriers, optimizes routes, and provides real-time tracking—making international shipping smarter and more efficient.",
    color: "bg-gradient-to-br from-[#EB993C] to-[#d88730]",
    textColor: "text-white",
    image: "/card-thumbnails/smart-shipit.png",
  },
  {
    id: 2,
    name: "Freight itSmart",
    tagline: "Be Smart, Freight itSmart !",
    description:
      "FreightItSmart is revolutionizing freight logistics, connecting businesses to top freight carriers and services with a single integration. Smart routing algorithms, advanced optimization, and comprehensive tracking make heavy cargo transportation faster, leaner, and more cost-effective.",
    color: "bg-gradient-to-br from-[#14529f] to-[#0f3c75]",
    textColor: "text-white",
    image: "/card-thumbnails/smart-freight.png",
  },
  {
    id: 3,
    name: "Return itSmart",
    tagline: "Be Smart, Return itSmart !",
    description:
      "ReturnItSmart transforms the returns process into a competitive advantage. Our intelligent reverse logistics platform streamlines return authorization, optimizes return routing, and maximizes recovery value—turning returns from a cost center into a customer satisfaction driver.",
    color: "bg-gradient-to-br from-[#EB993C] to-[#d88730]",
    textColor: "text-white",
    image: "/card-thumbnails/returnit.png",
  },
  {
    id: 4,
    name: "Fulfill itSmart",
    tagline: "Be smart, Fulfill itSmart !",
    description:
      "FulfillItSmart is the ultimate fulfillment solution, seamlessly integrating order processing, inventory management, and distribution. From order to delivery, our platform ensures accurate, fast, and cost-effective fulfillment that scales with your business growth.",
    color: "bg-gradient-to-br from-[#14529f] to-[#0f3c75]",
    textColor: "text-white",
    image: "/card-thumbnails/smart-fufillit.png",
  },
];

export default function OurBrandsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  const handleLearnMoreClick = (e: React.MouseEvent) => {
    e.preventDefault();
    console.log("Learn More clicked!");
  };

  useEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLDivElement>(".brand-card-item");
      if (cards.length <= 1) return;

      // Animate the first card in on page load
      gsap.from(cards[0], {
        opacity: 0,
        y: 100,
        duration: 0.8,
        ease: "power3.out",
        delay: 0.3,
      });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${(cards.length - 1) * window.innerHeight}`,
        },
      });

      // Animation logic for a cleaner stack
      cards.slice(0, -1).forEach((card, index) => {
        const nextCard = cards[index + 1];

        // Animate the next card coming up from the bottom
        timeline
          .fromTo(
            nextCard,
            { yPercent: 100 },
            { yPercent: 0, ease: "power2.inOut" }
          )
          // At the same time, scale down the current card to create the stacking effect
          .to(
            card,
            { scale: 0.95, ease: "power2.inOut" },
            "<" // The "<" ensures this animation starts at the same time as the previous one
          );
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="brands"
      className="relative h-screen overflow-hidden bg-[#f6fdfe]"
    >
      {/* Section Header */}
      <div className="absolute top-20 left-0 right-0 z-50 px-4 md:px-8 pt-8 pb-8">
        <div className="text-center">
          <Badge
            variant="outline"
            className="text-xs border-accent text-accent bg-accent/10 mb-3"
          >
            Our Brands
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Smart Logistics <span className="text-accent">Platforms</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-4">
            Discover our suite of intelligent logistics solutions designed to
            transform your supply chain operations.
          </p>
        </div>
      </div>

      <div
        ref={cardsContainerRef}
        className="absolute inset-0 flex items-center justify-center pt-36 sm:pt-40 md:pt-44 lg:pt-48 xl:pt-52"
      >
        {brands.map((brand, i) => (
          <div
            key={brand.id}
            className="brand-card-item absolute flex h-full w-full items-center justify-center p-4 md:p-8"
            style={{ zIndex: i }}
          >
            {/* Inner wrapper for border and styling */}
            <div
              className={`relative w-full max-w-6xl rounded-3xl overflow-hidden shadow-2xl ${brand.color} border-2 border-white/20 min-h-[280px] sm:min-h-[320px] md:min-h-[360px] lg:min-h-[380px] xl:min-h-[400px]`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10 h-full">
                <div className="p-8 sm:p-10 md:p-12 lg:p-14 xl:p-16 flex flex-col justify-center">
                  <div className={brand.textColor}>
                    <div className="mb-4 sm:mb-5 md:mb-6">
                      <div className="flex items-center gap-3 md:gap-4">
                        <Building2 className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 opacity-80" />
                        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                          {brand.name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg leading-relaxed opacity-90 mb-5 sm:mb-6 md:mb-8">
                      {brand.description}
                    </p>
                    <div>
                      <Button
                        size="lg"
                        onClick={handleLearnMoreClick}
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm text-sm sm:text-base px-5 sm:px-6 py-3 sm:py-4 font-semibold transition-all hover:scale-105"
                      >
                        Learn More <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="relative hidden lg:block h-full">
                  {/* Tagline - positioned in bottom right */}
                  <div className="absolute bottom-8 right-8 z-20">
                    <div className="bg-white/10 backdrop-blur-md rounded-lg px-5 py-4 border border-white/20">
                      <h4 className="text-white text-base sm:text-lg md:text-xl lg:text-2xl font-bold tracking-tight leading-tight whitespace-nowrap">
                        {brand.tagline}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
