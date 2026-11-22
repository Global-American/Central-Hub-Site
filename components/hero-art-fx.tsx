"use client";

import Image from "next/image";
import { useId } from "react";
import type { CSSProperties } from "react";

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
//                    or passes behind

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
  /** It comes in from far off (a curved trip only): this many times its size
      at the start (0.2 is a fifth), growing as it nears its place, most of
      all at the end */
  far?: number;
  /** It faces the way it is going (a curved trip only): mirrored while it
      heads the other way across the picture from the way it finally faces,
      swinging round as it turns back */
  turns?: boolean;
  /** It passes behind the artwork's `cover` on its way (a curved trip only):
      for this share of the trip's time (0 to 1) it is drawn behind the cover
      and under the other vehicles, and as usual after that. Pick a moment
      when it is clear of the cover and inside the picture. */
  behind?: number;
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
  /** A beam of light that goes round the artwork's stations in turn, to show
      the order the work is done in. It runs on a ring on the ground, under
      the artwork (so it leaves from under one station and comes in under the
      next), and each station lights up as the beam reaches it: see
      HeroArtUnder. */
  loop?: {
    /** The ring: a circle on the ground, by its middle and how far across it
        reaches either side of that */
    x: number;
    y: number;
    rx: number;
    /** The four stations, first to last, going round clockwise: the middle
        of the top of each one's pad. The ring should pass close to them. */
    stops: [number, number][];
    /** The pads, all alike: how far each reaches either side of its middle,
        and how thick it is */
    pad: [number, number];
  };
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
// One that comes from far off grows on the way, and one that turns is
// mirrored while it heads the other way across the picture.
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
    // Which way it faces: 1 as it is drawn, -1 mirrored, narrowing to nearly
    // edge on (never quite, or it would vanish) as it swings from heading
    // one way across to the other
    const across = Math.max(-1, Math.min(1, (home[0] < 0 ? -hx : hx) / 0.35));
    const face = !s.turns ? 1 : across < 0 ? Math.min(-0.14, across) : Math.max(0.14, across);
    const ahead = face < 0 ? [-home[0], home[1]] : home;
    const lean = TRIP_LEAN * (ahead[0] * hy - ahead[1] * hx) * (face < 0 ? -face : face);
    const size = s.far ? s.far + (1 - s.far) * pace * pace * pace : 1;
    frames.push(
      `${((100 * step) / TRIP_STEPS).toFixed(2)}%{opacity:${Math.min(1, time / 0.12).toFixed(2)};` +
        `transform:translate(${((100 * x) / W).toFixed(2)}cqw,${((100 * y) / W).toFixed(2)}cqw) ` +
        `rotate(${lean.toFixed(2)}deg)` +
        (s.far || s.turns ? ` scale(${(face * size).toFixed(3)},${size.toFixed(3)})` : "") +
        "}"
    );
  }
  return `@keyframes ${tripName(s)}{${frames.join("")}}`;
}

// The beam: a comet with a tail, made of dashes drawn over one another with
// their heads together. Each is [length, width, opacity] in artwork pixels;
// the last is the bright bead at its head.
const BEAM: [number, number, number][] = [
  [320, 6, 0.26],
  [180, 8, 0.55],
  [72, 10, 1],
  [1, 19, 1],
];
const BEAM_LONGEST = BEAM[0][0];
// The bead starts this far back from the start of its leg, to be out of
// sight under the pad it leaves
const BEAM_TUCK = 20;
// Seconds from one station to the next (a short stop, then the trip)
const LOOP_STEP = 2.2;

/** The outline of a pad: a diamond with its corners rounded off */
function padOutline(x: number, y: number, rx: number, ry: number): string {
  const corners = [
    [x - rx, y],
    [x, y - ry],
    [x + rx, y],
    [x, y + ry],
  ];
  const cut = 0.24;
  const part = (from: number[], to: number[]) =>
    `${(from[0] + (to[0] - from[0]) * cut).toFixed(1)} ${(from[1] + (to[1] - from[1]) * cut).toFixed(1)}`;
  return (
    corners
      .map((c, i) => {
        const before = corners[(i + 3) % 4];
        const after = corners[(i + 1) % 4];
        return `${i ? "L" : "M"}${part(c, before)}Q${c[0]} ${c[1]} ${part(c, after)}`;
      })
      .join("") + "Z"
  );
}

/** The beam's trips round its ring, station to station: each as an SVG arc
    and its length. Where a station is on the ring (straight out from the
    ring's middle through it) and how long an arc is are worked out with
    nothing but + - * / and square roots, like the vehicles' trips. */
function loopLegs(loop: NonNullable<ArtFx["loop"]>) {
  const ry = loop.rx * ISO;
  // Each station as a point on a circle of radius 1
  const spots = loop.stops.map(([px, py]) => {
    const u = (px - loop.x) / loop.rx;
    const v = (py - loop.y) / ry;
    const far = Math.sqrt(u * u + v * v);
    return [u / far, v / far];
  });
  const place = ([u, v]: number[]) =>
    `${(loop.x + u * loop.rx).toFixed(1)} ${(loop.y + v * ry).toFixed(1)}`;
  return spots.map((from, i) => {
    const to = spots[(i + 1) % spots.length];
    // The arc between them, halved and halved again, measured along the
    // straight steps
    let points = [from, to];
    for (let halving = 0; halving < 5; halving++) {
      const finer = [points[0]];
      for (let k = 1; k < points.length; k++) {
        const [a, b] = [points[k - 1], points[k]];
        const far = Math.sqrt((a[0] + b[0]) ** 2 + (a[1] + b[1]) ** 2);
        finer.push([(a[0] + b[0]) / far, (a[1] + b[1]) / far], b);
      }
      points = finer;
    }
    let length = 0;
    for (let k = 1; k < points.length; k++) {
      const dx = (points[k][0] - points[k - 1][0]) * loop.rx;
      const dy = (points[k][1] - points[k - 1][1]) * ry;
      length += Math.sqrt(dx * dx + dy * dy);
    }
    return {
      d: `M${place(from)}A${loop.rx} ${ry.toFixed(1)} 0 0 1 ${place(to)}`,
      length: Math.round(length),
    };
  });
}

/** The part of a slide's animation that lies on the ground under its
    artwork. It goes before the picture (and before the globe, which floats
    over the ground), so the picture's own stations hide it where they stand. */
export function HeroArtUnder({ fx }: { fx: ArtFx }) {
  const loop = fx.loop;
  if (!loop) return null;
  const { width: W, height: H } = fx;
  const [padRx, padDeep] = loop.pad;
  const padRy = padRx * ISO;
  const legs = loopLegs(loop);
  const round = { "--round": `${loop.stops.length * LOOP_STEP}s` } as CSSProperties;
  const frame = {
    viewBox: `0 0 ${W} ${H}`,
    preserveAspectRatio: "none",
    style: round,
  };
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {/* Light spilling out from under each pad as the beam comes in */}
      <svg className="hero-docks absolute inset-0 h-full w-full" {...frame}>
        {loop.stops.map(([x, y], i) => (
          <path
            key={i}
            className="hero-dock"
            style={{ animationDelay: `${i * LOOP_STEP}s` }}
            d={padOutline(x, y + padDeep / 2, padRx + 4, padRy + padDeep / 2 + 4)}
          />
        ))}
      </svg>
      <svg className="hero-loop absolute inset-0 h-full w-full" {...frame}>
        <ellipse className="hero-loop-track" cx={loop.x} cy={loop.y} rx={loop.rx} ry={loop.rx * ISO} />
        {/* ... and a ripple going out from it over the ground */}
        {loop.stops.map(([x, y], i) => (
          <path
            key={i}
            className="hero-dock-ring"
            style={{
              transformOrigin: `${x}px ${y + padDeep / 2}px`,
              animationDelay: `${i * LOOP_STEP}s`,
            }}
            d={padOutline(x, y + padDeep / 2, padRx, padRy + padDeep / 2)}
          />
        ))}
        {/* The beam itself: one leg at a time, each in its quarter of a round */}
        {legs.map((leg, i) => (
          <g key={i} className="hero-beam">
            {BEAM.map(([length, width, opacity], k) => (
              <path
                key={k}
                d={leg.d}
                pathLength={leg.length}
                strokeWidth={width}
                strokeOpacity={opacity}
                strokeDasharray={`${length} ${leg.length + 2 * BEAM_LONGEST + 100}`}
                style={
                  {
                    "--from": length + BEAM_TUCK,
                    "--to": length - leg.length - BEAM_LONGEST - BEAM_TUCK,
                    animationDelay: `${i * LOOP_STEP}s`,
                  } as CSSProperties
                }
              />
            ))}
          </g>
        ))}
      </svg>
    </div>
  );
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
  // Vehicles that pass behind the cover on their way, and when each stops
  // being drawn behind it
  const passes = (s: ArtSprite) => Boolean(s.behind && s.trip && s.curve && fx.cover);
  const swap = (s: ArtSprite) =>
    ({ "--swap": `${((s.delay ?? 0) + s.behind! * s.trip!).toFixed(2)}s` }) as CSSProperties;
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
      {/* A vehicle passing behind the cover is drawn twice: here, cut to the
          cover and under the others, until it is clear of it, and with the
          rest from then on. Both are in the same place when one takes over. */}
      {fx.sprites?.filter(passes).map((s) => (
        <div
          key={s.src}
          className="hero-sprite-behind absolute inset-0"
          style={{ ...mask(fx.cover!), ...swap(s) }}
        >
          {vehicle(s)}
        </div>
      ))}
      {fx.sprites?.map((s) => {
        const sprite = vehicle(s);
        if (passes(s)) {
          return (
            <div key={s.src} className="hero-sprite-front absolute inset-0" style={swap(s)}>
              {sprite}
            </div>
          );
        }
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
