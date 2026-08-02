import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, N8AO } from '@react-three/postprocessing';
import * as THREE from 'three';
import Broche from './Broche';
import Smoke from './Smoke';
import KebabMachine from './KebabMachine';
import { HDRI_DARK } from './env';

/** Couteau inox qui capte la lumière, léger va-et-vient (découpe lente). */
function Knife() {
  const g = useRef();
  const blade = useMemo(() => new THREE.MeshStandardMaterial({ color: '#dfe4ea', metalness: 1, roughness: 0.14, envMapIntensity: 1.3 }), []);
  const handle = useMemo(() => new THREE.MeshStandardMaterial({ color: '#20140c', metalness: 0.2, roughness: 0.6 }), []);
  useFrame((s) => {
    if (!g.current) return;
    const t = s.clock.elapsedTime;
    g.current.position.y = 0.1 + Math.sin(t * 0.7) * 0.32;
    g.current.rotation.z = -0.5 + Math.sin(t * 0.7) * 0.05;
  });
  return (
    <group ref={g} position={[0.95, 0.1, 0.7]} rotation={[0, -0.3, -0.5]}>
      <mesh material={blade}><boxGeometry args={[0.85, 0.15, 0.02]} /></mesh>
      <mesh material={handle} position={[-0.58, 0, 0]}><boxGeometry args={[0.32, 0.1, 0.08]} /></mesh>
    </group>
  );
}

/** Fines tranches de viande qui se détachent et tombent, en boucle. */
function Slices({ count = 5 }) {
  const refs = useRef([]);
  const geo = useMemo(() => new THREE.BoxGeometry(0.32, 0.02, 0.15), []);
  const mat = useMemo(() => new THREE.MeshStandardMaterial({ color: '#b79366', roughness: 0.82 }), []);
  const seeds = useMemo(() => new Array(count).fill(0).map(() => ({ p: Math.random(), sp: 0.2 + Math.random() * 0.14, a: Math.random() * Math.PI, x: 0.3 + Math.random() * 0.2 })), [count]);
  useFrame((s, delta) => {
    const d = Math.min(delta, 0.05);
    seeds.forEach((seed, i) => {
      seed.p += d * seed.sp; if (seed.p > 1) seed.p -= 1;
      const m = refs.current[i]; if (!m) return;
      const f = seed.p;
      m.position.set(seed.x + f * 0.25, 0.5 - f * 2.3, 0.55);
      m.rotation.set(f * 3 + seed.a, seed.a, f * 2);
      m.material.transparent = true;
      m.material.opacity = Math.sin(f * Math.PI);
    });
  });
  return seeds.map((_, i) => <mesh key={i} ref={(r) => (refs.current[i] = r)} geometry={geo} material={mat.clone()} />);
}

function Rig() {
  useFrame((s, delta) => {
    const t = s.clock.elapsedTime;
    const target = new THREE.Vector3(Math.sin(t * 0.1) * 0.5 + s.pointer.x * 0.45, 0.25 + s.pointer.y * 0.25, 6.1);
    const k = 1 - Math.pow(0.003, delta);
    s.camera.position.lerp(target, k);
    s.camera.lookAt(0, 0.0, -0.2);
  });
  return null;
}

export default function NeDuFeuScene({ quality = 'high', reduce = false, pixelRatio = 1 }) {
  const low = quality === 'low';
  return (
    <>
      <fog attach="fog" args={['#0a0705', 6, 15]} />
      <Environment files={HDRI_DARK} environmentIntensity={low ? 0.3 : 0.4} />
      {/* Lumière d'appoint douce pour révéler l'avant de la viande (pas de blanc dur) */}
      <ambientLight intensity={0.14} color="#332c24" />
      <directionalLight position={[2, 3, 5]} intensity={0.95} color="#ffcc9a" />
      <spotLight position={[-3, 4, 2]} angle={0.6} penumbra={1} intensity={2} color="#8090b0" />

      <group position={[0, -0.15, 0]}>
        <KebabMachine quality={quality} />
        <Broche quality={quality} />
        {!reduce && (
          <>
            <Knife />
            <Slices count={low ? 3 : 5} />
            {/* La fumée qui monte, discrète */}
            <Smoke count={low ? 14 : 26} origin={[0, 0.2, -0.1]} spread={0.6} rise={3.4} size={low ? 70 : 100} opacity={0.26} color="#b8ad9e" pixelRatio={pixelRatio} />
          </>
        )}
      </group>

      <Rig />

      {!reduce && (
        <EffectComposer multisampling={low ? 0 : 4}>
          {!low && <N8AO aoRadius={1.1} intensity={2.4} distanceFalloff={1} halfRes color="#050302" />}
          {/* Bloom léger : ne fait rougeoyer que les panneaux chauffants */}
          <Bloom mipmapBlur intensity={low ? 0.5 : 0.7} luminanceThreshold={0.62} luminanceSmoothing={0.9} radius={0.6} />
          <Vignette offset={0.26} darkness={1.05} />
        </EffectComposer>
      )}
    </>
  );
}
