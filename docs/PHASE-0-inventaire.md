# Phase 0 : inventaire et plan

> Réalisé le 5 novembre 2026. Les 12 images de `/images-source/` ont été regardées une par une.

## 1. Correspondance des images

| # | Fichier d'origine | Peluche identifiée | Vue | Format | Utilisation prévue |
|---|---|---|---|---|---|
| 1 | `peluche_redbull_rose.jpeg` | Édition Rose (rose fuchsia, pêche blanche) | Face | 1254×1254, fond blanc | Photo principale + pastille + carte produit |
| 2 | `peluche_redbull_blanche.jpeg` | Édition Coco (blanche et grise, coco-baies) | Face | 1254×1254, fond blanc | Photo principale + pastille + carte produit |
| 3 | `peluche_redbull_bleu.jpeg` | Édition Hiver (bleu vif, vanille glacée) | Face | 1254×1254, fond blanc | Photo principale + pastille + carte produit |
| 4 | `peluche_redbull.jpeg` | Édition Classique (bleu roi et blanc en diagonale) | Face | 1254×1254, fond blanc | Photo principale + pastille + carte produit |
| 5 | `peluche_Celsius.jpeg` | Pétillante Orange | Face | 1254×1254, fond blanc | Photo principale + pastille + carte produit |
| 6 | `peluche_monster_vert.jpeg` | Ultra Verte | Face | 1024×1024, fond gris clair | Photo principale + pastille + carte produit |
| 7 | `peluche_monster_violet.jpeg` | Ultra Violette | Face | 1024×1024, fond gris clair | Photo principale + pastille + carte produit |
| 8 | `peluche_monster_bleu.jpeg` | Ultra Bleue (griffe orange) | Face | 1024×1024, fond gris clair | Photo principale + pastille + carte produit |
| 9 | `peluche_monster_rose.jpeg` | Ultra Rose | Face | 1024×1024, fond gris clair | Photo principale + pastille + carte produit |
| 10 | `peluche_monster_blanc.jpeg` | Ultra Blanche (zéro sucre) | Face | 1024×1024, fond blanc | Photo principale + pastille + carte produit |
| 11 | `peluche_monster_organge.jpeg` | Ultra Orange | Face | 1024×1024, fond blanc | Photo principale + pastille + carte produit |
| 12 | `peluche_monster_noir.jpeg` | Ultra Noire (griffe verte) | Face | 1024×1024, fond gris clair | Photo principale + pastille + carte produit |

## 2. Renommage proposé (`peluche-{slug}-{vue}-{n}.webp`)

| Fichier d'origine | Nouveau nom |
|---|---|
| `peluche_redbull_rose.jpeg` | `peluche-edition-rose-face-1.webp` |
| `peluche_redbull_blanche.jpeg` | `peluche-edition-coco-face-1.webp` |
| `peluche_redbull_bleu.jpeg` | `peluche-edition-hiver-face-1.webp` |
| `peluche_redbull.jpeg` | `peluche-edition-classique-face-1.webp` |
| `peluche_Celsius.jpeg` | `peluche-petillante-orange-face-1.webp` |
| `peluche_monster_vert.jpeg` | `peluche-ultra-verte-face-1.webp` |
| `peluche_monster_violet.jpeg` | `peluche-ultra-violette-face-1.webp` |
| `peluche_monster_bleu.jpeg` | `peluche-ultra-bleue-face-1.webp` |
| `peluche_monster_rose.jpeg` | `peluche-ultra-rose-face-1.webp` |
| `peluche_monster_blanc.jpeg` | `peluche-ultra-blanche-face-1.webp` |
| `peluche_monster_organge.jpeg` | `peluche-ultra-orange-face-1.webp` |
| `peluche_monster_noir.jpeg` | `peluche-ultra-noire-face-1.webp` |

Les noms de fichiers web ne contiennent aucune marque déposée.

## 3. Manques constatés

- **3 peluches sans aucune photo** : Pétillante Tropicale, Pétillante Fruits Rouges, Pétillante Pêche.
- **Aucune photo de dos, de 3/4, de détail, d'échelle ni de vidéo** pour les 12 autres : une seule vue de face par peluche. Le survol « photo de dos » des cartes produit et la galerie à 6 vues de la fiche produit ne peuvent pas être remplis.
- **Aucune photo de groupe ni d'ambiance** : le héros de l'accueil (« photo de famille ») et les tuiles de collection n'ont pas d'image source.
- **Fonds différents** : les Éditions et la Pétillante sont sur blanc pur (1254 px), les Ultra sur gris clair (1024 px). Ça se verra dans une grille. Le prompt interdit de retoucher, donc je pose chaque photo sur une carte au fond teinté plutôt que de modifier le fond.
- **Définition** : 1024 px pour les Ultra, en dessous du master de 2048 px prévu. Aucun agrandissement : le master gardera la taille d'origine.

Le détail est dans `/docs/A-COMPLETER.md`.

## 4. Arborescence du site

```
Accueil
├── Toutes les peluches            /collections/peluches-canettes
├── Collections ▾
│   ├── Éditions                   /collections/peluches-canettes-editions
│   ├── Pétillante                 /collections/peluches-canettes-petillante
│   └── Ultra                      /collections/peluches-canettes-ultra
├── Packs                          /pages/creer-mon-pack
├── Porte-clés                     /collections/porte-cles-canettes   (si vendus)
├── Idées cadeaux                  /collections/idees-cadeaux
├── Notre histoire                 /pages/notre-histoire
├── Aide
│   ├── FAQ                        /pages/faq
│   ├── Livraison                  /pages/livraison
│   ├── Retours et remboursement   /pages/retours
│   ├── Suivi de commande          /pages/suivi-de-commande
│   ├── Contact                    /pages/contact
│   └── Guide des tailles          /pages/guide-des-tailles
├── Blog                           /blogs/journal (5 articles)
├── Légal : mentions légales, CGV, confidentialité, cookies   /policies/* + /pages/*
├── Fiche produit                  /products/peluche-canette-{slug}
├── Panier (tiroir + page)         /cart
├── Recherche, 404, compte client
└── Design system (non indexée)    /pages/design-system
```

## 5. Fichiers que je vais créer

```
/theme/                              thème Dawn personnalisé (Online Store 2.0)
  assets/
    pl-tokens.css                    design tokens
    pl-base.css                      composants communs (boutons, badges, cartes…)
    pl-{section}.css                 un fichier par section
    pl-{composant}.js                web components : pl-variant-picker, pl-gallery,
                                     pl-pack-builder, pl-cart-drawer, pl-delivery-estimate,
                                     pl-embroidery-preview, pl-sticky-atc, pl-quick-add…
    pl-logo.svg
  sections/
    pl-announcement-bar, pl-header, pl-footer, pl-mega-menu
    pl-hero, pl-trust-bar, pl-bestsellers, pl-collection-tiles, pl-benefits,
    pl-pack-banner, pl-ugc-wall, pl-reviews, pl-gift-guide, pl-faq, pl-seo-text
    pl-main-product, pl-complete-collection, pl-bought-together
    pl-main-collection, pl-collection-banner
    pl-pack-builder, pl-cart-drawer, pl-main-cart
    pl-size-guide, pl-story, pl-legal-page, pl-article, pl-404, pl-design-system
  snippets/
    pl-product-card, pl-swatch, pl-badge, pl-price, pl-stars, pl-breadcrumb,
    pl-payment-icons, pl-reassurance, pl-jsonld-{organization,product,faq,breadcrumb,article}
  templates/
    index.json, collection.json, product.json, product.porte-cles.json,
    page.pack.json, page.faq.json, page.contact.json, page.size-guide.json,
    page.story.json, page.legal.json, page.design-system.json,
    cart.json, search.json, 404.json, article.json, blog.json
  locales/fr.default.json
/scripts/process-images.mjs          traitement des images (sharp)
/images-web/                         images traitées + manifest.json
/data/products_import.csv, /data/collections.md
/docs/INSTALLATION.md, APPS.md, A-COMPLETER.md, QA.md, reponses-avis.md
/docs/blog/                          5 brouillons d'articles
```
