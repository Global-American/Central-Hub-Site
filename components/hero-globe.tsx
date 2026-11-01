"use client";

import { useEffect, useRef, useState } from "react";
import type { ComponentType } from "react";
import type { GlobeMethods, GlobeProps } from "react-globe.gl";
import { supportsWebGL } from "@/components/logistics-globe";
import type { Hologram } from "@/components/globe-hologram";

// Hologram cyan, for the glow around the globe
const GLOW = "#5FD8FF";

// Canvas edge as a multiple of the globe's diameter, leaving room for the
// atmosphere glow. The fallback pictures are cropped to the same box.
const CANVAS_SCALE = 1.5;

// Inset of the globe's disc within the canvas box, for the scanlines
const DISC_INSET = `${((1 - 1 / CANVAS_SCALE) / 2) * 100}%`;

// Camera altitude (globe radii) at which the globe spans 1/CANVAS_SCALE of
// the canvas, under globe.gl's 50° field of view
const ALTITUDE = (() => {
  const t = Math.tan((25 * Math.PI) / 180) / CANVAS_SCALE;
  return Math.sqrt(1 + t * t) / t - 1;
})();

// Facing the Atlantic, like the artwork's own globe
const VIEW = { lat: 18, lng: -30, altitude: ALTITUDE };

type GlobeComponent = ComponentType<
  GlobeProps & { ref?: React.MutableRefObject<GlobeMethods | undefined> }
>;

type Props = {
  /** Centre of the globe, as a % of the parent's width */
  x: number;
  /** Centre of the globe, as a % of the parent's height */
  y: number;
  /** Diameter of the globe, as a % of the parent's width */
  size: number;
  /** The artwork's original globe, cropped to the canvas box. Shown until
      the 3D globe is ready, and instead of it without WebGL. */
  fallback: string;
  /** Only spin while the slide is showing */
  active: boolean;
};

/** A spinning hologram globe to sit in the hero artwork, behind the picture */
export default function HeroGlobe({ x, y, size, fallback, active }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [Globe, setGlobe] = useState<GlobeComponent | null>(null);
  const [hologram, setHologram] = useState<Hologram | null>(null);
  const [width, setWidth] = useState(0);
  const [ready, setReady] = useState(false);
  const [inView, setInView] = useState(false);

  // Load the WebGL library (and the three.js hologram material) on the client only
  useEffect(() => {
    if (!supportsWebGL()) return;
    let cancelled = false;
    Promise.all([import("react-globe.gl"), import("@/components/globe-hologram")])
      .then(([mod, hologramMod]) => {
        if (cancelled) return;
        setHologram(hologramMod.createHologram());
        setGlobe(() => mod.default as unknown as GlobeComponent);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the canvas sized to its box. clientWidth rather than the bounding
  // rect: the hero shrinks its contents with CSS zoom, and the canvas is
  // sized in the box's own (unzoomed) pixels.
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => setWidth(el.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([entry]) => setInView(entry.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  // Only draw frames while the slide is showing and the hero is on screen
  useEffect(() => {
    const g = globeRef.current;
    if (!g || !ready) return;
    if (active && inView) g.resumeAnimation();
    else g.pauseAnimation();
  }, [active, inView, ready]);

  useEffect(() => () => hologram?.dispose(), [hologram]);

  const handleGlobeReady = () => {
    const g = globeRef.current;
    if (!g) return;

    g.pointOfView(VIEW, 0);
    hologram?.attach(g.scene());

    // Not interactive: it just turns
    const controls = g.controls();
    controls.enableRotate = false;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    controls.autoRotateSpeed = 0.8;

    setReady(true);
  };

  return (
    <div
      ref={containerRef}
      aria-hidden="true"
      className="pointer-events-none absolute aspect-square -translate-x-1/2 -translate-y-1/2"
      style={{ left: `${x}%`, top: `${y}%`, width: `${size * CANVAS_SCALE}%` }}
    >
      <img
        src={fallback}
        alt=""
        className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
          ready ? "opacity-0" : "opacity-100"
        }`}
      />

      {Globe && hologram && width > 0 && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <Globe
            ref={globeRef}
            width={width}
            height={width}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl="/globe/earth-hologram.png"
            globeMaterial={hologram.material}
            showAtmosphere
            atmosphereColor={GLOW}
            atmosphereAltitude={0.2}
            animateIn={false}
            enablePointerInteraction={false}
            onGlobeReady={handleGlobeReady}
          />

          {/* Scanlines across the globe's disc */}
          <div
            className="absolute rounded-full mix-blend-screen"
            style={{
              inset: DISC_INSET,
              backgroundImage:
                "repeating-linear-gradient(to bottom, rgba(170,235,255,0.22) 0 1px, transparent 1px 3px)",
            }}
          />
        </div>
      )}
    </div>
  );
}
