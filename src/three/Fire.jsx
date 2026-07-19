import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { NOISE } from './shaders/glsl';

const vertex = /* glsl */ `
varying vec2 vUv;
void main(){
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
}
`;

const fragment = /* glsl */ `
uniform float uTime;
uniform float uIntensity;
uniform float uSeed;
uniform vec3 uLow;
uniform vec3 uMid;
uniform vec3 uHigh;
varying vec2 vUv;
${NOISE}

void main(){
  vec2 uv = vUv;
  float t = uTime + uSeed;
  // Domaine qui monte : la flamme "lèche" vers le haut.
  vec3 coord = vec3(uv.x*2.6, uv.y*2.2 - t*2.1, t*0.4 + uSeed);
  float n = fbm(coord);
  float n2 = fbm(coord*2.3 + 5.0);

  float dist = abs(uv.x - 0.5) * 2.0;
  // Profil vertical : large et intense en bas, effilé et fondu en haut.
  float shape = smoothstep(1.0, 0.05, uv.y);
  shape *= smoothstep(0.0, 0.14, uv.y);
  // Largeur perturbée par le bruit -> bords vivants.
  float width = dist + n*0.42 + n2*0.14 + uv.y*0.25;
  shape *= smoothstep(1.05, 0.1, width);
  shape = clamp(shape, 0.0, 1.0);

  float core = pow(shape, 1.7);
  vec3 col = mix(uLow, uMid, smoothstep(0.0, 0.55, shape));
  col = mix(col, uHigh, smoothstep(0.6, 1.0, core));

  float alpha = shape * uIntensity;
  if(alpha < 0.01) discard;
  gl_FragColor = vec4(col * (0.5 + core*0.7), alpha * 0.92);
}
`;

/** Une nappe de flamme composée de plusieurs plans additifs face caméra. */
export default function Fire({ position = [0, 0, 0], scale = [3, 4, 1], layers = 3, quality = 'high' }) {
  const group = useRef();
  const mats = useRef([]);

  const planes = useMemo(() => {
    const n = quality === 'low' ? Math.max(2, layers - 1) : layers;
    return new Array(n).fill(0).map((_, i) => ({
      seed: i * 13.7,
      z: (i - (n - 1) / 2) * 0.18,
      s: 1 - i * 0.12,
    }));
  }, [layers, quality]);

  const uniforms = useMemo(
    () =>
      planes.map((p) => ({
        uTime: { value: 0 },
        uIntensity: { value: 1 },
        uSeed: { value: p.seed },
        uLow: { value: new THREE.Color('#7a1500') },
        uMid: { value: new THREE.Color('#ff5a1f') },
        uHigh: { value: new THREE.Color('#ffd27a') },
      })),
    [planes],
  );

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    // Scintillement organique commun (utilisé aussi par la lumière du feu).
    const flick = 0.82 + Math.sin(t * 9.0) * 0.08 + Math.sin(t * 21.0) * 0.05 + Math.random() * 0.06;
    mats.current.forEach((m, i) => {
      if (!m) return;
      m.uniforms.uTime.value = t;
      m.uniforms.uIntensity.value = flick * (1 - i * 0.14);
    });
    if (group.current) group.current.rotation.y = state.camera ? 0 : 0;
  });

  return (
    <group ref={group} position={position}>
      {planes.map((p, i) => (
        <mesh key={i} position={[0, 0, p.z]} scale={[scale[0] * p.s, scale[1] * p.s, 1]} renderOrder={2}>
          <planeGeometry args={[1, 1, 1, 1]} />
          <shaderMaterial
            ref={(m) => (mats.current[i] = m)}
            args={[{ vertexShader: vertex, fragmentShader: fragment, uniforms: uniforms[i] }]}
            transparent
            depthWrite={false}
            blending={THREE.AdditiveBlending}
            toneMapped={false}
          />
        </mesh>
      ))}
    </group>
  );
}
