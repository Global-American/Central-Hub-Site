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
      <div className="absolute top-16 lg:top-20 left-0 right-0 z-50 px-4 md:px-8 lg:px-12 pt-8 lg:pt-12 pb-8">
        <div className="text-center max-w-5xl mx-auto">
          <Badge
            variant="outline"
            className="text-xs md:text-sm border-accent text-accent bg-accent/10 mb-4"
          >
            Our Brands
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-foreground mb-4 lg:mb-6">
            Smart Logistics <span className="text-accent">Platforms</span>
          </h2>
          <p className="text-base md:text-lg lg:text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover our suite of intelligent logistics solutions designed to
            transform your supply chain operations.
          </p>
        </div>
      </div>

      <div
        ref={cardsContainerRef}
        className="absolute inset-0 flex items-center justify-center pt-40 sm:pt-44 md:pt-48 lg:pt-56 xl:pt-60"
      >
        {brands.map((brand, i) => (
          <div
            key={brand.id}
            className="brand-card-item absolute flex h-full w-full items-center justify-center p-4 md:p-6 lg:p-8 xl:p-10"
            style={{ zIndex: i }}
          >
            {/* Inner wrapper for border and styling */}
            <div
              className={`relative w-full max-w-7xl rounded-3xl overflow-hidden shadow-2xl ${brand.color} border-2 border-white/20 min-h-[300px] sm:min-h-[340px] md:min-h-[380px] lg:min-h-[420px] xl:min-h-[450px]`}
            >
              <div className="grid grid-cols-1 lg:grid-cols-2 relative z-10 h-full">
                <div className="p-8 sm:p-10 md:p-12 lg:p-16 xl:p-20 flex flex-col justify-center">
                  <div className={brand.textColor}>
                    <div className="mb-4 sm:mb-5 md:mb-6 lg:mb-8">
                      <div className="flex items-center gap-3 md:gap-4 lg:gap-5">
                        <Building2 className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-11 lg:w-11 xl:h-12 xl:w-12 opacity-80" />
                        <h3 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold tracking-tight">
                          {brand.name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed opacity-90 mb-6 sm:mb-7 md:mb-8 lg:mb-10 max-w-2xl">
                      {brand.description}
                    </p>
                    <div>
                      <Button
                        size="lg"
                        onClick={handleLearnMoreClick}
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm text-sm sm:text-base lg:text-lg px-6 sm:px-7 lg:px-8 py-3 sm:py-4 lg:py-5 font-semibold transition-all hover:scale-105 shadow-lg"
                      >
                        Learn More <ArrowRight className="ml-2 h-4 w-4 lg:h-5 lg:w-5" />
                      </Button>
                    </div>
                  </div>
                </div>
                <div className="relative hidden lg:block h-full">
                  {/* Tagline - positioned in bottom right */}
                  <div className="absolute bottom-10 right-10 xl:bottom-12 xl:right-12 z-20">
                    <div className="bg-white/10 backdrop-blur-md rounded-xl px-6 py-5 xl:px-8 xl:py-6 border border-white/20 shadow-xl">
                      <h4 className="text-white text-lg md:text-xl lg:text-2xl xl:text-3xl font-bold tracking-tight leading-tight whitespace-nowrap">
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
