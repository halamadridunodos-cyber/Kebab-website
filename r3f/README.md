# O'Bresse — version immersive 3D (React Three Fiber)

Version **alternative et immersive** du site O'Bresse, avec une **broche 3D**
qui tourne (Three.js / React Three Fiber) dans le hero, des braises animées et
un éclairage cinématique. Le contenu (carte, avis, FAQ, contact) reprend la
même charte que la version principale.

> ⚠️ Projet **séparé** : la version principale (validée) reste à la racine du
> dépôt en HTML/CSS/JS vanilla + le fichier `O-Bresse-standalone.html`
> ouvrable en double-clic. Cette version-ci nécessite React + un build.

## Stack
- React 19 + [@react-three/fiber](https://r3f.docs.pmnd.rs) 9 + [drei](https://github.com/pmndrs/drei) 10
- three.js 0.171 · Vite 6

## Lancer en local
```bash
cd r3f
npm install
npm run dev      # http://localhost:5173
```

## Build de production
```bash
npm run build    # génère r3f/dist/
npm run preview  # prévisualise le build
```
Le `dist/` est un site statique : déposez-le sur n'importe quel hébergeur
(Netlify, Vercel, GitHub Pages…). `base: './'` est déjà configuré pour un
sous-dossier.

## Structure
```
r3f/
├── index.html
├── vite.config.js
├── src/
│   ├── main.jsx      # point d'entrée
│   ├── App.jsx       # nav + hero 3D + sections (carte, avis, FAQ, contact)
│   ├── Scene.jsx     # scène 3D : broche (LatheGeometry), lumières, braises
│   └── styles.css    # charte O'Bresse (crème + braise)
└── public/           # enseigne.png, broche.mp4
```

## Personnaliser la broche 3D
Dans `src/Scene.jsx`, la constante `PROFILE` définit la silhouette de la broche
(paires `[hauteur, rayon]` pour le `LatheGeometry`). Les couleurs, l'intensité
des braises (`Sparkles`) et l'éclairage se règlent dans le même fichier.
