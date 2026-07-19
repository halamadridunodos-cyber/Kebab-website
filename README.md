# O'Bresse — Site vitrine

Site du snack **O'Bresse** (Montréal-la-Cluse) : broche maison 100 % veau, halal.
Design premium sombre & doré, **basé sur de vraies photos** (pas de 3D).

## Stack
- **React 18** + **Vite**
- **GSAP + Lenis** — scroll fluide et révélations au scroll
- **Framer Motion** — micro-interactions
- Photos importées et inlinées (build « fichier unique » possible)

## Développement
```bash
npm install
npm run dev       # dev
npm run build     # build de prod -> dist/
npm run build:html # fichier unique autonome -> dist-html/index.html
```

## Remplacer / ajouter des photos
Les photos sont dans `src/assets/` et référencées via `src/assets.js`.
Pour la galerie « En images » (`src/components/Prepa.jsx`), chaque produit
sans photo affiche « Photo à venir » — il suffit d'ajouter l'image et de la
brancher dans le tableau `PRODUITS`.
