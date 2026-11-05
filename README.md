# Canettou : site de peluches canettes

Site statique (HTML, CSS, JavaScript vanilla), sans framework ni Shopify.

## Voir le site

```bash
npm install          # une seule fois (installe sharp pour les images)
npm run build        # génère /public
npm run dev          # génère puis ouvre http://localhost:4321
```

Ou ouvre directement `public/index.html` dans ton navigateur.

## Modifier le site

| Je veux changer… | Fichier |
|---|---|
| Prix, tailles, remises des packs, seuil de livraison, délais, email, infos société | `site/data.mjs` → `CONFIG` |
| Une peluche (nom, texte, couleur) ou en ajouter une | `site/data.mjs` → `PRODUCTS` |
| La FAQ | `site/data.mjs` → `FAQ` |
| Les pages légales | `site/legal.mjs` |
| Le design (couleurs, polices, espacements) | `site/assets/styles.css` (tokens en haut du fichier) |
| Le comportement (panier, filtres, fiche produit, pack) | `site/assets/app.js` |
| La structure des pages | `site/build.mjs` |

Après chaque modification : `npm run build`.

## Ajouter des photos

1. Mets la photo dans `images-source/`.
2. Ajoute la correspondance fichier → peluche dans `scripts/process-images.mjs` (`MAP`).
3. Lance `npm run images`, puis `npm run build`.
4. Dans `site/data.mjs`, mets `image: 'peluche-{slug}-face-1'` et retire `comingSoon: true`.

## Mettre en ligne

Le dossier `public/` se déploie tel quel sur Netlify, Vercel, GitHub Pages ou n'importe quel hébergeur statique.

## Ce qui reste à brancher

- **Paiement** : le bouton « Commander » affiche « bientôt ». Fonction `checkout()` dans `site/assets/app.js` (Stripe Checkout, Shopify Buy Button…).
- **Newsletter** : formulaire du pied de page (Brevo, Klaviyo…).
- **Avis clients** : section vide par défaut, aucun faux avis.

Tout ce qui manque est listé dans `docs/A-COMPLETER.md`.
