"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2 } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// Every brand currently points at the Ship itSmart site; swap in the real
// URLs as the other brand sites go live.
const SHIP_IT_SMART_URL = "https://ship-it-smart.vercel.app/";

// Data for the brand cards
const brands = [
  {
    id: 1,
    name: "Ship itSmart",
    logo: "/shipitsmart.svg",
    description:
      "The world's leading brands trust ShipItSmart to streamline their shipping operations with unparalleled speed and precision. Our platform connects you to global carriers, optimizes routes, and provides real-time tracking—making international shipping smarter and more efficient.",
    color: "bg-gradient-to-br from-[#EB993C] to-[#d88730]",
    textColor: "text-white",
    image: "/card-thumbnails/ship-itsmart.png",
    url: SHIP_IT_SMART_URL,
  },
  {
    id: 2,
    name: "Freight itSmart",
    logo: "/frieghtit.svg",
    description:
      "FreightItSmart is revolutionizing freight logistics, connecting businesses to top freight carriers and services with a single integration. Smart routing algorithms, advanced optimization, and comprehensive tracking make heavy cargo transportation faster, leaner, and more cost-effective.",
    color: "bg-gradient-to-br from-[#14529f] to-[#0f3c75]",
    textColor: "text-white",
    image: "/card-thumbnails/freight-itsmart.png",
    url: SHIP_IT_SMART_URL,
  },
  {
    id: 3,
    name: "Return itSmart",
    logo: "/returnit.svg",
    description:
      "ReturnItSmart transforms the returns process into a competitive advantage. Our intelligent reverse logistics platform streamlines return authorization, optimizes return routing, and maximizes recovery value—turning returns from a cost center into a customer satisfaction driver.",
    color: "bg-gradient-to-br from-[#EB993C] to-[#d88730]",
    textColor: "text-white",
    image: "/card-thumbnails/return-itsmart.png",
    url: SHIP_IT_SMART_URL,
  },
  {
    id: 4,
    name: "Fulfill itSmart",
    logo: "/fufillit.svg",
    description:
      "FulfillItSmart is the ultimate fulfillment solution, seamlessly integrating order processing, inventory management, and distribution. From order to delivery, our platform ensures accurate, fast, and cost-effective fulfillment that scales with your business growth.",
    color: "bg-gradient-to-br from-[#14529f] to-[#0f3c75]",
    textColor: "text-white",
    image: "/card-thumbnails/fulfill-itsmart.png",
    url: SHIP_IT_SMART_URL,
  },
];

export default function OurBrandsSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const cardsContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let ctx = gsap.context(() => {
      const cards = gsap.utils.toArray<HTMLDivElement>(".brand-card-item");
      if (cards.length <= 1) return;

      // Keep non-active cards below the viewport so only one card is visible at
      // a time. The first card is deliberately left alone: it must be visible
      // from the first paint with no entrance tween. A load-time fade-in used to
      // run here, but it shared the card's opacity with the scroll timeline
      // below, and if the tween stalled (hidden tab, slow load) the timeline
      // could capture opacity 0 as the card's resting state and it never showed.
      gsap.set(cards.slice(1), { yPercent: 100, autoAlpha: 1 });

      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          pin: true,
          scrub: 1,
          end: () => `+=${(cards.length - 1) * window.innerHeight}`,
        },
      });

      // Every step declares both its start and end values (fromTo) so the
      // timeline never samples the DOM for a baseline and scrolling back always
      // restores a fully visible, unscaled card.
      cards.slice(0, -1).forEach((card, index) => {
        const nextCard = cards[index + 1];

        timeline
          // Next card slides up over the current one
          .fromTo(
            nextCard,
            { yPercent: 100 },
            { yPercent: 0, ease: "power2.inOut" }
          )
          // Current card tucks back slightly while it is being covered
          .fromTo(
            card,
            { scale: 1 },
            { scale: 0.96, ease: "power2.inOut" },
            "<" // start together with the slide-in above
          )
          // Hide the covered card only once the next one fully overlaps it
          .fromTo(card, { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.01 });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="brands"
      className="relative h-screen overflow-hidden"
    >
      {/* Section Header */}
      <div className="absolute top-0 left-0 right-0 z-50 px-4 md:px-8 pt-20 md:pt-24 pb-4">
        <div className="text-center">
          <Badge
            variant="outline"
            className="text-xs border-accent text-accent bg-accent/10 mb-4"
          >
            Our Brands
          </Badge>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-4">
            Smart Logistics <span className="text-accent">Platforms</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
            Discover our suite of intelligent logistics solutions designed to
            transform your supply chain operations.
          </p>
        </div>
      </div>

      <div
        ref={cardsContainerRef}
        className="absolute inset-0 flex items-start justify-center px-2 sm:px-4 pt-[clamp(15.5rem,31vh,19.5rem)]"
      >
        {brands.map((brand, i) => (
          <div
            key={brand.id}
            className="brand-card-item absolute flex h-full w-full items-start justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16"
            style={{ zIndex: i }}
          >
            {/* Inner wrapper for border and styling */}
            <div
              className={`relative w-full max-w-[83rem] rounded-3xl overflow-hidden shadow-2xl ${brand.color} border-2 border-white/20 h-[320px] sm:h-[380px] md:h-[420px] lg:h-[490px] xl:h-[530px]`}
            >
              <div className="flex h-full lg:grid lg:grid-cols-2">
                {/* Text half */}
                <div className="flex h-full w-full flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14">
                  <div className={brand.textColor}>
                    <div className="mb-4 sm:mb-5 md:mb-6">
                      <div className="flex items-center gap-3 md:gap-4">
                        <Building2 className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 lg:h-10 lg:w-10 opacity-80" />
                        <h3 className="text-xl sm:text-2xl md:text-3xl lg:text-[2.6rem] xl:text-[3rem] font-bold tracking-tight leading-tight">
                          {brand.name}
                        </h3>
                      </div>
                    </div>
                    <p className="text-[11px] sm:text-xs md:text-sm lg:text-base xl:text-[1.05rem] leading-relaxed opacity-90 mb-5 sm:mb-6 max-w-4xl">
                      {brand.description}
                    </p>
                    <div>
                      <Button
                        asChild
                        size="lg"
                        className="bg-white/10 hover:bg-white/20 text-white border-white/20 backdrop-blur-sm text-sm sm:text-base md:text-lg px-5 sm:px-6 md:px-8 py-3 sm:py-4 md:py-5 font-semibold transition-all hover:scale-105"
                      >
                        <a
                          href={brand.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          aria-label={`Learn more about ${brand.name}`}
                        >
                          Learn More{" "}
                          <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" />
                        </a>
                      </Button>
                    </div>
                    <div className="mt-3 sm:mt-4">
                      <div className="inline-flex items-center rounded-xl bg-white px-4 py-2.5 shadow-lg sm:px-5 sm:py-3">
                        <Image
                          src={brand.logo}
                          alt={`${brand.name} logo`}
                          width={220}
                          height={60}
                          className="h-7 w-auto object-contain sm:h-8 md:h-9 lg:h-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Image half */}
                <div className="hidden h-full items-center justify-center p-4 lg:flex lg:p-6 xl:p-8">
                  <Image
                    src={brand.image}
                    alt={`${brand.name} illustration`}
                    width={720}
                    height={512}
                    className="h-full w-full -translate-x-6 scale-[1.2] object-contain drop-shadow-2xl xl:-translate-x-8"
                  />
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
