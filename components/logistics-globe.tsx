"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import type { GlobeMethods, GlobeProps } from "react-globe.gl";

// Brand palette
const ORANGE = "#EB993C";

// 1 = globe.gl's default lighting; higher is brighter
const LIGHT_LEVEL = 1.4;

export type GlobeHub = { id: string; label: string; lat: number; lng: number };
export type GlobeView = { lat: number; lng: number; altitude: number };

type Props = {
  hubs: GlobeHub[];
  /** Hub to fly to; null/undefined returns to the home view */
  selectedId?: string | null;
  /** When set, hub pins and labels become clickable */
  onHubSelect?: (id: string) => void;
  /** Camera position when nothing is selected */
  homeView?: GlobeView;
  /** Camera altitude (globe radii) when zoomed in on a hub */
  focusAltitude?: number;
  /** Rendered instead of the globe when WebGL is unavailable */
  fallback?: ReactNode;
  /** Must position and size the element (e.g. "absolute inset-0") */
  className?: string;
};

// Markets we ship to; each is drawn as a lane from its nearest hub
const cities = [
  { name: "Los Angeles", lat: 34.05, lng: -118.24 },
  { name: "Chicago", lat: 41.88, lng: -87.63 },
  { name: "Miami", lat: 25.76, lng: -80.19 },
  { name: "Toronto", lat: 43.65, lng: -79.38 },
  { name: "Boston", lat: 42.36, lng: -71.06 },
  { name: "Mexico City", lat: 19.43, lng: -99.13 },
  { name: "São Paulo", lat: -23.55, lng: -46.63 },
  { name: "Buenos Aires", lat: -34.6, lng: -58.38 },
  { name: "Tokyo", lat: 35.68, lng: 139.69 },
  { name: "Sydney", lat: -33.87, lng: 151.21 },
  { name: "Reykjavik", lat: 64.15, lng: -21.94 },
  { name: "Lisbon", lat: 38.72, lng: -9.14 },
  { name: "Paris", lat: 48.86, lng: 2.35 },
  { name: "Amsterdam", lat: 52.37, lng: 4.9 },
  { name: "Frankfurt", lat: 50.11, lng: 8.68 },
  { name: "Madrid", lat: 40.42, lng: -3.7 },
  { name: "Milan", lat: 45.46, lng: 9.19 },
  { name: "Warsaw", lat: 52.23, lng: 21.01 },
  { name: "Stockholm", lat: 59.33, lng: 18.07 },
  { name: "Istanbul", lat: 41.01, lng: 28.98 },
  { name: "Dubai", lat: 25.2, lng: 55.27 },
  { name: "Mumbai", lat: 19.08, lng: 72.88 },
  { name: "Singapore", lat: 1.35, lng: 103.82 },
  { name: "Hong Kong", lat: 22.32, lng: 114.17 },
  { name: "Johannesburg", lat: -26.2, lng: 28.05 },
  { name: "Lagos", lat: 6.52, lng: 3.38 },
];

type LatLng = { lat: number; lng: number };

const toRad = (d: number) => (d * Math.PI) / 180;
function distanceKm(a: LatLng, b: LatLng) {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * 6371 * Math.asin(Math.sqrt(s));
}

// Deterministic pseudo-random so every visitor sees the same lanes
const jitter = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

type Arc = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
  color: string[];
  stroke: number;
  dashLength: number;
  dashGap: number;
  dashTime: number;
};

function buildArcs(hubs: DisplayHub[]): Arc[] {
  if (!hubs.length) return [];

  const lanes: Arc[] = cities.map((c, i) => {
    const h = hubs.reduce((best, cur) =>
      distanceKm(cur, c) < distanceKm(best, c) ? cur : best
    );
    return {
      startLat: h.dLat,
      startLng: h.dLng,
      endLat: c.lat,
      endLng: c.lng,
      color: ["rgba(60,145,252,1)", "rgba(60,145,252,0.65)"],
      stroke: 0.5,
      dashLength: 0.35 + jitter(i, 1) * 0.3,
      dashGap: 0.6 + jitter(i, 2) * 0.6,
      dashTime: 2800 + jitter(i, 3) * 2600,
    };
  });

  // Heavier trunk lanes from the primary hub to each other site
  // (skipping sites that sit on top of one already connected)
  const primary = hubs[0];
  const connected: LatLng[] = [];
  const trunk: Arc[] = [];
  hubs.slice(1).forEach((h, i) => {
    if (connected.some((c) => distanceKm(c, h) < 100)) return;
    connected.push(h);
    trunk.push({
      startLat: primary.dLat,
      startLng: primary.dLng,
      endLat: h.dLat,
      endLng: h.dLng,
      color: ["rgba(60,145,252,1)", "rgba(60,145,252,0.95)"],
      stroke: 0.85,
      dashLength: 0.5,
      dashGap: 0.25,
      dashTime: 2200 + i * 400,
    });
  });

  return [...trunk, ...lanes];
}

type DisplayHub = GlobeHub & {
  dLat: number;
  dLng: number;
  /** Index of the cluster this site belongs to */
  cluster: number;
  /** Position within a stacked cluster, or null for a lone site */
  stackPos: "top" | "middle" | "bottom" | null;
};

// Sites within ~120 km would sit on top of each other, so stack them
// north-to-south (in the order they're listed) around their shared centre.
// `spread` is the total spacing in degrees; the camera still flies to the
// true location.
function spreadHubs(hubs: GlobeHub[], spread: number): DisplayHub[] {
  const clusters: GlobeHub[][] = [];
  hubs.forEach((h) => {
    const c = clusters.find((cl) => cl.some((o) => distanceKm(o, h) < 120));
    if (c) c.push(h);
    else clusters.push([h]);
  });

  const display = new Map<string, Omit<DisplayHub, keyof GlobeHub>>();
  clusters.forEach((members, ci) => {
    const n = members.length;
    const cLat = members.reduce((sum, h) => sum + h.lat, 0) / n;
    const cLng = members.reduce((sum, h) => sum + h.lng, 0) / n;
    members.forEach((h, i) => {
      const offset = n === 1 ? 0 : ((n - 1) / 2 - i) * spread;
      display.set(h.id, {
        dLat: n === 1 ? h.lat : cLat + offset,
        dLng: n === 1 ? h.lng : cLng,
        cluster: ci,
        stackPos:
          n === 1 ? null : i === 0 ? "top" : i === n - 1 ? "bottom" : "middle",
      });
    });
  });

  return hubs.map((h) => ({ ...h, ...display.get(h.id)! }));
}

type Label = { id: string; text: string; lat: number; lng: number };

// Rough width of a label in degrees of longitude. Text height is `size`
// degrees of arc; glyphs average ~0.6 of that, and a degree of arc spans
// more longitude the further from the equator you are.
function labelWidthLng(text: string, size: number, lat: number) {
  const arc = text.length * 0.6 * size;
  return arc / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
}

// One label per site. Lone sites hang their label just below the pin.
// Stacked sites instead put their label to the WEST of the pin, vertically
// centred on it, so the stack reads as a tidy column of callouts and never
// runs into neighbours to the east. Text runs east from its anchor, so for
// lone sites an eastern label that would collide with a western one is
// nudged apart. `s` scales offsets with zoom; `size` is the text height.
function buildLabels(hubs: DisplayHub[], s: number, size: number): Label[] {
  const labels = hubs.map((h) => {
    const stacked = h.stackPos !== null;
    if (stacked) {
      const gap = (1.0 * s) / Math.max(0.2, Math.cos((h.dLat * Math.PI) / 180));
      return {
        id: h.id,
        cluster: h.cluster,
        stacked,
        text: h.label,
        lat: h.dLat - size / 2,
        lng: h.dLng - labelWidthLng(h.label, size, h.dLat) - gap,
      };
    }
    return {
      id: h.id,
      cluster: h.cluster,
      stacked,
      text: h.label,
      lat: h.dLat - 1.2 * s,
      lng: h.dLng - 0.4 * s,
    };
  });
  const sorted = [...labels].sort((a, b) => a.lng - b.lng);
  for (let i = 0; i < sorted.length - 1; i++) {
    const a = sorted[i];
    const b = sorted[i + 1];
    if (a.stacked || b.stacked) continue;
    if (b.lng - a.lng < 8 * s && Math.abs(a.lat - b.lat) < 3 * s) {
      a.lat += 1.6 * s;
      b.lat -= 1.6 * s;
    }
  }
  return labels.map(({ id, text, lat, lng }) => ({ id, text, lat, lng }));
}

type Marker = { kind: "city" | "hub"; id?: string; name: string; lat: number; lng: number };
const asMarker = (d: object) => d as Marker;
const asHub = (d: object) => d as GlobeHub;
const asLabel = (d: object) => d as Label;

function supportsWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

type GlobeComponent = ComponentType<
  GlobeProps & { ref?: React.MutableRefObject<GlobeMethods | undefined> }
>;

const DEFAULT_HOME: GlobeView = { lat: 36, lng: -35, altitude: 2.05 };

export default function LogisticsGlobe({
  hubs,
  selectedId = null,
  onHubSelect,
  homeView = DEFAULT_HOME,
  focusAltitude = 0.7,
  fallback,
  className = "",
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [Globe, setGlobe] = useState<GlobeComponent | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [hoveringHub, setHoveringHub] = useState(false);
  const coarseRef = useRef(false);

  // Latest values for effects that must not re-run on every render
  const homeViewRef = useRef(homeView);
  homeViewRef.current = homeView;
  const onHubSelectRef = useRef(onHubSelect);
  onHubSelectRef.current = onHubSelect;
  const interactive = !!onHubSelect;

  const zoomed = !!selectedId && hubs.some((h) => h.id === selectedId);

  // Tighter spread and smaller text once zoomed in on a site
  const displayHubs = useMemo(() => spreadHubs(hubs, zoomed ? 0.9 : 2.0), [hubs, zoomed]);
  const arcs = useMemo(() => buildArcs(displayHubs), [displayHubs]);
  const labelSize = zoomed ? 0.6 : 1.3;
  const labels = useMemo(
    () => buildLabels(displayHubs, zoomed ? 0.4 : 1, labelSize),
    [displayHubs, zoomed, labelSize]
  );
  const markers = useMemo<Marker[]>(
    () => [
      ...cities.map((c) => ({ kind: "city" as const, name: c.name, lat: c.lat, lng: c.lng })),
      ...displayHubs.map((h) => ({ kind: "hub" as const, id: h.id, name: h.label, lat: h.dLat, lng: h.dLng })),
    ],
    [displayHubs]
  );

  // Load the WebGL library on the client only
  useEffect(() => {
    let cancelled = false;
    if (!supportsWebGL()) {
      setUseFallback(true);
      return;
    }
    import("react-globe.gl")
      .then((mod) => {
        if (!cancelled) setGlobe(() => mod.default as unknown as GlobeComponent);
      })
      .catch(() => {
        if (!cancelled) setUseFallback(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Keep the canvas sized to its container
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;
    const update = () => {
      const rect = el.getBoundingClientRect();
      setSize({ w: Math.round(rect.width), h: Math.round(rect.height) });
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  // Pause rendering while scrolled out of view
  useEffect(() => {
    const el = containerRef.current;
    if (!el || !ready) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        const g = globeRef.current;
        if (!g) return;
        if (entry.isIntersecting) g.resumeAnimation();
        else g.pauseAnimation();
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ready]);

  // Fly to the selected hub, or back home when deselected
  const hadSelectionRef = useRef(false);
  useEffect(() => {
    const g = globeRef.current;
    if (!g || !ready) return;
    const controls = g.controls();
    const hub = hubs.find((h) => h.id === selectedId);
    if (hub) {
      hadSelectionRef.current = true;
      controls.autoRotate = false;
      g.pointOfView(
        { lat: hub.lat - 3.5, lng: hub.lng + 5, altitude: focusAltitude },
        1200
      );
      return;
    }
    if (!hadSelectionRef.current) return; // initial mount: home view already set
    g.pointOfView(homeViewRef.current, 1200);
    const t = setTimeout(() => {
      controls.autoRotate = !coarseRef.current;
    }, 1200);
    return () => clearTimeout(t);
  }, [selectedId, ready, hubs, focusAltitude]);

  const handleGlobeReady = () => {
    const g = globeRef.current;
    if (!g) return;

    g.pointOfView(homeViewRef.current, 0);

    // Tone the lighting up: globe.gl's defaults are a bit flat
    g.lights().forEach((light) => {
      light.intensity *= LIGHT_LEVEL;
    });

    const controls = g.controls();
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.4;
    controls.enableZoom = false; // never hijack page scroll
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.08;
    controls.minPolarAngle = Math.PI * 0.12;
    controls.maxPolarAngle = Math.PI * 0.88;

    // On touch screens let the page scroll; the globe just auto-rotates
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    coarseRef.current = coarse;
    if (coarse) {
      controls.enableRotate = false;
      g.renderer().domElement.style.touchAction = "pan-y";
    }

    setReady(true);
  };

  // Layer accessors (memoised so react-globe.gl doesn't re-digest each render)
  const pointColor = useCallback(
    (d: object) => (asMarker(d).kind === "hub" ? "#3C91FC" : "rgba(60,145,252,0.9)"),
    []
  );
  const pointRadius = useCallback(
    (d: object) => {
      const m = asMarker(d);
      if (m.kind !== "hub") return 0.4;
      if (zoomed) return m.id === selectedId ? 0.7 : 0.45;
      return m.id === selectedId ? 0.95 : 0.6;
    },
    [selectedId, zoomed]
  );
  const pointAltitude = useCallback(
    (d: object) => (asMarker(d).kind === "hub" ? 0.012 : 0.004),
    []
  );
  const pointLabel = useCallback(
    (d: object) => {
      const m = asMarker(d);
      return interactive && m.kind === "hub" ? m.name : "";
    },
    [interactive]
  );
  const ringColor = useCallback(
    (d: object) =>
      asHub(d).id === selectedId
        ? (t: number) => `rgba(255,255,255,${1 - t})`
        : (t: number) => `rgba(235,153,60,${1 - t})`,
    [selectedId]
  );
  const ringMaxRadius = useCallback(
    (d: object) => (asHub(d).id === selectedId ? 6 : 4),
    [selectedId]
  );
  const arcStroke = useCallback(
    (d: object) => (d as Arc).stroke * (zoomed ? 0.45 : 1),
    [zoomed]
  );
  const labelColor = useCallback(() => "#ffffff", []);
  const labelLabel = useCallback(
    (d: object) => (interactive ? asLabel(d).text : ""),
    [interactive]
  );
  const onPointClick = useCallback((d: object) => {
    const m = asMarker(d);
    if (m.kind === "hub" && m.id) onHubSelectRef.current?.(m.id);
  }, []);
  const onLabelClick = useCallback((d: object) => {
    onHubSelectRef.current?.(asLabel(d).id);
  }, []);
  const onPointHover = useCallback(
    (d: object | null) => setHoveringHub(!!d && asMarker(d).kind === "hub"),
    []
  );
  const onLabelHover = useCallback((d: object | null) => setHoveringHub(!!d), []);

  const cursor = hoveringHub && interactive ? "pointer" : "grab";

  return (
    <div
      ref={containerRef}
      className={`logistics-globe select-none active:cursor-grabbing ${className}`}
      style={{ cursor }}
    >
      {/* Placeholder while the WebGL bundle + textures load */}
      {!ready && (
        <div className="absolute inset-0 flex items-center justify-center">
          {useFallback ? (
            fallback ?? null
          ) : (
            <div className="h-[82%] max-h-full aspect-square rounded-full bg-[#1F447B]/10 animate-pulse" />
          )}
        </div>
      )}

      {Globe && size.w > 0 && (
        <div
          className={`absolute inset-0 transition-opacity duration-700 ${
            ready ? "opacity-100" : "opacity-0"
          }`}
        >
          <Globe
            ref={globeRef}
            width={size.w}
            height={size.h}
            backgroundColor="rgba(0,0,0,0)"
            globeImageUrl="/globe/earth-brand.png"
            showAtmosphere
            atmosphereColor="#7FB2F0"
            atmosphereAltitude={0.18}
            onGlobeReady={handleGlobeReady}
            // Shipping lanes
            arcsData={arcs}
            arcColor="color"
            arcStroke={arcStroke}
            arcAltitudeAutoScale={0.4}
            arcDashLength="dashLength"
            arcDashGap="dashGap"
            arcDashAnimateTime="dashTime"
            arcsTransitionDuration={0}
            arcLabel={() => ""}
            // Pulsing rings on our facilities
            ringsData={displayHubs}
            ringLat="dLat"
            ringLng="dLng"
            ringColor={ringColor}
            ringMaxRadius={ringMaxRadius}
            ringPropagationSpeed={1.6}
            ringRepeatPeriod={1100}
            // Destination dots + clickable hub pins
            pointsData={markers}
            pointColor={pointColor}
            pointAltitude={pointAltitude}
            pointRadius={pointRadius}
            pointLabel={pointLabel}
            pointsTransitionDuration={300}
            onPointClick={interactive ? onPointClick : undefined}
            onPointHover={interactive ? onPointHover : undefined}
            // Facility labels
            labelsData={labels}
            labelText="text"
            labelColor={labelColor}
            labelSize={labelSize}
            labelAltitude={0.02}
            labelIncludeDot={false}
            labelResolution={2}
            labelsTransitionDuration={0}
            labelLabel={labelLabel}
            onLabelClick={interactive ? onLabelClick : undefined}
            onLabelHover={interactive ? onLabelHover : undefined}
          />
        </div>
      )}
    </div>
  );
}
