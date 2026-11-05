# Prompt maître : générer la boutique Shopify complète de peluches canettes

> **Mode d'emploi (pour toi, pas pour l'IA)**
> 1. Dans ton projet, place les images dans un dossier `/images-source/` et les deux fichiers .md (`analyse-sac-cabine.md` et `prompt-fiche-produit-peluches.md`) dans un dossier `/docs/`.
> 2. Remplis le **tableau des variables** en fin de fichier. Tout ce que tu laisses vide sera marqué `[À COMPLÉTER]` sur le site, rien ne sera inventé.
> 3. Copie tout le bloc « PROMPT » dans ton IDE (Cursor, Claude Code, Windsurf…), avec le tableau des variables rempli.
> 4. L'IA travaille **par phases** et s'arrête à chaque point de contrôle ⛔ pour que tu valides.

---

## PROMPT

```
############################################
# RÔLE ET MISSION
############################################
Tu es une équipe e-commerce complète réunie en un seul agent :
- un développeur Shopify senior (thèmes Online Store 2.0, Liquid, JSON templates, Shopify CLI) ;
- un designer UI/UX spécialisé en conversion mobile ;
- un copywriter français spécialisé en e-commerce et en SEO ;
- un responsable conformité e-commerce en France et dans l'UE.

Ta mission : construire de A à Z une boutique Shopify complète, prête à être mise en ligne, qui vend des PELUCHES EN FORME DE CANETTES DE BOISSONS ÉNERGISANTES (style kawaii, avec bras, pieds et visage brodé). Le site doit inspirer une confiance immédiate et convertir aussi bien que les meilleurs sites de sa catégorie.

############################################
# FICHIERS FOURNIS : LIS-LES AVANT TOUT
############################################
1. /docs/analyse-sac-cabine.md
   → Analyse d'un site Shopify qui convertit très bien. Applique ses 7 LEVIERS (bénéfice clair, marque forte, objection n°1 traitée, empilement de garanties, preuve sociale, offre et urgence HONNÊTES, angle cadeau). N'applique AUCUN des points faibles listés dans sa section 4.
2. /docs/prompt-fiche-produit-peluches.md
   → Spécification COMPLÈTE de la fiche produit. Suis-la à la lettre : c'est la page la plus importante du site.
3. /images-source/
   → Toutes les photos des peluches (photos e-commerce sur fond propre, plus les photos d'ambiance d'origine).

Règle : ces fichiers sont la source de vérité. En cas de conflit entre ce prompt et le fichier de la fiche produit, c'est le fichier de la fiche produit qui l'emporte pour la page produit.

############################################
# RÈGLES DE TRAVAIL (non négociables)
############################################
- N'INVENTE AUCUN FAIT : prix, délais, adresse, SIRET, nombre de clients, note moyenne, avis, stocks, labels. Si une info manque dans les VARIABLES, écris `[À COMPLÉTER : description]` et ajoute-la à /docs/A-COMPLETER.md.
- Aucun faux avis, faux compteur de clients, faux stock, faux minuteur ni faux prix barré.
- NE MODIFIE JAMAIS l'apparence des produits sur les images. Tu as le droit de recadrer, redimensionner, compresser et convertir le format, c'est tout. Pas de retouche des couleurs, des logos ou des formes.
- Conserve les fichiers originaux : toute image transformée va dans un nouveau dossier.
- Travaille par phases. À chaque ⛔ POINT DE CONTRÔLE, arrête-toi, résume ce qui est fait et attends que je valide.
- Fais un commit git par phase, avec un message clair.
- Tous les textes du site sont en français, avec le tutoiement (la cible : 13-30 ans, gamers, fans de TikTok, et parents ou proches qui cherchent un cadeau).
- Code propre, commenté en français, sans dépendance JavaScript lourde (pas de jQuery, pas de framework front).

############################################
# STACK TECHNIQUE
############################################
- Thème de base : Dawn (dernière version stable, clonée depuis github.com/Shopify/dawn), puis fortement personnalisé. Garde la compatibilité Online Store 2.0 : sections et blocs éditables dans l'éditeur de thème.
- Outils : Shopify CLI (`shopify theme dev` pour l'aperçu local, `shopify theme check` pour la qualité, `shopify theme push --unpublished` pour l'envoi).
- Les nouvelles sections sont préfixées `pl-` (par ex. `pl-hero.liquid`, `pl-main-product.liquid`) pour les distinguer de celles de Dawn.
- CSS : variables CSS (design tokens) dans un fichier `pl-tokens.css`, puis un fichier CSS par section, chargé uniquement si la section est présente.
- JavaScript : modules vanilla en web components (`<pl-variant-picker>`, `<pl-pack-builder>`, `<pl-cart-drawer>`…), en defer.
- Images : WebP ou AVIF, via `image_url` et `image_tag` de Shopify, avec srcset et chargement différé (sauf l'image du héros et la première photo produit).

############################################
# PHASE 0 : INVENTAIRE ET PLAN
############################################
1. Lis les deux fichiers .md et liste toutes les images de /images-source/.
2. Regarde CHAQUE image et identifie la peluche qu'elle montre. Produis un tableau de correspondance :
   | fichier d'origine | peluche identifiée | vue (face, dos, 3/4, détail, ambiance, groupe) | utilisation prévue |
3. Propose un renommage selon la convention `peluche-{slug}-{vue}-{n}.webp` (par ex. `peluche-edition-rose-face-1.webp`).
4. Repère les MANQUES : quelles peluches n'ont pas de photo de dos, de détail ou d'échelle. Liste-les dans /docs/A-COMPLETER.md.
5. Donne le plan de l'arborescence du site et la liste des fichiers que tu vas créer.
⛔ POINT DE CONTRÔLE 0 : j'attends ta correspondance des images et ton plan avant toute suite.

############################################
# CATALOGUE (15 peluches)
############################################
IMPORTANT : sur le site, n'utilise AUCUN nom ni logo de marque déposée (Red Bull, Monster, Celsius…) dans les titres, descriptions, balises, URL, textes alternatifs ou données structurées. Utilise les noms neutres ci-dessous, ou ceux de la variable NOMS_PRODUITS si je les ai remplis.

Collection « Éditions » (canettes fines, gros texte vertical, rebord en feutrine grise) :
  1. Édition Rose (rose fuchsia, saveur pêche blanche)
  2. Édition Coco (blanche et grise, coco-baies)
  3. Édition Hiver (bleu vif, vanille glacée)
  4. Édition Classique (bleu roi et blanc en diagonale, regard déterminé)

Collection « Pétillante » (corps blanc, couvercle noir, pieds gris) :
  5. Pétillante Orange
  6. Pétillante Tropicale
  7. Pétillante Fruits Rouges
  8. Pétillante Pêche

Collection « Ultra » (canettes rondes et dodues, grosse griffe brodée) :
  9. Ultra Verte
  10. Ultra Violette
  11. Ultra Bleue (griffe orange)
  12. Ultra Rose
  13. Ultra Blanche (zéro sucre)
  14. Ultra Orange
  15. Ultra Noire (griffe verte)

STRUCTURE PRODUIT DANS SHOPIFY : choisis l'option la plus adaptée, justifie ton choix et attends ma validation au point de contrôle 1.
  Option A : 1 produit par collection, avec Option 1 = Couleur et Option 2 = Taille.
  Option B : 1 produit par peluche, relié aux autres par des « produits combinés » (metafield de liste de produits), affichés en pastilles comme des couleurs. C'est meilleur pour le SEO : une page et une URL par peluche.
  → Recommandation par défaut : l'option B.

TAILLES ET PRIX : voir les VARIABLES (par défaut : Porte-clés 12 cm, Classique 22 cm, XL 35 cm. N'active que les tailles que je peux réellement vendre).

############################################
# PHASE 1 : DESIGN SYSTEM ET IDENTITÉ
############################################
Crée `pl-tokens.css` et une page de démo `/pages/design-system` (non indexée) qui affiche tous les composants.

DIRECTION ARTISTIQUE : un « kawaii premium ». La rigueur et la propreté d'une grande enseigne (comme la fiche Samsonite de référence), la douceur et le fun d'une marque de peluches. Beaucoup d'espace blanc, et les photos produit sont les stars.

DESIGN TOKENS :
- Couleurs de base : texte #111111, texte secondaire #6B6B6B, fond #FFFFFF, fond doux #F6F5F3, bordures #E6E4E0, promo et prix barré #E3262F, succès #1F9D55, alerte stock #E8890C, badge « Meilleure vente » #3B4FD8.
- Couleurs d'accent par peluche (metafield `accent_color`) : Rose #E8358A, Coco #8C8C8C, Hiver #2E8BE6, Classique #1F3FA0, Orange #F28C28, Tropicale #F5A524, Fruits Rouges #D7263D, Pêche #FF6F59, Verte #7AC943, Violette #6B3FA0, Bleue #29A3E0, Rose Ultra #F4A6C1, Blanche #BDBDBD, Orange Ultra #FF6A13, Noire #1A1A1A.
  → Pour chaque accent, calcule automatiquement une version très pâle pour les fonds (mélange à 8 % avec du blanc) et vérifie le contraste AA du texte posé dessus.
- Typographies (Google Fonts, auto-hébergées via Shopify si possible) : titres en « Nunito » 800 et 900, texte en « Inter » 400, 500 et 600.
- Échelle typographique fluide avec clamp() : H1 de 32 à 56 px, H2 de 26 à 40 px, H3 de 20 à 24 px, corps 16 px, petit texte 13 px.
- Rayons : petits 8 px, cartes 16 px, grandes cartes 24 px, boutons et pastilles 999 px.
- Ombres très douces (0 4px 20px rgba(0,0,0,.06)), jamais de bordures dures épaisses.
- Espacements en base 4 (4, 8, 12, 16, 24, 32, 48, 64, 96).
- Animations de 200 à 300 ms, en ease-out. Toujours un repli sans animation pour `prefers-reduced-motion`.

COMPOSANTS À CRÉER : boutons (principal noir en pilule, secondaire avec contour, lien), badges (promo, nouveau, meilleure vente, édition limitée, rupture), carte produit, pastilles de miniatures, sélecteur de taille, champ texte, case à cocher, accordéon, onglets, modale, tiroir, info-bulle, barre de progression, étoiles de notation, fil d'Ariane, pagination, toast de confirmation, squelettes de chargement.

TON DE VOIX : fun, chaleureux et rassurant, avec le tutoiement. Phrases courtes, émojis très rares (maximum 1 par bloc, jamais dans les titres SEO).

Si la variable MARQUE est vide, propose 10 noms de marque (courts, prononçables, sans marque déposée, avec un nom de domaine .fr ou .com probablement disponible), puis utilise temporairement le premier. Crée aussi un logo texte en SVG (wordmark en Nunito 900, avec un petit élément graphique en forme de canette ou de goutte).
⛔ POINT DE CONTRÔLE 1 : présente le design system, la structure produit choisie et les noms de marque.

############################################
# PHASE 2 : TRAITEMENT DES IMAGES
############################################
Écris un script Node (`/scripts/process-images.mjs`, avec la librairie sharp) qui :
- prend /images-source/ et produit /images-web/ ;
- renomme selon la convention validée en phase 0 ;
- produit pour chaque image : un master WebP de 2048 px de côté max (qualité 82), une miniature de pastille carrée de 300 px, et une image Open Graph de 1200x630 ;
- ne modifie NI les couleurs NI le contenu (pas de filtre, pas d'accentuation agressive) ;
- génère un rapport `/images-web/manifest.json` (fichier, peluche, vue, dimensions, poids).

############################################
# PHASE 3 : ARCHITECTURE ET PAGES
############################################
EN-TÊTE (sur toutes les pages)
- Barre d'annonce défilante, éditable : « Livraison offerte dès [SEUIL_LIVRAISON] € », « Retours gratuits [DELAI_RETOUR] jours », « Expédié depuis [PAYS_EXPEDITION] ». N'affiche QUE ce qui est vrai.
- Logo centré sur mobile, à gauche sur desktop.
- Menu : Toutes les peluches · Collections ▾ (méga-menu avec une miniature par collection et 3 best-sellers) · Packs · Porte-clés · Idées cadeaux · Notre histoire · Aide.
- À droite : recherche prédictive (avec miniatures), compte, panier avec compteur animé.
- Sur mobile, un menu latéral avec de grandes miniatures des collections.

PIED DE PAGE
- Inscription à la newsletter : « -10 % sur ta 1ʳᵉ commande » (seulement si la variable OFFRE_NEWSLETTER est remplie).
- 4 colonnes : Boutique, Aide (FAQ, Livraison, Retours, Suivi de commande, Contact, Guide des tailles), Marque (Notre histoire, Blog, Avis clients), Légal (Mentions légales, CGV, Confidentialité, Cookies).
- Réseaux sociaux (TikTok et Instagram en premier), logos de paiement, sélecteur de pays et de devise, et « © [ANNÉE] [MARQUE] ».
- Le nom de la société et la ville en clair (pour la confiance).

PAGES À CRÉER (template JSON et sections pour chacune) :

1) ACCUEIL (index.json), dans cet ordre :
   a. HÉROS : une vidéo ou photo plein écran montrant toutes les peluches en rangée, façon photo de famille (utilise les photos de groupe d'origine).
      H1 : par ex. « Les peluches canettes les plus douces de France » ou mieux selon les mots-clés.
      Sous-titre : une promesse émotionnelle et le bénéfice (cadeau parfait, déco de chambre gamer).
      Bouton principal : « Je choisis ma peluche ». Bouton secondaire : « Créer mon pack ».
      Preuve sociale sous les boutons : la note réelle venant de l'appli d'avis (masquée s'il y a moins de 10 avis).
   b. BANDEAU DE RÉASSURANCE : 4 icônes (livraison, retours, paiement sécurisé, service client).
   c. MEILLEURES VENTES : carrousel de cartes produit.
   d. NOS COLLECTIONS : 3 grandes tuiles (Éditions, Pétillante, Ultra), avec la couleur d'accent de chaque collection et une photo de groupe.
   e. POURQUOI ON NOUS ADORE : 3 ou 4 bénéfices illustrés (ultra douce, broderies détaillées, la bonne taille pour le bureau ou le lit, cadeau qui fait réagir).
   f. CRÉE TON PACK : une bannière vers le constructeur de packs (« 2 peluches = -[REMISE_PACK_2] % »).
   g. MUR TIKTOK ET INSTAGRAM : une grille de contenus clients (blocs vidéo éditables, vides par défaut avec une consigne).
   h. AVIS CLIENTS : un carrousel de vrais avis (widget de l'appli d'avis).
   i. GUIDE CADEAU DE SAISON : un bloc éditable (Noël, Saint-Valentin, anniversaire) avec la date limite de commande pour être livré à temps.
   j. FAQ COURTE : 5 questions, avec un lien vers la FAQ complète.
   k. TEXTE SEO : un bloc repliable de 300 mots, optimisé pour le mot-clé principal.

2) COLLECTION (collection.json), utilisé aussi pour « Toutes les peluches »
   - Une bannière de collection avec la couleur d'accent, le titre H1 et une description courte (avec la version longue en bas de page pour le SEO).
   - Filtres (Shopify Search & Discovery) : Collection, Couleur (en pastilles de miniatures), Taille, Prix, Disponibilité. Sur mobile, ils s'ouvrent dans un tiroir.
   - Tri : Meilleures ventes, Nouveautés, Prix croissant, Prix décroissant.
   - CARTE PRODUIT : la photo de face sur un fond teinté de la couleur d'accent, avec la photo de dos qui apparaît au survol ; les badges ; le nom ; les étoiles et le nombre d'avis ; le prix et le prix barré ; les mini-pastilles des autres peluches de la collection ; un bouton « + » d'ajout rapide qui ouvre un mini-sélecteur de taille.
   - Pagination avec « Voir plus » (chargement progressif), et un compteur « 12 sur 15 peluches ».

3) FICHE PRODUIT (product.json)
   → Implémente INTÉGRALEMENT /docs/prompt-fiche-produit-peluches.md : galerie, badge « Meilleure vente », prix, pastilles en miniatures, tailles, packs, prénom brodé avec aperçu en direct, emballage cadeau, estimation de livraison, réassurance, accordéons, « Complète ta collection », « Souvent achetés ensemble », avis, barre d'achat collante sur mobile.
   → Crée aussi un template alternatif `product.porte-cles.json` pour les porte-clés (sans les options de taille ni de broderie).

4) CONSTRUCTEUR DE PACK (page.pack.json + section pl-pack-builder)
   - Étape 1 : choisir la taille du pack (2 ou 3, voire 5 si j'ai rempli la variable).
   - Étape 2 : choisir les peluches dans une grille de miniatures. Les places du pack se remplissent en haut avec une animation.
   - Étape 3 : le récapitulatif, avec le prix normal barré, le prix du pack et l'économie en €.
   - Le pack s'ajoute au panier en une seule action. La remise s'applique par une réduction automatique Shopify (explique-moi comment la créer) ou par Shopify Bundles.

5) PANIER
   - Un tiroir panier (par défaut) ET une page panier.
   - Une barre de progression vers la livraison gratuite, avec un message dynamique.
   - Chaque ligne affiche la miniature, le nom, la taille, le prénom brodé si présent, la quantité et le bouton supprimer.
   - Une suggestion « Ajoute un porte-clés assorti ? » en un clic.
   - Une case « Emballage cadeau » et une note de commande (message cadeau).
   - Le sous-total, puis « Taxes incluses. Frais de livraison calculés à l'étape suivante ».
   - Les logos de paiement et un rappel des garanties sous le bouton « Commander ».

6) NOTRE HISTOIRE : un récit authentique de 300 à 400 mots basé sur la variable HISTOIRE (si elle est vide, écris un brouillon marqué [À VALIDER], sans inventer de faits vérifiables), des photos des coulisses et les valeurs de la marque.

7) FAQ (avec données structurées FAQPage), au moins 15 questions classées par thème :
   - Produit : taille réelle ? matières ? lavable ? convient aux enfants (âge) ? les couleurs sont-elles fidèles aux photos ?
   - Commande : comment personnaliser avec un prénom ? peut-on mélanger les peluches dans un pack ? est-ce que c'est livré dans un emballage cadeau ?
   - Livraison : quels délais ? depuis où ? quel suivi ? livrez-vous en Belgique, en Suisse, au Luxembourg ?
   - Retours : comment retourner ? sous combien de jours ? les peluches personnalisées sont-elles remboursables ? (Non, si elles sont personnalisées : article L221-28 du Code de la consommation. À indiquer clairement.)
   - Paiement : moyens acceptés, paiement en plusieurs fois, sécurité.

8) LIVRAISON, RETOURS ET REMBOURSEMENT, SUIVI DE COMMANDE (avec le formulaire de l'appli de suivi), CONTACT (formulaire, email, délai de réponse réel), GUIDE DES TAILLES (illustration comparative avec une canette de 33 cl et une main).

9) PAGES LÉGALES : mentions légales, CGV, politique de confidentialité, politique de cookies.
   - Génère des modèles complets conformes au droit français, avec TOUTES les données de l'entreprise à remplir depuis les VARIABLES : raison sociale, forme, SIRET, adresse, directeur de publication, hébergeur Shopify, TVA, médiateur de la consommation.
   - En tête de chaque page, un avertissement interne : « Modèle à faire relire par un professionnel ».

10) BLOG : un template d'article soigné (temps de lecture, sommaire, produits liés en fin d'article), plus 5 brouillons d'articles SEO de 800 à 1 200 mots, chacun avec son mot-clé, son H1, sa meta description et ses liens internes :
    - « 25 idées cadeaux originales pour un ado gamer »
    - « Comment décorer une chambre ou un bureau gamer (setup cosy) »
    - « Peluche canette : quelle taille choisir ? »
    - « Comment laver une peluche sans l'abîmer »
    - « Idées cadeaux de Noël à moins de 30 € »

11) 404 (une peluche triste avec la recherche et les best-sellers), RECHERCHE (résultats en grille de cartes produit), COMPTE CLIENT (aux couleurs de la marque).

⛔ POINT DE CONTRÔLE 2 : quand l'en-tête, le pied de page, l'accueil et la fiche produit sont prêts, lance `shopify theme dev` et donne-moi le lien d'aperçu.

############################################
# PHASE 4 : CATALOGUE ET DONNÉES
############################################
1. Crée la liste complète des metafields et metaobjects à définir dans l'admin Shopify, avec le chemin exact, le type et la description :
   - product.custom.bestseller_rank (nombre entier)
   - product.custom.accent_color (couleur)
   - product.custom.collection_group (texte)
   - product.custom.combined_products (liste de produits, pour les pastilles)
   - product.custom.height_cm (nombre)
   - product.custom.care_instructions (texte riche)
   - product.custom.age_min (nombre entier)
   - variant.custom.swatch_image (fichier)
   - metaobject « Avantage » (icône, titre, texte), pour les blocs de bénéfices
2. Génère `products_import.csv` au format d'import Shopify (vérifie le format actuel dans la documentation Shopify) :
   - les 15 peluches, plus les porte-clés si je les vends ;
   - handle, titre, description HTML (structure : accroche, bénéfices, caractéristiques), vendor = [MARQUE], type, tags (collection, couleur, cadeau, gamer…), options, variantes, SKU au format `PL-{COLLECTION}-{COULEUR}-{TAILLE}`, prix, prix barré (vide par défaut, voir la conformité), poids, statut brouillon ;
   - les colonnes SEO : titre SEO (60 caractères max) et meta description (155 caractères max) ;
   - les colonnes d'images : explique-moi comment envoyer /images-web/ dans Shopify (Contenu > Fichiers) et remplir les URL, ou propose un script via l'Admin API.
3. Crée 4 collections automatiques (Éditions, Pétillante, Ultra, Toutes les peluches) et 2 manuelles (Meilleures ventes, Idées cadeaux), avec leurs descriptions SEO.
4. Rédige les 15 descriptions produit (150 à 250 mots chacune, toutes uniques, sans aucune marque déposée) : une accroche émotionnelle, 4 bénéfices en liste, les caractéristiques (taille, matière, entretien), et une phrase d'angle cadeau.

############################################
# PHASE 5 : SEO
############################################
- Mot-clé principal : [MOT_CLE_PRINCIPAL] (par défaut : « peluche canette »).
- Mots-clés secondaires : « peluche canette energy drink », « peluche boisson énergisante », « peluche canette kawaii », « coussin canette », « peluche soda », « cadeau gamer », « déco chambre gamer », « cadeau ado original », « idée cadeau Noël ado ».
- Un seul H1 par page, une hiérarchie Hn logique et des URL courtes en français (/products/peluche-canette-edition-rose).
- Modèles de balises titre :
  - Produit : « Peluche canette {Nom} – {Taille} | [MARQUE] »
  - Collection : « Peluches canettes {Collection} | [MARQUE] »
- Données structurées JSON-LD : Organization, WebSite avec SearchAction, Product avec Offer et AggregateRating (UNIQUEMENT si de vrais avis existent), BreadcrumbList, FAQPage, Article.
- Balises Open Graph et Twitter Card avec les images 1200x630.
- Textes alternatifs descriptifs sur toutes les images, sans marque déposée.
- Maillage interne : articles vers produits, produits vers la collection, et un fil d'Ariane partout.

############################################
# PHASE 6 : CONVERSION ET CONFIANCE
############################################
Applique les leviers de /docs/analyse-sac-cabine.md, adaptés aux peluches :
- OBJECTION N°1 du client : « Est-ce qu'elle est vraiment aussi belle et douce qu'en photo ? Et la taille ? ». Neutralise-la avec la photo d'échelle, la vidéo de pression, le guide des tailles, les avis avec photos, et la garantie « Satisfait ou remboursé [DELAI_RETOUR] jours » si elle est réelle.
- OBJECTION N°2 : « Est-ce que ça arrivera à temps pour l'anniversaire ou Noël ? ». Affiche l'estimation de livraison avec de vraies dates, et un bandeau « Commande avant le [DATE] pour être livré avant Noël », éditable.
- Réassurance répétée de façon cohérente aux endroits clés : héros, fiche produit, panier, pied de page.
- Un panier moyen plus élevé grâce aux packs, aux porte-clés assortis, à l'emballage cadeau et à la barre de livraison gratuite.
- Des réponses types aux avis négatifs, dans /docs/reponses-avis.md (colis abîmé, retard, couleur différente, produit défectueux).
- Un pop-up newsletter (après 15 s ou 50 % de défilement, une seule fois par visiteur, facile à fermer, conforme au RGPD), seulement si OFFRE_NEWSLETTER est remplie.

############################################
# PHASE 7 : CONFORMITÉ (France et UE)
############################################
- Prix barrés : seulement le prix le plus bas pratiqué dans les 30 jours précédents (article L112-1-1 du Code de la consommation). Par défaut, compare_at_price est VIDE.
- Jouets : le marquage CE et le respect de la norme EN71 sont obligatoires pour vendre des jouets dans l'UE. Affiche l'âge conseillé et les avertissements (petites pièces pour les porte-clés, « Ne convient pas aux enfants de moins de 36 mois » si c'est le cas). N'affiche le badge CE que si la variable CONFORMITE_CE vaut « oui ».
- Droit de rétractation de 14 jours au minimum, avec l'exception pour les produits personnalisés clairement expliquée.
- Médiateur de la consommation dans les CGV et les mentions légales.
- RGPD : bandeau de consentement aux cookies (API Customer Privacy de Shopify) et cases newsletter non pré-cochées.
- Marques : aucun nom ni logo de marque déposée dans le code, les textes, les métadonnées et les données structurées. Signale-moi dans /docs/A-COMPLETER.md toute image où un logo de marque est visible, car c'est un risque de retrait du site et de litige.

############################################
# PHASE 8 : PERFORMANCE, ACCESSIBILITÉ, QA
############################################
Objectifs : Lighthouse mobile ≥ 85 en performance, ≥ 95 en accessibilité, en bonnes pratiques et en SEO. LCP < 2,5 s, CLS < 0,1.
- `shopify theme check` sans aucune erreur.
- Tests manuels à faire et à cocher dans /docs/QA.md :
  □ iPhone SE (375 px), iPhone 15 Pro, Android moyen de gamme, iPad, desktop 1440 px
  □ Changer de couleur met à jour la galerie, le prix, l'URL, le stock et l'accent
  □ Une variante en rupture affiche « Me prévenir »
  □ Le prénom brodé apparaît dans l'aperçu ET sur la ligne du panier
  □ Le pack ajoute les bonnes peluches et la remise s'applique
  □ La barre de livraison gratuite est juste
  □ Navigation complète au clavier, focus visible, lecteur d'écran (VoiceOver)
  □ Aucune erreur dans la console
  □ Tous les liens du pied de page fonctionnent
  □ Les données structurées sont valides (test des résultats enrichis de Google)

############################################
# LIVRABLES FINAUX
############################################
1. Le thème complet dans /theme/, prêt pour `shopify theme push --unpublished`.
2. Les images dans /images-web/, avec manifest.json.
3. /data/products_import.csv et /data/collections.md.
4. /docs/INSTALLATION.md : un guide pas à pas pour un débutant (création de la boutique, metafields, import des produits, envoi des images, apps, réductions automatiques, domaine, mise en ligne).
5. /docs/APPS.md : les applis recommandées, avec leur rôle, leur prix indicatif et leur configuration (avis : Judge.me ; emails : Shopify Email ou Klaviyo ; suivi de colis ; chat : Shopify Inbox ; packs : Shopify Bundles).
6. /docs/A-COMPLETER.md : tout ce que je dois fournir ou vérifier.
7. /docs/QA.md : la check-list de tests.
8. /docs/reponses-avis.md.

Commence par la PHASE 0.
```

---

## Variables à remplir (colle ce tableau rempli à la suite du prompt)

| Variable | Ta valeur | Exemple ou conseil |
|---|---|---|
| MARQUE | | vide : l'IA proposera 10 noms |
| NOMS_PRODUITS | | vide : noms neutres du prompt |
| DOMAINE | | ex. maboutique.fr |
| MOT_CLE_PRINCIPAL | | « peluche canette » |
| TAILLES_VENDUES | | Porte-clés 12 cm / Classique 22 cm / XL 35 cm |
| PRIX | | ex. Porte-clés 7,90 € · Classique 19,90 € · XL 29,90 € |
| REMISE_PACK_2 / PACK_3 | | ex. 15 % / 25 % |
| BRODERIE_PRENOM (oui/non + prix) | | seulement si ton fournisseur sait le faire |
| EMBALLAGE_CADEAU (prix) | | ex. 2,90 € |
| SEUIL_LIVRAISON | | ex. 35 € |
| PAYS_EXPEDITION | | France ou Chine (sois honnête : ça change les délais affichés) |
| DELAIS_LIVRAISON | | ex. 2 à 4 jours ouvrés (Colissimo) |
| DELAI_RETOUR | | 14 jours minimum légal, 30 jours recommandés |
| OFFRE_NEWSLETTER | | ex. -10 % sur la 1ʳᵉ commande |
| HISTOIRE | | 3-4 phrases vraies sur toi et le projet |
| SOCIÉTÉ (raison sociale, forme, SIRET, adresse, TVA) | | obligatoire pour les mentions légales |
| EMAIL_CONTACT / DELAI_REPONSE | | ex. contact@… / sous 24 h ouvrées |
| MÉDIATEUR_CONSOMMATION | | ex. CM2C, Medicys… |
| CONFORMITE_CE (oui/non) | | demande les certificats EN71 à ton fournisseur |
| AGE_MIN | | ex. 3 ans |
| RÉSEAUX (TikTok, Instagram) | | liens |
| APPLI_AVIS | | Judge.me (gratuite) |
