"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Truck } from "lucide-react";

// How long each slide shows before the banner moves on
const SLIDE_MS = 15000;
// Fade-out before the next slide is swapped in
const FADE_MS = 300;

// Slideshow data with synchronized content.
// artInsetRight: transparent padding on the right edge of each PNG, as a % of
// its width. On desktop the picture is shifted right by this amount so the
// visible artwork (not the transparent strip) sits on the section padding edge.
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
    artInsetRight: 4.42,
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
    artInsetRight: 5.21,
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
    artInsetRight: 7.22,
  },
  {
    title: "Smart",
    titleAccent: "Fulfillment.",
    subtitle: "E-Commerce",
    description: "Complete fulfillment solutions.",
    textColor: "text-white",
    label: "Fulfillment",
    graphic: "/hero-variation-smart/fulfil-it-smart.png",
    artInsetRight: 8.06,
  },
];

export default function HeroSection() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [titleAnimation, setTitleAnimation] = useState("animate-in");
  const pendingTransition = useRef<ReturnType<typeof setTimeout> | null>(null);
  const indicatorsRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const truckRef = useRef<HTMLDivElement>(null);
  // Centre x of each slide dot, relative to the indicator row
  const [dotCenters, setDotCenters] = useState<number[]>([]);

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
    }, FADE_MS);
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
    }, SLIDE_MS);

    return () => clearInterval(interval);
  }, [currentSlideIndex]); // Dependency on currentSlideIndex to reset timer on manual navigation

  // Measure the slide dots so the truck's road runs between them
  useLayoutEffect(() => {
    const row = indicatorsRef.current;
    if (!row) return;
    const measure = () => {
      const left = row.getBoundingClientRect().left;
      setDotCenters(
        dotRefs.current.map((dot) => {
          const r = dot?.getBoundingClientRect();
          return r ? r.left + r.width / 2 - left : 0;
        })
      );
    };
    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(row);
    return () => ro.disconnect();
  }, []);

  // Drive the truck from the current dot to the next one over the slide's
  // lifetime, so it pulls in just as the banner moves on. Each leg runs dot
  // centre to dot centre (the dots cover it at the stops) and lasts until the
  // next slide is actually swapped in, after the fade, so one leg flows
  // straight into the next. After the last slide it turns round and heads
  // back to the first.
  const nextIndex = (currentSlideIndex + 1) % slides.length;
  const headingBack = nextIndex < currentSlideIndex;
  useEffect(() => {
    const truck = truckRef.current;
    if (!truck || dotCenters.length !== slides.length) return;
    const from = dotCenters[currentSlideIndex];
    const to = dotCenters[nextIndex];
    const at = (x: number) => `translateX(${x}px) translateX(-50%)`;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      truck.style.transform = at(from);
      return;
    }
    const drive = truck.animate([{ transform: at(from) }, { transform: at(to) }], {
      duration: SLIDE_MS + FADE_MS,
      easing: "linear",
      fill: "forwards",
    });
    return () => drive.cancel();
  }, [currentSlideIndex, nextIndex, headingBack, dotCenters]);

  return (
    <section
      id="hero"
      // From lg up the banner is 80vh tall, 10% less than the 89vh it used to
      // take of the first screen, but never under 36rem so short screens keep
      // room between the headline and the header. lg:pt-20 / lg:pb-16 centre
      // the content in the band between the 5rem fixed header and the slide
      // indicators. Phones keep 95vh: the stacked mobile layout needs the room.
      // `isolate`: the z-10/20/30 layers inside stay inside, so the strip that
      // overlaps the hero's bottom edge on the home page can paint over all of
      // them, not just the gradient.
      className="relative isolate w-full h-[95vh] lg:h-[80vh] lg:min-h-[36rem] lg:pt-20 lg:pb-16 flex items-center justify-center overflow-hidden"
    >
      {/* Gradient Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-r from-[#1e40af] via-[#60a5fa] to-[#93c5fd]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#ea8339] via-transparent to-transparent opacity-60" />
      </div>

      {/* Dark overlay for improved text contrast */}
      <div className="absolute inset-0 bg-black/20 z-10" />

      {/* zoom scales the whole composition (type, padding, artwork) to 90%,
          the same factor as the height cut above, so the layout designed for
          the taller banner still fits. */}
      <div className="w-full px-6 sm:px-8 lg:px-20 xl:px-28 2xl:px-40 lg:[zoom:0.9] relative z-20 flex items-center h-full">
        <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,29rem)_minmax(0,1fr)] xl:grid-cols-[minmax(0,35rem)_minmax(0,1fr)] 2xl:grid-cols-[minmax(0,42rem)_minmax(0,1fr)] gap-10 lg:gap-8 xl:gap-10 items-center w-full">
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
          <div className="flex justify-center lg:justify-end items-center lg:order-2">
            <div
              className={`w-full max-w-xl lg:max-w-none lg:w-[90%] transition-all duration-500 ease-in-out ${
                titleAnimation === "animate-in"
                  ? "opacity-100 translate-y-0 transform"
                  : "opacity-0 translate-y-4 transform"
              }`}
            >
              {/* All graphics stay mounted and preloaded in one grid cell;
                  only the active slide's image is visible, so the picture can
                  never lag behind the headline while a file downloads. */}
              <div className="grid grid-cols-1 w-full">
                {slides.map((slide, index) =>
                  slide.graphic ? (
                    <Image
                      key={slide.graphic}
                      src={slide.graphic}
                      alt={`${slide.label} illustration`}
                      width={720}
                      height={512}
                      sizes="(min-width: 1024px) 54vw, 100vw"
                      priority={index === 0}
                      loading={index === 0 ? undefined : "eager"}
                      aria-hidden={index !== currentSlideIndex}
                      data-slide={slide.label}
                      style={
                        {
                          "--art-inset": `${slide.artInsetRight}%`,
                        } as React.CSSProperties
                      }
                      className={`col-start-1 row-start-1 self-center justify-self-center lg:justify-self-end w-auto max-w-full h-auto max-h-[75vh] lg:max-h-[64vh] lg:translate-x-[var(--art-inset)] ${
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
      <div
        ref={indicatorsRef}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex items-center justify-center gap-6"
      >
        {/* Dotted road joining the dots, and the truck that drives it to
            show when the next slide is coming */}
        {dotCenters.length === slides.length && (
          <>
            <div
              aria-hidden="true"
              className="pointer-events-none absolute top-[5px] h-0 border-t-2 border-dotted border-white/40"
              style={{
                left: dotCenters[0],
                width: dotCenters[dotCenters.length - 1] - dotCenters[0],
              }}
            />
            <div
              ref={truckRef}
              aria-hidden="true"
              className="pointer-events-none absolute left-0 -top-[3px]"
            >
              <Truck
                className={`h-[18px] w-[18px] text-accent drop-shadow ${headingBack ? "-scale-x-100" : ""}`}
                fill="white"
                strokeWidth={2.25}
              />
            </div>
          </>
        )}
        {slides.map((slide, index) => (
          <div key={index} className="relative flex flex-col items-center space-y-2">
            <button
              ref={(el) => {
                dotRefs.current[index] = el;
              }}
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
