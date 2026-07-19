import * as THREE from 'three';

export const easeOutBack = (x) => {
  const c1 = 1.70158, c3 = c1 + 1;
  return 1 + c3 * Math.pow(x - 1, 3) + c1 * Math.pow(x - 1, 2);
};
export const easeOutCubic = (x) => 1 - Math.pow(1 - x, 3);
export const clamp01 = (x) => Math.min(1, Math.max(0, x));

/** Dispose `count` matrices dans un disque (mound) et renvoie un Float32 prêt pour InstancedMesh. */
export function scatterMatrices(count, { radius = 1, dome = 0.4, rot = true, jitterScale = 0.3, base = 0 }) {
  const m = new THREE.Matrix4();
  const q = new THREE.Quaternion();
  const e = new THREE.Euler();
  const v = new THREE.Vector3();
  const s = new THREE.Vector3();
  const out = [];
  for (let i = 0; i < count; i++) {
    const a = Math.random() * Math.PI * 2;
    const r = Math.sqrt(Math.random()) * radius;
    const y = base + Math.cos((r / radius) * Math.PI * 0.5) * dome + (Math.random() - 0.5) * 0.05;
    v.set(Math.cos(a) * r, y, Math.sin(a) * r);
    e.set(rot ? Math.random() * Math.PI : 0, Math.random() * Math.PI * 2, rot ? Math.random() * Math.PI : 0);
    q.setFromEuler(e);
    const sc = 1 + (Math.random() - 0.5) * jitterScale;
    s.set(sc, sc, sc);
    m.compose(v, q, s);
    out.push(m.clone());
  }
  return out;
}
