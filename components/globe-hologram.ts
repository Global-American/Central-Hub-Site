import * as THREE from "three";

// Loaded lazily alongside react-globe.gl so three.js stays out of the page bundle

export type Hologram = ReturnType<typeof createHologram>;

/**
 * A see-through hologram look for a globe.gl globe. Pass `material` as the
 * globe's `globeMaterial` and draw it with /globe/earth-hologram.png (baked
 * from earth-brand.png: brand-orange land, bright coastlines, near-clear
 * oceans and a cyan 15° grid), then call `attach` once the globe is ready.
 */
export function createHologram() {
  // Self-lit in the texture's own colours (orange land, cyan grid), so the
  // night side still glows, and see-through where the texture is
  const material = new THREE.MeshPhongMaterial({
    transparent: true,
    emissive: "#ffffff",
    emissiveIntensity: 0.45,
    specular: "#E6FBFF",
    shininess: 40,
  });

  // The far side, seen faintly through the oceans: the inside of the same
  // sphere, drawn first
  const backMaterial = new THREE.MeshBasicMaterial({
    transparent: true,
    opacity: 0.3,
    side: THREE.BackSide,
    depthWrite: false,
  });
  let back: THREE.Mesh | null = null;

  return {
    material,

    /** Adds the glow and the far side; call once the globe's texture has loaded */
    attach(scene: THREE.Scene) {
      let sphere: THREE.Mesh | undefined;
      scene.traverse((obj) => {
        if ((obj as THREE.Mesh).material === material) sphere = obj as THREE.Mesh;
      });
      if (!sphere || back) return;
      material.emissiveMap = material.map;
      material.needsUpdate = true;
      backMaterial.map = material.map;
      back = new THREE.Mesh(sphere.geometry, backMaterial);
      back.renderOrder = -1;
      sphere.add(back);
    },

    dispose() {
      back?.removeFromParent();
      back = null;
      material.dispose();
      backMaterial.dispose();
    },
  };
}
