# À compléter ou à vérifier

Sur le site, tout ce qui manque est surligné en jaune `[À COMPLÉTER]`. Les valeurs se changent dans `site/data.mjs`.

## Valeurs d'exemple utilisées (à remplacer par les vraies)

Elles viennent des exemples du prompt :

- [ ] Marque : **Canettou** (nom provisoire) · domaine `canettou.fr`
- [ ] Prix : Porte-clés 7,90 € · Classique 19,90 € · XL 29,90 €
- [ ] Packs : 2 = -15 % · 3 = -25 %
- [ ] Prénom brodé : +4,90 € (ton fournisseur sait-il le faire ?)
- [ ] Emballage cadeau : +2,90 €
- [ ] Livraison offerte dès 35 € · expédition depuis la France · 2 à 4 jours ouvrés · commande avant 14 h = expédiée le jour même
- [ ] Retours : 30 jours
- [ ] Âge conseillé : 3 ans
- [ ] Date limite de Noël : 18 décembre
- [ ] Matières : polyester et ouate, lavable à 30 °C

## Informations obligatoires manquantes

- [ ] Société : raison sociale, forme, SIRET, adresse, ville, TVA, directeur de la publication
- [ ] Hébergeur du site
- [ ] Médiateur de la consommation
- [ ] Email de contact réel (actuellement `contact@canettou.fr`)
- [ ] Liens TikTok et Instagram
- [ ] Marquage CE / EN71 : passe `ceCompliant` à `true` seulement avec les certificats du fournisseur
- [ ] Pays livrés hors France, tarifs de livraison, transporteur, frais de retour
- [ ] Paiement en plusieurs fois : oui ou non
- [ ] Ta vraie histoire (page « Notre histoire »)
- [ ] Faire relire les pages légales par un professionnel

## À brancher

- [ ] Paiement (bouton « Commander » → fonction `checkout()` dans `site/assets/app.js`)
- [ ] Newsletter (formulaire du pied de page)
- [ ] Suivi de commande (actuellement : envoie un email)
- [ ] Avis clients (Judge.me, Trustpilot… ou publication manuelle)

## Photos

- [ ] `peluche_Celsius.jpeg` a été supprimée du dossier : la collection Pétillante (4 peluches) s'affiche en « Bientôt », avec des silhouettes dessinées.
- [ ] Une seule photo de face par peluche : pas de dos, de 3/4, de détail, d'échelle ni de vidéo.
- [ ] Pas de photo de groupe (l'accueil compose une rangée à partir des photos individuelles).
- [ ] Fonds différents : blanc pour les Éditions, gris clair pour les Ultra.

## Risques signalés

- [ ] Les peluches en photo portent des logos et noms de marques déposées, brodés sur le produit. Les textes du site n'en mentionnent aucune, mais les photos et les produits les montrent.
- [ ] Certaines photos semblent générées (texte « NIKE JAST » sur l'Ultra Noire, « Bery » sur Coco et Hiver) : vérifie qu'elles correspondent aux peluches réellement livrées.
