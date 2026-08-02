# O'Bresse — Site vitrine premium

Site vitrine one-page pour **O'Bresse — Broche Maison · 100% Veau**.
Design éditorial noir & blanc, animations au scroll, vidéo de la broche en boucle.

## Aperçu

- **Accueil** : photo de l'enseigne en plein écran avant le scroll
- **01 · La Broche** : vidéo de la broche qui tourne, en boucle continue
- **02 · La Carte** : menu façon carte gastronomique
- **03 · La Maison** : histoire + compteurs animés
- **04 · Contact** : adresse, horaires, réseaux

## Stack

- HTML / CSS / JavaScript vanilla — aucun build nécessaire
- [GSAP](https://gsap.com/) + ScrollTrigger (animations)
- [Lenis](https://github.com/darkroomengineering/lenis) (smooth scroll)
- Librairies **hébergées en local** dans `js/vendor/` → aucune dépendance CDN

## Lancer en local

Un simple serveur statique suffit (les navigateurs bloquent la lecture vidéo en `file://`) :

```bash
python3 -m http.server 8000
# puis ouvrir http://localhost:8000
```

## Personnaliser

| Élément | Où |
|---|---|
| Vidéo de la broche | remplacer `assets/broche.mp4` (H.264 recommandé) |
| Photo d'accueil | remplacer `assets/enseigne.png` |
| **Adresse / téléphone / horaires** | `index.html`, section `#contact` (cherchez le commentaire ⚙️) |
| Menu & prix | `index.html`, section `#menu` |
| Couleurs / typos | variables CSS en haut de `css/style.css` (`:root`) |
| Lien « Commander en ligne » | `href` des boutons CTA dans `index.html` |

### Structure

```
├── index.html
├── css/style.css
├── js/
│   ├── main.js
│   └── vendor/         # gsap, ScrollTrigger, lenis (locaux)
└── assets/
    ├── enseigne.png    # photo d'accueil
    └── broche.mp4      # vidéo de la broche (boucle)
```

## Notes

- La vidéo est en `.mp4` **H.264**, lue nativement par tous les navigateurs modernes
  (Chrome, Safari, Firefox, Edge, mobiles). Elle est en lecture automatique, muette et en boucle.
- Le site respecte `prefers-reduced-motion` (animations désactivées si l'utilisateur le demande).
- Les coordonnées de contact sont des **exemples à remplacer**.
