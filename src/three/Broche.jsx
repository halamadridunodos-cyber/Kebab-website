import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { BROCHE } from '../img';

/**
 * Broche de kebab procédurale (döner vertical).
 * - Profil « teardrop » via LatheGeometry, déformé pour imiter l'empilage main.
 * - Texture de surface rôtie (broche.jpg) en map + relief léger.
 * - Broche métallique + coiffe, tourne lentement autour de Y.
 */
export default function Broche({ quality = 'high' }) {
  const group = useRef();
  const meatTex = useTexture(BROCHE);

  const geometry = useMemo(() => {
    // Profil radial (x = rayon, y = hauteur) — plus large au tiers supérieur.
    const pts = [];
    const H = 3.4;
    const bottom = -H / 2;
    const steps = 42;
    const profile = (u) => {
      // u de 0 (bas) à 1 (haut)
      const bulge = Math.sin(Math.pow(u, 0.85) * Math.PI); // ventru au milieu
      const taperTop = 1 - Math.pow(Math.max(0, u - 0.7) / 0.3, 1.6) * 0.55;
      const base = 0.16 + bulge * 0.5;
      return Math.max(0.08, base * taperTop);
    };
    for (let i = 0; i <= steps; i++) {
      const u = i / steps;
      pts.push(new THREE.Vector2(profile(u), bottom + u * H));
    }
    const radial = quality === 'low' ? 48 : 96;
    const geo = new THREE.LatheGeometry(pts, radial);

    // Déformation : strates horizontales + bruit -> empilage irrégulier « fait main ».
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const ang = Math.atan2(v.z, v.x);
      const r = Math.hypot(v.x, v.z);
      const layers = Math.sin(v.y * 9.0) * 0.018 + Math.sin(v.y * 23.0 + ang * 2.0) * 0.01;
      const rough = Math.sin(ang * 8.0 + v.y * 4.0) * 0.014 + Math.sin(ang * 17.0) * 0.008;
      const nr = r + layers + rough;
      if (r > 0.001) {
        v.x = (v.x / r) * nr;
        v.z = (v.z / r) * nr;
      }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, [quality]);

  const meatMaterial = useMemo(() => {
    meatTex.wrapS = meatTex.wrapT = THREE.RepeatWrapping;
    meatTex.repeat.set(3, 2);
    meatTex.colorSpace = THREE.SRGBColorSpace;
    meatTex.anisotropy = 8;
    return new THREE.MeshStandardMaterial({
      map: meatTex,
      bumpMap: meatTex,
      bumpScale: 0.035,
      roughness: 0.78,
      metalness: 0.05,
      emissive: new THREE.Color('#4a1200'),
      emissiveMap: meatTex,
      emissiveIntensity: 0.18,
    });
  }, [meatTex]);

  const rodMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#c8ccd2', roughness: 0.28, metalness: 0.95 }),
    [],
  );

  useFrame((state, delta) => {
    if (group.current) group.current.rotation.y += delta * 0.35; // rotation lente
  });

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={meatMaterial} castShadow />
      {/* Broche métallique traversante */}
      <mesh material={rodMaterial}>
        <cylinderGeometry args={[0.045, 0.045, 4.7, 20]} />
      </mesh>
      {/* Coiffe supérieure */}
      <mesh position={[0, 2.05, 0]} material={rodMaterial}>
        <coneGeometry args={[0.16, 0.34, 24]} />
      </mesh>
      {/* Embase / plateau bas */}
      <mesh position={[0, -1.95, 0]} material={rodMaterial}>
        <cylinderGeometry args={[0.42, 0.5, 0.12, 32]} />
      </mesh>
    </group>
  );
}
