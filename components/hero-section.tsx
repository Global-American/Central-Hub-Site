"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Truck } from "lucide-react";
import HeroGlobe from "@/components/hero-globe";
import HeroArtFx, { type ArtFx } from "@/components/hero-art-fx";
import { HeroArtUnder } from "@/components/hero-art-loop";
// The pictures scripts/build-hero-fx.py writes are imported, not named by
// their path: an imported picture's address has a hash of its contents in
// it, so one that has been redrawn can never come back out of the image
// cache as the old one (which would put the old artwork over the new globe).
import shipBase from "@/public/hero-variation-smart/fx/ship-base.png";
import shipShip from "@/public/hero-variation-smart/fx/ship-ship.png";
import freightBase from "@/public/hero-variation-smart/fx/freight-base.png";
import freightShip from "@/public/hero-variation-smart/fx/freight-ship.png";
import freightTruck from "@/public/hero-variation-smart/fx/freight-truck.png";
// The plane as it parks on the Freight slide, facing the other way from the
// artwork's (scripts/build-hero-plane.py)
import freightPlane from "@/public/hero-variation-smart/fx/freight-plane-right.png";
import returnBase from "@/public/hero-variation-smart/fx/return-base.png";
import fulfilBase from "@/public/hero-variation-smart/fx/fulfil-base.png";
import fulfilTruck from "@/public/hero-variation-smart/fx/fulfil-truck.png";
import fulfilTrolley from "@/public/hero-variation-smart/fx/fulfil-trolley.png";
import fulfilPhoneOrder from "@/public/hero-variation-smart/fx/fulfil-phone-order.png";
import fulfilPhoneDelivered from "@/public/hero-variation-smart/fx/fulfil-phone-delivered.png";
import fulfilHand from "@/public/hero-variation-smart/fx/fulfil-hand.png";
import fulfilParcel from "@/public/hero-variation-smart/fx/fulfil-parcel.png";

// How long each slide shows before the banner moves on
const SLIDE_MS = 15000;
// Fade-out before the next slide is swapped in
const FADE_MS = 300;

// Slideshow data with synchronized content.
// width/height: the PNG's pixel size. The picture is sized from its column and
// this aspect ratio, never from the file the browser picked out of the srcset:
// Next never upscales, so on 2x screens the browser would think a 1440px file
// was 3840px wide and lay the picture out at a fraction of its column.
// artInsetRight: transparent padding on the right edge of each PNG, as a % of
// its width. On desktop the picture is shifted right by this amount so the
// visible artwork (not the transparent strip) sits on the section padding edge.
// globe: where the artwork's globe was cut out, for a 3D one to show through
// (centre as a % of the picture's width/height, diameter as a % of its width).
// fx: the animation layer over the artwork (see components/hero-art-fx.tsx).
// Where it has vehicles of its own, graphic is the artwork with them cut out.
// The middle of three of them is redrawn: a projector for the globe in
// Freight (scripts/hero_projector.py), and a circuit board where Returns and
// Fulfillment had a cog (scripts/hero_circuit_board.py).
// The masks are fetched as they are, so they are named by their path
const FX = "/hero-variation-smart/fx";

// All the vehicles face down-left along the isometric axis, so they arrive
// from up-right: this many % of the artwork's width across, and ISO_RISE as
// much up for each step across.
const ISO_RISE = 0.58;
const arriveFrom = (across: number, extraUp = 0): [number, number] => [
  across,
  -(across * ISO_RISE + extraUp),
];

const shippingFx: ArtFx = {
  width: 1448,
  height: 1086,
  silhouette: `${FX}/ship-silhouette.webp`,
  sprites: [
    { src: shipShip.src, x: 116, y: 300, w: 396, h: 280, motion: "sail", from: arriveFrom(7) },
  ],
  // The order on the phone goes out across the whole network
  lines: { mask: `${FX}/ship-lines.webp`, x: 890, y: 440, radius: 1000, tone: "light" },
  sparkles: [
    [1290, 140, 1],
    [330, 150, 0.8],
    [1400, 640, 0.7],
    [690, 110, 0.9],
    [110, 900, 0.8],
    [1090, 1010, 0.7],
  ],
};

// Freight: a projector in the middle throws up the globe, and the vehicles
// come in round it.
const freightFx: ArtFx = {
  width: 1440,
  height: 1024,
  // The outline with the plane the way it parks here (build-hero-plane.py)
  silhouette: `${FX}/freight-silhouette-right.webp`,
  // The ship and the truck turn round the projection on their way in, clear
  // of it and of each other: the ship comes out from behind the globe and
  // swings round the left of the projector, and the truck comes down the
  // right of it (from beyond the artwork's right edge) and round the front.
  // The plane points down and to the right here, the opposite way from the
  // artwork, and flies in the way it points: a straight line from far off in
  // the top left to its place, well below the globe. It parks lower than the
  // artwork has it so that line passes between the projector and the truck,
  // sets off once the ship is out of its way, and arrives last, growing as
  // it comes.
  cover: `${FX}/freight-cover.webp`,
  sprites: [
    { src: freightShip.src, x: 80, y: 476, w: 528, h: 400, motion: "sail", from: [46.3, -30.6], trip: 3.8, curve: [[176, -476], [225, -130]], emerge: [909, 770] },
    { src: freightTruck.src, x: 536, y: 608, w: 272, h: 260, motion: "drive", from: arriveFrom(64), trip: 2.8, delay: 0.7, curve: [[670, -40], [216, -126]] },
    { src: freightPlane.src, x: 842, y: 572, w: 540, h: 388, motion: "fly", from: [-72.5, -42.43], trip: 4.6, delay: 1.9, curve: [[-696, -407], [-348, -204]], far: 0.15 },
  ],
  // Radar sweeps out from the projector's lens over the dots around it
  lines: { mask: `${FX}/freight-lines.webp`, x: 909, y: 400, radius: 1150, tone: "light" },
  rings: { shape: "ellipse", x: 909, y: 470, rx: 250, grow: 1.8, behind: [744, 60, 330, 500] },
  sparkles: [
    [280, 330, 0.9],
    [560, 170, 0.8],
    [1250, 230, 1],
    [1390, 450, 0.7],
    [130, 960, 0.7],
    [660, 40, 0.6],
  ],
};

// Returns and Fulfillment share a layout: four stations wired to a circuit
// board in the middle, which sends signals out along the circuit traces (and
// its own). The board lies flat, so the rings only pass behind the globe
// that floats over it.
const hubFx = (key: string, chipX: number): ArtFx => ({
  width: 1440,
  height: 1024,
  silhouette: `${FX}/${key}-silhouette.webp`,
  lines: { mask: `${FX}/${key}-lines.webp`, x: chipX, y: 570, radius: 520, tone: "electric" },
  rings: { shape: "diamond", x: chipX, y: 570, rx: 188, grow: 2.2, behind: [chipX - 135, 150, 270, 290] },
  sparkles: [
    [700, 70, 0.9],
    [1395, 560, 0.8],
    [70, 520, 0.8],
    [740, 930, 0.9],
    [520, 190, 0.7],
    [1000, 230, 0.7],
  ],
});

// Fulfillment's four stations are the steps an order goes through, and the
// picture goes round them in that order, clockwise (hero-art-loop.tsx): the
// order is placed on the phone (bottom right) and goes as a beam of light to
// the packing bench (bottom left), which sends it on as a parcel through the
// warehouse (top left) to the truck (top right). The truck drives it down
// to the phone and in at the back of it, the phone turns over to say PARCEL
// DELIVERED, and the next order starts. The ring the round runs on is wide enough to go round the outside
// of the sign over the bench, so it is in view all the way up the left.
// The truck, the trolley in front of it, the phone, the man's hand in front
// of that and the parcel are pictures of their own (scripts/hero_delivery.py): build-hero-fx.py prints
// their boxes.
const fulfilFx: ArtFx = {
  ...hubFx("fulfil", 731),
  loop: {
    x: 707,
    y: 552,
    rx: 637,
    stops: [
      [1143.5, 784.5],
      [265.5, 760.5],
      [333.5, 304.5],
      [1143.5, 280.5],
    ],
    pad: [180, 18],
    parcel: { src: fulfilParcel.src, w: 46, h: 52, foot: [23, 38], from: 1 },
    delivery: {
      truck: { src: fulfilTruck.src, x: 1071, y: 96, w: 245, h: 230 },
      front: { src: fulfilTrolley.src, x: 1018, y: 203, w: 137, h: 130 },
      // The middle of the truck ends up behind the middle of the phone
      to: [57, 452],
      // (the phone turns about the middle of its face, not of its picture:
      // the picture has the thickness of its case down its right side)
      phone: { src: fulfilPhoneOrder.src, delivered: fulfilPhoneDelivered.src, x: 1188, y: 524, w: 124, h: 278, axis: 0.452 },
      hand: { src: fulfilHand.src, x: 1193, y: 670, w: 23, h: 40 },
    },
  },
};

const slides = [
  {
    title: "Smart",
    titleAccent: "Shipping.",
    subtitle: "Global",
    subtitleAccent: "Solutions.",
    description: "Fast, reliable shipping worldwide.",
    textColor: "text-white",
    label: "Shipping",
    graphic: shipBase.src,
    width: 1448,
    height: 1086,
    artInsetRight: 4.42,
    fx: shippingFx,
  },
  {
    title: "Smart",
    titleAccent: "Freight.",
    subtitle: "Fast",
    subtitleAccent: "Logistics.",
    description: "Transparent global freight.",
    textColor: "text-white",
    label: "Freight",
    graphic: freightBase.src,
    width: 1440,
    height: 1024,
    artInsetRight: 5.21,
    fx: freightFx,
    // Over the projector's lens (scripts/hero_projector.py has the same
    // place, for the mask of what passes behind it)
    globe: {
      x: 63.13,
      y: 21,
      size: 19.44,
      fallback: "/hero-variation-smart/return-it-smart-globe.png",
    },
  },
  {
    title: "Smart",
    titleAccent: "Returns.",
    subtitle: "Easy",
    subtitleAccent: "Process.",
    description: "Hassle-free returns.",
    textColor: "text-white",
    label: "Returns",
    graphic: returnBase.src,
    width: 1440,
    height: 1024,
    artInsetRight: 7.22,
    fx: hubFx("return", 743),
    globe: {
      x: 51.77,
      y: 27.96,
      size: 17.65,
      fallback: "/hero-variation-smart/return-it-smart-globe.png",
    },
  },
  {
    title: "Smart",
    titleAccent: "Fulfillment.",
    subtitle: "E-Commerce",
    description: "Complete fulfillment solutions.",
    textColor: "text-white",
    label: "Fulfillment",
    graphic: fulfilBase.src,
    width: 1440,
    height: 1024,
    artInsetRight: 8.06,
    fx: fulfilFx,
    globe: {
      x: 50.87,
      y: 28.06,
      size: 17.65,
      fallback: "/hero-variation-smart/fulfil-it-smart-globe.png",
    },
  },
];

export default function HeroSection() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [titleAnimation, setTitleAnimation] = useState("animate-in");
  const pendingTransition = useRef<ReturnType<typeof setTimeout> | null>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const artTiltRef = useRef<HTMLDivElement>(null);

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

  // Pause the artwork's animations while the hero is scrolled out of view
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;
    const io = new IntersectionObserver(([entry]) => {
      section.toggleAttribute("data-offscreen", !entry.isIntersecting);
    });
    io.observe(section);
    return () => io.disconnect();
  }, []);

  // Tilt the artwork towards the pointer, with the vehicles drifting a little
  // further than the picture for depth. Eased every frame towards the
  // pointer, and back to rest when it leaves the banner. Mouse and trackpad
  // only, and never with reduced motion.
  useEffect(() => {
    const section = sectionRef.current;
    const art = artTiltRef.current;
    if (!section || !art) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const target = { x: 0, y: 0 };
    const now = { x: 0, y: 0 };
    let frame = 0;
    const step = () => {
      now.x += (target.x - now.x) * 0.08;
      now.y += (target.y - now.y) * 0.08;
      art.style.transform = `perspective(1400px) rotateX(${(-now.y * 4).toFixed(3)}deg) rotateY(${(now.x * 6).toFixed(3)}deg)`;
      art.style.setProperty("--tilt-x", now.x.toFixed(4));
      art.style.setProperty("--tilt-y", now.y.toFixed(4));
      const settled =
        Math.abs(target.x - now.x) < 0.001 && Math.abs(target.y - now.y) < 0.001;
      frame = settled ? 0 : requestAnimationFrame(step);
    };
    const kick = () => {
      if (!frame) frame = requestAnimationFrame(step);
    };
    const onMove = (e: PointerEvent) => {
      const r = section.getBoundingClientRect();
      target.x = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
      target.y = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
      kick();
    };
    const onLeave = () => {
      target.x = 0;
      target.y = 0;
      kick();
    };
    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
      cancelAnimationFrame(frame);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
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

          {/* Graphic Column. Tilted towards the pointer (see above). */}
          <div
            ref={artTiltRef}
            className="flex justify-center lg:justify-end items-center lg:order-2"
          >
            <div
              className={`w-full max-w-xl lg:max-w-none lg:w-[90%] transition-all duration-500 ease-in-out ${
                titleAnimation === "animate-in"
                  ? "opacity-100 translate-y-0 transform"
                  : "opacity-0 translate-y-4 transform"
              }`}
            >
              {/* All graphics stay mounted and preloaded in one grid cell;
                  only the active slide's image is visible, so the picture can
                  never lag behind the headline while a file downloads. Each
                  picture fills its box: the column's full width, capped so
                  the picture stays under 75vh (64vh on desktop) tall. A globe
                  can then be placed behind it in % of the picture. */}
              <div className="hero-art-float grid grid-cols-1 w-full">
                {slides.map((slide, index) =>
                  slide.graphic ? (
                    <div
                      key={slide.graphic}
                      style={
                        {
                          "--art-inset": `${slide.artInsetRight}%`,
                          "--art-ratio": slide.width / slide.height,
                        } as React.CSSProperties
                      }
                      data-active={index === currentSlideIndex}
                      className={`hero-art relative col-start-1 row-start-1 self-center justify-self-center lg:justify-self-end w-full max-w-[calc(75vh*var(--art-ratio))] lg:max-w-[calc(64vh*var(--art-ratio))] lg:translate-x-[var(--art-inset)] ${
                        index === currentSlideIndex
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                    >
                      {slide.fx?.loop && (
                        <HeroArtUnder
                          loop={slide.fx.loop}
                          width={slide.fx.width}
                          height={slide.fx.height}
                        />
                      )}
                      {slide.globe && (
                        <HeroGlobe
                          {...slide.globe}
                          active={index === currentSlideIndex}
                        />
                      )}
                      <Image
                        src={slide.graphic}
                        alt={`${slide.label} illustration`}
                        width={slide.width}
                        height={slide.height}
                        sizes="(min-width: 1024px) 54vw, 100vw"
                        priority={index === 0}
                        loading={index === 0 ? undefined : "eager"}
                        aria-hidden={index !== currentSlideIndex}
                        data-slide={slide.label}
                        className="relative w-full h-auto"
                      />
                      {slide.fx && (
                        <HeroArtFx fx={slide.fx} priority={index === 0} />
                      )}
                    </div>
                  ) : null
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Slide indicators: a glass bar with a segment for each slide. The
          current slide's segment fills up over the time the slide is shown,
          with a truck at the front of it, so the bar also says when the
          banner will move on; the slides before it stay full. (The fill is
          keyed by the slide, so it starts again from empty on every change.) */}
      <div className="absolute bottom-5 left-1/2 z-30 flex -translate-x-1/2 items-stretch gap-1 rounded-2xl border border-white/20 bg-gradient-to-br from-[#3f8ade]/80 to-[#1c62b8]/80 p-1.5 shadow-[0_10px_40px_-12px_rgb(8_30_66/0.6)] backdrop-blur-md sm:bottom-7 sm:gap-1.5 sm:p-2">
        {slides.map((slide, index) => {
          const active = index === currentSlideIndex;
          const slideMs = { "--slide-ms": `${SLIDE_MS + FADE_MS}ms` } as React.CSSProperties;
          return (
            <button
              key={index}
              onClick={() => goToSlide(index)}
              aria-label={`Go to ${slide.label} slide`}
              aria-current={active ? "true" : undefined}
              className={`group relative w-[4.75rem] rounded-xl px-2.5 pt-2 pb-2.5 text-left outline-none transition-colors duration-300 focus-visible:ring-2 focus-visible:ring-white/70 sm:w-[7.25rem] sm:px-3 ${
                active ? "bg-white/15" : "hover:bg-white/10"
              }`}
            >
              <span className="flex items-baseline gap-1.5">
                <span
                  className={`hidden text-[10px] font-semibold tabular-nums transition-colors duration-300 sm:inline ${
                    active ? "text-accent" : "text-white/40"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`text-[11px] font-medium tracking-wide transition-colors duration-300 sm:text-[13px] ${
                    active ? "text-white" : "text-white/65 group-hover:text-white/90"
                  }`}
                >
                  {slide.label}
                </span>
              </span>

              <span className="relative mt-2 block h-[3px]">
                <span className="absolute inset-0 overflow-hidden rounded-full bg-white/20">
                  {index <= currentSlideIndex && (
                    <span
                      key={active ? `run-${currentSlideIndex}` : "done"}
                      className={`absolute inset-0 rounded-full bg-gradient-to-r from-accent to-amber-300 ${
                        active ? "hero-progress" : ""
                      }`}
                      style={slideMs}
                    />
                  )}
                </span>
                {active && (
                  <span
                    key={currentSlideIndex}
                    aria-hidden="true"
                    className="hero-progress pointer-events-none absolute inset-0"
                    style={slideMs}
                  >
                    <Truck
                      className="absolute right-0 top-1/2 h-4 w-4 -translate-y-[62%] translate-x-1/2 text-accent drop-shadow-[0_1px_2px_rgb(0_0_0/0.35)]"
                      fill="white"
                      strokeWidth={2.25}
                    />
                  </span>
                )}
              </span>
            </button>
          );
        })}
      </div>
    </section>
  );
}
