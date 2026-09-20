"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";

// Slideshow data with synchronized content
const slides = [
  {
    title: "Smart",
    titleAccent: "Shipping.",
    subtitle: "Global",
    subtitleAccent: "Solutions.",
    description: "Fast, reliable shipping worldwide.",
    textColor: "text-white",
    label: "Shipping",
    graphic: "/hero-variation-smart/ship-it-smart.png",
  },
  {
    title: "Smart",
    titleAccent: "Freight.",
    subtitle: "Fast",
    subtitleAccent: "Logistics.",
    description: "Transparent global freight.",
    textColor: "text-white",
    label: "Freight",
    graphic: "/hero-variation-smart/freight-it-smart.png",
  },
  {
    title: "Smart",
    titleAccent: "Returns.",
    subtitle: "Easy",
    subtitleAccent: "Process.",
    description: "Hassle-free returns.",
    textColor: "text-white",
    label: "Returns",
    graphic: "/hero-variation-smart/return-it-smart.png",
  },
  {
    title: "Smart",
    titleAccent: "Fulfillment.",
    subtitle: "E-Commerce",
    description: "Complete fulfillment solutions.",
    textColor: "text-white",
    label: "Fulfillment",
    graphic: "/hero-variation-smart/fulfil-it-smart.png",
  },
];

export default function HeroSection() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [titleAnimation, setTitleAnimation] = useState("animate-in");
  const pendingTransition = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Fade out, then swap the slide index and fade back in. Starting a new
  // transition cancels a pending one so a timer tick and a manual click can
  // never apply two different indices back to back.
  const transitionTo = (resolveIndex: (current: number) => number) => {
    if (pendingTransition.current) clearTimeout(pendingTransition.current);
    setTitleAnimation("animate-out");
    pendingTransition.current = setTimeout(() => {
      pendingTransition.current = null;
      setCurrentSlideIndex(resolveIndex);
      setTitleAnimation("animate-in");
    }, 300);
  };

  // Function to go to next slide
  const nextSlide = () => {
    transitionTo((current) => (current + 1) % slides.length);
  };

  // Manual slide navigation
  const goToSlide = (index: number) => {
    if (index === currentSlideIndex) return;
    transitionTo(() => index);
  };

  // Drop any in-flight transition on unmount
  useEffect(() => {
    return () => {
      if (pendingTransition.current) clearTimeout(pendingTransition.current);
    };
  }, []);

  // Auto-advance slides every 15 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 15000); // 15 seconds

    return () => clearInterval(interval);
  }, [currentSlideIndex]); // Dependency on currentSlideIndex to reset timer on manual navigation

  return (
    <section
      id="hero"
      className="relative w-full h-[95vh] flex items-center justify-center overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e40af] via-[#60a5fa] to-[#93c5fd]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#ea8339] via-transparent to-transparent opacity-60" />
      </div>

      {/* Dark overlay for improved text contrast */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      <div className="mx-auto w-full max-w-[120rem] px-6 sm:px-8 lg:px-12 xl:px-20 2xl:px-24 relative z-20 flex items-center h-full">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,29rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,35rem)_minmax(0,1fr)] gap-10 lg:gap-8 xl:gap-10 items-center w-full">
          {/* Content Column */}
          <div className="flex flex-col items-start text-left space-y-6 lg:space-y-8 max-w-2xl lg:order-1">
            {/* Main title with animations */}
            <h1
              className={`text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight leading-tight ${
                slides[currentSlideIndex].textColor
              } transition-all duration-500 ease-in-out ${
                titleAnimation === "animate-in"
                  ? "opacity-100 translate-y-0 transform"
                  : "opacity-0 translate-y-4 transform"
              }`}
            >
              {slides[currentSlideIndex].title}{" "}
              <span className="text-white">
                {slides[currentSlideIndex].titleAccent}
              </span>
              <br />
              {slides[currentSlideIndex].subtitle}{" "}
              <span className="text-white">
                {slides[currentSlideIndex].subtitleAccent}
              </span>
            </h1>

            {/* Description text */}
            <div
              className={`transition-all duration-500 ease-in-out ${
                titleAnimation === "animate-in"
                  ? "opacity-100 translate-y-0 transform"
                  : "opacity-0 translate-y-4 transform"
              }`}
            >
              <p className="text-base sm:text-lg md:text-xl xl:text-2xl font-medium text-white leading-relaxed">
                {slides[currentSlideIndex].description}
              </p>
            </div>

            {/* CTA Button */}
            <div
              className={`pt-4 transition-all duration-500 ease-in-out ${
                titleAnimation === "animate-in"
                  ? "opacity-100 translate-y-0 transform"
                  : "opacity-0 translate-y-4 transform"
              }`}
            >
              <Button
                asChild
                size="lg"
                className="bg-accent hover:bg-accent/90 text-accent-foreground font-semibold rounded-md shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 px-8 sm:px-10 xl:px-12 py-4 xl:py-5 text-base sm:text-lg xl:text-xl w-full sm:w-auto"
              >
                <Link href="/contact">Get Started →</Link>
              </Button>
            </div>
          </div>

          {/* Graphic Column */}
          <div className="flex justify-center items-center lg:order-2">
            <div
              className={`w-full max-w-xl lg:max-w-[60rem] transition-all duration-500 ease-in-out ${
                titleAnimation === "animate-in"
                  ? "opacity-100 translate-y-0 transform"
                  : "opacity-0 translate-y-4 transform"
              }`}
            >
              {/* All graphics stay mounted and preloaded in one grid cell;
                  only the active slide's image is visible, so the picture can
                  never lag behind the headline while a file downloads. */}
              <div className="grid">
                {slides.map((slide, index) =>
                  slide.graphic ? (
                    <Image
                      key={slide.graphic}
                      src={slide.graphic}
                      alt={`${slide.label} illustration`}
                      width={720}
                      height={512}
                      sizes="(min-width: 1024px) 60vw, 100vw"
                      priority={index === 0}
                      loading={index === 0 ? undefined : "eager"}
                      aria-hidden={index !== currentSlideIndex}
                      data-slide={slide.label}
                      className={`col-start-1 row-start-1 self-center w-full h-auto max-h-[72vh] object-contain ${
                        index === currentSlideIndex
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                    />
                  ) : null
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center space-x-6">
        {slides.map((slide, index) => (
          <div key={index} className="flex flex-col items-center space-y-2">
            <button
              onClick={() => goToSlide(index)}
              className="relative group"
              aria-label={`Go to ${slide.label} slide`}
            >
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlideIndex
                    ? "bg-accent shadow-lg shadow-accent/30 scale-110"
                    : "bg-white/60 group-hover:bg-white/80 group-hover:scale-105"
                }`}
              />
            </button>

            {/* Slide label */}
            <span
              className={`text-xs font-medium transition-all duration-300 ${
                index === currentSlideIndex
                  ? "text-accent font-semibold"
                  : "text-white/70"
              }`}
            >
              {slide.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}
