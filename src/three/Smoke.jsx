import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { makeSoftTexture } from './util';

const vertex = /* glsl */ `
uniform float uSize;
uniform float uPixelRatio;
attribute float aLife;
attribute float aScale;
varying float vLife;
void main(){
  vLife = aLife;
  vec4 mv = modelViewMatrix * vec4(position,1.0);
  // Grossit avec l'âge ; taille atténuée par la distance.
  float grow = mix(0.35, 1.6, aLife) * aScale;
  gl_PointSize = uSize * uPixelRatio * grow * (300.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

const fragment = /* glsl */ `
uniform sampler2D uMap;
uniform vec3 uColor;
uniform float uOpacity;
varying float vLife;
void main(){
  vec4 tx = texture2D(uMap, gl_PointCoord);
  // Apparition douce puis dissipation en fin de vie.
  float fade = smoothstep(0.0,0.18,vLife) * (1.0 - smoothstep(0.55,1.0,vLife));
  float a = tx.a * fade * uOpacity;
  if(a < 0.003) discard;
  gl_FragColor = vec4(uColor, a);
}
`;

/** Fumée volumétrique légère montant en spirale, sans popping (fade par cycle de vie). */
export default function Smoke({
  count = 26,
  origin = [0, 0, 0],
  spread = 0.7,
  rise = 1.2,
  size = 90,
  opacity = 0.5,
  color = '#c4bbae',
  pixelRatio = 1,
}) {
  const geomRef = useRef();
  const tex = useMemo(() => makeSoftTexture('rgba(210,203,193,0.85)', 'rgba(210,203,193,0)'), []);

  const parts = useMemo(
    () =>
      new Array(count).fill(0).map(() => ({
        x: (Math.random() - 0.5) * spread,
        z: (Math.random() - 0.5) * spread,
        life: Math.random(),
        speed: 0.1 + Math.random() * 0.13,
        drift: Math.random() * Math.PI * 2,
      })),
    [count, spread],
  );

  const { geom, uniforms } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute('aLife', new THREE.BufferAttribute(new Float32Array(count), 1));
    const scale = new Float32Array(count).map(() => 0.7 + Math.random() * 0.7);
    g.setAttribute('aScale', new THREE.BufferAttribute(scale, 1));
    const u = {
      uMap: { value: tex },
      uColor: { value: new THREE.Color(color) },
      uOpacity: { value: opacity },
      uSize: { value: size },
      uPixelRatio: { value: pixelRatio },
    };
    return { geom: g, uniforms: u };
  }, [count, tex, color, opacity, size, pixelRatio]);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const pos = geom.attributes.position.array;
    const lifeAttr = geom.attributes.aLife.array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const p = parts[i];
      p.life += d * p.speed;
      if (p.life > 1) p.life -= 1;
      const sway = Math.sin(t * 0.5 + p.drift) * 0.22 * p.life;
      pos[i * 3] = origin[0] + p.x + sway;
      pos[i * 3 + 1] = origin[1] + p.life * rise;
      pos[i * 3 + 2] = origin[2] + p.z + Math.cos(t * 0.4 + p.drift) * 0.14 * p.life;
      lifeAttr[i] = p.life;
    }
    geom.attributes.position.needsUpdate = true;
    geom.attributes.aLife.needsUpdate = true;
  });

  return (
    <points ref={geomRef} geometry={geom} renderOrder={1}>
      <shaderMaterial
        args={[{ vertexShader: vertex, fragmentShader: fragment, uniforms }]}
        transparent
        depthWrite={false}
        blending={THREE.NormalBlending}
        toneMapped={false}
      />
    </points>
  );
}
