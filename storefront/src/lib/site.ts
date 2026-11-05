// Réglages de la boutique. Tout ce qui dépend d'une décision commerciale ou juridique est ici.
export const site = {
  // Nom provisoire : vérifie sa disponibilité (marque et domaine) avant de le garder
  name: { first: "Volt", second: "oudou" },
  fullName: "Voltoudou",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  hashtag: "#Voltoudou",
  freeShippingThreshold: 50,
  giftWrapPrice: 3,
  lowStockThreshold: 5,
  shippingCutoffHour: 14,

  // À n'activer qu'avec un accord écrit de chaque marque : affiche « Produit officiel sous licence »
  licensed: process.env.NEXT_PUBLIC_LICENSED === "true",

  // Paiement pas encore en place. Le test crée une commande sans encaisser : jamais en production.
  paymentsEnabled: false,
  testCheckout: process.env.NEXT_PUBLIC_TEST_CHECKOUT === "true",

  // Avis, témoignages et notes fictifs, toujours signalés. À désactiver avant la mise en ligne.
  demoContent: process.env.NEXT_PUBLIC_DEMO_CONTENT !== "false",

  // Échéance réelle de l'édition limitée. Passée cette date, le compte à rebours disparaît.
  limitedEndsAt: process.env.NEXT_PUBLIC_LIMITED_ENDS_AT ?? "2026-12-24T23:59:00+01:00",
}

export const universes = {
  redbull: { name: "Red Bull", handle: "red-bull", bg: "#0b1e4b", fg: "#ffffff", plate: "#2348c7", photo: "redbull", tagline: "Bleu nuit, argent, éclats de rouge et de jaune." },
  monster: { name: "Monster", handle: "monster", bg: "#0a0a0a", fg: "#39ff14", plate: "#39ff14", photo: "monster_vert", tagline: "Noir profond et griffes néon. Ça ne dort jamais." },
  celsius: { name: "Celsius", handle: "celsius", bg: "#ff8a1f", fg: "#14141a", plate: "#ff8a1f", photo: "celsius", tagline: "Pétillante, solaire, et très facile à câliner." },
} as const

export const themes = [
  { name: "Sport auto", handle: "sport-auto", tile: "#ddf3ff", photo: "redbull" },
  { name: "Sports extrêmes", handle: "sports-extremes", tile: "#ffd84d", photo: "monster_bleu" },
  { name: "Gaming & e-sport", handle: "gaming-esport", tile: "#d9ffd2", photo: "monster_vert" },
  { name: "Canettes en peluche", handle: "canettes", tile: "#ffe9df", photo: "redbull_rose" },
]

export const formats = [
  { name: "Mini (moins de 15 cm)", handle: "mini" },
  { name: "Medium (20 à 30 cm)", handle: "medium" },
  { name: "XXL (plus de 50 cm)", handle: "xxl" },
  { name: "Coffrets", handle: "coffrets" },
]

export const highlights = [
  { name: "Nouveautés", handle: "nouveautes" },
  { name: "Meilleures ventes", handle: "meilleures-ventes" },
  { name: "Éditions limitées", handle: "editions-limitees" },
  { name: "Promotions", handle: "promotions" },
]
