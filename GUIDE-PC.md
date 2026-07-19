# 🥙 O'Bresse — Guide d'installation sur PC

Ce guide t'explique, étape par étape, comment **ouvrir**, **modifier** et **mettre en ligne** ton site,
et comment activer **Magic** sur ta machine. Pas besoin d'être développeur : suis les blocs dans l'ordre.

> Dépôt GitHub : `halamadridunodos-cyber/kebab-website`
> Branche du site : `claude/kebab-3d-animations-v1rd2a`

---

## 🟢 Option A — Juste voir le site (le plus simple, 30 secondes)

1. Récupère le fichier **`obresse.html`** (celui que je t'envoie dans le chat).
2. **Double-clique** dessus → il s'ouvre dans ton navigateur.

C'est tout. Ce fichier est **autonome** (tout est dedans). Aucune installation.
👉 Seule limite : c'est une "photo" figée du site, tu ne peux pas l'éditer facilement. Pour modifier, passe à l'option B.

---

## 🛠️ Option B — Modifier le site sur ton PC

### 1. Installer les outils (une seule fois)

| Outil | À quoi ça sert | Lien |
|-------|----------------|------|
| **Node.js** (version LTS) | Faire tourner le site en local | https://nodejs.org |
| **Git** | Récupérer le projet | https://git-scm.com |
| **VS Code** (éditeur) | Modifier les textes/fichiers | https://code.visualstudio.com |
| **Claude Code** | M'utiliser sur ton PC | https://claude.com/claude-code |

> Sur **Windows**, pendant l'install de Node.js, laisse les options par défaut.
> Après installation, **redémarre** ton terminal (PowerShell / Terminal).

### 2. Récupérer le projet

Ouvre un terminal (PowerShell sur Windows, Terminal sur Mac) et tape :

```bash
git clone https://github.com/halamadridunodos-cyber/kebab-website.git
cd kebab-website
git checkout claude/kebab-3d-animations-v1rd2a
```

### 3. Installer les dépendances (une fois)

```bash
npm install
```

### 4. Lancer le site en local (mode aperçu en direct)

```bash
npm run dev
```

Le terminal affiche une adresse du type `http://localhost:5173`.
Ouvre-la dans ton navigateur → le site s'affiche, et **il se met à jour tout seul** quand tu modifies un fichier. Pour arrêter : `Ctrl + C`.

### 5. Régénérer le fichier unique (à donner / héberger)

```bash
npm run build:html
```

→ crée `dist-html/index.html` : le fichier autonome, comme `obresse.html`.

---

## 🖼️ Remplacer / ajouter des photos

1. Mets tes photos dans le dossier **`src/assets/`** (ex. `tacos.jpg`, `burger.jpg`).
2. Ouvre **`src/assets.js`** et ajoute-les :
   ```js
   import tacos from './assets/tacos.jpg';
   export const PHOTOS = { hero: kebab, broche: brocheMachine, kebab, tacos /* ... */ };
   ```
3. Ouvre **`src/components/Prepa.jsx`** (galerie) et remplace `img: null` par `img: PHOTOS.tacos` sur la ligne du produit.
4. Relance `npm run dev` pour voir le résultat.

> Astuce cadrage : prends la photo avec le produit **bien au centre**. Les cartes recadrent depuis le centre.

**Ou plus simple** : envoie-moi les photos dans le chat, je les intègre et te renvoie le fichier. 😉

---

## ✨ Activer Magic sur ton PC

Une fois **Node.js** et **Claude Code** installés :

```bash
# Colle ta VRAIE clé (copiée sur https://21st.dev/magic-chat)
claude mcp add magic --scope user --env "API_KEY=TA_CLE" -- npx -y @21st-dev/magic@latest

# Vérifier : doit afficher "magic - ✓ Connected"
claude mcp list
```

Puis **redémarre Claude Code** (nouvelle session). Ensuite tu peux écrire par ex. :
`/ui une section menu premium` et Magic génère le composant.

> ⚠️ La config Magic faite pendant notre échange était sur un serveur temporaire : elle **ne suit pas** sur ton PC. Il faut relancer la commande ci-dessus **sur ta machine**.

---

## 🌍 Mettre le site en ligne (gratuit)

Le plus simple, sans compte technique :

1. Va sur **https://app.netlify.com/drop**
2. **Glisse-dépose** le fichier `obresse.html` (renomme-le d'abord en `index.html`).
3. Netlify te donne une **adresse web** immédiate. Tu peux ensuite y brancher ton nom de domaine.

Autres options : **Vercel**, **GitHub Pages**, ou l'hébergeur de ton choix (upload du fichier `index.html`).

---

## 🆘 Petits soucis fréquents

| Problème | Solution |
|----------|----------|
| `npm : commande introuvable` | Node.js pas installé ou terminal pas redémarré |
| `git : commande introuvable` | Installe Git puis redémarre le terminal |
| Le site est tout noir | Attends le préchargement (2 s) ; vérifie la connexion (les polices Google se chargent en ligne) |
| Magic « host not reachable » | Vérifie ta connexion Internet et ta clé API |
| Une commande bloque | `Ctrl + C` pour arrêter, puis relance |

---

## 📞 Infos du restaurant (déjà dans le site)

- **O'Bresse** — 2 Av. de Bresse, 01460 Montréal-la-Cluse
- **Téléphone** : +33 6 51 28 06 74
- **Horaires** : 7j/7 · 11h–14h & 17h30–23h
- **Instagram** : https://www.instagram.com/obresse01
- **TikTok** : https://www.tiktok.com/@obresse2

---

*Besoin d'aide ? Reviens me voir dans Claude Code sur ton PC, ou envoie-moi ce qui bloque.*
