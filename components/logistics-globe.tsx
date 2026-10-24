"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ComponentType, ReactNode } from "react";
import { Minus, Plus } from "lucide-react";
import type { GlobeMethods, GlobeProps } from "react-globe.gl";
import type { GlobeDecorations, PinFactory } from "@/components/globe-decorations";

type DecorationsModule = typeof import("@/components/globe-decorations");

// Brand palette
const ORANGE = "#EB993C";
const MARKER_RED = "#E53935";

// 1 = globe.gl's default lighting; higher is brighter
const LIGHT_LEVEL = 1.4;

// Lane height relative to its length; planes need the same value to ride the lanes
const ARC_ALTITUDE_SCALE = 0.4;

// Facility pin heights in scene units (the globe's radius is 100)
const PIN_HEIGHT = 7;
const PIN_HEIGHT_ZOOMED = 2.4;
const PIN_HEIGHT_SELECTED = 2.9;
// Camera altitude limits (globe radii) for the zoom buttons
const MIN_ALTITUDE = 0.25;
const MAX_ALTITUDE = 3.5;
const ZOOM_STEP = 1.5;

// Height of a pin's head above its tip, as a fraction of the pin
const PIN_HEAD = 0.55;
const UNITS_PER_DEG = (100 * Math.PI) / 180;

const NO_CITIES: typeof cities = [];

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
  /** Leave out the clouds and the dots on destination cities */
  simplified?: boolean;
  /** Show zoom in/out buttons in the top-right corner */
  zoomControls?: boolean;
};

// Markets we ship to; each is drawn as a lane from its nearest hub, or from
// the hub named in `from`
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
  { name: "Honolulu", lat: 21.31, lng: -157.86, from: "quanzhou" },
];

// Lanes (besides the trunk lanes) that get a plane flying along them
const FLIGHT_CITIES = new Set(["Los Angeles", "São Paulo", "Dubai", "Tokyo", "Sydney", "Honolulu"]);

// Extra air lanes across the Pacific, through Honolulu, each with a plane.
// Ends are facility ids or city names.
const PACIFIC_LANES: [string, string][] = [
  ["quanzhou", "Los Angeles"],
  ["Los Angeles", "Honolulu"],
  ["Honolulu", "Tokyo"],
  ["Honolulu", "Sydney"],
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
  flight: boolean;
};

function buildArcs(hubs: DisplayHub[]): Arc[] {
  if (!hubs.length) return [];

  const lanes: Arc[] = cities.map((c, i) => {
    const h =
      hubs.find((x) => x.id === c.from) ??
      hubs.reduce((best, cur) => (distanceKm(cur, c) < distanceKm(best, c) ? cur : best));
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
      flight: FLIGHT_CITIES.has(c.name),
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
      flight: true,
    });
  });

  const endpoint = (key: string): LatLng | undefined => {
    const h = hubs.find((x) => x.id === key);
    return h ? { lat: h.dLat, lng: h.dLng } : cities.find((c) => c.name === key);
  };
  const pacific: Arc[] = PACIFIC_LANES.flatMap(([from, to], i) => {
    const a = endpoint(from);
    const b = endpoint(to);
    if (!a || !b) return [];
    return [
      {
        startLat: a.lat,
        startLng: a.lng,
        endLat: b.lat,
        endLng: b.lng,
        color: ["rgba(60,145,252,1)", "rgba(60,145,252,0.65)"],
        stroke: 0.5,
        dashLength: 0.35 + jitter(i, 11) * 0.3,
        dashGap: 0.6 + jitter(i, 12) * 0.6,
        dashTime: 2800 + jitter(i, 13) * 2600,
        flight: true,
      },
    ];
  });

  return [...trunk, ...lanes, ...pacific];
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

// One label per site. Lone sites hang their label just below the pin's tip.
// Stacked sites instead put their label to the WEST of the pin, level with
// its head (`pinLift` degrees above the tip), so the stack reads as a tidy
// column of callouts and never runs into neighbours to the east. Text runs
// east from its anchor, so for lone sites an eastern label that would collide
// with a western one is nudged apart. `s` scales offsets with zoom; `size` is
// the text height.
function buildLabels(hubs: DisplayHub[], s: number, size: number, pinLift: number): Label[] {
  const labels = hubs.map((h) => {
    const stacked = h.stackPos !== null;
    if (stacked) {
      const gap = (1.0 * s) / Math.max(0.2, Math.cos((h.dLat * Math.PI) / 180));
      return {
        id: h.id,
        cluster: h.cluster,
        stacked,
        text: h.label,
        lat: h.dLat + pinLift - size / 2,
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
  // Draw each label a few times, nudged slightly, to thicken the strokes
  // beyond what the bold font alone gives
  const nudge = 0.03 * size;
  const offsets = [[0, 0], [nudge, nudge], [nudge, -nudge], [-nudge, nudge], [-nudge, -nudge]];
  return labels.flatMap(({ id, text, lat, lng }) => {
    const lngScale = 1 / Math.max(0.2, Math.cos((lat * Math.PI) / 180));
    return offsets.map(([dLat, dLng]) => ({ id, text, lat: lat + dLat, lng: lng + dLng * lngScale }));
  });
}

const asHub = (d: object) => d as DisplayHub;
const asLabel = (d: object) => d as Label;
const cityColor = () => "rgba(229,57,53,0.9)";
const noLabel = () => "";

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
  simplified = false,
  zoomControls = false,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const globeRef = useRef<GlobeMethods | undefined>(undefined);
  const [Globe, setGlobe] = useState<GlobeComponent | null>(null);
  const [decorationsMod, setDecorationsMod] = useState<DecorationsModule | null>(null);
  const decorationsRef = useRef<GlobeDecorations | null>(null);
  const [size, setSize] = useState({ w: 0, h: 0 });
  const [ready, setReady] = useState(false);
  const [useFallback, setUseFallback] = useState(false);
  const [hoveringHub, setHoveringHub] = useState(false);
  const [labelFont, setLabelFont] = useState<object | null>(null);
  const coarseRef = useRef(false);

  // Latest values for effects that must not re-run on every render
  const homeViewRef = useRef(homeView);
  homeViewRef.current = homeView;
  const onHubSelectRef = useRef(onHubSelect);
  onHubSelectRef.current = onHubSelect;
  const interactive = !!onHubSelect;

  const zoomed = !!selectedId && hubs.some((h) => h.id === selectedId);

  // Tighter spread and smaller text once zoomed in on a site; the spread
  // leaves room for the pins to stack without overlapping
  const displayHubs = useMemo(() => spreadHubs(hubs, zoomed ? 1.5 : 3.6), [hubs, zoomed]);
  const arcs = useMemo(() => buildArcs(displayHubs), [displayHubs]);
  const labelSize = zoomed ? 0.6 : 1.3;
  const pinLift = ((zoomed ? PIN_HEIGHT_ZOOMED : PIN_HEIGHT) * PIN_HEAD) / UNITS_PER_DEG;
  const labels = useMemo(
    () => buildLabels(displayHubs, zoomed ? 0.4 : 1, labelSize, pinLift),
    [displayHubs, zoomed, labelSize, pinLift]
  );
  const pins = useMemo<PinFactory | null>(
    () => decorationsMod?.createPinFactory(MARKER_RED) ?? null,
    [decorationsMod]
  );
  useEffect(() => () => pins?.dispose(), [pins]);

  // Load the WebGL library (and the three.js extras built on it) on the client only
  useEffect(() => {
    let cancelled = false;
    if (!supportsWebGL()) {
      setUseFallback(true);
      return;
    }
    Promise.all([import("react-globe.gl"), import("@/components/globe-decorations")])
      .then(([mod, decorations]) => {
        if (cancelled) return;
        setDecorationsMod(decorations);
        setGlobe(() => mod.default as unknown as GlobeComponent);
      })
      .catch(() => {
        if (!cancelled) setUseFallback(true);
      });
    // Bold label font; the library's built-in regular one is used until it loads
    fetch("/fonts/helvetiker_bold.typeface.json")
      .then((res) => res.json())
      .then((font) => {
        if (!cancelled) setLabelFont(font);
      })
      .catch(() => {});
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
        decorationsRef.current?.setPaused(!entry.isIntersecting);
      },
      { threshold: 0.05 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ready]);

  // Clouds, planes and boats
  useEffect(() => {
    const g = globeRef.current;
    if (!g || !ready || !decorationsMod) return;
    const decorations = decorationsMod.createGlobeDecorations(g.scene(), {
      arcAltitudeAutoScale: ARC_ALTITUDE_SCALE,
      showClouds: !simplified,
    });
    decorationsRef.current = decorations;
    return () => {
      decorations.dispose();
      decorationsRef.current = null;
    };
  }, [ready, decorationsMod, simplified]);

  useEffect(() => {
    decorationsRef.current?.setFlights(arcs.filter((a) => a.flight));
    decorationsRef.current?.setParcels(arcs.filter((a) => !a.flight));
  }, [arcs, ready, decorationsMod]);

  useEffect(() => {
    decorationsRef.current?.setScale(zoomed ? 0.4 : 1);
  }, [zoomed, ready, decorationsMod]);

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
  const pinObject = useCallback(
    (d: object) => {
      const id = asHub(d).id;
      const height = !zoomed
        ? PIN_HEIGHT
        : id === selectedId
          ? PIN_HEIGHT_SELECTED
          : PIN_HEIGHT_ZOOMED;
      return pins!.make(height);
    },
    [pins, selectedId, zoomed]
  );
  const pinLabel = useCallback(
    (d: object) => (interactive ? asHub(d).label : ""),
    [interactive]
  );
  const ringColor = useCallback(
    (d: object) =>
      asHub(d).id === selectedId
        ? (t: number) => `rgba(255,255,255,${1 - t})`
        : (t: number) => `rgba(229,57,53,${1 - t})`,
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
  const onPinClick = useCallback((d: object) => {
    onHubSelectRef.current?.(asHub(d).id);
  }, []);
  const onLabelClick = useCallback((d: object) => {
    onHubSelectRef.current?.(asLabel(d).id);
  }, []);
  const onHubHover = useCallback((d: object | null) => setHoveringHub(!!d), []);

  const cursor = hoveringHub && interactive ? "pointer" : "grab";

  // Wheel zoom stays off so the page scrolls; these buttons zoom instead
  const zoomBy = (factor: number) => {
    const g = globeRef.current;
    if (!g) return;
    g.controls().autoRotate = false;
    const view = g.pointOfView();
    const altitude = Math.min(MAX_ALTITUDE, Math.max(MIN_ALTITUDE, view.altitude * factor));
    g.pointOfView({ ...view, altitude }, 400);
  };

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

      {Globe && pins && size.w > 0 && (
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
            arcAltitudeAutoScale={ARC_ALTITUDE_SCALE}
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
            // Destination dots
            pointsData={simplified ? NO_CITIES : cities}
            pointColor={cityColor}
            pointAltitude={0.004}
            pointRadius={0.4}
            pointLabel={noLabel}
            pointsTransitionDuration={0}
            // Clickable facility pins
            objectsData={displayHubs}
            objectLat="dLat"
            objectLng="dLng"
            objectAltitude={0.004}
            objectThreeObject={pinObject}
            objectLabel={pinLabel}
            onObjectClick={interactive ? onPinClick : undefined}
            onObjectHover={interactive ? onHubHover : undefined}
            // Facility labels
            labelsData={labels}
            labelText="text"
            {...(labelFont ? { labelTypeFace: labelFont } : {})}
            labelColor={labelColor}
            labelSize={labelSize}
            labelAltitude={0.02}
            labelIncludeDot={false}
            labelResolution={2}
            labelsTransitionDuration={0}
            labelLabel={labelLabel}
            onLabelClick={interactive ? onLabelClick : undefined}
            onLabelHover={interactive ? onHubHover : undefined}
          />
        </div>
      )}

      {zoomControls && ready && (
        <div className="absolute right-4 top-4 z-10 flex flex-col overflow-hidden rounded-lg border-2 border-[#1F447B] bg-white/90 shadow-sm backdrop-blur">
          <button
            type="button"
            onClick={() => zoomBy(1 / ZOOM_STEP)}
            aria-label="Zoom in"
            className="flex h-9 w-9 items-center justify-center text-[#1F447B] transition-colors hover:bg-[#EB993C] hover:text-white"
          >
            <Plus className="h-4 w-4" />
          </button>
          <div className="h-px bg-[#1F447B]/30" />
          <button
            type="button"
            onClick={() => zoomBy(ZOOM_STEP)}
            aria-label="Zoom out"
            className="flex h-9 w-9 items-center justify-center text-[#1F447B] transition-colors hover:bg-[#EB993C] hover:text-white"
          >
            <Minus className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}
