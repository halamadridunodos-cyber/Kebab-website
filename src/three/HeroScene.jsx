import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, DepthOfField, N8AO, Noise } from '@react-three/postprocessing';
import { BlendFunction } from 'postprocessing';
import * as THREE from 'three';
import Broche from './Broche';
import Smoke from './Smoke';
import Embers from './Embers';
import KebabMachine from './KebabMachine';
import { HDRI_WARM } from './env';

/** Caméra cinématographique : parallaxe souris + recul scroll + flottement amorti. */
function Rig({ scrollRef }) {
  useFrame((state, delta) => {
    const p = state.pointer;
    const sc = scrollRef?.current ?? 0;
    const t = state.clock.elapsedTime;
    const floatX = Math.sin(t * 0.35) * 0.12 + Math.sin(t * 0.13) * 0.05;
    const floatY = Math.cos(t * 0.29) * 0.07;
    const target = new THREE.Vector3(
      p.x * 0.7 + floatX,
      0.3 + p.y * 0.3 + floatY - sc * 0.8,
      7.6 + sc * 3.0,
    );
    const k = 1 - Math.pow(0.0018, delta);
    state.camera.position.lerp(target, k);
    state.camera.lookAt(0, 0.05 - sc * 0.5, -0.2);
  });
  return null;
}

export default function HeroScene({ quality = 'high', reduce = false, scrollRef, pixelRatio = 1 }) {
  const low = quality === 'low';
  return (
    <>
      <fog attach="fog" args={['#0a0806', 9, 22]} />
      <Environment files={HDRI_WARM} environmentIntensity={low ? 0.34 : 0.44} />

      <ambientLight intensity={0.16} color="#3a2c1e" />
      <directionalLight position={[3, 4, 6]} intensity={1.0} color="#ffcaa0" />
      <spotLight position={[-4, 6, 3]} angle={0.5} penumbra={1} intensity={2.4} color="#44536e" />

      <group position={[0, -0.1, 0]}>
        <KebabMachine quality={quality} />
        <Broche quality={quality} />
        {!reduce && (
          <>
            <Smoke count={low ? 16 : 30} origin={[0, 0.3, -0.1]} spread={0.65} rise={3.0} size={low ? 62 : 88} opacity={0.24} color="#b8ad9e" pixelRatio={pixelRatio} />
            <Embers count={low ? 16 : 30} origin={[0, -1.4, 0.2]} area={1.0} rise={2.6} size={low ? 12 : 16} pixelRatio={pixelRatio} />
          </>
        )}
      </group>

      <Rig scrollRef={scrollRef} />

      {!reduce && (
        <EffectComposer multisampling={low ? 0 : 4}>
          {!low && <N8AO aoRadius={1.2} intensity={2.2} distanceFalloff={1} halfRes color="#0a0604" />}
          {/* Bloom léger : rougeoiement des panneaux chauffants uniquement */}
          <Bloom mipmapBlur intensity={low ? 0.32 : 0.44} luminanceThreshold={0.78} luminanceSmoothing={0.9} radius={0.55} />
          {!low && <DepthOfField focusDistance={0.028} focalLength={0.2} bokehScale={2.2} />}
          <Vignette eskil={false} offset={0.3} darkness={0.95} />
          {!low && <Noise premultiply blendFunction={BlendFunction.OVERLAY} opacity={0.04} />}
        </EffectComposer>
      )}
    </>
  );
}
