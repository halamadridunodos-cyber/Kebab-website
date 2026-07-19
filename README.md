# O'Bresse — Expérience web 3D

Site vitrine du snack **O'Bresse** (Montréal-la-Cluse) réimaginé en expérience 3D
haut de gamme : broche de kebab qui tourne devant un feu réaliste, et montage du
sandwich piloté au scroll.

## Stack
- **React 18** + **Vite**
- **React Three Fiber / Three.js** — toute la 3D (broche procédurale, feu shader, fumée & braises GPU, montage du sandwich)
- **@react-three/postprocessing** — bloom, depth of field, vignette
- **GSAP + ScrollTrigger** — caméra et montage pilotés par le scroll
- **Web Audio API** — crépitement du feu synthétisé (activé après interaction, coupable)

## Développement
```bash
npm install
npm run dev      # serveur de dev
npm run build    # build de production -> dist/
npm run preview  # prévisualise le build
```

## Points clés
- Feu, fumée et braises 100 % procéduraux (shaders GLSL + particules), aucun modèle lourd à charger.
- Montage du sandwich : pain → sauce → salade → tomates → oignons → viande → frites, avec physique d'apparition (ease back) synchronisée au scroll.
- Rendu adaptatif : palier de qualité (DPR, densité de particules, post-processing) selon l'appareil.
- Boucle de rendu suspendue hors écran / onglet en arrière-plan.
- Respect de `prefers-reduced-motion` et bonnes pratiques d'accessibilité.
