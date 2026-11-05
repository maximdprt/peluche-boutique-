// Contenus de démonstration. Les avis et témoignages sont fictifs : ne pas les publier en production.
export type DemoReview = { name: string; rating: number; date: string; text: string; color: string }

export const demoReviews: DemoReview[] = [
  { name: "Léa", rating: 5, date: "2 octobre 2026", color: "#ff5fa8", text: "Offerte à mon copain gamer, elle a remplacé son oreiller. Je n'avais pas prévu ça." },
  { name: "Mathis", rating: 5, date: "18 septembre 2026", color: "#2348c7", text: "La XXL est énorme et hyper douce. Elle a sa propre chaise dans mon setup." },
  { name: "Inès", rating: 4, date: "6 septembre 2026", color: "#39ff14", text: "Trop mignonne. Un peu plus petite que je l'imaginais en Mini, mais parfaite sur mon sac." },
  { name: "Hugo", rating: 5, date: "27 août 2026", color: "#e4002b", text: "Reçue en deux jours, emballage cadeau nickel. Le Secret Santa est plié pour dix ans." },
  { name: "Camille", rating: 5, date: "12 août 2026", color: "#ffcc00", text: "On collectionne à deux, on en est à cinq. Envoyez de l'aide. Ou la prochaine édition." },
  { name: "Noah", rating: 3, date: "30 juillet 2026", color: "#7b3ff2", text: "Belle finition, mais le coloris que je voulais était en rupture. Vivement le retour." },
]

export const faq = [
  { q: "Quels sont les délais de livraison ?", a: "Compte 3 à 5 jours ouvrés avec Mondial Relay, 2 à 3 avec Colissimo, et le lendemain avec Chronopost. Une commande passée avant 14 h un jour ouvré part le jour même." },
  { q: "La livraison est-elle offerte ?", a: "Oui, dès 50 € d'achat avec Mondial Relay et Colissimo. Chronopost reste payant." },
  { q: "Puis-je retourner une peluche ?", a: "Oui, tu as 30 jours après réception pour la renvoyer, neuve et dans son emballage. Le droit légal de rétractation de 14 jours s'applique en plus de cette garantie commerciale." },
  { q: "Où livrez-vous ?", a: "En France, en Belgique, au Luxembourg, en Allemagne, en Espagne, en Italie et aux Pays-Bas." },
  { q: "Quels moyens de paiement acceptez-vous ?", a: "Les moyens de paiement seront annoncés à l'ouverture des commandes." },
  { q: "Puis-je commander sans créer de compte ?", a: "Oui. Le compte sert seulement à retrouver tes commandes et tes adresses." },
  { q: "Les peluches conviennent-elles aux enfants ?", a: "L'âge conseillé et les normes applicables sont indiqués sur chaque fiche produit. Vérifie-les avant d'offrir à un jeune enfant, surtout pour les modèles avec porte-clés." },
  { q: "Comment laver ma peluche ?", a: "Lavage à la main ou en machine à 30 °C dans un filet, sans essorage, puis séchage à l'air libre. Pas de sèche-linge : elle aurait trop chaud." },
  { q: "Comment utiliser un code promo ?", a: "Saisis-le dans le panier ou à l'étape de paiement. La réduction s'affiche tout de suite dans le total." },
  { q: "Comment suivre ma commande ?", a: "Tu reçois un lien de suivi par e-mail à l'expédition. Tu peux aussi retrouver ta commande sur la page Suivi de commande." },
]

export const testimonials = demoReviews.slice(0, 5)

export const story = [
  { title: "Tout a commencé par une canette vide", text: "Une nuit de LAN, une canette oubliée sur le bureau, et une question idiote : et si l'énergie, ça se câlinait ? La première peluche est née d'un croquis griffonné à 4 h du matin.", photo: "redbull" },
  { title: "Doux dehors, survolté dedans", text: "On aime le bruit des paddocks, les finales d'e-sport et les descentes trop raides. On aime aussi les trucs moelleux. Notre boutique, c'est ce contraste assumé.", photo: "monster_vert" },
  { title: "Une boutique de collectionneurs", text: "Chaque modèle est choisi par des fans, pour des fans. Peu de références, des éditions courtes et un vrai service client. Quand on répond, c'est nous.", photo: "monster_orange" },
]
