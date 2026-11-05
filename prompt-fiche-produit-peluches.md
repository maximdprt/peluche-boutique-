# Prompt : fiche produit Shopify pour peluches canettes

> Copie tout le bloc « PROMPT » ci-dessous dans ChatGPT, Claude ou ton développeur, en joignant la capture d'écran de la fiche Samsonite comme référence visuelle.
> Remplace les valeurs entre [CROCHETS] par les tiennes avant de l'envoyer.

---

## PROMPT

```
RÔLE
Tu es un développeur front-end Shopify senior et un designer UX e-commerce. Tu crées une section de fiche produit pour une boutique Shopify (thème Online Store 2.0) qui vend des peluches en forme de canettes de boissons énergisantes.

RÉFÉRENCE VISUELLE
Je te joins une capture d'écran d'une fiche produit de valise Samsonite. Reprends EXACTEMENT sa structure et sa clarté, puis personnalise-la pour des peluches (détails plus bas).

Structure de la référence à reproduire :
- Écran desktop coupé en deux : à GAUCHE, 2 grandes photos produit côte à côte sur fond gris très clair (#F5F5F5), et à DROITE, la colonne d'achat.
- Un badge de réduction rouge « -45 % » en haut à gauche de la première photo.
- En haut de la colonne d'achat : un badge bleu plein « #37 Meilleure vente », puis un lien texte bleu vers la catégorie (« Valise 4 roues »).
- Le nom de la marque en très gros et en gras, puis le nom du produit en dessous, en gris, plus fin.
- La note en étoiles (4,5), un séparateur vertical, puis le lien « 2 Avis » qui fait défiler jusqu'aux avis.
- Le prix en rouge et en gras (« 246,95 € »), suivi de « Taxes incluses. » en petit gris.
- La ligne « Au lieu de : 449,00 € » (barré) suivie de « (-45 %) » en rouge.
- « Couleur : dune » : le libellé, puis le nom de la couleur choisie en gras.
- Les pastilles de couleur sont de VRAIES MINIATURES du produit dans chaque couleur, pas des ronds de couleur. La pastille choisie a une bordure noire de 2 px. Une couleur en rupture est barrée d'une diagonale grise.
- « Taille : 75 cm x 50 cm x 28 cm » : le libellé, puis les dimensions exactes de la taille choisie.
- Les boutons de taille sont rectangulaires avec une bordure grise fine. Le bouton choisi a une bordure noire de 2 px.
- Le bouton « Ajouter au panier » est noir, en pleine largeur, très arrondi (en forme de pilule), avec une icône de sac.

========================================
PERSONNALISATION « PELUCHES »
========================================

1. IDENTITÉ VISUELLE
- Marque : [NOM_DE_MA_MARQUE]. Style « kawaii premium » : propre et sobre comme la référence, mais plus doux.
- Coins arrondis partout (16 px pour les cartes, 999 px pour les boutons), police ronde et lisible (par ex. « Nunito » ou « Quicksand » pour les titres, « Inter » pour le texte).
- ACCENT DYNAMIQUE : chaque couleur de peluche a sa propre couleur d'accent, stockée dans un metafield. Quand le client change de peluche, l'accent change en douceur (transition de 300 ms) sur :
  • le fond des photos (une teinte très pâle de l'accent, par ex. rose pâle pour l'édition rose) ;
  • la bordure de la pastille choisie ;
  • le badge « Meilleure vente » ;
  • le bouton « Ajouter au panier » au survol.
- Le bouton principal reste noir par défaut, pour garder l'aspect premium de la référence.
- Micro-animation : quand on change de couleur, la photo principale fait un petit rebond (de 0,96 à 1 en 250 ms). Désactive-la si l'utilisateur a choisi de réduire les animations (prefers-reduced-motion).

2. GALERIE (colonne de gauche)
- Desktop : 2 photos côte à côte (face et dos), comme la référence, avec en dessous une grille de 2 colonnes pour les photos suivantes.
- Photos à prévoir pour chaque couleur : face, dos, profil 3/4, gros plan sur la broderie et le visage, photo d'échelle (peluche tenue en main ou posée sur un bureau gamer), et une courte vidéo en boucle (la peluche qu'on presse, pour montrer le moelleux).
- Au survol, la photo zoome sur la texture (zoom 2x qui suit la souris). Au clic, elle s'ouvre en plein écran.
- Mobile : un carrousel qu'on fait défiler du doigt, avec des points de pagination et un compteur « 1/6 ».
- Changer de couleur remplace TOUTE la galerie par les photos de cette couleur. Les photos de chaque variante sont associées via le « variant image » Shopify ou un metafield.
- Badges sur la photo, en haut à gauche, empilés : « -XX % » (rouge), « Nouveau » (noir), « Édition limitée » (couleur d'accent). Chacun ne s'affiche que si les données le justifient.

3. EN-TÊTE DE LA COLONNE D'ACHAT
- Le badge « #[RANG] Meilleure vente » vient d'un metafield (par ex. product.metafields.custom.bestseller_rank). Il est masqué si le champ est vide.
- Le lien de collection est cliquable (par ex. « Collection Energy » ou « Peluches canettes »).
- Le nom de la marque en gros, puis le nom de la peluche (par ex. « Peluche canette — Édition Rose »).
- Les étoiles et le nombre d'avis viennent de mon appli d'avis ([Judge.me / Loox / autre]). Le lien fait défiler jusqu'à la section des avis.

4. PRIX
- Le prix actuel en rouge, mais SEULEMENT s'il y a un prix barré (compare_at_price). Sinon, il s'affiche en noir.
- « Au lieu de : XX,XX € (-XX %) » s'affiche uniquement si compare_at_price est plus grand que price. Le pourcentage est calculé automatiquement.
- Sous le prix, une ligne de paiement en plusieurs fois, si l'appli est installée : « ou 3x X,XX € sans frais ».
- Le prix se met à jour en direct selon la couleur, la taille et le pack choisis.

5. SÉLECTEUR DE COULEUR (le cœur de la page)
- Libellé : « Couleur : [Nom de la variante en gras] », par ex. « Couleur : Édition Rose ».
- Les pastilles sont des MINIATURES de la peluche (environ 88x88 px desktop, 72 px mobile), sur fond gris clair, comme sur la référence.
- La pastille choisie a une bordure de 2 px dans la couleur d'accent et une légère ombre.
- Survoler une pastille sur desktop affiche une infobulle avec le nom ET un aperçu de la photo principale.
- Les pastilles sont REGROUPÉES PAR COLLECTION, chaque groupe avec un petit titre gris (par ex. « Éditions fruitées », « Éditions classiques ») et un défilement horizontal sur mobile si besoin.
- Une couleur en rupture de stock a une diagonale grise, une opacité de 50 %, et elle reste cliquable : la cliquer remplace le bouton d'achat par « Me prévenir du retour ».
- Changer de couleur met à jour l'URL (?variant=ID) sans recharger la page, pour que chaque couleur ait son propre lien partageable.

6. SÉLECTEUR DE TAILLE
- Libellé : « Taille : [hauteur exacte en cm] », par ex. « Taille : 22 cm de hauteur ».
- Boutons rectangulaires arrondis, comme la référence, avec 2 lignes de texte :
  • « Porte-clés » / « 12 cm »
  • « Classique » / « 22 cm »
  • « XL » / « 35 cm »
  • « Géante » / « 50 cm »
- Un petit lien « Guide des tailles » ouvre une fenêtre avec une illustration des 4 tailles à côté d'une vraie canette de 33 cl et d'une main, pour donner l'échelle.
- Une taille indisponible pour la couleur choisie est barrée et grisée.

7. OPTIONS EN PLUS (spécifiques aux peluches)
a) PACK (pour faire grimper le panier moyen)
   - 3 cartes à choisir : « 1 peluche », « Pack de 2 (-15 %) » avec le badge « Le plus choisi », et « Pack de 3 (-25 %) ».
   - Dans un pack, le client choisit chaque peluche dans un mini sélecteur de miniatures.
b) PERSONNALISATION (optionnelle)
   - Une case « Ajouter un prénom brodé (+[X] €) », qui ouvre un champ texte (12 caractères maximum, avec un compteur).
   - Un APERÇU EN DIRECT : le prénom tapé apparaît sur la photo principale, à l'endroit de la broderie, dans une police ronde.
   - Le prénom est enregistré comme propriété de ligne de commande Shopify (properties[Prénom]).
c) EMBALLAGE CADEAU
   - Une case « Emballage cadeau + carte message (+[X] €) », avec un champ message facultatif.

8. BOUTON D'ACHAT ET INFOS SOUS LE BOUTON
- « Ajouter au panier » : noir, pleine largeur, en forme de pilule, avec une icône de sac, exactement comme la référence.
- Au clic, un tiroir panier s'ouvre sur le côté (sans changer de page), avec une barre de progression « Plus que X € pour la livraison offerte ».
- Sous le bouton, une estimation de livraison calculée en JavaScript : « Commandez avant 14h → livré entre le [date] et le [date] ». Les dates sautent les dimanches et les jours fériés français.
- Un indicateur de stock : « En stock » (pastille verte), ou « Plus que X en stock » (orange) seulement si le stock réel est inférieur à 5. Jamais de faux stock.
- 4 réassurances avec icônes, en grille de 2x2 : « Livraison offerte dès [X] € », « Retours gratuits [X] jours », « Paiement sécurisé », « Expédié depuis [PAYS] ». N'affiche QUE ce qui est vrai.
- Les logos de paiement : CB, Visa, Mastercard, PayPal, Apple Pay, Google Pay.

9. SOUS LA ZONE D'ACHAT
- Des accordéons, avec le premier ouvert :
  • Description (mise en avant des bénéfices : ultra douce, cadeau idéal, déco de chambre ou de bureau gamer)
  • Matières et entretien (polyester doux, ouate, lavable en machine à 30 °C dans un filet)
  • Dimensions (selon la taille)
  • Sécurité (marquage CE et normes EN71 si c'est le cas, âge conseillé)
  • Livraison et retours
- « Complète ta collection » : un carrousel des autres peluches avec ajout rapide au panier.
- « Souvent achetés ensemble » : la peluche + le porte-clés assorti + l'emballage cadeau, avec une seule case à cocher et un bouton « Tout ajouter ».
- La section avis, avec photos de clients, filtres par note et un résumé de la note.

10. MOBILE (la priorité : la majorité du trafic vient de TikTok et d'Instagram)
- Ordre d'affichage : carrousel de photos, nom, prix, couleur, taille, options, bouton.
- Une BARRE D'ACHAT COLLANTE en bas de l'écran apparaît quand le bouton principal sort de l'écran. Elle affiche la miniature de la couleur choisie, le prix et le bouton « Ajouter ».
- Toutes les zones cliquables font au moins 44 px de haut.

========================================
CONTRAINTES TECHNIQUES
========================================
- Livrable : une section Shopify OS 2.0 « main-product-plush.liquid » avec son schéma JSON (réglages éditables dans l'éditeur de thème : couleurs, textes de réassurance, seuil de livraison gratuite, prix de la personnalisation et de l'emballage, remises des packs), un fichier CSS et un fichier JavaScript vanilla, sans jQuery ni bibliothèque lourde.
- Options de variante Shopify : Option 1 = « Couleur », Option 2 = « Taille ».
- Metafields à créer et à utiliser :
  • product.metafields.custom.bestseller_rank (nombre entier)
  • variant.metafields.custom.accent_color (couleur)
  • variant.metafields.custom.swatch_image (fichier image)
  • variant.metafields.custom.swatch_group (texte, le groupe de pastilles)
  • variant.metafields.custom.height_cm (nombre)
- Accessibilité : les sélecteurs sont des boutons radio accessibles, avec navigation au clavier, focus visible et textes alternatifs sur toutes les images.
- Performance : chargement différé des images (sauf la première), formats WebP ou AVIF, aucune bibliothèque JavaScript externe.
- Donne aussi un FICHIER HTML AUTONOME DE DÉMO, avec des données fictives (6 couleurs, 4 tailles), pour que je puisse voir le rendu dans mon navigateur avant de l'installer sur Shopify.

========================================
CONFORMITÉ (obligatoire)
========================================
- Prix barré : c'est le prix le plus bas pratiqué dans les 30 jours précédant la réduction (Code de la consommation, article L112-1-1). Pas de faux prix barré permanent.
- Pas de faux compteur de stock, pas de faux avis, pas de faux minuteur.
- Le rang « Meilleure vente » doit correspondre à de vraies ventes.
- N'utilise aucun logo ni nom de marque déposée (Red Bull, Monster, Celsius…) dans le code, les données de démo ou les textes.

ORDRE DE LIVRAISON
1. La démo HTML autonome.
2. La section Liquid, le CSS et le JavaScript.
3. Le guide d'installation pas à pas (création des metafields, ajout de la section au template produit, remplissage des données).
```

---

## Données à préparer avant de lancer le prompt

| Donnée | Exemple |
|---|---|
| Nom de marque | [NOM_DE_MA_MARQUE] |
| Couleurs + accent | Édition Rose `#E8358A`, Édition Coco `#9A9A9A`, Édition Hiver `#2E8BE6`… |
| Tailles + prix | Porte-clés 12 cm : 9,99 € · Classique 22 cm : 19,99 € · XL 35 cm : 29,99 € |
| Photos par couleur | face, dos, 3/4, détail, échelle, vidéo (fond identique pour toutes) |
| Miniature de pastille | 1 photo de face sur fond clair, en carré, par couleur |
| Appli d'avis | Judge.me (gratuite) ou Loox (avis avec photos) |
| Remises des packs | 2 = -15 %, 3 = -25 % |
| Seuil de livraison gratuite | 35 € |
