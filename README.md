# O'Bresse — Site vitrine premium

Site vitrine one-page pour **O'Bresse — Broche Maison · 100% Veau**.
Design éditorial noir & blanc, animations au scroll, vidéo de la broche en boucle.

## Aperçu

- **Accueil** : photo de l'enseigne en plein écran (pan au scroll qui révèle la devanture)
- **01 · La Broche** : vidéo de la broche qui tourne, en boucle continue
- **02 · La Carte** : carte complète (14 catégories · 56 produits) avec filtres
- **03 · Les Avis** : 6 avis Google 5★ + **note et nombre d'avis mis à jour automatiquement**
- **04 · Questions** : FAQ en accordéon
- **05 · Contact** : adresse, horaires, réseaux + **carte Google Maps**

## Note & nombre d'avis Google (mise à jour automatique)

La note (4,8 ★) et le nombre d'avis (27) affichés dans la section **Avis**
peuvent se mettre à jour tout seuls depuis la fiche Google du restaurant.
Par défaut, ils affichent les valeurs de repli (4,8 / 27) tant que ce n'est
pas configuré. Pour activer le direct :

1. Dans la [console Google Cloud](https://console.cloud.google.com/), activez
   **Places API (New)** et créez une **clé API** restreinte au domaine du site.
2. Récupérez le **Place ID** de la fiche O'Bresse
   ([Place ID Finder](https://developers.google.com/maps/documentation/places/web-service/place-id)).
3. Dans `js/main.js`, fonction `initGoogleRating()`, renseignez :
   ```js
   const CONFIG = { placeId: "VOTRE_PLACE_ID", apiKey: "VOTRE_CLE_API" };
   ```

Les **6 avis affichés restent fixes** (avis réels de la fiche Google) — seuls
la note globale et le compteur d'avis se synchronisent automatiquement.

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
