import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

/**
 * Machine à kebab verticale (rôtissoire), inspirée d'une vraie :
 * carrosserie inox, plaque arrière et surtout les 4 panneaux chauffants
 * qui rougeoient derrière la viande (aucune flamme). Léger scintillement
 * de la chaleur. Les lumières chaudes viennent de ces panneaux.
 */
export default function KebabMachine({ quality = 'high' }) {
  const bars = useRef([]);
  const lights = useRef([]);

  const steel = useMemo(() => new THREE.MeshStandardMaterial({ color: '#8f959d', metalness: 0.92, roughness: 0.28, envMapIntensity: 1.0 }), []);
  const steelDark = useMemo(() => new THREE.MeshStandardMaterial({ color: '#20242a', metalness: 0.8, roughness: 0.5, envMapIntensity: 0.6 }), []);
  const grid = useMemo(() => new THREE.MeshStandardMaterial({ color: '#0c0806', metalness: 0.5, roughness: 0.8 }), []);
  const barMats = useMemo(
    () => new Array(4).fill(0).map(() => new THREE.MeshStandardMaterial({
      color: '#2a0a02', emissive: new THREE.Color('#ff4d0c'), emissiveIntensity: 3.2, roughness: 0.55, metalness: 0.2, toneMapped: true,
    })),
    [],
  );

  // Position des 4 panneaux : 2 débordent sur les côtés (visibles), 2 derrière la viande (halo).
  const barX = [-0.74, -0.26, 0.26, 0.74];

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    barMats.forEach((m, i) => {
      // rougeoiement lent, désynchronisé par panneau
      const glow = 3.0 + Math.sin(t * 1.3 + i * 1.7) * 0.5 + Math.sin(t * 4.1 + i) * 0.18;
      m.emissiveIntensity = glow;
      const l = lights.current[i];
      if (l) l.intensity = 1.5 + Math.sin(t * 1.3 + i * 1.7) * 0.3;
    });
  });

  return (
    <group>
      {/* Plaque arrière sombre + grille */}
      <mesh position={[0, 0, -0.95]} material={steelDark}><boxGeometry args={[2.1, 4.0, 0.16]} /></mesh>
      <mesh position={[0, 0, -0.82]} material={grid}><boxGeometry args={[1.9, 3.5, 0.05]} /></mesh>

      {/* Les 4 panneaux chauffants rougeoyants */}
      {barX.map((x, i) => (
        <group key={i}>
          <mesh position={[x, 0, -0.74]} material={barMats[i]} ref={(r) => (bars.current[i] = r)}>
            <boxGeometry args={[0.34, 3.0, 0.06]} />
          </mesh>
          <pointLight ref={(r) => (lights.current[i] = r)} position={[x, 0.2, -0.35]} color="#ff5a1a" intensity={1.3} distance={6} decay={2} />
        </group>
      ))}

      {/* Carrosserie inox : montant gauche large (comme la photo) + montant droit fin */}
      <mesh position={[-1.28, 0, -0.1]} material={steel}><boxGeometry args={[0.5, 4.0, 1.7]} /></mesh>
      <mesh position={[1.22, 0, -0.2]} material={steel}><boxGeometry args={[0.16, 4.0, 1.4]} /></mesh>
      {/* Capot supérieur + hotte */}
      <mesh position={[0, 2.15, -0.35]} material={steel}><boxGeometry args={[2.7, 0.35, 1.5]} /></mesh>
      {/* Plateau / bac inox du bas */}
      <mesh position={[0, -2.05, 0.05]} material={steel} receiveShadow><boxGeometry args={[2.5, 0.18, 1.5]} /></mesh>
      <mesh position={[0, -1.95, 0.02]} material={steelDark}><boxGeometry args={[1.7, 0.06, 1.0]} /></mesh>
    </group>
  );
}
