import { useMemo, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';
import { makeSoftTexture } from './util';

const vertex = /* glsl */ `
uniform float uSize;
uniform float uPixelRatio;
attribute float aLife;
attribute float aSeed;
varying float vLife;
void main(){
  vLife = aLife;
  vec4 mv = modelViewMatrix * vec4(position,1.0);
  float tw = 0.6 + 0.4*sin(aSeed*30.0 + aLife*40.0); // scintillement
  gl_PointSize = uSize * uPixelRatio * tw * (200.0 / -mv.z);
  gl_Position = projectionMatrix * mv;
}
`;

const fragment = /* glsl */ `
uniform sampler2D uMap;
varying float vLife;
void main(){
  vec4 tx = texture2D(uMap, gl_PointCoord);
  float fade = (1.0 - smoothstep(0.5,1.0,vLife)) * smoothstep(0.0,0.08,vLife);
  // Braise : jaune vif au coeur -> orange -> rouge en refroidissant.
  vec3 hot = vec3(1.0,0.85,0.45);
  vec3 cold = vec3(1.0,0.28,0.05);
  vec3 col = mix(hot, cold, vLife);
  float a = tx.a * fade;
  if(a < 0.01) discard;
  gl_FragColor = vec4(col, a);
}
`;

/** Braises additives qui s'élèvent, dérivent et refroidissent. */
export default function Embers({ count = 60, origin = [0, 0, 0], area = 1.2, rise = 2.4, size = 26, pixelRatio = 1 }) {
  const tex = useMemo(() => makeSoftTexture('rgba(255,240,200,1)', 'rgba(255,240,200,0)'), []);

  const parts = useMemo(
    () =>
      new Array(count).fill(0).map(() => ({
        x: (Math.random() - 0.5) * area,
        z: (Math.random() - 0.5) * area,
        life: Math.random(),
        speed: 0.25 + Math.random() * 0.4,
        drift: Math.random() * Math.PI * 2,
        vx: (Math.random() - 0.5) * 0.3,
      })),
    [count, area],
  );

  const { geom, uniforms } = useMemo(() => {
    const g = new THREE.BufferGeometry();
    g.setAttribute('position', new THREE.BufferAttribute(new Float32Array(count * 3), 3));
    g.setAttribute('aLife', new THREE.BufferAttribute(new Float32Array(count), 1));
    const seeds = new Float32Array(count).map(() => Math.random());
    g.setAttribute('aSeed', new THREE.BufferAttribute(seeds, 1));
    const u = {
      uMap: { value: tex },
      uSize: { value: size },
      uPixelRatio: { value: pixelRatio },
    };
    return { geom: g, uniforms: u };
  }, [count, tex, size, pixelRatio]);

  useFrame((state, delta) => {
    const d = Math.min(delta, 0.05);
    const pos = geom.attributes.position.array;
    const life = geom.attributes.aLife.array;
    const t = state.clock.elapsedTime;
    for (let i = 0; i < count; i++) {
      const p = parts[i];
      p.life += d * p.speed;
      if (p.life > 1) { p.life -= 1; p.x = (Math.random() - 0.5) * area; p.z = (Math.random() - 0.5) * area; }
      pos[i * 3] = origin[0] + p.x + Math.sin(t * 1.5 + p.drift) * 0.2 * p.life + p.vx * p.life;
      pos[i * 3 + 1] = origin[1] + p.life * rise;
      pos[i * 3 + 2] = origin[2] + p.z + Math.cos(t * 1.2 + p.drift) * 0.15 * p.life;
      life[i] = p.life;
    }
    geom.attributes.position.needsUpdate = true;
    geom.attributes.aLife.needsUpdate = true;
  });

  return (
    <points geometry={geom} renderOrder={3}>
      <shaderMaterial
        args={[{ vertexShader: vertex, fragmentShader: fragment, uniforms }]}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        toneMapped={false}
      />
    </points>
  );
}
