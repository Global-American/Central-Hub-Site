"use client";

import { Button } from "@/components/ui/button";
import { useState, useEffect, useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { Truck } from "lucide-react";
import HeroGlobe from "@/components/hero-globe";
import HeroArtFx, { HeroArtUnder, type ArtFx } from "@/components/hero-art-fx";
// The pictures scripts/build-hero-fx.py writes are imported, not named by
// their path: an imported picture's address has a hash of its contents in
// it, so one that has been redrawn can never come back out of the image
// cache as the old one (which would put the old artwork over the new globe).
import shipBase from "@/public/hero-variation-smart/fx/ship-base.png";
import shipShip from "@/public/hero-variation-smart/fx/ship-ship.png";
import freightBase from "@/public/hero-variation-smart/fx/freight-base.png";
import freightShip from "@/public/hero-variation-smart/fx/freight-ship.png";
import freightTruck from "@/public/hero-variation-smart/fx/freight-truck.png";
import freightPlane from "@/public/hero-variation-smart/fx/freight-plane.png";
import returnBase from "@/public/hero-variation-smart/fx/return-base.png";
import fulfilBase from "@/public/hero-variation-smart/fx/fulfil-base.png";

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
  silhouette: `${FX}/freight-silhouette.webp`,
  // Each vehicle turns round the projection on its way in, clear of it and of
  // the others: the ship comes out from behind the globe and swings round the
  // left of the projector, the truck comes down the right of it and round the
  // front, and the plane flies in from far off in the top left, passes
  // behind the globe, turns round to the right of it and comes down into its
  // place. They arrive in that order, so no two are ever in the same place.
  // The truck starts beyond the artwork's right edge. The plane is drawn
  // behind the globe (and under the ship) for the first 47% of its trip, by
  // when it is clear of the projection on the right and still in the picture.
  cover: `${FX}/freight-cover.webp`,
  sprites: [
    { src: freightShip.src, x: 80, y: 476, w: 528, h: 400, motion: "sail", from: [46.3, -30.6], trip: 3.8, curve: [[176, -476], [225, -130]], emerge: [909, 770] },
    { src: freightTruck.src, x: 536, y: 608, w: 272, h: 260, motion: "drive", from: arriveFrom(64), trip: 2.8, delay: 0.7, curve: [[670, -40], [216, -126]] },
    { src: freightPlane.src, x: 828, y: 504, w: 540, h: 388, motion: "fly", from: [-67.9, -41.9], trip: 5.2, delay: 0.8, curve: [[640, -500], [200, -117]], far: 0.2, turns: true, behind: 0.47 },
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

// Fulfillment's four stations are the steps an order goes through, so a beam
// of light goes round them in that order, clockwise: the order is placed on
// the phone (bottom right), packed at the bench (bottom left), taken through
// the warehouse (top left) and sent out on the truck (top right). Then it
// comes back round for the next order. The ring it runs on is wide enough
// to go round the outside of the sign over the bench, so the beam is in
// view all the way up the left.
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
  const indicatorsRef = useRef<HTMLDivElement>(null);
  const dotRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const truckRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLElement>(null);
  const artTiltRef = useRef<HTMLDivElement>(null);
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
                      {slide.fx && <HeroArtUnder fx={slide.fx} />}
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
