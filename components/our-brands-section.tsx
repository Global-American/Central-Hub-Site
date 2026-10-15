"use client";

import { useRef, useEffect } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { brands } from "@/lib/brands";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

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
      // Card geometry lives in CSS variables so the section height can be derived
      // from it. The section used to be a full viewport tall, which left all
      // the space below the card empty; it now keeps only half of that gap.
      className="relative overflow-hidden [--brand-card-top:clamp(15.5rem,31vh,19.5rem)] [--brand-card-h:320px] sm:[--brand-card-h:380px] md:[--brand-card-h:420px] lg:[--brand-card-h:490px] xl:[--brand-card-h:530px] h-[calc((100vh_+_var(--brand-card-top)_+_var(--brand-card-h))_/_2)]"
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
        className="absolute inset-0 flex items-start justify-center px-2 sm:px-4 pt-[var(--brand-card-top)]"
      >
        {brands.map((brand, i) => (
          <div
            key={brand.id}
            className="brand-card-item absolute flex h-full w-full items-start justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16"
            style={{ zIndex: i }}
          >
            {/* Inner wrapper for border and styling */}
            <div
              className={`relative w-full max-w-[83rem] rounded-3xl overflow-hidden shadow-2xl ${brand.color} border-2 border-white/20 h-[var(--brand-card-h)]`}
            >
              <div className="flex h-full lg:grid lg:grid-cols-2">
                {/* Text half */}
                <div className="flex h-full w-full flex-col justify-center p-6 sm:p-8 md:p-10 lg:p-12 xl:p-14">
                  <div className={brand.textColor}>
                    <div className="mb-4 sm:mb-5 md:mb-6">
                      <h3 className="sr-only">{brand.name}</h3>
                      <Image
                        src={brand.logo}
                        alt={`${brand.name} logo`}
                        width={1480}
                        height={390}
                        priority={i === 0}
                        sizes="(min-width: 1280px) 320px, (min-width: 768px) 240px, 180px"
                        className="h-10 w-auto object-contain sm:h-12 md:h-14 lg:h-16 xl:h-20"
                      />
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
                    <p className="mt-4 text-[1.05rem] leading-snug font-semibold italic tracking-wide opacity-90 sm:mt-5 sm:text-[1.2rem] md:text-[1.35rem]">
                      {brand.tagline}
                    </p>
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
