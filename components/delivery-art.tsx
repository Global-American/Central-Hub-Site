"use client";

import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import type { CSSProperties } from "react";
// Imported, not named by their path: an imported picture's address has a hash
// of its contents in it, so a redrawn one never comes back out of a cache as
// the old one.
import base from "@/public/card-thumbnails/fx/delivery-base.png";
import pin from "@/public/card-thumbnails/fx/delivery-pin.png";
import truck1 from "@/public/card-thumbnails/fx/delivery-truck-1.png";
import truck2 from "@/public/card-thumbnails/fx/delivery-truck-2.png";
import truck3 from "@/public/card-thumbnails/fx/delivery-truck-3.png";
import truck4 from "@/public/card-thumbnails/fx/delivery-truck-4.png";
import truck5 from "@/public/card-thumbnails/fx/delivery-truck-5.png";
import signal1 from "@/public/card-thumbnails/fx/delivery-signal-1.png";
import signal2 from "@/public/card-thumbnails/fx/delivery-signal-2.png";
import signal3 from "@/public/card-thumbnails/fx/delivery-signal-3.png";
import rings from "@/public/card-thumbnails/fx/delivery-rings.webp";
import lines from "@/public/card-thumbnails/fx/delivery-lines.webp";
import screen from "@/public/card-thumbnails/fx/delivery-screen.webp";

// The Ship itSmart picture (five trucks on round pads about a phone with a
// map pin on it), brought to life: the pin hops on the phone and sends a
// parcel to each truck in turn, which hops as it catches it and sends a pulse
// of light out along the lines round it. All the while the bright quarter of
// each pad turns, the signal marks ping and the phone's screen catches the
// light.
//
// The picture was cut into layers by scripts/build-brand-fx.py, which prints
// the numbers below. They are all in the picture's own pixels, so everything
// stays pinned to it at any size. Styles: "Ship itSmart picture" in
// app/globals.css.
const W = 1440;
const H = 1024;

// Each truck's box, and the pad it stands on (middle x, y, half width, half
// height), in the order the parcels go round. `up` is how high its parcel is
// thrown, in % of the picture's width: less for the trucks at the top, so it
// stays in the picture.
const TRUCKS: {
  src: StaticImageData;
  box: [number, number, number, number];
  pad: [number, number, number, number];
  up: number;
}[] = [
  { src: truck1, box: [593, 65, 156, 173], pad: [656, 205.8, 98, 54.2], up: 5 },
  { src: truck2, box: [1027, 156, 156, 173], pad: [1088, 295.8, 98, 54.2], up: 7 },
  { src: truck3, box: [1013, 601, 230, 257], pad: [1103.5, 809.9, 147.5, 80.1], up: 11 },
  { src: truck4, box: [236, 658, 230, 257], pad: [327.5, 867.9, 147.5, 80.1], up: 12 },
  { src: truck5, box: [274, 310, 182, 203], pad: [344, 470.4, 119, 63.8], up: 9 },
];
// Where a parcel lands on a truck: the middle of the top of its box, as
// shares of the truck's own box
const CATCH = [0.54, 0.2];

const PIN = { box: [789, 260, 146, 229], tip: [853, 487] };

// Each signal mark's box, and the dot its arcs spread from
const SIGNALS: { src: StaticImageData; box: number[]; dot: number[] }[] = [
  { src: signal1, box: [753, 56, 67, 50], dot: [757, 94] },
  { src: signal2, box: [1192, 126, 71, 47], dot: [1197, 165] },
  { src: signal3, box: [150, 533, 84, 62], dot: [224, 549] },
];

// The timing, in seconds. The pin hops once per SLOT and each truck gets a
// parcel once per turn of TRUCKS.length slots; the keyframes in globals.css
// are written for a 2.4s slot and a 12s turn.
const SLOT = 2.4;
const START = 0.4; // before the first hop
const LAND = 0.53; // the pin comes back down, and the parcel leaves
const FLIGHT = 0.95; // the parcel is in the air

const pct = (v: number, of: number) => `${(v / of) * 100}%`;
const cqw = (v: number) => `${((v / W) * 100).toFixed(2)}cqw`;

const mask = (src: string): CSSProperties => ({
  maskImage: `url(${src})`,
  WebkitMaskImage: `url(${src})`,
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
});

/** A parcel like the ones on the trucks: a taped box, seen from the same side */
function Parcel() {
  return (
    <svg viewBox="0 0 40 44" className="block h-auto w-full">
      <path d="M2 11 20 20v22L2 33z" fill="#c1b4a9" />
      <path d="M38 11 20 20v22l18-9z" fill="#96817d" />
      <path d="M20 2 38 11 20 20 2 11z" fill="#dfd6d4" />
      <path d="M13.2 5.4 31.2 14.4l-4.4 2.2L8.8 7.6z" fill="#f5e4a7" />
      <path d="M31.2 14.4v8l-4.4 2.2v-8z" fill="#e3cd8c" />
    </svg>
  );
}

export default function DeliveryArt({
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
  const [active, setActive] = useState(false);

  // Only run while the picture is on screen: it starts from the top each
  // time it comes back, with everything in step
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
    <div
      ref={ref}
      data-active={active}
      className={`delivery-art ${className}`}
      style={{ "--start": `${START}s` } as CSSProperties}
    >
      <Image
        src={base}
        alt={alt}
        sizes={sizes}
        priority={priority}
        className={`relative block h-auto w-full ${baseClassName}`}
      />

      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        {/* The bright quarter of each pad's band, turning (it shows only
            where the band is) */}
        <div className="absolute inset-0" style={mask(rings.src)}>
          {TRUCKS.map(({ pad: [x, y, a, b] }, i) => (
            <div
              key={i}
              className="delivery-quarter"
              style={
                {
                  left: pct(x, W),
                  top: pct(y, H),
                  width: pct(a * 2.1, W),
                  "--squash": (b / a).toFixed(3),
                  "--turn": `${6.5 + i * 0.7}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>

        {/* A pulse of light along the lines round a truck as it catches its
            parcel */}
        <div className="absolute inset-0 overflow-hidden" style={mask(lines.src)}>
          {TRUCKS.map(({ pad: [x, y, a, b] }, i) => (
            <div
              key={i}
              className="delivery-pulse"
              style={
                {
                  left: pct(x, W),
                  top: pct(y - b * 0.7, H),
                  width: pct(a * 4.3, W),
                  "--at": `${START + i * SLOT + LAND + FLIGHT}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>

        {/* Signal marks, spreading out from their dot */}
        {SIGNALS.map(({ src, box: [x, y, w, h], dot }, i) => (
          <div
            key={i}
            className="delivery-signal"
            style={
              {
                left: pct(x, W),
                top: pct(y, H),
                width: pct(w, W),
                "--dot-x": pct(dot[0] - x, w),
                "--dot-y": pct(dot[1] - y, h),
                "--at": `${0.3 + i * 0.8}s`,
              } as CSSProperties
            }
          >
            <Image src={src} alt="" sizes="48px" className="block h-auto w-full" />
          </div>
        ))}

        {/* On the phone's screen: a ripple where the pin lands, and a gloss */}
        <div className="absolute inset-0 overflow-hidden" style={mask(screen.src)}>
          <div
            className="delivery-ripple"
            style={{
              left: pct(PIN.tip[0], W),
              top: pct(PIN.tip[1], H),
              width: pct(520, W),
            }}
          />
          <div className="delivery-gloss" />
        </div>

        {TRUCKS.map(({ src, box: [x, y, w] }, i) => (
          <div
            key={i}
            className="delivery-truck"
            style={
              {
                left: pct(x, W),
                top: pct(y, H),
                width: pct(w, W),
                "--at": `${START + i * SLOT + LAND + FLIGHT}s`,
                "--idle": `${2.3 + ((i * 3) % 5) * 0.22}s`,
              } as CSSProperties
            }
          >
            <div className="delivery-truck-idle">
              <Image src={src} alt="" sizes="160px" className="block h-auto w-full" />
            </div>
          </div>
        ))}

        <div
          className="delivery-pin"
          style={{
            left: pct(PIN.box[0], W),
            top: pct(PIN.box[1], H),
            width: pct(PIN.box[2], W),
            transformOrigin: `${pct(PIN.tip[0] - PIN.box[0], PIN.box[2])} ${pct(
              PIN.tip[1] - PIN.box[1],
              PIN.box[3]
            )}`,
          }}
        >
          <Image src={pin} alt="" sizes="96px" className="block h-auto w-full" />
        </div>

        {/* Parcels, thrown from under the pin to each truck in turn, and a
            twinkle where each one lands */}
        {TRUCKS.map(({ box: [x, y, w, h], up }, i) => {
          const to = [x + w * CATCH[0], y + h * CATCH[1]];
          const at = START + i * SLOT + LAND;
          return (
            <div key={i}>
              <div
                className="delivery-parcel"
                style={
                  {
                    left: pct(PIN.tip[0], W),
                    top: pct(PIN.tip[1], H),
                    "--to-x": cqw(to[0] - PIN.tip[0]),
                    "--to-y": cqw(to[1] - PIN.tip[1]),
                    "--up": `${up}cqw`,
                    "--at": `${at}s`,
                  } as CSSProperties
                }
              >
                <div className="delivery-parcel-toss">
                  <Parcel />
                </div>
              </div>
              <svg
                className="delivery-spark"
                viewBox="0 0 24 24"
                style={
                  {
                    left: pct(to[0], W),
                    top: pct(to[1], H),
                    "--at": `${at + FLIGHT}s`,
                  } as CSSProperties
                }
              >
                <path
                  fill="currentColor"
                  d="M12 0c.7 6.3 5.7 11.3 12 12-6.3.7-11.3 5.7-12 12-.7-6.3-5.7-11.3-12-12C6.3 11.3 11.3 6.3 12 0z"
                />
              </svg>
            </div>
          );
        })}
      </div>
    </div>
  );
}
