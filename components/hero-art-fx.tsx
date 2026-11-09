"use client";

import Image from "next/image";
import { useId } from "react";
import type { CSSProperties } from "react";

// Animation layer drawn over a hero slide's artwork. Every coordinate here is
// in the artwork's own pixels (its PNG size), so the effects stay pinned to
// the picture at any size. The masks and sprites in
// /public/hero-variation-smart/fx were cut from the artwork itself:
//   *-base.png       the artwork with its vehicles taken out
//   <slide>-<thing>  each vehicle on its own, cropped to its box
//   *-lines.webp     only the artwork's network / circuit lines
//   *-silhouette     the artwork's outline, for the gloss sweep

/** A piece of the artwork that moves on its own */
export type ArtSprite = {
  src: string;
  /** Box of the sprite within the artwork */
  x: number;
  y: number;
  w: number;
  h: number;
  /** sail: rock on the water, drive: road bumps, fly: hover */
  motion: "sail" | "drive" | "fly";
  /** Where it glides in from when the slide comes in, in % of the artwork's
      width (along its heading, so it pulls into place) */
  from: [number, number];
  /** Stagger of its arrival, in seconds */
  delay?: number;
};

export type ArtFx = {
  /** The artwork's pixel size, which every coordinate below refers to */
  width: number;
  height: number;
  /** The artwork's outline, for the gloss that sweeps across it */
  silhouette: string;
  sprites?: ArtSprite[];
  /** Waves of light running out along the artwork's own lines */
  lines?: {
    mask: string;
    /** Where the waves start */
    x: number;
    y: number;
    /** How far they travel (horizontal radius, in artwork pixels) */
    radius: number;
    /** light: brighten cyan lines, electric: colour pale lines */
    tone: "light" | "electric";
  };
  /** Isometric rings sent out over the ground from a point */
  rings?: {
    shape: "ellipse" | "diamond";
    x: number;
    y: number;
    /** Starting horizontal radius; the vertical one follows the isometric angle */
    rx: number;
    /** How much bigger each ring gets before it fades out */
    grow: number;
    /** Rounded box the rings pass behind (x, y, w, h) */
    behind: [number, number, number, number];
  };
  /** Twinkles: x, y, size (1 = 2.2% of the artwork's width) */
  sparkles?: [number, number, number][];
};

// Height of a circle on the artwork's isometric ground plane, as a share of its width
const ISO = 0.58;

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

const mask = (src: string): CSSProperties => ({
  maskImage: `url(${src})`,
  WebkitMaskImage: `url(${src})`,
  maskSize: "100% 100%",
  WebkitMaskSize: "100% 100%",
  maskRepeat: "no-repeat",
  WebkitMaskRepeat: "no-repeat",
});

export default function HeroArtFx({
  fx,
  priority,
}: {
  fx: ArtFx;
  /** Load the sprites with the page (first slide) */
  priority?: boolean;
}) {
  const { width: W, height: H } = fx;
  const maskId = useId();

  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Rings over the ground, under the vehicles */}
      {fx.rings && (
        <svg
          className="hero-rings absolute inset-0 h-full w-full"
          viewBox={`0 0 ${W} ${H}`}
          preserveAspectRatio="none"
        >
          <defs>
            <mask id={maskId} maskUnits="userSpaceOnUse" x="0" y="0" width={W} height={H}>
              <rect width={W} height={H} fill="white" />
              <rect
                x={fx.rings.behind[0]}
                y={fx.rings.behind[1]}
                width={fx.rings.behind[2]}
                height={fx.rings.behind[3]}
                rx={fx.rings.behind[2] / 2.4}
                fill="black"
              />
            </mask>
          </defs>
          <g mask={`url(#${maskId})`}>
            {[0, 1, 2].map((i) => {
              const { x, y, rx, shape, grow } = fx.rings!;
              const ry = rx * ISO;
              const style = {
                transformOrigin: `${x}px ${y}px`,
                animationDelay: `${i * 1.3}s`,
                "--grow": grow,
              } as CSSProperties;
              return shape === "diamond" ? (
                <polygon
                  key={i}
                  className="hero-ring"
                  style={style}
                  points={`${x - rx},${y} ${x},${y - ry} ${x + rx},${y} ${x},${y + ry}`}
                />
              ) : (
                <ellipse
                  key={i}
                  className="hero-ring"
                  style={style}
                  cx={x}
                  cy={y}
                  rx={rx}
                  ry={ry}
                />
              );
            })}
          </g>
        </svg>
      )}

      {/* Waves of light along the artwork's lines */}
      {fx.lines && (
        <div
          className={`hero-waves hero-waves-${fx.lines.tone} absolute inset-0 overflow-hidden`}
          style={mask(fx.lines.mask)}
        >
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="hero-wave"
              style={
                {
                  left: pct(fx.lines!.x, W),
                  top: pct(fx.lines!.y, H),
                  width: pct(fx.lines!.radius * 2, W),
                  animationDelay: `${i * 1.4}s`,
                } as CSSProperties
              }
            />
          ))}
        </div>
      )}

      {/* Vehicles, each moving on its own */}
      {fx.sprites?.map((s) => (
        <div
          key={s.src}
          className="hero-sprite absolute"
          style={
            {
              left: pct(s.x, W),
              top: pct(s.y, H),
              width: pct(s.w, W),
              "--from-x": `${s.from[0]}cqw`,
              "--from-y": `${s.from[1]}cqw`,
              "--delay": `${s.delay ?? 0}s`,
            } as CSSProperties
          }
        >
          <div className={`hero-sprite-${s.motion}`}>
            <Image
              src={s.src}
              alt=""
              width={s.w}
              height={s.h}
              sizes={`(min-width: 1024px) ${Math.ceil((54 * s.w) / W)}vw, ${Math.ceil(
                (100 * s.w) / W
              )}vw`}
              priority={priority}
              loading={priority ? undefined : "eager"}
              className="block h-auto w-full"
            />
          </div>
        </div>
      ))}

      {/* Gloss sweeping across the whole picture */}
      <div className="hero-sheen absolute inset-0 overflow-hidden" style={mask(fx.silhouette)} />

      {fx.sparkles?.map(([x, y, size], i) => (
        <svg
          key={i}
          className="hero-sparkle absolute"
          viewBox="0 0 24 24"
          style={
            {
              left: pct(x, W),
              top: pct(y, H),
              width: `${2.2 * size}cqw`,
              animationDelay: `${(i * 0.7) % 3.2}s`,
            } as CSSProperties
          }
        >
          <path
            fill="currentColor"
            d="M12 0c.7 6.3 5.7 11.3 12 12-6.3.7-11.3 5.7-12 12-.7-6.3-5.7-11.3-12-12C6.3 11.3 11.3 6.3 12 0z"
          />
        </svg>
      ))}
    </div>
  );
}
