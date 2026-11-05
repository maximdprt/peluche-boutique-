// =====================================================================
// DONNÉES DU SITE : tout ce qui se modifie facilement est ICI.
// Les valeurs de prix, délais et seuils sont les EXEMPLES du prompt :
// remplace-les par tes vraies valeurs (voir docs/A-COMPLETER.md).
// =====================================================================

export const CONFIG = {
  brand: 'Canettou',
  slogan: 'Doux comme un câlin, pétillant comme une canette.',
  domain: 'canettou.fr', // [À COMPLÉTER] domaine réel
  year: 2026,

  // Tailles vendues et prix (exemples du prompt)
  sizes: [
    { id: 'porte-cles', label: 'Porte-clés', cm: 12, price: 7.9 },
    { id: 'classique', label: 'Classique', cm: 22, price: 19.9 },
    { id: 'xl', label: 'XL', cm: 35, price: 29.9 },
  ],
  defaultSize: 'classique',

  // Packs : remise en % sur le total
  packs: [
    { n: 1, discount: 0, label: '1 peluche' },
    { n: 2, discount: 15, label: 'Pack de 2', badge: 'Le plus choisi' },
    { n: 3, discount: 25, label: 'Pack de 3' },
  ],

  freeShipping: 35, // livraison offerte dès X €
  embroidery: { enabled: true, price: 4.9, maxLength: 12 },
  giftWrap: { enabled: true, price: 2.9 },

  shipFrom: 'France',
  deliveryDays: [2, 4], // jours ouvrés après expédition
  cutoffHour: 14, // commande avant 14 h = expédiée le jour même (jours ouvrés)
  returnDays: 30,
  ageMin: 3,
  ceCompliant: false, // passe à true UNIQUEMENT avec les certificats EN71 du fournisseur

  email: 'contact@canettou.fr', // [À COMPLÉTER]
  replyDelay: 'sous 24 h ouvrées',
  social: {
    tiktok: 'https://www.tiktok.com/', // [À COMPLÉTER] lien du compte
    instagram: 'https://www.instagram.com/', // [À COMPLÉTER]
  },
  company: {
    name: '[À COMPLÉTER : raison sociale]',
    form: '[À COMPLÉTER : forme juridique, ex. micro-entreprise]',
    siret: '[À COMPLÉTER : SIRET]',
    address: '[À COMPLÉTER : adresse du siège]',
    city: '[À COMPLÉTER : ville]',
    vat: '[À COMPLÉTER : n° de TVA intracommunautaire ou « TVA non applicable, art. 293 B du CGI »]',
    director: '[À COMPLÉTER : directeur de la publication]',
    mediator: '[À COMPLÉTER : médiateur de la consommation, nom et site]',
    host: '[À COMPLÉTER : hébergeur du site, nom, adresse, téléphone]',
  },
  seasonal: {
    title: 'Les cadeaux de Noël, c’est maintenant',
    text: 'Commande avant le 18 décembre pour être livré avant Noël (France métropolitaine).', // [À VÉRIFIER] selon ton transporteur
    cta: 'Voir les idées cadeaux',
  },
};

// Collections
export const COLLECTIONS = [
  {
    id: 'editions',
    name: 'Éditions',
    accent: '#E8358A',
    short: 'Des canettes fines et élancées, un rebord en feutrine grise et de grosses lettres brodées. Les plus chics de la bande.',
    long: 'La collection Éditions, ce sont nos peluches canettes les plus élancées. Corps fin, rebord en feutrine grise tout doux, et une broderie soignée qui reprend le style des éditions de saison : rose fuchsia, blanc coco, bleu hiver et le grand classique bleu et blanc. Elles tiennent assises toutes seules, ont des petits bras pour les câlins et un sourire brodé qui fait fondre. Parfaites sur un bureau gamer, une étagère ou un oreiller.',
  },
  {
    id: 'petillante',
    name: 'Pétillante',
    accent: '#F28C28',
    short: 'Corps blanc, couvercle noir, pieds gris et des fruits brodés. Arrivée prochaine.',
    long: 'La collection Pétillante arrive bientôt : des peluches canettes au corps blanc tout doux, au couvercle noir et aux petits pieds gris, avec des fruits brodés en couleur. Orange, Tropicale, Fruits Rouges et Pêche : inscris-toi à la newsletter pour être prévenu(e) de leur sortie.',
    comingSoon: true,
  },
  {
    id: 'ultra',
    name: 'Ultra',
    accent: '#7AC943',
    short: 'Des canettes rondes et dodues avec une grosse griffe brodée. Sept couleurs, zéro chance de n’en prendre qu’une.',
    long: 'La collection Ultra, c’est la plus dodue. Des peluches canettes toutes rondes, faciles à serrer, avec une grosse griffe brodée sur le ventre et des yeux brillants. Elles existent en sept couleurs : verte, violette, bleue, rose, blanche, orange et noire. Une couleur par humeur, ou les sept pour toute la team.',
  },
];

// Familles de couleurs (pour le filtre « Couleur »)
export const COLOR_FAMILIES = {
  rose: '#E8358A', blanc: '#F2F2F2', bleu: '#2E8BE6', vert: '#7AC943',
  violet: '#6B3FA0', orange: '#FF6A13', noir: '#1A1A1A', gris: '#8C8C8C',
};

// Le catalogue. `image` = nom de base dans /images (sans extension).
// Les peluches sans photo ont `comingSoon: true`.
export const PRODUCTS = [
  // ---------- ÉDITIONS ----------
  {
    slug: 'edition-rose', name: 'Édition Rose', collection: 'editions', accent: '#E8358A',
    colors: ['rose'], flavor: 'pêche blanche', image: 'peluche-edition-rose-face-1',
    alt: 'Peluche canette rose fuchsia assise, avec un visage souriant brodé et un rebord gris',
    hook: 'Le rose qui met de bonne humeur dès le réveil.',
    text: 'L’Édition Rose, c’est la peluche canette qui illumine une chambre en une seconde. Son rose fuchsia éclatant, ses grosses lettres brodées et son petit sourire en font la star de toutes les étagères. Côté saveur imaginaire : une pêche blanche toute douce. Elle s’assoit sagement sur ton bureau pendant tes games, se cale contre l’oreiller le soir, et passe très bien en photo pour TikTok.',
    gift: 'Le cadeau idéal pour une meilleure amie fan de rose, ou pour une Saint-Valentin qui sort de l’ordinaire.',
  },
  {
    slug: 'edition-coco', name: 'Édition Coco', collection: 'editions', accent: '#8C8C8C',
    colors: ['blanc', 'gris'], flavor: 'coco et baies', image: 'peluche-edition-coco-face-1',
    alt: 'Peluche canette blanche et grise assise, avec des bras et des pieds gris et un visage souriant brodé',
    hook: 'Blanche comme une noix de coco, douce comme un nuage.',
    text: 'L’Édition Coco joue la carte du minimalisme : un corps blanc moelleux, des bras et des pieds gris, et des broderies gris anthracite avec une touche de bleu. Elle se fond dans toutes les déco, du setup gamer noir et blanc à la chambre cosy aux tons neutres. Sa saveur imaginaire ? Coco et baies, pour un petit air de vacances toute l’année.',
    gift: 'Parfaite pour celles et ceux qui aiment les déco épurées, ou pour compléter une collection déjà commencée.',
  },
  {
    slug: 'edition-hiver', name: 'Édition Hiver', collection: 'editions', accent: '#2E8BE6',
    colors: ['bleu'], flavor: 'vanille glacée', image: 'peluche-edition-hiver-face-1',
    alt: 'Peluche canette bleu vif assise, avec un visage souriant brodé et des broderies blanches',
    hook: 'Un bleu glacé, un cœur tout chaud.',
    text: 'L’Édition Hiver a la couleur d’un ciel de janvier et la douceur d’un plaid. Son bleu vif, ses broderies blanches et ses joues rebondies en font la peluche canette la plus fraîche de la bande. Saveur imaginaire : vanille glacée. Elle adore les soirées sous la couette, les sessions de jeu qui finissent tard et les bureaux aux LED bleues.',
    gift: 'Le cadeau de Noël tout trouvé pour un ado gamer, ou un clin d’œil pour un anniversaire d’hiver.',
  },
  {
    slug: 'edition-classique', name: 'Édition Classique', collection: 'editions', accent: '#1F3FA0',
    colors: ['bleu', 'blanc'], flavor: 'l’originale', image: 'peluche-edition-classique-face-1',
    alt: 'Peluche canette bleu roi et blanche en diagonale, assise, avec un visage souriant brodé',
    hook: 'La légende en version câlin.',
    text: 'L’Édition Classique, c’est celle que tout le monde reconnaît : bleu roi et blanc coupés en diagonale, rebord gris argenté et un regard plein d’énergie. Elle porte fièrement les couleurs des nuits blanches de révisions et des parties qui durent « encore cinq minutes ». C’est la peluche canette par excellence, celle qui ouvre une collection.',
    gift: 'Le choix sûr quand tu ne sais pas laquelle offrir : tout le monde la connaît, tout le monde l’adore.',
  },
  // ---------- PÉTILLANTE (bientôt : pas de photo) ----------
  { slug: 'petillante-orange', name: 'Pétillante Orange', collection: 'petillante', accent: '#F28C28', colors: ['orange', 'blanc'], comingSoon: true },
  { slug: 'petillante-tropicale', name: 'Pétillante Tropicale', collection: 'petillante', accent: '#F5A524', colors: ['orange', 'blanc'], comingSoon: true },
  { slug: 'petillante-fruits-rouges', name: 'Pétillante Fruits Rouges', collection: 'petillante', accent: '#D7263D', colors: ['rose', 'blanc'], comingSoon: true },
  { slug: 'petillante-peche', name: 'Pétillante Pêche', collection: 'petillante', accent: '#FF6F59', colors: ['orange', 'blanc'], comingSoon: true },
  // ---------- ULTRA ----------
  {
    slug: 'ultra-verte', name: 'Ultra Verte', collection: 'ultra', accent: '#7AC943',
    colors: ['vert'], image: 'peluche-ultra-verte-face-1',
    alt: 'Peluche canette ronde vert pomme assise, avec une griffe argentée brodée et un visage souriant',
    hook: 'Le vert qui donne envie d’appuyer sur Start.',
    text: 'L’Ultra Verte, c’est l’énergie pure en version moelleuse. Toute ronde, toute dodue, avec une grande griffe argentée brodée sur le ventre et deux yeux qui brillent. Son vert pomme pétant réveille n’importe quel coin de bureau. Elle se serre comme un coussin anti-stress quand la partie tourne mal, et elle trône fièrement à côté de l’écran quand tu gagnes.',
    gift: 'Le cadeau parfait pour un gamer ou une gameuse qui a déjà tout… sauf elle.',
  },
  {
    slug: 'ultra-violette', name: 'Ultra Violette', collection: 'ultra', accent: '#6B3FA0',
    colors: ['violet'], image: 'peluche-ultra-violette-face-1',
    alt: 'Peluche canette ronde violette assise, avec un rebord noir, une griffe argentée brodée et un visage souriant',
    hook: 'Mystérieuse, douce et un peu rebelle.',
    text: 'L’Ultra Violette a le style des soirées néon : un violet profond, un rebord noir et une griffe argentée qui ressort à la lumière. Ronde et dodue, elle tient parfaitement dans les bras et se pose aussi bien sur un lit que sur une étagère de figurines. C’est la préférée de celles et ceux qui ont un setup RGB réglé sur le violet.',
    gift: 'Une idée cadeau originale pour un anniversaire, surtout si le violet est sa couleur préférée.',
  },
  {
    slug: 'ultra-bleue', name: 'Ultra Bleue', collection: 'ultra', accent: '#29A3E0',
    colors: ['bleu', 'orange'], image: 'peluche-ultra-bleue-face-1',
    alt: 'Peluche canette ronde bleu ciel assise, avec une griffe orange brodée et un visage souriant',
    hook: 'Bleu ciel et griffe orange : le duo qui claque.',
    text: 'L’Ultra Bleue mélange deux couleurs qui n’ont rien à faire ensemble… et c’est pour ça qu’elle est irrésistible. Un bleu ciel tout doux, une grosse griffe orange vif et un sourire de vacances. Elle apporte une touche de fun dans une chambre, un dortoir ou un bureau d’open space qui manque de couleurs.',
    gift: 'Le cadeau qui fait rire à coup sûr, pour un ado comme pour un collègue.',
  },
  {
    slug: 'ultra-rose', name: 'Ultra Rose', collection: 'ultra', accent: '#F4A6C1',
    colors: ['rose'], image: 'peluche-ultra-rose-face-1',
    alt: 'Peluche canette ronde rose pastel assise, avec une griffe argentée brodée et un visage souriant',
    hook: 'Rose pastel, griffe argentée : kawaii et badass à la fois.',
    text: 'L’Ultra Rose est la preuve qu’on peut être tout doux et avoir du caractère. Son rose pastel se marie avec toutes les déco cosy, et sa griffe argentée brodée lui donne un petit côté rebelle. Ronde comme un coussin, elle est parfaite pour les câlins devant une série ou pour veiller sur ton bureau pendant les révisions.',
    gift: 'Une valeur sûre pour une fan de kawaii, en solo ou en pack avec l’Ultra Blanche.',
  },
  {
    slug: 'ultra-blanche', name: 'Ultra Blanche', collection: 'ultra', accent: '#BDBDBD',
    colors: ['blanc', 'gris'], flavor: 'zéro sucre', image: 'peluche-ultra-blanche-face-1',
    alt: 'Peluche canette ronde blanche assise, avec un rebord gris foncé, une griffe argentée brodée et un visage souriant',
    hook: 'Zéro sucre, 100 % douceur.',
    text: 'L’Ultra Blanche, c’est la version la plus lumineuse de la collection : un blanc immaculé, une griffe argentée et un rebord gris foncé. Elle va avec tout, du setup tout blanc à la chambre scandinave. Version zéro sucre, comme il se doit, mais avec une dose maximale de câlins.',
    gift: 'Le cadeau élégant qui plaît aussi aux adultes : on la pose sur un bureau de télétravail sans complexe.',
  },
  {
    slug: 'ultra-orange', name: 'Ultra Orange', collection: 'ultra', accent: '#FF6A13',
    colors: ['orange'], image: 'peluche-ultra-orange-face-1',
    alt: 'Peluche canette ronde orange vif assise, avec un rebord noir, une griffe argentée brodée et un visage souriant',
    hook: 'Une bombe de vitamines en version peluche.',
    text: 'L’Ultra Orange déborde d’énergie : un orange vif qui se voit de loin, un rebord noir et une griffe argentée brodée. Elle réchauffe une pièce comme un coucher de soleil. Toute ronde, elle se serre facilement et reste bien droite sur un bureau. Idéale pour ajouter du peps dans un setup sombre.',
    gift: 'Un cadeau qui met la banane, parfait pour remonter le moral de quelqu’un.',
  },
  {
    slug: 'ultra-noire', name: 'Ultra Noire', collection: 'ultra', accent: '#1A1A1A',
    colors: ['noir', 'vert'], image: 'peluche-ultra-noire-face-1',
    alt: 'Peluche canette ronde noire assise, avec une griffe verte brodée et un sourire vert',
    hook: 'Le boss final de la collection.',
    text: 'L’Ultra Noire, c’est la plus mystérieuse de la bande : un noir profond, une griffe vert fluo et un sourire assorti. Elle a l’air sérieuse, mais elle est aussi douce que les autres. C’est la peluche préférée des setups gaming sombres, des chambres aux LED vertes et de tous ceux qui jouent la nuit.',
    gift: 'LE cadeau pour un gamer : elle va parfaitement à côté d’un clavier mécanique.',
  },
];

// Bénéfices communs (affichés sur l'accueil et les fiches produit)
export const BENEFITS = [
  { icon: 'cloud', title: 'Ultra douce', text: 'Un tissu peluche tout doux et un rembourrage moelleux qu’on a envie de serrer.' },
  { icon: 'needle', title: 'Broderies détaillées', text: 'Le visage et les motifs sont brodés, pas imprimés : ils ne s’effacent pas.' },
  { icon: 'ruler', title: 'La bonne taille', text: 'Porte-clés pour le sac, Classique pour le bureau, XL pour le lit.' },
  { icon: 'gift', title: 'Le cadeau qui fait réagir', text: 'Effet garanti au déballage, et en story.' },
];

// FAQ complète (aussi utilisée pour les données structurées FAQPage)
export const FAQ = [
  { theme: 'Produit', q: 'Quelle est la taille réelle des peluches ?', a: 'Trois tailles : Porte-clés (environ 12 cm), Classique (environ 22 cm, un peu moins de deux canettes de 33 cl l’une sur l’autre) et XL (environ 35 cm). Le guide des tailles montre chaque peluche à côté d’une canette et d’une main.' },
  { theme: 'Produit', q: 'En quelle matière sont-elles ?', a: 'Un tissu peluche en polyester tout doux et un rembourrage en ouate de polyester. Les visages et les motifs sont brodés. [À VÉRIFIER avec la fiche technique du fournisseur]' },
  { theme: 'Produit', q: 'Est-ce qu’on peut les laver ?', a: 'Oui : lavage en machine à 30 °C, dans un filet ou une taie d’oreiller, en cycle délicat. Laisse sécher à l’air libre, sans sèche-linge.' },
  { theme: 'Produit', q: 'Est-ce qu’elles conviennent aux enfants ?', a: 'Nos peluches sont conseillées à partir de 3 ans. Les porte-clés contiennent un anneau métallique et de petites pièces : ils ne conviennent pas aux enfants de moins de 36 mois.' },
  { theme: 'Produit', q: 'Les couleurs sont-elles fidèles aux photos ?', a: 'On photographie nos peluches en lumière naturelle et sans filtre. Selon ton écran, une teinte peut paraître un peu plus claire ou plus foncée. Si la couleur ne te plaît pas, tu peux nous la retourner.' },
  { theme: 'Commande', q: 'Comment personnaliser une peluche avec un prénom ?', a: 'Sur la fiche produit, coche « Ajouter un prénom brodé », tape le prénom (12 caractères maximum) et regarde l’aperçu en direct sur la photo. Le prénom apparaît ensuite dans ton panier.' },
  { theme: 'Commande', q: 'Peut-on mélanger les peluches dans un pack ?', a: 'Oui, c’est tout l’intérêt ! Choisis 2 ou 3 peluches de n’importe quelle collection dans le constructeur de pack, dans la même taille. La remise s’applique sur le total.' },
  { theme: 'Commande', q: 'C’est livré dans un emballage cadeau ?', a: 'En option : coche « Emballage cadeau + carte message » sur la fiche produit ou dans le panier, et écris ton message. On s’occupe du reste.' },
  { theme: 'Livraison', q: 'Quels sont les délais de livraison ?', a: 'Les commandes passées avant 14 h un jour ouvré partent le jour même. Compte ensuite 2 à 4 jours ouvrés en France métropolitaine. La date estimée est affichée sur chaque fiche produit. [À VÉRIFIER]' },
  { theme: 'Livraison', q: 'D’où sont expédiées les commandes ?', a: 'Depuis la France. [À VÉRIFIER]' },
  { theme: 'Livraison', q: 'Est-ce que je peux suivre mon colis ?', a: 'Oui, tu reçois un email avec ton numéro de suivi dès que ton colis part. Tu peux aussi le suivre sur la page « Suivi de commande ».' },
  { theme: 'Livraison', q: 'Livrez-vous en Belgique, en Suisse et au Luxembourg ?', a: '[À COMPLÉTER : pays desservis, délais et frais]' },
  { theme: 'Retours', q: 'Comment retourner une peluche ?', a: 'Écris-nous à l’adresse de contact avec ton numéro de commande. On t’envoie les instructions de retour. La peluche doit être neuve, dans son emballage d’origine.' },
  { theme: 'Retours', q: 'Sous combien de jours puis-je la retourner ?', a: 'Tu as 30 jours à compter de la réception (la loi en impose 14 : on te laisse plus de temps). Le remboursement est fait sous 14 jours après réception du retour.' },
  { theme: 'Retours', q: 'Les peluches avec un prénom brodé sont-elles remboursables ?', a: 'Non. Une peluche personnalisée avec un prénom est fabriquée spécialement pour toi : elle n’ouvre pas droit à la rétractation (article L221-28 du Code de la consommation). Bien sûr, si elle arrive abîmée ou défectueuse, on la remplace.' },
  { theme: 'Paiement', q: 'Quels moyens de paiement acceptez-vous ?', a: 'Carte bancaire (CB, Visa, Mastercard), PayPal, Apple Pay et Google Pay. [À VÉRIFIER selon ton prestataire de paiement]' },
  { theme: 'Paiement', q: 'Peut-on payer en plusieurs fois ?', a: '[À COMPLÉTER : oui/non, et avec quel service]' },
  { theme: 'Paiement', q: 'Le paiement est-il sécurisé ?', a: 'Oui. Le paiement passe par un prestataire certifié, et tes données bancaires ne sont jamais stockées sur notre site.' },
];
