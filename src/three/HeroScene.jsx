import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, DepthOfField } from '@react-three/postprocessing';
import * as THREE from 'three';
import Broche from './Broche';
import Fire from './Fire';
import Smoke from './Smoke';
import Embers from './Embers';
import FireLight from './FireLight';

/** Caméra cinématographique : parallaxe souris + recul piloté par le scroll. */
function Rig({ scrollRef }) {
  useFrame((state) => {
    const p = state.pointer;
    const sc = scrollRef?.current ?? 0;
    const camX = p.x * 0.7;
    const camY = 0.35 + p.y * 0.35 - sc * 0.8;
    const camZ = 7.2 + sc * 3.0;
    state.camera.position.x += (camX - state.camera.position.x) * 0.045;
    state.camera.position.y += (camY - state.camera.position.y) * 0.045;
    state.camera.position.z += (camZ - state.camera.position.z) * 0.045;
    state.camera.lookAt(0, 0.1 - sc * 0.5, 0);
  });
  return null;
}

/** Le feu « penche » doucement selon la position de la souris (réaction subtile). */
function ReactiveFire({ children }) {
  const g = useRef();
  useFrame((state) => {
    if (!g.current) return;
    const p = state.pointer;
    g.current.rotation.z += ((-p.x * 0.12) - g.current.rotation.z) * 0.06;
    g.current.position.x += (p.x * 0.15 - g.current.position.x) * 0.06;
  });
  return <group ref={g}>{children}</group>;
}

export default function HeroScene({ quality = 'high', reduce = false, scrollRef, pixelRatio = 1 }) {
  const low = quality === 'low';
  return (
    <>
      {/* Canvas transparent : la photo assombrie du hero reste visible derrière. */}
      <fog attach="fog" args={['#0a0806', 9, 20]} />

      <ambientLight intensity={0.35} color="#5b4a3a" />
      <FireLight position={[0, -1.1, 1.7]} intensity={low ? 7 : 9} />
      {/* Contre-jour froid pour détacher la broche du fond */}
      <spotLight position={[-4, 6, -3]} angle={0.5} penumbra={1} intensity={7} color="#4a5a7a" />
      <directionalLight position={[3, 4, 5]} intensity={1.1} color="#ffd9a8" />

      <Environment resolution={low ? 128 : 256} frames={low ? 1 : Infinity}>
        <Lightformer form="rect" intensity={2} color="#ff7a2a" position={[0, -2, 2]} scale={[6, 3, 1]} />
        <Lightformer form="rect" intensity={1} color="#ffcf8a" position={[3, 3, 2]} scale={[3, 4, 1]} />
        <Lightformer form="ring" intensity={0.6} color="#5566aa" position={[-4, 2, -3]} scale={4} />
      </Environment>

      <group position={[0, -0.1, 0]}>
        <Broche quality={quality} />
        <ReactiveFire>
          <Fire position={[0, -1.35, 0.75]} scale={[1.7, 2.2, 1]} layers={low ? 2 : 3} quality={quality} />
          <Fire position={[0, -1.45, -0.3]} scale={[1.4, 1.8, 1]} layers={2} quality={quality} />
        </ReactiveFire>
        {!reduce && (
          <>
            <Smoke count={low ? 14 : 26} origin={[0, 0.2, 0]} spread={0.7} rise={2.6} size={low ? 60 : 82} opacity={0.28} pixelRatio={pixelRatio} />
            <Embers count={low ? 30 : 54} origin={[0, -1.3, 0.4]} area={1.1} rise={3.0} size={low ? 16 : 22} pixelRatio={pixelRatio} />
          </>
        )}
      </group>

      <Rig scrollRef={scrollRef} />

      {!reduce && (
        <EffectComposer disableNormalPass multisampling={low ? 0 : 4}>
          <Bloom mipmapBlur intensity={low ? 0.4 : 0.55} luminanceThreshold={0.62} luminanceSmoothing={0.85} radius={0.6} />
          {!low && <DepthOfField focusDistance={0.02} focalLength={0.16} bokehScale={1.4} />}
          <Vignette eskil={false} offset={0.3} darkness={0.92} />
        </EffectComposer>
      )}
    </>
  );
}
