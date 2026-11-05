# À compléter ou à vérifier

> Liste vivante, mise à jour à chaque phase. Rien de ce qui est listé ici n'a été inventé sur le site : chaque manque y apparaît sous la forme `[À COMPLÉTER : …]`.

## 🔴 Bloquant : marques déposées visibles sur TOUTES les photos

Les 12 photos montrent des logos et des noms de marques déposées **brodés sur les peluches elles-mêmes** :

| Fichier | Marques visibles |
|---|---|
| `peluche_redbull.jpeg`, `_rose`, `_blanche`, `_bleu` | Logo des deux taureaux, nom « Red Bull », « Energy Drink », mentions « The Pink / Coconut / Winter Edition » |
| `peluche_Celsius.jpeg` | Logo « C », nom « Celsius® », slogan « Live Fit » |
| `peluche_monster_*.jpeg` (7 photos) | Logo de la griffe « M », nom « Monster Energy », « Ultra White » |

Renommer les produits sur le site **ne suffit pas** : c'est le produit lui-même qui porte les marques. Vendre ces peluches sans licence des titulaires des marques, c'est de la contrefaçon en droit français (articles L713-2 et L716-9 du Code de la propriété intellectuelle). Les risques : retrait du site par Shopify, blocage de Shopify Payments et de PayPal, saisie des colis en douane, et poursuites des titulaires (ces trois marques sont connues pour défendre leurs droits).

À fournir AVANT la mise en ligne, l'un ou l'autre :
- [ ] une **licence** écrite des titulaires des marques (ou la preuve que ton fournisseur en a une) ;
- [ ] ou des **modèles sans logo ni nom de marque** (couleurs, visage et forme de canette conservés, avec ton propre logo brodé), et leurs vraies photos.

## 🔴 Les photos semblent générées par IA

Plusieurs détails font penser à des images générées et non à des photos de produits réels :
- `peluche_monster_noir.jpeg` : texte sans sens « NIKE JAST » en haut, et « ULTRA WHITE » sur une canette noire.
- `peluche_redbull_blanche.jpeg` et `peluche_redbull_bleu.jpeg` : faute « Bery » au lieu de « Berry ».

Si ces images ne montrent pas les peluches que tu vas réellement livrer, les utiliser pour vendre est une pratique commerciale trompeuse (article L121-2 du Code de la consommation), et c'est exactement l'objection n°1 du client (« est-ce qu'elle est aussi belle qu'en photo ? »).
- [ ] Confirmer que ce sont des photos des produits réels, ou fournir les photos du fournisseur ou les tiennes.

## 🟠 Photos manquantes

- [ ] Pétillante Tropicale : aucune photo
- [ ] Pétillante Fruits Rouges : aucune photo
- [ ] Pétillante Pêche : aucune photo
- [ ] Pour chacune des 15 peluches : dos, 3/4, gros plan broderie, photo d'échelle (en main ou sur un bureau), vidéo courte où on presse la peluche
- [ ] Photo de groupe « famille » de toutes les peluches (héros de l'accueil)
- [ ] Une photo de groupe par collection (tuiles de l'accueil)
- [ ] Photos des coulisses (page « Notre histoire »)
- [ ] Idéalement : toutes les photos sur le même fond et à 2048 px minimum (les Ultra font 1024 px, sur fond gris ; les autres 1254 px, sur fond blanc)

## 🟠 Variables du prompt (toutes vides)

- [ ] MARQUE (sinon je propose 10 noms en phase 1)
- [ ] DOMAINE
- [ ] TAILLES_VENDUES et PRIX
- [ ] REMISE_PACK_2 / PACK_3 (et PACK_5 éventuellement)
- [ ] BRODERIE_PRENOM : oui/non, prix (ton fournisseur sait-il le faire ?)
- [ ] EMBALLAGE_CADEAU : prix
- [ ] SEUIL_LIVRAISON
- [ ] PAYS_EXPEDITION et DELAIS_LIVRAISON
- [ ] DELAI_RETOUR
- [ ] OFFRE_NEWSLETTER
- [ ] HISTOIRE
- [ ] SOCIÉTÉ : raison sociale, forme, SIRET, adresse, TVA, directeur de publication
- [ ] EMAIL_CONTACT et DELAI_REPONSE
- [ ] MÉDIATEUR_CONSOMMATION
- [ ] CONFORMITE_CE : certificats EN71 du fournisseur
- [ ] AGE_MIN
- [ ] RÉSEAUX : liens TikTok et Instagram
- [ ] APPLI_AVIS

## 🟡 Outils

- [ ] Shopify CLI n'est pas installé sur ce PC (`npm install -g @shopify/cli`), et il faut une boutique Shopify (ou une boutique de développement Partner) pour `shopify theme dev`.
