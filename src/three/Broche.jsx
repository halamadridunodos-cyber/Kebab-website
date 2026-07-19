import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { brocheTextures } from './textures';

/**
 * Broche de kebab (döner vertical) fidèle à une vraie machine :
 * colonne de veau beige empilée en couches horizontales, sommet arrondi,
 * pointe basse brunie. Tourne lentement autour de la broche métallique.
 */
export default function Broche({ quality = 'high' }) {
  const group = useRef();
  const tex = useMemo(() => brocheTextures(quality === 'low' ? 512 : 1024), [quality]);

  const geometry = useMemo(() => {
    const pts = [];
    const H = 3.4;
    const bottom = -H / 2;
    const steps = 60;
    // Profil : pointe étroite en bas, corps plein et bombé, sommet arrondi.
    const profile = (u) => {
      const body = Math.sin(Math.pow(u, 0.72) * Math.PI * 0.98); // ventre haut-médian
      let r = 0.13 + body * 0.5;
      r *= 0.82 + u * 0.28;                                       // un peu plus large vers le haut
      if (u > 0.86) r *= Math.sqrt(Math.max(0, 1 - Math.pow((u - 0.86) / 0.14, 2))) * 0.55 + 0.45; // dôme
      if (u < 0.12) r *= 0.4 + (u / 0.12) * 0.6;                  // pointe basse
      return Math.max(0.05, r);
    };
    for (let i = 0; i <= steps; i++) { const u = i / steps; pts.push(new THREE.Vector2(profile(u), bottom + u * H)); }
    const radial = quality === 'low' ? 56 : 110;
    const geo = new THREE.LatheGeometry(pts, radial);

    // Déformation : strates horizontales + bruit -> empilage « fait main ».
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const ang = Math.atan2(v.z, v.x);
      const r = Math.hypot(v.x, v.z);
      const layers = Math.sin(v.y * 11.0) * 0.022 + Math.sin(v.y * 27.0 + ang * 1.5) * 0.012;
      const rough = Math.sin(ang * 7.0 + v.y * 3.0) * 0.016 + Math.sin(ang * 15.0) * 0.009;
      const nr = r + layers + rough;
      if (r > 0.001) { v.x = (v.x / r) * nr; v.z = (v.z / r) * nr; }
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, [quality]);

  const meatMaterial = useMemo(() => {
    [tex.map, tex.normalMap, tex.roughnessMap].forEach((t) => t.repeat.set(4, 1));
    return new THREE.MeshStandardMaterial({
      map: tex.map,
      normalMap: tex.normalMap,
      normalScale: new THREE.Vector2(1, 1),
      roughnessMap: tex.roughnessMap,
      roughness: 1,
      metalness: 0,
      envMapIntensity: 0.4,
      emissive: new THREE.Color('#1c0e05'),
      emissiveIntensity: 0.05,
    });
  }, [tex]);

  const rodMaterial = useMemo(
    () => new THREE.MeshStandardMaterial({ color: '#c8ccd2', roughness: 0.26, metalness: 0.96, envMapIntensity: 1.1 }),
    [],
  );

  useFrame((_, delta) => { if (group.current) group.current.rotation.y += delta * 0.32; });

  return (
    <group ref={group}>
      <mesh geometry={geometry} material={meatMaterial} castShadow />
      {/* Broche métallique traversante */}
      <mesh material={rodMaterial}><cylinderGeometry args={[0.04, 0.04, 4.7, 20]} /></mesh>
      {/* Écrou / coiffe supérieure */}
      <mesh position={[0, 1.95, 0]} material={rodMaterial}><sphereGeometry args={[0.11, 20, 16]} /></mesh>
      {/* Embase basse */}
      <mesh position={[0, -1.9, 0]} material={rodMaterial}><cylinderGeometry args={[0.16, 0.2, 0.14, 24]} /></mesh>
    </group>
  );
}
