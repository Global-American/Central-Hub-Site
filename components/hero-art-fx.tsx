"use client";

import Image from "next/image";
import { useId } from "react";
import type { CSSProperties } from "react";
import { HeroArtDelivery, type ArtLoop } from "@/components/hero-art-loop";

// Animation layer drawn over a hero slide's artwork. Every coordinate here is
// in the artwork's own pixels (its PNG size), so the effects stay pinned to
// the picture at any size. The masks and sprites in
// /public/hero-variation-smart/fx were cut from the artwork itself:
//   *-base.png       the artwork with its vehicles taken out (or its cog
//                    swapped for a circuit board)
//   <slide>-<thing>  each vehicle on its own, cropped to its box
//   *-lines.webp     only the artwork's network / circuit lines
//   *-silhouette     the artwork's outline, for the gloss sweep
//   *-cover.webp     everything but the piece a vehicle arrives from behind

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
  /** It comes a long way (sails, drives or flies in from out of the picture)
      rather than gliding a short step into place: seconds the trip takes */
  trip?: number;
  /** It swerves on its trip instead of coming straight in: the trip is a
      Bezier curve from `from` to its place, bent by these two control points
      (offsets from its place, in artwork pixels). Put the second one back
      along its heading so it pulls in straight. */
  curve?: [[number, number], [number, number]];
  /** It arrives from behind the artwork's `cover`: out of sight until it
      reaches the first x, all there by the second (artwork pixels, heading
      left) */
  emerge?: [number, number];
  /** It comes in from far off (a trip with a `curve` only): this many times
      its size at the start (0.2 is a fifth), staying small for most of the
      way and growing as it comes in to its place */
  far?: number;
};

export type ArtFx = {
  /** The artwork's pixel size, which every coordinate below refers to */
  width: number;
  height: number;
  /** The artwork's outline, for the gloss that sweeps across it */
  silhouette: string;
  sprites?: ArtSprite[];
  /** Everything but the piece of the artwork that hides the vehicles
      arriving from behind it (see ArtSprite.emerge) */
  cover?: string;
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
  /** A round of the artwork's stations, in the order the work is done in:
      see hero-art-loop.tsx */
  loop?: ArtLoop;
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

// A curved trip, as keyframes. The vehicle keeps to the Bezier curve, quick at
// first and slowing all the way in, and leans into the bends (it turns a
// little towards where it is going, as far as a flat picture of it can).
// One that comes from far off grows on the way.
// Only + - * / and square roots, so the server and every browser write the
// very same text.
const TRIP_STEPS = 36;
const TRIP_LEAN = 13; // degrees of lean when it is travelling side-on
const tripName = (s: ArtSprite) =>
  `hero-trip-${s.src.split("/").pop()!.replace(/\W+/g, "-")}`;

function tripKeyframes(s: ArtSprite, W: number): string {
  const p0 = [(s.from[0] / 100) * W, (s.from[1] / 100) * W];
  const [c1, c2] = s.curve!;
  const at = (t: number) =>
    [0, 1].map(
      (k) => 3 * (1 - t) ** 2 * t * c1[k] + 3 * (1 - t) * t * t * c2[k] + (1 - t) ** 3 * p0[k]
    );
  const heading = (t: number) => {
    const d = [0, 1].map(
      (k) =>
        (1 - t) ** 2 * (c1[k] - p0[k]) + 2 * (1 - t) * t * (c2[k] - c1[k]) - t * t * c2[k]
    );
    const len = Math.sqrt(d[0] * d[0] + d[1] * d[1]) || 1;
    return [d[0] / len, d[1] / len];
  };
  // How far along the curve each t is, to pace it by distance
  const N = 240;
  const along = [0];
  for (let i = 1, a = at(0); i <= N; i++) {
    const b = at(i / N);
    along.push(along[i - 1] + Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2));
    a = b;
  }
  const home = heading(1);
  const frames = [];
  for (let step = 0; step <= TRIP_STEPS; step++) {
    const time = step / TRIP_STEPS;
    const pace = 1 - (1 - time) ** 2;
    const want = pace * along[N];
    let i = 1;
    while (i < N && along[i] < want) i++;
    const t = (i - 1 + (want - along[i - 1]) / (along[i] - along[i - 1] || 1)) / N;
    const [x, y] = at(t);
    const [hx, hy] = heading(t);
    const lean = TRIP_LEAN * (home[0] * hy - home[1] * hx);
    const late = pace * pace * pace; // most of the growing comes at the end
    const size = s.far ? s.far + (1 - s.far) * late * late : 1;
    frames.push(
      `${((100 * step) / TRIP_STEPS).toFixed(2)}%{opacity:${Math.min(1, time / 0.12).toFixed(2)};` +
        `transform:translate(${((100 * x) / W).toFixed(2)}cqw,${((100 * y) / W).toFixed(2)}cqw) ` +
        `rotate(${lean.toFixed(2)}deg)` +
        (s.far ? ` scale(${size.toFixed(3)})` : "") +
        "}"
    );
  }
  return `@keyframes ${tripName(s)}{${frames.join("")}}`;
}

// A vehicle behind the cover: hidden where the cover's piece of the artwork
// is, and to the right of where it comes into view
const emergeMask = (cover: string, [from, to]: [number, number], W: number): CSSProperties => {
  const layers = `url(${cover}), linear-gradient(to right, #000 ${pct(to, W)}, transparent ${pct(from, W)})`;
  return {
    WebkitMaskImage: layers,
    maskImage: layers,
    WebkitMaskSize: "100% 100%",
    maskSize: "100% 100%",
    WebkitMaskRepeat: "no-repeat",
    maskRepeat: "no-repeat",
    WebkitMaskComposite: "source-in",
    maskComposite: "intersect",
  };
};

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
  const curved = fx.sprites?.filter((s) => s.trip && s.curve) ?? [];
  // When the last vehicle on a trip is in its place. The gloss is cut to the
  // finished picture, so until then it would light vehicles that aren't there.
  const settled = Math.max(
    0,
    ...(fx.sprites ?? []).map((s) => (s.trip ? (s.delay ?? 0) + s.trip : 0))
  );

  const vehicle = (s: ArtSprite) => (
    <div
      key={s.src}
      className={`hero-sprite absolute ${s.trip ? "hero-sprite-trip" : ""}`}
      data-motion={s.motion}
      data-far={s.far && s.trip && s.curve ? "" : undefined}
      style={
        {
          left: pct(s.x, W),
          top: pct(s.y, H),
          width: pct(s.w, W),
          "--from-x": `${s.from[0]}cqw`,
          "--from-y": `${s.from[1]}cqw`,
          "--delay": `${s.delay ?? 0}s`,
          ...(s.trip ? { "--trip": `${s.trip}s` } : null),
          // The curve's keyframes carry their own pacing
          ...(s.trip && s.curve
            ? { "--trip-path": tripName(s), "--trip-ease": "linear" }
            : null),
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
  );

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
      {curved.length > 0 && (
        <style
          dangerouslySetInnerHTML={{
            __html: curved.map((s) => tripKeyframes(s, W)).join(""),
          }}
        />
      )}
      {fx.sprites?.map((s) => {
        const sprite = vehicle(s);
        // The mask stays put on the artwork while the vehicle moves under it
        return s.emerge && fx.cover ? (
          <div
            key={s.src}
            className="absolute inset-0"
            style={emergeMask(fx.cover, s.emerge, W)}
          >
            {sprite}
          </div>
        ) : (
          sprite
        );
      })}

      {/* The truck and the phone of the round's delivery */}
      {fx.loop && <HeroArtDelivery loop={fx.loop} width={W} height={H} />}

      {/* Gloss sweeping across the whole picture */}
      <div
        className="hero-sheen absolute inset-0 overflow-hidden"
        style={
          {
            ...mask(fx.silhouette),
            ...(settled ? { "--sheen-delay": `${settled + 0.4}s` } : null),
          } as CSSProperties
        }
      />

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
