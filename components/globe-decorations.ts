import * as THREE from "three";
import { LineSegments2 } from "three/examples/jsm/lines/LineSegments2.js";
import { LineSegmentsGeometry } from "three/examples/jsm/lines/LineSegmentsGeometry.js";
import { LineMaterial } from "three/examples/jsm/lines/LineMaterial.js";
import borders from "@/lib/country-borders.json";

// Loaded lazily alongside react-globe.gl so three.js stays out of the page bundle

// three-globe's globe radius, in scene units
const R = 100;

// Brand palette
const NAVY = "#1F447B";
const ORANGE = "#EB993C";
const SKY = "#3C91FC";

/** Unit vector for a lat/lng, using the same mapping as three-globe */
function toUnit(lat: number, lng: number) {
  const phi = ((90 - lat) * Math.PI) / 180;
  const theta = ((90 - lng) * Math.PI) / 180;
  return new THREE.Vector3(
    Math.sin(phi) * Math.cos(theta),
    Math.cos(phi),
    Math.sin(phi) * Math.sin(theta)
  );
}

/** Point along the great circle between two unit vectors */
function slerp(a: THREE.Vector3, b: THREE.Vector3, t: number) {
  const angle = a.angleTo(b);
  if (angle < 1e-6) return a.clone();
  return a
    .clone()
    .multiplyScalar(Math.sin((1 - t) * angle))
    .addScaledVector(b, Math.sin(t * angle))
    .divideScalar(Math.sin(angle));
}

// ---------------------------------------------------------------------------
// Map pins

function drawPin(color: string) {
  const r = 44;
  const pad = 6;
  const w = 2 * (r + pad);
  const cx = w / 2;
  const cy = r + pad;
  const tipY = cy + r * 1.6;
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = Math.ceil(tipY + pad);
  const ctx = canvas.getContext("2d")!;

  ctx.beginPath();
  ctx.moveTo(cx, tipY);
  ctx.bezierCurveTo(cx - r * 0.3, tipY - r * 0.7, cx - r, cy + r * 0.7, cx - r, cy);
  ctx.arc(cx, cy, r, Math.PI, 0);
  ctx.bezierCurveTo(cx + r, cy + r * 0.7, cx + r * 0.3, tipY - r * 0.7, cx, tipY);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
  ctx.lineJoin = "round";
  ctx.lineWidth = 5;
  ctx.strokeStyle = "#ffffff";
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, r * 0.38, 0, Math.PI * 2);
  ctx.fillStyle = "#ffffff";
  ctx.fill();

  return { canvas, tipV: (canvas.height - tipY) / canvas.height };
}

const pinDir = new THREE.Vector3();
const camPos = new THREE.Vector3();

/**
 * Camera-facing map-marker sprites whose tip sits on the given point. They're
 * drawn last with no depth test, so clouds, planes, lanes and labels never
 * cover them, and fade out on their own as they turn behind the globe.
 */
export function createPinFactory(color: string) {
  const { canvas, tipV } = drawPin(color);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  const material = new THREE.SpriteMaterial({ map: texture, depthTest: false, depthWrite: false });
  const aspect = canvas.width / canvas.height;

  return {
    /** `height` is in scene units (the globe's radius is 100) */
    make(height: number) {
      // Own material so each pin can fade independently
      const pinMaterial = material.clone();
      const pin = new THREE.Sprite(pinMaterial);
      pin.center.set(0.5, tipV);
      pin.scale.set(height * aspect, height, 1);
      pin.renderOrder = 999;
      pin.onBeforeRender = (_renderer, _scene, camera) => {
        // A point on the globe is in view when it's on the camera's side of the horizon
        pin.getWorldPosition(pinDir).normalize();
        camera.getWorldPosition(camPos);
        const facing = pinDir.dot(camPos) / camPos.length() - R / camPos.length();
        pinMaterial.opacity = THREE.MathUtils.smoothstep(facing, -0.04, 0.02);
      };
      return pin;
    },
    dispose() {
      texture.dispose();
      material.dispose();
    },
  };
}

export type PinFactory = ReturnType<typeof createPinFactory>;

// ---------------------------------------------------------------------------
// Country borders, clouds, planes and boats

// Land borders from Natural Earth's 110m countries (public domain), keeping only
// edges two countries share so coastlines aren't drawn twice over the texture.
// Each entry is one border line as flat [lng, lat, lng, lat, ...] pairs.
const BORDER_ALTITUDE = 0.001;

function borderPositions() {
  const positions: number[] = [];
  const r = R * (1 + BORDER_ALTITUDE);
  const push = (v: THREE.Vector3) => positions.push(v.x * r, v.y * r, v.z * r);
  const oneDegree = Math.PI / 180;
  for (const line of borders) {
    for (let i = 0; i + 3 < line.length; i += 2) {
      const a = toUnit(line[i + 1], line[i]);
      const b = toUnit(line[i + 3], line[i + 2]);
      // Split long edges so they hug the globe instead of cutting into it
      const steps = Math.max(1, Math.ceil(a.angleTo(b) / oneDegree));
      for (let s = 0; s < steps; s++) {
        push(slerp(a, b, s / steps));
        push(slerp(a, b, (s + 1) / steps));
      }
    }
  }
  return positions;
}

export type FlightLane = {
  startLat: number;
  startLng: number;
  endLat: number;
  endLng: number;
};

// Sea routes as [lat, lng] waypoints, kept clear of land
const SEA_ROUTES: [number, number][][] = [
  // New York – English Channel
  [[40.45, -73.7], [40.2, -69], [41.5, -55], [45, -40], [48.5, -25], [49.6, -12], [49.7, -5.5], [50.2, -1]],
  // Xiamen – Los Angeles, out through the Luzon Strait
  [[24.3, 118.3], [23.0, 119.6], [21.4, 121.2], [24, 130], [30, 150], [35, 170], [37, -170], [36, -150], [34.6, -130], [33.6, -118.6]],
  // Singapore – Dubai, via the Malacca Strait and Hormuz
  [[1.25, 103.9], [2.5, 101.2], [4.0, 99.8], [6.0, 96.5], [5.8, 90], [5.6, 82], [7.5, 75], [14, 63], [22.6, 60.6], [25.0, 57.5], [26.6, 56.45], [25.35, 55.0]],
  // Santos – Lisbon, west of the Canaries
  [[-24.1, -46.2], [-23.5, -42], [-18, -37.5], [-8, -32], [3, -27], [14.5, -19.5], [24, -20], [30, -19], [36.5, -10.5], [38.55, -9.5]],
];

// Bands chosen to drift clear of our facilities' latitudes
const CLOUDS = [
  { lat: -48, lng: -150, size: 2.4, alt: 0.07, drift: 1.1 },
  { lat: -35, lng: -20, size: 2.1, alt: 0.06, drift: 0.9 },
  { lat: -15, lng: 60, size: 2.6, alt: 0.08, drift: 1.2 },
  { lat: -5, lng: -120, size: 2.0, alt: 0.06, drift: 1.0 },
  { lat: 8, lng: -40, size: 2.3, alt: 0.07, drift: 1.3 },
  { lat: 12, lng: 150, size: 2.1, alt: 0.06, drift: 0.8 },
  { lat: 32, lng: -150, size: 2.4, alt: 0.08, drift: 1.0 },
  { lat: 33, lng: 70, size: 2.0, alt: 0.06, drift: 1.2 },
  { lat: 47, lng: -40, size: 2.1, alt: 0.07, drift: 0.9 },
  { lat: 64, lng: 20, size: 2.2, alt: 0.06, drift: 1.1 },
  { lat: 66, lng: -100, size: 2.4, alt: 0.08, drift: 0.8 },
  { lat: -58, lng: 100, size: 2.6, alt: 0.07, drift: 1.2 },
];

// Puffs as [x, y, z, radius]; clouds drift along +z
const PUFFS: [number, number, number, number][][] = [
  [[0, 0, 0, 1.6], [0, -0.2, 1.6, 1.2], [0, -0.3, -1.6, 1.15], [-0.6, 0.5, 0.6, 1.1], [0.7, 0.35, -0.5, 1.0], [0, -0.5, 2.7, 0.8], [0.2, -0.5, -2.6, 0.75]],
  [[0, 0, 0, 1.4], [0.3, -0.25, 1.4, 1.1], [-0.2, -0.2, -1.3, 1.2], [0.5, 0.45, 0.2, 1.0], [0, -0.45, -2.4, 0.8]],
];

const PLANE_SPEED = 22; // scene units per second
const PLANE_SCALE = 1.6;
const BOAT_SPEED = 3;
const BOAT_SCALE = 1.5;
const BOAT_ALTITUDE = 0.002;

// Deterministic pseudo-random so every visitor sees the same traffic
const jitter = (i: number, salt: number) => {
  const x = Math.sin(i * 12.9898 + salt * 78.233) * 43758.5453;
  return x - Math.floor(x);
};

/** Something shuttling back and forth along a route */
type Traveller = {
  obj: THREE.Object3D;
  pointAt: (u: number) => THREE.Vector3;
  length: number; // scene units
  speed: number; // scene units per second
  scale: number;
  fade: number; // distance from either end over which it grows/shrinks
  u: number; // 0..1 along the route
  dir: 1 | -1;
  wait: number; // seconds spent "in port" before heading back
  rest: number;
};

export type GlobeDecorations = ReturnType<typeof createGlobeDecorations>;

/**
 * Adds country borders, drifting clouds, planes flying the shipping lanes and
 * boats on sea routes to a globe.gl scene. `arcAltitudeAutoScale` must match
 * the globe's so planes ride exactly on the drawn lanes.
 */
export function createGlobeDecorations(
  scene: THREE.Scene,
  { arcAltitudeAutoScale }: { arcAltitudeAutoScale: number }
) {
  const root = new THREE.Group();
  scene.add(root);

  const disposables: { dispose(): void }[] = [];
  const track = <T extends { dispose(): void }>(x: T) => {
    disposables.push(x);
    return x;
  };
  const lambert = (color: THREE.ColorRepresentation, flatShading = false) =>
    track(new THREE.MeshLambertMaterial({ color, flatShading }));

  const white = lambert("#ffffff");
  const wingGrey = lambert("#D6E2F0");
  const orange = lambert(ORANGE);
  const sky = lambert(SKY);
  const cloudWhite = lambert("#F4F8FD", true);
  const wake = track(
    new THREE.MeshBasicMaterial({ color: "#ffffff", transparent: true, opacity: 0.35, depthWrite: false })
  );

  // Line width is in CSS pixels, so borders stay crisp at any zoom
  const borderLines = new LineSegments2(
    track(new LineSegmentsGeometry().setPositions(borderPositions())),
    track(new LineMaterial({ color: NAVY, linewidth: 1.2, transparent: true, opacity: 0.75 }))
  );
  root.add(borderLines);

  // Models face +z with +y pointing away from the globe
  const planeModel = new THREE.Group();
  {
    const body = new THREE.Mesh(track(new THREE.CapsuleGeometry(0.42, 4.6, 4, 8)), white);
    body.rotation.x = Math.PI / 2;
    const wing = new THREE.Mesh(track(new THREE.BoxGeometry(6, 0.14, 1.3)), wingGrey);
    wing.position.set(0, 0, 0.3);
    const tailplane = new THREE.Mesh(track(new THREE.BoxGeometry(2.2, 0.12, 0.7)), wingGrey);
    tailplane.position.set(0, 0.1, -2.3);
    const fin = new THREE.Mesh(track(new THREE.BoxGeometry(0.14, 1.3, 0.9)), orange);
    fin.position.set(0, 0.65, -2.35);
    planeModel.add(body, wing, tailplane, fin);
  }

  const boatModel = new THREE.Group();
  {
    const outline = new THREE.Shape();
    outline.moveTo(-0.8, -3);
    outline.lineTo(0.8, -3);
    outline.lineTo(0.8, 1.6);
    outline.lineTo(0, 3);
    outline.lineTo(-0.8, 1.6);
    outline.closePath();
    const hullGeo = track(new THREE.ExtrudeGeometry(outline, { depth: 0.55, bevelEnabled: false }));
    hullGeo.rotateX(Math.PI / 2);
    hullGeo.translate(0, 0.55, 0);
    const hull = new THREE.Mesh(hullGeo, white);

    const containerGeo = track(new THREE.BoxGeometry(1.3, 0.5, 0.95));
    const containers = [orange, sky, orange].map((m, i) => {
      const c = new THREE.Mesh(containerGeo, m);
      c.position.set(0, 0.8, 1.25 - i);
      return c;
    });
    const bridge = new THREE.Mesh(track(new THREE.BoxGeometry(1.4, 0.9, 0.8)), white);
    bridge.position.set(0, 1.0, -2.2);

    const wakeShape = new THREE.Shape();
    wakeShape.moveTo(-0.7, -3);
    wakeShape.lineTo(0.7, -3);
    wakeShape.lineTo(1.6, -7.5);
    wakeShape.lineTo(-1.6, -7.5);
    wakeShape.closePath();
    const wakeGeo = track(new THREE.ShapeGeometry(wakeShape));
    wakeGeo.rotateX(Math.PI / 2);
    wakeGeo.translate(0, 0.05, 0);

    boatModel.add(hull, ...containers, bridge, new THREE.Mesh(wakeGeo, wake));
  }

  const puffGeo = track(new THREE.SphereGeometry(1, 10, 7));
  const clouds = CLOUDS.map((c, i) => {
    const cloud = new THREE.Group();
    PUFFS[i % PUFFS.length].forEach(([x, y, z, r]) => {
      const puff = new THREE.Mesh(puffGeo, cloudWhite);
      puff.position.set(x, y, z);
      puff.scale.setScalar(r);
      cloud.add(puff);
    });
    root.add(cloud);
    return { ...c, obj: cloud };
  });

  const boats: Traveller[] = SEA_ROUTES.flatMap((route, i) => {
    const curve = new THREE.CatmullRomCurve3(
      route.map(([lat, lng]) => toUnit(lat, lng)),
      false,
      "centripetal"
    );
    const pointAt = (u: number) =>
      curve.getPointAt(u).normalize().multiplyScalar(R * (1 + BOAT_ALTITUDE));
    const length = curve.getLength() * R;
    // Two ships per route, heading opposite ways
    return [0, 1].map((k) => {
      const obj = boatModel.clone();
      root.add(obj);
      return {
        obj,
        pointAt,
        length,
        speed: BOAT_SPEED * (0.85 + jitter(i * 2 + k, 1) * 0.3),
        scale: BOAT_SCALE,
        fade: 4,
        u: k ? 0.7 - jitter(i, 2) * 0.2 : 0.15 + jitter(i, 3) * 0.2,
        dir: k ? -1 : 1,
        wait: 2,
        rest: 0,
      } satisfies Traveller;
    });
  });

  let planes: Traveller[] = [];
  let sizeFactor = 1;
  let paused = false;
  const motion = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0 : 1;

  const ahead = new THREE.Vector3();
  function place(t: Traveller) {
    if (t.rest > 0) {
      t.obj.visible = false;
      return;
    }
    const p = t.pointAt(t.u);
    // Heading from points just behind and ahead, so it never degenerates at the ends
    const d = 1 / t.length;
    const back = t.pointAt(Math.max(0, Math.min(1, t.u - t.dir * d)));
    ahead.copy(t.pointAt(Math.max(0, Math.min(1, t.u + t.dir * d)))).sub(back).add(p);
    t.obj.position.copy(p);
    t.obj.up.copy(p).normalize();
    t.obj.lookAt(ahead);
    const edge = Math.min(t.u, 1 - t.u) * t.length;
    const grow = THREE.MathUtils.smoothstep(edge, 0, t.fade);
    t.obj.visible = grow > 0.01;
    t.obj.scale.setScalar(t.scale * sizeFactor * Math.max(grow, 0.01));
  }

  function advance(t: Traveller, dt: number) {
    if (t.rest > 0) {
      t.rest -= dt;
      if (t.rest > 0) return;
    }
    t.u += (t.dir * t.speed * dt) / t.length;
    if (t.u >= 1 || t.u <= 0) {
      t.u = Math.max(0, Math.min(1, t.u));
      t.dir = t.dir === 1 ? -1 : 1;
      t.rest = t.wait;
    }
  }

  const eastward = new THREE.Vector3();
  function placeCloud(c: (typeof clouds)[number]) {
    const r = R * (1 + c.alt);
    c.obj.position.copy(toUnit(c.lat, c.lng)).multiplyScalar(r);
    c.obj.up.copy(c.obj.position).normalize();
    c.obj.lookAt(eastward.copy(toUnit(c.lat, c.lng + 1)).multiplyScalar(r));
    const s = c.size * sizeFactor;
    c.obj.scale.set(s, s * 0.6, s);
  }

  function placeAll() {
    clouds.forEach(placeCloud);
    boats.forEach(place);
    planes.forEach(place);
  }

  let last = performance.now();
  let frame = requestAnimationFrame(function tick(now) {
    frame = requestAnimationFrame(tick);
    const dt = Math.min(0.1, (now - last) / 1000) * motion;
    last = now;
    if (paused || !dt) return;
    clouds.forEach((c) => {
      c.lng = ((c.lng + c.drift * dt + 180) % 360) - 180;
    });
    boats.forEach((t) => advance(t, dt));
    planes.forEach((t) => advance(t, dt));
    placeAll();
  });

  placeAll();

  return {
    /** Planes fly back and forth along these lanes */
    setFlights(lanes: FlightLane[]) {
      planes.forEach((t) => root.remove(t.obj));
      planes = lanes.map((lane, i) => {
        const a = toUnit(lane.startLat, lane.startLng);
        const b = toUnit(lane.endLat, lane.endLng);
        // Same curve three-globe draws for an arc with auto-scaled altitude
        const ctrlR = R * (1 + (a.angleTo(b) / 2) * arcAltitudeAutoScale * 1.5);
        const curve = new THREE.CubicBezierCurve3(
          a.clone().multiplyScalar(R),
          slerp(a, b, 0.25).multiplyScalar(ctrlR),
          slerp(a, b, 0.75).multiplyScalar(ctrlR),
          b.clone().multiplyScalar(R)
        );
        const obj = planeModel.clone();
        root.add(obj);
        const t: Traveller = {
          obj,
          pointAt: (u) => curve.getPointAt(u),
          length: curve.getLength(),
          speed: PLANE_SPEED,
          scale: PLANE_SCALE,
          fade: 14, // stay small until clear of the pin
          u: jitter(i, 4),
          dir: jitter(i, 5) > 0.5 ? 1 : -1,
          wait: 1.5 + jitter(i, 6) * 2,
          rest: 0,
        };
        place(t);
        return t;
      });
    },
    /** Scale models down when the camera is zoomed in */
    setScale(factor: number) {
      sizeFactor = factor;
      placeAll();
    },
    setPaused(value: boolean) {
      paused = value;
    },
    dispose() {
      cancelAnimationFrame(frame);
      scene.remove(root);
      disposables.forEach((x) => x.dispose());
    },
  };
}
