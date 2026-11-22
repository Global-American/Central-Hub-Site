"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
// Imported, not named by their path: an imported picture's address has a hash
// of its contents in it, so a redrawn one never comes back out of a cache as
// the old one.
import base from "@/public/card-thumbnails/fx/freight-base.png";
import truck from "@/public/card-thumbnails/fx/freight-truck.png";
import plane from "@/public/card-thumbnails/fx/freight-plane.png";
import ship from "@/public/card-thumbnails/fx/freight-ship.png";
import ring from "@/public/card-thumbnails/fx/freight-ring.webp";

// The Freight itSmart picture (a truck, a plane on a round pad and a ship
// about a phone), brought to life: when it comes on screen the truck drives
// in, the ship sails in and the plane comes down out of the distance onto
// its pad, each along the way it faces. Then the truck's engine ticks over
// and the ship rides the swell, and all the while the bright quarter of the
// pad's band turns.
//
// The picture was cut into layers by scripts/build-brand-fx.py, which prints
// the numbers below. They are all in the picture's own pixels, so everything
// stays pinned to it at any size. Styles: "Freight itSmart picture" in
// app/globals.css.
const W = 1448;
const H = 1086;

// Each vehicle's box, and its trip in: where it starts from (in % of the
// picture's width, across and down from its place), how long the trip takes
// and how long after the picture comes on screen it sets off (seconds).
// The truck and the ship face down and to the left, so they come from up on
// the right, from beyond the picture's edge; the plane faces down and to the
// right, and comes from up on the left.
const VEHICLES: {
  name: "truck" | "ship" | "plane";
  src: StaticImageData;
  box: [number, number, number, number];
  from: [number, number];
  trip: number;
  delay: number;
}[] = [
  { name: "truck", src: truck, box: [350, 175, 338, 321], from: [50, -28.9], trip: 1.7, delay: 0.15 },
  { name: "ship", src: ship, box: [951, 598, 383, 296], from: [38, -21.5], trip: 2.4, delay: 0.5 },
  { name: "plane", src: plane, box: [175, 647, 324, 244], from: [-30, -20.7], trip: 2.3, delay: 0.9 },
];

// The pad the plane lands on: its middle, half width and half height
const PAD = [336, 818.1, 214, 119.7];

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

const mask = (src: string): CSSProperties => ({
  maskImage: `url(${src})`,
  WebkitMaskImage: `url(${src})`,
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
});

export default function FreightArt({
  alt,
  className = "",
  baseClassName = "",
  sizes,
  priority,
}: {
  alt: string;
  /** Extra classes for the picture's box (which fits itself inside its
      parent, like object-contain: the parent must be a size container) */
  className?: string;
  /** Extra classes for the still part of the picture (a drop shadow, say:
      on the box itself it would be redrawn on every frame) */
  baseClassName?: string;
  /** How wide the whole picture is shown, for the browser to pick a file */
  sizes: string;
  priority?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  // Not set until the page is running: without scripts the vehicles simply
  // stand in their places
  const [active, setActive] = useState<boolean>();

  // The vehicles come in each time the picture comes on screen, and are
  // taken away again while it is off it
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-active={active} className={`freight-art ${className}`}>
      <Image
        src={base}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={`relative block h-auto w-full ${baseClassName}`}
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* The bright quarter of the pad's band, turning (it shows only
            where the band is) */}
        <div className="absolute inset-0" style={mask(ring.src)}>
          <div
            className="freight-quarter"
            style={
              {
                left: pct(PAD[0], W),
                top: pct(PAD[1], H),
                width: pct(PAD[2] * 2.1, W),
                "--squash": (PAD[3] / PAD[2]).toFixed(3),
              } as CSSProperties
            }
          />
        </div>

        {VEHICLES.map(({ name, src, box: [x, y, w], from, trip, delay }) => (
          <div
            key={name}
            className="freight-vehicle"
            data-vehicle={name}
            style={
              {
                left: pct(x, W),
                top: pct(y, H),
                width: pct(w, W),
                "--from-x": `${from[0]}cqw`,
                "--from-y": `${from[1]}cqw`,
                "--trip": `${trip}s`,
                "--delay": `${delay}s`,
              } as CSSProperties
            }
          >
            <div className="freight-vehicle-body">
              <Image
                src={src}
                alt=""
                sizes="(min-width: 1024px) 16vw, 1px"
                className="block h-auto w-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
