"use client";

import Image from "next/image";
import type { CSSProperties } from "react";

// The round a slide's artwork can show: something going from station to
// station, clockwise, in the order the work is done in. It runs on a ring on
// the ground under the artwork, so it leaves from under one station and
// comes in under the next, and each station lights up as it gets there.
//
// On the Fulfillment slide that is an order's whole life. The order leaves
// the phone it was placed on as a beam of light, comes out of the packing
// bench as a parcel, and goes on through the warehouse to the truck. The
// truck then drives it down to the phone and in at the back of it, the phone
// turns over to say PARCEL DELIVERED, and it all starts again.
//
// Every coordinate is in the artwork's own pixels, like the rest of the
// animation layer (hero-art-fx.tsx). The pictures are cut from the artwork
// by scripts/build-hero-fx.py (scripts/hero_delivery.py).

/** A piece of the artwork that is a picture of its own: its box there */
type ArtPart = { src: string; x: number; y: number; w: number; h: number };

export type ArtLoop = {
  /** The ring: a circle on the ground, by its middle and how far across it
      reaches either side of that */
  x: number;
  y: number;
  rx: number;
  /** The four stations, first to last, going round clockwise: the middle of
      the top of each one's pad. The ring should pass close to them. */
  stops: [number, number][];
  /** The pads, all alike: how far each reaches either side of its middle,
      and how thick it is */
  pad: [number, number];
  /** What goes round is a parcel (rather than a beam of light) from this
      station on: its picture, its size, and where in it the middle of its
      foot is */
  parcel?: { src: string; w: number; h: number; foot: [number, number]; from: number };
  /** The last station's truck takes it the rest of the way, back to the
      first station, whose phone then says it has come */
  delivery?: {
    /** The truck in its place */
    truck: ArtPart;
    /** What stands in front of the truck there, and stays when it goes */
    front?: ArtPart;
    /** Where it ends up, behind the phone: how far from its place, across
        and down. It sets off the way it faces and comes round to drive
        straight down the picture into the back of the phone, growing small
        as it goes in, until the phone hides it. */
    to: [number, number];
    /** The phone saying the order is placed, the same phone saying the
        parcel has come, and the upright line it turns about (how far across
        its picture, 0 to 1) */
    phone: ArtPart & { delivered: string; axis: number };
    /** What is in front of the phone and stays there while it turns */
    hand?: ArtPart;
  };
};

// Height of a circle on the artwork's isometric ground plane, as a share of its width
const ISO = 0.58;
// The way the truck faces on the artwork's floor: down to the right
const AHEAD = [0.863, 0.506];

const pct = (v: number, of: number) => `${(v / of) * 100}%`;

// --- when things happen, in seconds --------------------------------------

// From one station to the next: a short stop under the pad, then the trip
const STEP = 2.2;
const STOP = 0.4;
// The delivery, counted from when the parcel reaches the truck: the truck
// sets off and is gone into the back of the phone, the phone turns over
// (FLIP seconds) and shows the news until SHOWN, then turns back as the
// round ends, while the truck comes back to its place (HOME seconds).
const DRIVE = [0.2, 2.9];
const FLIP = 0.6;
const SHOWN = 5.0;
const HOME = 0.9;
const DELIVERY = SHOWN + FLIP;
// How far the truck leans into its bend (degrees, side-on), how small it is
// by the time it is inside the phone, and the share of its trip it does at
// its full size
const LEAN = 12;
const INSIDE = 0.36;
const FULL = 0.55;

/** How long a round takes, and when the delivery starts in it */
function timing(loop: ArtLoop) {
  const legs = loop.delivery ? loop.stops.length - 1 : loop.stops.length;
  const handover = legs * STEP;
  return { legs, handover, round: handover + (loop.delivery ? DELIVERY : 0) };
}

// --- where things are -----------------------------------------------------

// Slow away, quick, slow in: 0 to 1
const ease = (p: number) => p * p * (3 - 2 * p);
const STEPS = 24;

/** The trips round the ring, station to station: each as an SVG arc, its
    length, and the points along it. Where a station is on the ring (straight
    out from the ring's middle through it) and how long an arc is are worked
    out with nothing but + - * / and square roots, so the server and every
    browser write the very same text. */
function loopLegs(loop: ArtLoop) {
  const ry = loop.rx * ISO;
  // Each station as a point on a circle of radius 1
  const spots = loop.stops.map(([px, py]) => {
    const u = (px - loop.x) / loop.rx;
    const v = (py - loop.y) / ry;
    const far = Math.sqrt(u * u + v * v);
    return [u / far, v / far];
  });
  const place = ([u, v]: number[]) => [loop.x + u * loop.rx, loop.y + v * ry];
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
    const path = points.map(place);
    const far = [0];
    for (let k = 1; k < path.length; k++) {
      const dx = path[k][0] - path[k - 1][0];
      const dy = path[k][1] - path[k - 1][1];
      far.push(far[k - 1] + Math.sqrt(dx * dx + dy * dy));
    }
    const length = far[far.length - 1];
    /** The point this share of the way along (0 to 1) */
    const at = (share: number) => {
      const want = share * length;
      let k = 1;
      while (k < far.length - 1 && far[k] < want) k++;
      const part = (want - far[k - 1]) / (far[k] - far[k - 1] || 1);
      return [0, 1].map((n) => path[k - 1][n] + (path[k][n] - path[k - 1][n]) * part);
    };
    const [x0, y0] = path[0];
    const [x1, y1] = path[path.length - 1];
    return {
      d: `M${x0.toFixed(1)} ${y0.toFixed(1)}A${loop.rx} ${ry.toFixed(1)} 0 0 1 ${x1.toFixed(1)} ${y1.toFixed(1)}`,
      length: Math.round(length),
      at,
    };
  });
}

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

// --- the keyframes --------------------------------------------------------
// Written out by the component, since they depend on how long the round is
// and where the ring and the truck's bend lie. All in % of a round.

function loopKeyframes(loop: ArtLoop, W: number): string {
  const { legs, handover, round } = timing(loop);
  const at = (seconds: number) => `${Math.min(100, (100 * seconds) / round).toFixed(2)}%`;
  const cqw = (v: number) => `${((100 * v) / W).toFixed(2)}cqw`;
  const out: string[] = [];

  // A leg's light: its head goes from the start of the leg to the end, in
  // step with the parcel (--from and --len are each dash's own), and what is
  // left of its tail fades as it gets there
  const dash = (share: number) =>
    `stroke-dashoffset:calc((var(--from) - var(--len) * ${share.toFixed(4)}) * 1px)`;
  const light = [`0%,${at(STOP)}{${dash(0)};opacity:1}`];
  for (let k = 1; k <= STEPS; k++) {
    light.push(`${at(STOP + ((STEP - STOP) * k) / STEPS)}{${dash(ease(k / STEPS))};opacity:1}`);
  }
  light.push(`${at(STEP + 0.3)},100%{${dash(1)};opacity:0}`);
  out.push(`@keyframes hero-loop-light{${light.join("")}}`);

  // The parcel: under the pad it starts from until its first leg, then along
  // each leg in turn, and out of sight again once it is under the last pad
  if (loop.parcel) {
    const { foot, from } = loop.parcel;
    const trips = loopLegs(loop);
    const spot = ([x, y]: number[], shown: number) =>
      `{opacity:${shown};transform:translate(${cqw(x - foot[0])},${cqw(y - foot[1])})}`;
    const start = from * STEP + STOP;
    const frames = [`0%,${at(start - 0.02)}${spot(trips[from].at(0), 0)}`];
    for (let leg = from; leg < legs; leg++) {
      const t = leg * STEP + STOP;
      frames.push(`${at(t)}${spot(trips[leg].at(0), 1)}`);
      for (let k = 1; k <= STEPS; k++) {
        frames.push(
          `${at(t + ((STEP - STOP) * k) / STEPS)}${spot(trips[leg].at(ease(k / STEPS)), 1)}`
        );
      }
    }
    const end = trips[legs - 1].at(1);
    frames.push(`${at(legs * STEP + 0.02)},100%${spot(end, 0)}`);
    out.push(`@keyframes hero-loop-parcel{${frames.join("")}}`);
  }

  if (loop.delivery) {
    const { to } = loop.delivery;
    // The truck's trip: a bend that leaves along the way it faces and comes
    // in straight down the picture
    const c1 = [170 * AHEAD[0], 170 * AHEAD[1]];
    const c2 = [to[0] + 26, to[1] - 170];
    const point = (t: number) =>
      [0, 1].map(
        (k) => 3 * (1 - t) ** 2 * t * c1[k] + 3 * (1 - t) * t * t * c2[k] + t ** 3 * to[k]
      );
    const heading = (t: number) => {
      const d = [0, 1].map(
        (k) =>
          (1 - t) ** 2 * c1[k] + 2 * (1 - t) * t * (c2[k] - c1[k]) + t * t * (to[k] - c2[k])
      );
      const len = Math.sqrt(d[0] * d[0] + d[1] * d[1]) || 1;
      return [d[0] / len, d[1] / len];
    };
    // How far along the bend each t is, to pace it by distance
    const N = 240;
    const far = [0];
    for (let i = 1, a = point(0); i <= N; i++) {
      const b = point(i / N);
      far.push(far[i - 1] + Math.sqrt((b[0] - a[0]) ** 2 + (b[1] - a[1]) ** 2));
      a = b;
    }
    const [sets, gone] = [handover + DRIVE[0], handover + DRIVE[1]];
    const steps = 32;
    const move = [`0%,${at(sets)}{opacity:1;transform:translate(0,0) rotate(0deg) scale(1)}`];
    for (let step = 1; step <= steps; step++) {
      const share = step / steps;
      const want = ease(share) * far[N];
      let i = 1;
      while (i < N && far[i] < want) i++;
      const t = (i - 1 + (want - far[i - 1]) / (far[i] - far[i - 1] || 1)) / N;
      const [x, y] = point(t);
      const [hx, hy] = heading(t);
      // Going in: smaller, straightening up, and out of sight at the last
      // (the phone is in front of it by then, and is about to turn)
      const going = share > FULL ? ease((share - FULL) / (1 - FULL)) : 0;
      const lean = LEAN * (AHEAD[0] * hy - AHEAD[1] * hx) * (1 - going);
      const size = 1 - (1 - INSIDE) * going;
      const shown = share > 0.9 ? (1 - share) / 0.1 : 1;
      move.push(
        `${at(sets + (gone - sets) * share)}{opacity:${shown.toFixed(2)};` +
          `transform:translate(${cqw(x)},${cqw(y)}) rotate(${lean.toFixed(2)}deg) scale(${size.toFixed(3)})}`
      );
    }
    // Then it comes back to its place from behind (along the way it faces)
    const back = round - HOME;
    const behind = `transform:translate(${cqw(-70 * AHEAD[0])},${cqw(-70 * AHEAD[1])}) rotate(0deg) scale(1)`;
    move.push(
      `${at(gone + 0.1)},${at(back)}{opacity:0;${behind};animation-timing-function:cubic-bezier(0.16,1,0.3,1)}`,
      `100%{opacity:1;transform:translate(0,0) rotate(0deg) scale(1)}`
    );
    out.push(`@keyframes hero-loop-truck{${move.join("")}}`);
    // The phone turns over once the truck is in, and back as the round
    // ends: one face closes edge-on, then the other opens
    const over = gone + 0.1;
    const turns = handover + SHOWN;
    const closing = "animation-timing-function:cubic-bezier(0.5,0,0.9,0.4)";
    const opening = "animation-timing-function:cubic-bezier(0.1,0.6,0.4,1)";
    out.push(
      `@keyframes hero-loop-phone-order{0%{transform:scaleX(1)}${at(over)}{transform:scaleX(1);${closing}}` +
        `${at(over + FLIP / 2)}{transform:scaleX(0)}${at(turns + FLIP / 2)}{transform:scaleX(0);${opening}}` +
        `100%{transform:scaleX(1)}}`,
      `@keyframes hero-loop-phone-delivered{0%{transform:scaleX(0)}${at(over + FLIP / 2)}{transform:scaleX(0);${opening}}` +
        `${at(over + FLIP)}{transform:scaleX(1)}${at(turns)}{transform:scaleX(1);${closing}}` +
        `${at(turns + FLIP / 2)},100%{transform:scaleX(0)}}`
    );
  }
  return out.join("");
}

// --- under the artwork ----------------------------------------------------

// The light on a leg: a comet with a tail, made of dashes drawn over one
// another with their heads together. Each is [length, width, opacity] in
// artwork pixels. A beam has all of them (the last is the bright bead at
// its head); behind a parcel there is only the tail.
const LIGHT: [number, number, number][] = [
  [320, 6, 0.26],
  [180, 8, 0.55],
  [72, 10, 1],
  [1, 19, 1],
];
const TAIL = 2;

/** The part of the round that lies on the ground under the artwork: the
    ring, the light on it, the parcel, and the light under each pad. It goes
    before the picture (and before the globe, which floats over the ground),
    so the picture's own stations hide it where they stand. */
export function HeroArtUnder({
  loop,
  width: W,
  height: H,
}: {
  loop: ArtLoop;
  /** The artwork's pixel size */
  width: number;
  height: number;
}) {
  const [padRx, padDeep] = loop.pad;
  const padRy = padRx * ISO;
  const { legs, handover, round } = timing(loop);
  const trips = loopLegs(loop).slice(0, legs);
  const vars = { "--round": `${round}s` } as CSSProperties;
  const frame = {
    viewBox: `0 0 ${W} ${H}`,
    preserveAspectRatio: "none",
  };
  // When each pad lights up: as the round reaches it, and the first once
  // more when the truck has brought the parcel to it
  const lit = loop.stops.map((stop, i) => ({ stop, when: i * STEP }));
  if (loop.delivery) lit.push({ stop: loop.stops[0], when: handover + DRIVE[1] });
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0" style={vars}>
      <style dangerouslySetInnerHTML={{ __html: loopKeyframes(loop, W) }} />
      {/* Light spilling out from under each pad as the round reaches it */}
      <svg className="hero-docks absolute inset-0 h-full w-full" {...frame}>
        {lit.map(({ stop: [x, y], when }, i) => (
          <path
            key={i}
            className="hero-dock"
            style={{ animationDelay: `${when}s` }}
            d={padOutline(x, y + padDeep / 2, padRx + 4, padRy + padDeep / 2 + 4)}
          />
        ))}
      </svg>
      <svg className="hero-loop absolute inset-0 h-full w-full" {...frame}>
        <ellipse className="hero-loop-track" cx={loop.x} cy={loop.y} rx={loop.rx} ry={loop.rx * ISO} />
        {/* ... and a ripple going out from it over the ground */}
        {lit.map(({ stop: [x, y], when }, i) => (
          <path
            key={i}
            className="hero-dock-ring"
            style={{
              transformOrigin: `${x}px ${y + padDeep / 2}px`,
              animationDelay: `${when}s`,
            }}
            d={padOutline(x, y + padDeep / 2, padRx, padRy + padDeep / 2)}
          />
        ))}
        {/* The light on each leg, one leg at a time */}
        {trips.map((leg, i) => {
          const parcel = loop.parcel && i >= loop.parcel.from;
          return (
            <g key={i} className="hero-loop-light">
              {LIGHT.slice(0, parcel ? TAIL : LIGHT.length).map(([length, width, opacity], k) => (
                <path
                  key={k}
                  d={leg.d}
                  pathLength={leg.length}
                  strokeWidth={width}
                  strokeOpacity={opacity}
                  strokeDasharray={`${length} ${2 * leg.length + length}`}
                  style={
                    {
                      "--from": length,
                      "--len": leg.length,
                      animationDelay: `${i * STEP}s`,
                    } as CSSProperties
                  }
                />
              ))}
            </g>
          );
        })}
      </svg>
      {loop.parcel && (
        <div className="hero-parcel" style={{ width: pct(loop.parcel.w, W) }}>
          <Image
            src={loop.parcel.src}
            alt=""
            width={loop.parcel.w}
            height={loop.parcel.h}
            sizes={`${Math.ceil((100 * loop.parcel.w) / W)}vw`}
            loading="eager"
            className="block h-auto w-full"
          />
        </div>
      )}
    </div>
  );
}

// --- over the artwork -----------------------------------------------------

function Part({
  part,
  of,
  src,
  className,
}: {
  part: ArtPart;
  /** The artwork's width */
  of: number;
  src?: string;
  className?: string;
}) {
  return (
    <Image
      src={src ?? part.src}
      alt=""
      width={part.w}
      height={part.h}
      sizes={`(min-width: 1024px) ${Math.ceil((54 * part.w) / of)}vw, ${Math.ceil((100 * part.w) / of)}vw`}
      loading="eager"
      className={className}
    />
  );
}

/** The delivery's own pictures, over the artwork: the truck (which goes in
    behind the phone, so it comes first) and what stands in front of it, the
    phone's two faces, and what is in front of the phone. */
export function HeroArtDelivery({
  loop,
  width: W,
  height: H,
}: {
  loop: ArtLoop;
  width: number;
  height: number;
}) {
  if (!loop.delivery) return null;
  const { truck, front, phone, hand } = loop.delivery;
  const box = (part: ArtPart): CSSProperties => ({
    left: pct(part.x, W),
    top: pct(part.y, H),
    width: pct(part.w, W),
  });
  const vars = { "--round": `${timing(loop).round}s` } as CSSProperties;
  return (
    <div className="absolute inset-0" style={vars}>
      <div className="hero-truck absolute" style={box(truck)}>
        <Part of={W} part={truck} className="block h-auto w-full" />
      </div>
      {front && (
        <div className="absolute" style={box(front)}>
          <Part of={W} part={front} className="block h-auto w-full" />
        </div>
      )}
      <div
        className="hero-phone absolute"
        style={{ ...box(phone), "--axis": `${phone.axis * 100}%` } as CSSProperties}
      >
        <Part of={W} part={phone} className="hero-phone-order block h-auto w-full" />
        <Part of={W} part={phone} src={phone.delivered} className="hero-phone-delivered absolute inset-0 h-full w-full" />
      </div>
      {hand && (
        <div className="absolute" style={box(hand)}>
          <Part of={W} part={hand} className="block h-auto w-full" />
        </div>
      )}
    </div>
  );
}
