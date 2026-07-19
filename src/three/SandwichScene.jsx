import { useEffect, useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Environment, Lightformer, ContactShadows } from '@react-three/drei';
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing';
import * as THREE from 'three';
import { easeOutBack, easeOutCubic, clamp01, scatterMatrices } from './ingredients';

/**
 * Un ingrédient qui apparaît sur une fenêtre de progression [start,end] :
 * chute depuis le haut avec léger dépassement (back.out) + fondu — physique crédible.
 */
function Ingredient({ start, end, drop = 2.2, finalY = 0, scrollRef, spin = 0, children }) {
  const g = useRef();
  const mats = useRef([]);
  useFrame(() => {
    if (!g.current) return;
    const p = scrollRef?.current ?? 0;
    const a = clamp01((p - start) / (end - start));
    const eased = easeOutBack(a);
    g.current.position.y = finalY + (1 - eased) * drop;
    const sc = 0.001 + easeOutBack(a) * 0.999;
    g.current.scale.setScalar(Math.max(0.001, sc));
    g.current.rotation.y = spin * (1 - a);
    const op = easeOutCubic(clamp01(a * 1.4));
    g.current.traverse((o) => {
      if (o.material && o.material.transparent) o.material.opacity = op;
    });
  });
  return <group ref={g}>{children}</group>;
}

function useStdMat(props) {
  return useMemo(() => new THREE.MeshStandardMaterial({ transparent: true, opacity: 0, ...props }), []);
}

/** Ensemble d'ingrédients empilés, chacun câblé sur une fenêtre du scroll. */
function Sandwich({ scrollRef }) {
  // Matériaux (mémoïsés)
  const painMat = useStdMat({ color: '#d9a24e', roughness: 0.82, metalness: 0.02, emissive: '#3a2408', emissiveIntensity: 0.15 });
  const sauceMat = useStdMat({ color: '#f4ede0', roughness: 0.3, metalness: 0.0 });
  const saladeMat = useStdMat({ color: '#5f9e3a', roughness: 0.7 });
  const saladeMat2 = useStdMat({ color: '#7cba52', roughness: 0.7 });
  const tomateMat = useStdMat({ color: '#d93b2b', roughness: 0.45, emissive: '#3a0a06', emissiveIntensity: 0.12 });
  const oignonMat = useStdMat({ color: '#b0567f', roughness: 0.55 });
  const viandeMat = useStdMat({ color: '#8a4a24', roughness: 0.72, emissive: '#3a1606', emissiveIntensity: 0.25 });
  const friteMat = useStdMat({ color: '#e3b64a', roughness: 0.6, emissive: '#2a1c05', emissiveIntensity: 0.12 });

  // Géométries instanciées
  const leafGeo = useMemo(() => new THREE.SphereGeometry(0.22, 8, 6).scale(1.3, 0.28, 1), []);
  const meatGeo = useMemo(() => new THREE.BoxGeometry(0.3, 0.07, 0.12), []);
  const friteGeo = useMemo(() => new THREE.BoxGeometry(0.1, 0.1, 0.92), []);

  const salade = useMemo(() => scatterMatrices(16, { radius: 1.02, dome: 0.12, base: 0, jitterScale: 0.5 }), []);
  const viande = useMemo(() => scatterMatrices(46, { radius: 0.92, dome: 0.5, base: 0, jitterScale: 0.5 }), []);
  const frites = useMemo(() => {
    const m = new THREE.Matrix4(), q = new THREE.Quaternion(), e = new THREE.Euler(), v = new THREE.Vector3(), s = new THREE.Vector3(1, 1, 1);
    return new Array(11).fill(0).map((_, i) => {
      const a = (i / 11) * Math.PI * 2 + Math.random() * 0.5;
      const r = 0.25 + Math.random() * 0.35;
      v.set(Math.cos(a) * r, 0.1 + Math.random() * 0.28, Math.sin(a) * r);
      e.set((Math.random() - 0.5) * 0.5, Math.random() * Math.PI, (Math.random() - 0.5) * 0.5);
      q.setFromEuler(e);
      m.compose(v, q, s);
      return m.clone();
    });
  }, []);

  const setInst = (ref, mats) => {
    if (!ref) return;
    mats.forEach((mtx, i) => ref.setMatrixAt(i, mtx));
    ref.instanceMatrix.needsUpdate = true;
  };

  // Tomates & oignons : positions en couronne
  const ring = (n, r) => new Array(n).fill(0).map((_, i) => {
    const a = (i / n) * Math.PI * 2;
    return [Math.cos(a) * r, 0, Math.sin(a) * r];
  });
  const tomates = useMemo(() => ring(6, 0.72), []);
  const oignons = useMemo(() => ring(9, 0.86), []);

  return (
    <group position={[0, -0.6, 0]}>
      {/* 1 · PAIN */}
      <Ingredient start={0.0} end={0.14} drop={2.6} finalY={0} scrollRef={scrollRef}>
        <mesh material={painMat} castShadow scale={[1, 0.55, 1]}>
          <sphereGeometry args={[1.25, 48, 32]} />
        </mesh>
      </Ingredient>

      {/* 2 · SAUCE */}
      <Ingredient start={0.14} end={0.27} drop={1.6} finalY={0.34} scrollRef={scrollRef}>
        <mesh material={sauceMat}>
          <cylinderGeometry args={[1.08, 1.02, 0.09, 48]} />
        </mesh>
      </Ingredient>

      {/* 3 · SALADE */}
      <Ingredient start={0.27} end={0.4} drop={1.7} finalY={0.44} scrollRef={scrollRef} spin={0.8}>
        <instancedMesh ref={(r) => setInst(r, salade)} args={[leafGeo, saladeMat, salade.length]} />
        <instancedMesh ref={(r) => setInst(r, salade)} args={[leafGeo, saladeMat2, salade.length]} rotation={[0, 0.6, 0]} scale={0.9} />
      </Ingredient>

      {/* 4 · TOMATES */}
      <Ingredient start={0.4} end={0.53} drop={1.8} finalY={0.6} scrollRef={scrollRef}>
        {tomates.map((p, i) => (
          <mesh key={i} position={p} rotation={[Math.random() * 0.3, 0, Math.random() * 0.3]} material={tomateMat}>
            <cylinderGeometry args={[0.32, 0.32, 0.1, 20]} />
          </mesh>
        ))}
      </Ingredient>

      {/* 5 · OIGNONS */}
      <Ingredient start={0.53} end={0.65} drop={1.6} finalY={0.68} scrollRef={scrollRef} spin={1.1}>
        {oignons.map((p, i) => (
          <mesh key={i} position={[p[0], p[1] + Math.random() * 0.06, p[2]]} rotation={[Math.PI / 2, 0, 0]} material={oignonMat}>
            <torusGeometry args={[0.16, 0.045, 8, 20]} />
          </mesh>
        ))}
      </Ingredient>

      {/* 6 · VIANDE */}
      <Ingredient start={0.65} end={0.82} drop={2.0} finalY={0.78} scrollRef={scrollRef}>
        <instancedMesh ref={(r) => setInst(r, viande)} args={[meatGeo, viandeMat, viande.length]} castShadow />
      </Ingredient>

      {/* 7 · FRITES */}
      <Ingredient start={0.82} end={1.0} drop={2.4} finalY={1.15} scrollRef={scrollRef}>
        <instancedMesh ref={(r) => setInst(r, frites)} args={[friteGeo, friteMat, frites.length]} castShadow />
      </Ingredient>
    </group>
  );
}

/** Caméra qui s'élève et tourne légèrement au fil du montage. */
function BuildRig({ scrollRef }) {
  useFrame((state) => {
    const p = scrollRef?.current ?? 0;
    const ang = -0.5 + p * 0.9 + state.pointer.x * 0.25;
    const radius = 5.4;
    const ty = 0.4 + p * 1.6 + state.pointer.y * 0.2;
    const tx = Math.sin(ang) * radius;
    const tz = Math.cos(ang) * radius;
    state.camera.position.x += (tx - state.camera.position.x) * 0.05;
    state.camera.position.y += (ty - state.camera.position.y) * 0.05;
    state.camera.position.z += (tz - state.camera.position.z) * 0.05;
    state.camera.lookAt(0, 0.2 + p * 0.5, 0);
  });
  return null;
}

export default function SandwichScene({ quality = 'high', reduce = false, scrollRef }) {
  const low = quality === 'low';
  return (
    <>
      <fog attach="fog" args={['#0a0806', 8, 18]} />
      <ambientLight intensity={0.25} color="#6a5a48" />
      <directionalLight position={[3, 6, 4]} intensity={2.2} color="#ffe0b0" castShadow shadow-mapSize={low ? 512 : 1024} />
      <pointLight position={[-3, 2, -2]} intensity={8} color="#ff6a2a" distance={14} decay={2} />
      <spotLight position={[0, 7, 2]} angle={0.6} penumbra={1} intensity={4} color="#ffd9a8" />

      <Environment resolution={low ? 128 : 256} frames={low ? 1 : Infinity}>
        <Lightformer form="rect" intensity={2} color="#ffcf8a" position={[2, 3, 2]} scale={[4, 5, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#ff7a2a" position={[-3, -1, 2]} scale={[4, 3, 1]} />
      </Environment>

      <Sandwich scrollRef={scrollRef} />
      {!low && <ContactShadows position={[0, -0.62, 0]} opacity={0.5} scale={7} blur={2.6} far={4} color="#000000" />}

      <BuildRig scrollRef={scrollRef} />

      {!reduce && (
        <EffectComposer disableNormalPass multisampling={low ? 0 : 4}>
          <Bloom mipmapBlur intensity={low ? 0.5 : 0.75} luminanceThreshold={0.4} luminanceSmoothing={0.9} radius={0.7} />
          <Vignette offset={0.3} darkness={0.85} />
        </EffectComposer>
      )}
    </>
  );
}
