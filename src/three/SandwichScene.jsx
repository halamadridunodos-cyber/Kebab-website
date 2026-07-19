import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette, N8AO } from '@react-three/postprocessing';
import * as THREE from 'three';
import { easeOutBack, easeOutCubic, clamp01 } from './ingredients';
import { breadTextures, friesTextures, meatTextures } from './textures';
import { HDRI_WARM } from './env';

/**
 * Ingrédient qui apparaît sur une fenêtre [start,end] : chute + léger dépassement
 * (back.out) + fondu. Reproduit une physique d'apparition crédible.
 */
function Ingredient({ start, end, drop = 2.2, finalY = 0, scrollRef, spin = 0, children }) {
  const g = useRef();
  useFrame(() => {
    if (!g.current) return;
    const p = scrollRef?.current ?? 0;
    const a = clamp01((p - start) / (end - start));
    const eased = easeOutBack(a);
    g.current.position.y = finalY + (1 - eased) * drop;
    g.current.scale.setScalar(Math.max(0.001, 0.001 + eased * 0.999));
    g.current.rotation.y = spin * (1 - a);
    const op = easeOutCubic(clamp01(a * 1.4));
    g.current.traverse((o) => { if (o.material && o.material.transparent) o.material.opacity = op; });
  });
  return <group ref={g}>{children}</group>;
}

// Dispersion dans une boîte allongée (le long de X), en dôme le long de l'axe.
function scatterBox(count, { lx = 1, lz = 0.3, yBase = 0, dome = 0.25, jitter = 0.35, flat = false }) {
  const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), s = new THREE.Vector3();
  return new Array(count).fill(0).map(() => {
    const x = (Math.random() * 2 - 1) * lx;
    const z = (Math.random() * 2 - 1) * lz;
    const edge = 1 - Math.min(1, (Math.abs(x) / lx) * 0.9);
    const y = yBase + edge * dome + (Math.random() - 0.5) * 0.05;
    v.set(x, y, z);
    e.set(flat ? 0 : Math.random() * Math.PI, Math.random() * Math.PI * 2, flat ? 0 : Math.random() * Math.PI);
    q.setFromEuler(e);
    const sc = 1 + (Math.random() - 0.5) * jitter;
    s.set(sc, sc, sc);
    m.compose(v, q, s);
    return m;
  });
}

// Cordon de sauce ondulant le long de X (TubeGeometry).
function sauceTube(len = 1.9, wig = 0.16, r = 0.055, seed = 0) {
  const pts = [];
  const n = 14;
  for (let i = 0; i <= n; i++) {
    const t = i / n;
    const x = -len + t * len * 2;
    const z = Math.sin(t * Math.PI * 5 + seed) * wig;
    const y = Math.sin(t * Math.PI * 3 + seed) * 0.03;
    pts.push(new THREE.Vector3(x, y, z));
  }
  return new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 90, r, 8, false);
}

function useStd(props, deps = []) { return useMemo(() => new THREE.MeshStandardMaterial({ transparent: true, opacity: 0, ...props }), deps); }

function Sandwich({ scrollRef, quality }) {
  const size = quality === 'low' ? 512 : 1024;
  const bread = useMemo(() => breadTextures(size), [size]);
  const fry = useMemo(() => friesTextures(quality === 'low' ? 256 : 512), [quality]);
  const meat = useMemo(() => meatTextures(size), [size]);

  const painMat = useStd({ map: bread.map, normalMap: bread.normalMap, normalScale: new THREE.Vector2(1.2, 1.2), roughnessMap: bread.roughnessMap, roughness: 1, envMapIntensity: 0.4, emissive: '#2a1606', emissiveIntensity: 0.08 }, [bread]);
  const rougeMat = useStd({ color: '#bd2f16', roughness: 0.32, metalness: 0, envMapIntensity: 0.9, emissive: '#3a0a03', emissiveIntensity: 0.12 });
  const blancheMat = useStd({ color: '#efe6d2', roughness: 0.22, metalness: 0, envMapIntensity: 1.0 });
  const saladeMat = useStd({ color: '#6aa53a', roughness: 0.62 });
  const saladeMat2 = useStd({ color: '#87bf55', roughness: 0.62 });
  const tomateMat = useStd({ color: '#c9402a', roughness: 0.34, envMapIntensity: 0.8, emissive: '#3a0a06', emissiveIntensity: 0.1 });
  const oignonMat = useStd({ color: '#c98aa2', roughness: 0.5 });
  const viandeMat = useStd({ color: '#7c5836', normalMap: meat.normalMap, normalScale: new THREE.Vector2(0.8, 0.8), roughness: 0.78, envMapIntensity: 0.4, emissive: '#2a1204', emissiveIntensity: 0.08 }, [meat]);
  const viandeMat2 = useStd({ color: '#5f4026', normalMap: meat.normalMap, roughness: 0.82, emissive: '#2a1204', emissiveIntensity: 0.06 }, [meat]);
  const friteMat = useStd({ map: fry.map, normalMap: fry.normalMap, roughnessMap: fry.roughnessMap, roughness: 1, envMapIntensity: 0.5 }, [fry]);

  // Géométries
  const breadGeo = useMemo(() => new THREE.CapsuleGeometry(0.55, 1.7, 12, 24), []);
  const shredGeo = useMemo(() => new THREE.BoxGeometry(0.36, 0.07, 0.14).toNonIndexed(), []);
  const leafGeo = useMemo(() => new THREE.SphereGeometry(0.17, 8, 6).scale(1.6, 0.2, 1.15), []);
  const diceGeo = useMemo(() => new THREE.BoxGeometry(0.15, 0.1, 0.15), []);
  const onionGeo = useMemo(() => new THREE.TorusGeometry(0.11, 0.032, 6, 14), []);
  const friteGeo = useMemo(() => new THREE.BoxGeometry(0.09, 0.09, 0.8), []);

  // Répartitions (garnies dans le creux du pain, le long de X)
  const meatA = useMemo(() => scatterBox(quality === 'low' ? 90 : 150, { lx: 1.0, lz: 0.42, yBase: 0, dome: 0.24, jitter: 0.5 }), [quality]);
  const meatB = useMemo(() => scatterBox(quality === 'low' ? 55 : 95, { lx: 1.0, lz: 0.4, yBase: 0.03, dome: 0.24, jitter: 0.5 }), [quality]);
  const salade = useMemo(() => scatterBox(quality === 'low' ? 20 : 34, { lx: 1.0, lz: 0.42, yBase: 0, dome: 0.06, jitter: 0.6 }), [quality]);
  const tomates = useMemo(() => scatterBox(11, { lx: 0.94, lz: 0.34, yBase: 0, dome: 0.05, jitter: 0.5 }), []);
  const oignons = useMemo(() => scatterBox(13, { lx: 0.96, lz: 0.36, yBase: 0, dome: 0.04, jitter: 0.5 }), []);
  const frites = useMemo(() => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), s = new THREE.Vector3(1, 1, 1);
    return new Array(quality === 'low' ? 8 : 13).fill(0).map((_, i) => {
      const x = (Math.random() * 2 - 1) * 0.9;
      v.set(x, 0.06 + Math.random() * 0.16, (Math.random() * 2 - 1) * 0.28);
      e.set((Math.random() - 0.5) * 0.4, Math.random() * Math.PI, (Math.random() - 0.5) * 0.4);
      q.setFromEuler(e); m.compose(v, q, s); return m.clone();
    });
  }, [quality]);
  const redTube = useMemo(() => sauceTube(0.95, 0.16, 0.05, 1), []);
  const whiteTube = useMemo(() => sauceTube(0.98, 0.2, 0.06, 3), []);
  const whiteTube2 = useMemo(() => sauceTube(0.9, 0.14, 0.05, 6), []);

  const setInst = (ref, mats) => { if (!ref) return; mats.forEach((mx, i) => ref.setMatrixAt(i, mx)); ref.instanceMatrix.needsUpdate = true; };

  return (
    <group position={[0, -0.15, 0]} rotation={[0, -0.15, 0]}>
      {/* 1 · PAIN — demi-baguette (dessus aplati, creux pour la garniture) */}
      <Ingredient start={0.0} end={0.14} drop={2.6} finalY={0} scrollRef={scrollRef}>
        <mesh geometry={breadGeo} material={painMat} rotation={[0, 0, Math.PI / 2]} scale={[0.72, 0.6, 1.18]} castShadow receiveShadow />
      </Ingredient>

      {/* 2 · SAUCE rouge (harissa) au fond du pain */}
      <Ingredient start={0.14} end={0.26} drop={1.0} finalY={0.24} scrollRef={scrollRef}>
        <mesh geometry={redTube} material={rougeMat} />
        <mesh geometry={redTube} material={rougeMat} position={[0, 0.01, 0.16]} rotation={[0, 0.3, 0]} />
      </Ingredient>

      {/* 3 · SALADE */}
      <Ingredient start={0.26} end={0.38} drop={1.4} finalY={0.26} scrollRef={scrollRef} spin={0.6}>
        <instancedMesh ref={(r) => setInst(r, salade)} args={[leafGeo, saladeMat, salade.length]} />
        <instancedMesh ref={(r) => setInst(r, salade)} args={[leafGeo, saladeMat2, salade.length]} position={[0, 0.03, 0.05]} />
      </Ingredient>

      {/* 4 · TOMATES en dés */}
      <Ingredient start={0.38} end={0.5} drop={1.5} finalY={0.3} scrollRef={scrollRef}>
        <instancedMesh ref={(r) => setInst(r, tomates)} args={[diceGeo, tomateMat, tomates.length]} />
      </Ingredient>

      {/* 5 · OIGNONS */}
      <Ingredient start={0.5} end={0.61} drop={1.3} finalY={0.32} scrollRef={scrollRef} spin={0.8}>
        <instancedMesh ref={(r) => setInst(r, oignons)} args={[onionGeo, oignonMat, oignons.length]} />
      </Ingredient>

      {/* 6 · VIANDE effilochée (généreuse) + sauce blanche par-dessus */}
      <Ingredient start={0.61} end={0.82} drop={1.9} finalY={0.28} scrollRef={scrollRef}>
        <instancedMesh ref={(r) => setInst(r, meatA)} args={[shredGeo, viandeMat, meatA.length]} castShadow />
        <instancedMesh ref={(r) => setInst(r, meatB)} args={[shredGeo, viandeMat2, meatB.length]} castShadow />
        <mesh geometry={whiteTube} material={blancheMat} position={[0, 0.3, 0]} />
        <mesh geometry={whiteTube2} material={blancheMat} position={[0.05, 0.32, 0.13]} rotation={[0, 0.4, 0]} />
        <mesh geometry={whiteTube} material={blancheMat} position={[-0.04, 0.29, -0.12]} rotation={[0, -0.3, 0]} scale={[1, 1, 0.9]} />
      </Ingredient>

      {/* 7 · FRITES */}
      <Ingredient start={0.82} end={1.0} drop={2.2} finalY={0.52} scrollRef={scrollRef}>
        <instancedMesh ref={(r) => setInst(r, frites)} args={[friteGeo, friteMat, frites.length]} castShadow />
      </Ingredient>
    </group>
  );
}

/** Caméra qui s'élève et tourne en douceur (amortie) au fil du montage. */
function BuildRig({ scrollRef }) {
  useFrame((state, delta) => {
    const p = scrollRef?.current ?? 0;
    const t = state.clock.elapsedTime;
    const ang = -0.6 + p * 0.7 + state.pointer.x * 0.25 + Math.sin(t * 0.25) * 0.05;
    const radius = 5.0 - p * 0.6;
    const ty = 1.4 + p * 1.0 + state.pointer.y * 0.25;
    const target = new THREE.Vector3(Math.sin(ang) * radius, ty, Math.cos(ang) * radius);
    const k = 1 - Math.pow(0.002, delta);
    state.camera.position.lerp(target, k);
    state.camera.lookAt(0, 0.15 + p * 0.3, 0);
  });
  return null;
}

export default function SandwichScene({ quality = 'high', reduce = false, scrollRef }) {
  const low = quality === 'low';
  return (
    <>
      <fog attach="fog" args={['#0a0806', 9, 20]} />
      <Environment files={HDRI_WARM} environmentIntensity={low ? 0.4 : 0.5} />
      <ambientLight intensity={0.18} color="#4a3a2a" />
      <directionalLight position={[3, 6, 4]} intensity={2.4} color="#ffe0b0" castShadow shadow-mapSize={low ? 512 : 2048} shadow-bias={-0.0004} />
      <pointLight position={[-3, 2, -2]} intensity={7} color="#ff6a2a" distance={14} decay={2} />
      <spotLight position={[0, 7, 2]} angle={0.6} penumbra={1} intensity={4} color="#ffd9a8" />

      <Sandwich scrollRef={scrollRef} quality={quality} />
      {!low && <ContactShadows position={[0, -0.62, 0]} opacity={0.55} scale={7} blur={2.6} far={4} color="#000000" />}

      <BuildRig scrollRef={scrollRef} />

      {!reduce && (
        <EffectComposer multisampling={low ? 0 : 4}>
          {!low && <N8AO aoRadius={0.8} intensity={2} distanceFalloff={1} halfRes color="#0a0604" />}
          <Bloom mipmapBlur intensity={low ? 0.28 : 0.4} luminanceThreshold={0.75} luminanceSmoothing={0.9} radius={0.5} />
          <Vignette offset={0.32} darkness={0.85} />
        </EffectComposer>
      )}
    </>
  );
}
