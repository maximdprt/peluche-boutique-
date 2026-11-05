# Voltoudou

Boutique de peluches : `storefront/` (site Next.js) et `backend/` (Medusa, avec son administration).

## Lancer le site

Ouvre trois terminaux, dans cet ordre :

```
cd backend && node scripts/dev-db.mjs    # base de données
cd backend && npx medusa develop         # administration : http://localhost:9000/app
cd storefront && npm run dev             # site : http://localhost:3000
```

Première installation : `npm install --legacy-peer-deps` dans `backend/`, `npm install` dans `storefront/`, puis
avec la base démarrée, dans `backend/` : `npx medusa db:migrate`, `npx medusa exec ./src/scripts/seed.ts` et
`npx medusa user -e ton@email.fr -p ton-mot-de-passe`.

## Modifier le site

- Couleurs, typos, rayons, ombres : `storefront/src/app/tokens.css`
- Styles des composants : `storefront/src/app/globals.css`
- Nom, seuil de livraison, marques, univers : `storefront/src/lib/site.ts`
- Textes de démo, FAQ, histoire : `storefront/src/lib/content.ts`
- Produits, prix, stock, commandes : administration Medusa
- Nouvelles photos : ajoute le `.jpeg` à la racine, puis `node scripts/cutouts.mjs` dans `storefront/`

## Pas encore en place

Paiement, e-mails automatiques, comptage des points de fidélité, parrainage, vrais avis clients, cartes cadeaux.
Pages légales à compléter (passages surlignés) et contenu de démo à désactiver avant la mise en ligne.
