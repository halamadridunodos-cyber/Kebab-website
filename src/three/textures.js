import * as THREE from 'three';

/* ------------------------------------------------------------------ *
 * Génération de textures PBR procédurales (canvas) — 100 % hors-ligne.
 * Chaque recette produit color + normal + roughness tileables, ce qui
 * donne un vrai relief sous l'éclairage HDRI (fibres, croûte, char...).
 * ------------------------------------------------------------------ */

// Value-noise tileable + fbm (déterministe par graine).
function makeNoise(seed = 1) {
  const perm = new Uint8Array(512);
  let s = seed * 1013904223 + 1;
  const rnd = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 4294967296);
  const p = new Uint8Array(256);
  for (let i = 0; i < 256; i++) p[i] = i;
  for (let i = 255; i > 0; i--) { const j = (rnd() * (i + 1)) | 0; [p[i], p[j]] = [p[j], p[i]]; }
  for (let i = 0; i < 512; i++) perm[i] = p[i & 255];
  const fade = (t) => t * t * t * (t * (t * 6 - 15) + 10);
  const lerp = (a, b, t) => a + (b - a) * t;
  const grad = (h, x, y) => ((h & 1) ? -x : x) + ((h & 2) ? -y : y);
  // bruit tileable sur une période "per"
  const noise = (x, y, per = 256) => {
    const xi = Math.floor(x) % per, yi = Math.floor(y) % per;
    const xf = x - Math.floor(x), yf = y - Math.floor(y);
    const u = fade(xf), v = fade(yf);
    const wrap = (n) => (n + per) % per;
    const aa = perm[wrap(xi) + perm[wrap(yi)]];
    const ba = perm[wrap(xi + 1) + perm[wrap(yi)]];
    const ab = perm[wrap(xi) + perm[wrap(yi + 1)]];
    const bb = perm[wrap(xi + 1) + perm[wrap(yi + 1)]];
    const x1 = lerp(grad(aa, xf, yf), grad(ba, xf - 1, yf), u);
    const x2 = lerp(grad(ab, xf, yf - 1), grad(bb, xf - 1, yf - 1), u);
    return (lerp(x1, x2, v) + 1) * 0.5;
  };
  const fbm = (x, y, oct = 5, per = 32) => {
    let f = 0, a = 0.5, freq = per, amp = 0;
    for (let i = 0; i < oct; i++) { f += a * noise(x * freq / per, y * freq / per, freq); amp += a; freq *= 2; a *= 0.5; }
    return f / amp;
  };
  return { noise, fbm };
}

function heightToNormal(height, size, strength = 2.2) {
  const out = new Uint8ClampedArray(size * size * 4);
  const at = (x, y) => height[((y + size) % size) * size + ((x + size) % size)];
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const dx = (at(x - 1, y) - at(x + 1, y)) * strength;
      const dy = (at(x, y - 1) - at(x, y + 1)) * strength;
      const len = Math.hypot(dx, dy, 1);
      const i = (y * size + x) * 4;
      out[i] = ((dx / len) * 0.5 + 0.5) * 255;
      out[i + 1] = ((dy / len) * 0.5 + 0.5) * 255;
      out[i + 2] = (1 / len) * 0.5 * 255 + 127;
      out[i + 3] = 255;
    }
  }
  return out;
}

function toTexture(data, size, srgb = false, repeat = 1) {
  const tex = new THREE.DataTexture(data, size, size, THREE.RGBAFormat);
  tex.colorSpace = srgb ? THREE.SRGBColorSpace : THREE.NoColorSpace;
  tex.wrapS = tex.wrapT = THREE.RepeatWrapping;
  tex.repeat.set(repeat, repeat);
  tex.anisotropy = 8;
  tex.generateMipmaps = true;
  tex.minFilter = THREE.LinearMipmapLinearFilter;
  tex.magFilter = THREE.LinearFilter;
  tex.needsUpdate = true;
  return tex;
}

const mix = (a, b, t) => a + (b - a) * t;
const mixHex = (c1, c2, t) => {
  const r = mix((c1 >> 16) & 255, (c2 >> 16) & 255, t);
  const g = mix((c1 >> 8) & 255, (c2 >> 8) & 255, t);
  const b = mix(c1 & 255, c2 & 255, t);
  return [r, g, b];
};

/**
 * Fabrique un jeu color/normal/roughness à partir d'une fonction `shade(u,v,N)`
 * renvoyant { col:[r,g,b], h:height0..1, r:rough0..1 }.
 */
function buildPBR(size, seed, shade, { normalStrength = 2.2, repeat = 1 } = {}) {
  const N = makeNoise(seed);
  const color = new Uint8ClampedArray(size * size * 4);
  const rough = new Uint8ClampedArray(size * size * 4);
  const height = new Float32Array(size * size);
  for (let y = 0; y < size; y++) {
    for (let x = 0; x < size; x++) {
      const u = x / size, v = y / size;
      const o = N.fbm(u * size, v * size);
      const s = shade(u, v, N);
      const i = (y * size + x) * 4;
      color[i] = s.col[0]; color[i + 1] = s.col[1]; color[i + 2] = s.col[2]; color[i + 3] = 255;
      height[y * size + x] = s.h;
      const rr = s.r * 255;
      rough[i] = rr; rough[i + 1] = rr; rough[i + 2] = rr; rough[i + 3] = 255;
    }
  }
  const normal = heightToNormal(height, size, normalStrength);
  return {
    map: toTexture(color, size, true, repeat),
    normalMap: toTexture(normal, size, false, repeat),
    roughnessMap: toTexture(rough, size, false, repeat),
  };
}

/* ---- VIANDE : fibres étirées, caramélisation, char, gras brillant ---- */
export function meatTextures(size = 1024) {
  return buildPBR(size, 7, (u, v, N) => {
    // fibres : bruit très étiré horizontalement
    const fiber = N.fbm(u * 26, v * 4, 5, 48);
    const grain = N.fbm(u * 120, v * 30, 4, 64);
    const macro = N.fbm(u * 6, v * 6, 4, 16);
    // caramélisation par zones (macro), char sur les crêtes
    const roast = macro;                                   // 0 tendre -> 1 grillé
    const char = Math.pow(Math.max(0, fiber * 0.6 + grain * 0.4 - 0.62) / 0.38, 1.6);
    let col = mixHex(0x7a2412, 0x8a3a16, roast);           // rouge braise -> brun doré
    col = mixHex((col[0] << 16) | (col[1] << 8) | col[2], 0x2c1408, char); // char sombre
    // gras : petites veines claires brillantes
    const fat = Math.pow(Math.max(0, grain - 0.72) / 0.28, 2);
    col = mixHex((col[0] << 16) | (col[1] << 8) | col[2], 0xd9b27a, fat * 0.8);
    const h = fiber * 0.5 + grain * 0.3 + macro * 0.2;
    // rugosité : gras=brillant, char=mat, tendre=moyen
    let r = 0.62 - fat * 0.4 + char * 0.28;
    return { col, h, r: Math.min(1, Math.max(0.08, r)) };
  }, { normalStrength: 3.0, repeat: 1 });
}

/* ---- BROCHE DÖNER : beige clair, couches horizontales empilées, pointe brunie ---- */
export function brocheTextures(size = 1024) {
  return buildPBR(size, 11, (u, v, N) => {
    // Strates horizontales (empilage à la main) : variation selon la hauteur v.
    const rings = Math.sin(v * Math.PI * 34 + N.fbm(u * 4, v * 5) * 3.2) * 0.5 + 0.5;
    const drape = N.fbm(u * 3, v * 22, 4, 40);      // plis / irrégularités verticales
    const grain = N.fbm(u * 70, v * 70, 3, 64);
    const band = rings * 0.55 + drape * 0.45;
    // Couleur döner : beige clair -> doré légèrement bruni sur les crêtes.
    let col = mixHex(0xdcc6a0, 0xb08d5c, band);
    col = mixHex((col[0] << 16) | (col[1] << 8) | col[2], 0x7c5834, Math.max(0, grain - 0.66) * 0.6);
    // Pointe basse caramélisée/brunie (v proche de 0).
    const bottom = Math.pow(Math.max(0, (0.2 - v) / 0.2), 1.5);
    col = mixHex((col[0] << 16) | (col[1] << 8) | col[2], 0x452a15, bottom);
    // Léger hâle dorci au sommet arrondi.
    const top = Math.pow(Math.max(0, (v - 0.86) / 0.14), 1.4);
    col = mixHex((col[0] << 16) | (col[1] << 8) | col[2], 0xb28a52, top * 0.5);
    const h = band * 0.55 + grain * 0.25 + Math.abs(rings - 0.5) * 0.4;
    const r = 0.82 - Math.max(0, grain - 0.7) * 0.25;
    return { col, h, r: Math.min(1, r) };
  }, { normalStrength: 2.6, repeat: 1 });
}

/* ---- PAIN : croûte dorée, bulles, mie, imperfections ---- */
export function breadTextures(size = 1024) {
  return buildPBR(size, 21, (u, v, N) => {
    const crust = N.fbm(u * 9, v * 9, 5, 20);
    const bubbles = N.fbm(u * 40, v * 40, 4, 48);
    const flour = N.fbm(u * 160, v * 160, 3, 64);
    const bake = crust;                                    // dorure
    let col = mixHex(0xd9a24e, 0x8a5a22, Math.pow(bake, 1.3)); // doré -> brun croûte
    // points de cuisson plus foncés
    const spot = Math.pow(Math.max(0, bubbles - 0.7) / 0.3, 2);
    col = mixHex((col[0] << 16) | (col[1] << 8) | col[2], 0x5a3312, spot);
    // farine claire
    col = mixHex((col[0] << 16) | (col[1] << 8) | col[2], 0xe7cfa0, Math.max(0, flour - 0.75) * 0.6);
    const h = crust * 0.5 + bubbles * 0.4 + flour * 0.1;
    const r = 0.78 - spot * 0.15;
    return { col, h, r };
  }, { normalStrength: 2.6 });
}

/* ---- FRITES : dorées, croustillantes, pointes plus foncées ---- */
export function friesTextures(size = 512) {
  return buildPBR(size, 33, (u, v, N) => {
    const skin = N.fbm(u * 30, v * 8, 4, 40);
    const speck = N.fbm(u * 120, v * 120, 3, 64);
    // extrémités (v proche 0/1) plus grillées
    const tip = Math.pow(Math.abs(v - 0.5) * 2, 2.2);
    let col = mixHex(0xe8bd55, 0xc98a2e, skin * 0.6 + tip * 0.7);
    col = mixHex((col[0] << 16) | (col[1] << 8) | col[2], 0x7a4a18, Math.max(0, speck - 0.72) * tip);
    const h = skin * 0.6 + speck * 0.4;
    const r = 0.5 + skin * 0.2;
    return { col, h, r };
  }, { normalStrength: 2.2 });
}
