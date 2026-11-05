// =====================================================================
// GÉNÉRATEUR DU SITE : node site/build.mjs  ->  /public/*.html
// Aucune dépendance : de simples gabarits en JavaScript.
// =====================================================================
import { mkdir, writeFile, copyFile, readdir } from 'node:fs/promises';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { CONFIG as C, COLLECTIONS, PRODUCTS, BENEFITS, FAQ, COLOR_FAMILIES } from './data.mjs';
import { LEGAL } from './legal.mjs';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'public');
const SITE_URL = `https://${C.domain}`;

// ---------- Utilitaires ----------
const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const euro = (n) => n.toFixed(2).replace('.', ',') + ' €';
const sizeById = (id) => C.sizes.find((s) => s.id === id);
const minPrice = Math.min(...C.sizes.map((s) => s.price));
const maxPrice = Math.max(...C.sizes.map((s) => s.price));
const defSize = sizeById(C.defaultSize);
const live = PRODUCTS.filter((p) => !p.comingSoon);
const collById = (id) => COLLECTIONS.find((c) => c.id === id);
const pUrl = (p) => `peluche-canette-${p.slug}.html`;
const cUrl = (c) => `collection-${c.id}.html`;
const img = (p, v = '600') => (v === 'full' ? `images/${p.image}.webp` : v === 'og' ? `images/${p.image}-og.jpg` : `images/${p.image}-${v}.webp`);
const todo = (s) => `<span class="todo">${esc(s)}</span>`;
// Remplace les [À COMPLÉTER …] / [À VÉRIFIER …] d'un texte par un surlignage visible
const marks = (s) => esc(s).replace(/\[(À (?:COMPLÉTER|VÉRIFIER|VALIDER)[^\]]*)\]/g, '<span class="todo">[$1]</span>');

// ---------- Icônes (traits, 24x24) ----------
const P = {
  bag: '<path d="M6 7h12l1 13H5L6 7Z"/><path d="M9 7V6a3 3 0 0 1 6 0v1"/>',
  search: '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/>',
  menu: '<path d="M4 7h16M4 12h16M4 17h16"/>',
  close: '<path d="M6 6l12 12M18 6 6 18"/>',
  down: '<path d="m6 9 6 6 6-6"/>',
  right: '<path d="M5 12h14M13 6l6 6-6 6"/>',
  left: '<path d="M19 12H5M11 6l-6 6 6 6"/>',
  truck: '<path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/>',
  return: '<path d="M9 14 4 9l5-5"/><path d="M4 9h11a5 5 0 0 1 0 10h-3"/>',
  lock: '<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/>',
  chat: '<path d="M21 12a8 8 0 0 1-11.6 7.1L4 20l1-4.6A8 8 0 1 1 21 12Z"/>',
  check: '<path d="m5 12 5 5 9-10"/>',
  cloud: '<path d="M7 18a4 4 0 0 1-.6-8 6 6 0 0 1 11.4 1.5A3.5 3.5 0 0 1 17.5 18Z"/>',
  needle: '<path d="M19 5 8 16M15 5h4v4"/><path d="M8 16c-2 0-4 1-4 3"/><circle cx="17.5" cy="6.5" r=".5"/>',
  ruler: '<rect x="3" y="8" width="18" height="8" rx="1.5"/><path d="M7 8v3M11 8v4M15 8v3M19 8v2"/>',
  gift: '<rect x="3" y="9" width="18" height="12" rx="1.5"/><path d="M3 13h18M12 9v12"/><path d="M12 9c-2-4-6-4-6-1.5S10 9 12 9Zm0 0c2-4 6-4 6-1.5S14 9 12 9Z"/>',
  star: '<path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1 6.2L12 17.3 6.5 20.3l1-6.2L3 9.7l6.2-.9Z"/>',
  sparkle: '<path d="M12 3v4M12 17v4M3 12h4M17 12h4M6 6l2.5 2.5M15.5 15.5 18 18M6 18l2.5-2.5M15.5 8.5 18 6"/>',
  heart: '<path d="M12 20s-7-4.5-7-10a4 4 0 0 1 7-2.6A4 4 0 0 1 19 10c0 5.5-7 10-7 10Z"/>',
  mail: '<rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/>',
  box: '<path d="M3 7.5 12 3l9 4.5v9L12 21l-9-4.5Z"/><path d="m3 7.5 9 4.5 9-4.5M12 12v9"/>',
  pin: '<path d="M12 21s7-6 7-11a7 7 0 0 0-14 0c0 5 7 11 7 11Z"/><circle cx="12" cy="10" r="2.5"/>',
  shield: '<path d="M12 3 4 6v6c0 5 3.5 8 8 9 4.5-1 8-4 8-9V6Z"/><path d="m9 12 2 2 4-4"/>',
  plus: '<path d="M12 5v14M5 12h14"/>',
  video: '<rect x="3" y="6" width="13" height="12" rx="2"/><path d="m16 10 5-3v10l-5-3"/>',
  tiktok: '<path d="M14 4v10.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 4c.5 2.5 2.5 4 5 4"/>',
  instagram: '<rect x="3.5" y="3.5" width="17" height="17" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.3" cy="6.7" r=".6" fill="currentColor"/>',
};
const icon = (n, extra = '') => `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" ${extra}>${P[n]}</svg>`;

// ---------- Dessins vectoriels ----------
// Petite canette du logo
const LOGO_CAN = `<svg viewBox="0 0 26 34" aria-hidden="true"><rect x="2" y="4" width="22" height="28" rx="8" fill="#E8358A"/><rect x="5" y="1" width="16" height="6" rx="3" fill="#111"/><circle cx="9.5" cy="17" r="1.8" fill="#111"/><circle cx="16.5" cy="17" r="1.8" fill="#111"/><path d="M10 21.5q3 2.6 6 0" stroke="#111" stroke-width="1.6" fill="none" stroke-linecap="round"/></svg>`;
const LOGO = `<a class="logo" href="index.html" aria-label="${C.brand}, accueil">${LOGO_CAN}<span>${C.brand.toLowerCase()}</span></a>`;

// Silhouette de peluche canette (pour les peluches sans photo, le 404, le panier vide)
function plushShapes(accent, { sad = false, rim = '#9a9a9a', body = accent, face = '#111' } = {}) {
  const mouth = sad ? 'M42 88q8-7 16 0' : 'M42 84q8 8 16 0';
  return `<ellipse cx="18" cy="82" rx="9" ry="14" fill="${body}" transform="rotate(18 18 82)"/>
<ellipse cx="82" cy="82" rx="9" ry="14" fill="${body}" transform="rotate(-18 82 82)"/>
<ellipse cx="36" cy="128" rx="13" ry="10" fill="${body}"/><ellipse cx="64" cy="128" rx="13" ry="10" fill="${body}"/>
<rect x="20" y="14" width="60" height="112" rx="24" fill="${body}"/>
<rect x="26" y="8" width="48" height="14" rx="7" fill="${rim}"/>
<circle cx="40" cy="72" r="5" fill="${face}"/><circle cx="60" cy="72" r="5" fill="${face}"/>
<circle cx="41.6" cy="70.4" r="1.6" fill="#fff"/><circle cx="61.6" cy="70.4" r="1.6" fill="#fff"/>
<path d="${mouth}" stroke="${face}" stroke-width="3" fill="none" stroke-linecap="round"/>
${sad ? '<path d="M66 80q2 5 0 8" stroke="#6fb3ff" stroke-width="3" fill="none" stroke-linecap="round"/>' : ''}`;
}
const plushSvg = (accent, opts = {}) => `<svg class="plush-svg" viewBox="0 0 100 140" aria-hidden="true">${plushShapes(accent, opts)}</svg>`;

// Illustration d'échelle : canette 33 cl + main + les 3 tailles (6 px = 1 cm)
function scaleSvg(accent = '#E8358A') {
  const k = 6, base = 262;
  const plush = (x, cm, label) => {
    const h = cm * k, s = h / 140;
    return `<g transform="translate(${x} ${base - h}) scale(${s})">${plushShapes(accent)}</g>
<text x="${x + 50 * s}" y="${base + 22}" text-anchor="middle" font-size="13" font-weight="700" fill="#111">${label}</text>
<text x="${x + 50 * s}" y="${base + 38}" text-anchor="middle" font-size="12" fill="#6b6b6b">${cm} cm</text>`;
  };
  const canH = 11.5 * k, canW = 6.6 * k;
  return `<svg class="scale-svg" viewBox="0 0 600 310" role="img" aria-label="Comparaison des tailles : porte-clés 12 cm, classique 22 cm et XL 35 cm, à côté d'une canette de 33 cl de 11,5 cm et d'une main d'adulte">
<line x1="10" y1="${base}" x2="590" y2="${base}" stroke="#e6e4e0" stroke-width="2"/>
<g transform="translate(24 ${base - canH})"><rect width="${canW}" height="${canH}" rx="6" fill="#c9ced6"/><rect x="3" y="-4" width="${canW - 6}" height="8" rx="3" fill="#a9afb8"/><rect x="0" y="${canH * 0.3}" width="${canW}" height="${canH * 0.35}" fill="#dfe3e8"/></g>
<text x="${24 + canW / 2}" y="${base + 22}" text-anchor="middle" font-size="13" font-weight="700" fill="#111">Canette</text>
<text x="${24 + canW / 2}" y="${base + 38}" text-anchor="middle" font-size="12" fill="#6b6b6b">33 cl · 11,5 cm</text>
${plush(92, 12, 'Porte-clés')}
${plush(170, 22, 'Classique')}
${plush(290, 35, 'XL')}
<g transform="translate(470 ${base - 18.5 * k})" fill="#f3d2b8" stroke="#e2b897" stroke-width="1.5">
  <rect x="8" y="0" width="13" height="50" rx="6.5"/><rect x="23" y="-6" width="13" height="56" rx="6.5"/><rect x="38" y="-3" width="13" height="53" rx="6.5"/><rect x="53" y="6" width="12" height="44" rx="6"/>
  <rect x="6" y="40" width="61" height="60" rx="18"/><rect x="-14" y="58" width="30" height="13" rx="6.5" transform="rotate(-35 0 64)"/>
</g>
<text x="506" y="${base + 22}" text-anchor="middle" font-size="13" font-weight="700" fill="#111">Main d'adulte</text>
<text x="506" y="${base + 38}" text-anchor="middle" font-size="12" fill="#6b6b6b">≈ 18,5 cm</text>
</svg>`;
}

// Collage de 3 photos d'une collection (ou silhouettes si pas de photo)
function collage(coll) {
  const ps = PRODUCTS.filter((p) => p.collection === coll.id).slice(0, 3);
  return `<div class="collage" aria-hidden="true">${ps
    .map((p) => (p.image ? `<img src="${img(p, '300')}" alt="" loading="lazy" width="300" height="300">` : plushSvg(p.accent, { rim: '#111' })))
    .join('')}</div>`;
}

// ---------- Fragments communs ----------
const PAYMENTS = `<div class="payments" aria-label="Moyens de paiement acceptés">${['CB', 'VISA', 'MC', 'PayPal', 'Apple Pay', 'G Pay'].map((x) => `<span>${x}</span>`).join('')}</div>`;

const REASSURANCE = [
  { icon: 'truck', title: `Livraison offerte dès ${C.freeShipping} €`, text: `${C.deliveryDays[0]} à ${C.deliveryDays[1]} jours ouvrés` },
  { icon: 'return', title: `${C.returnDays} jours pour changer d'avis`, text: 'Satisfait ou remboursé' },
  { icon: 'lock', title: 'Paiement sécurisé', text: 'CB, PayPal, Apple Pay' },
  { icon: 'pin', title: `Expédié depuis la ${C.shipFrom}`, text: `Avant ${C.cutoffHour} h = parti le jour même` },
];

function card(p, { eager = false } = {}) {
  const coll = collById(p.collection);
  const style = `--accent:${p.accent}`;
  if (p.comingSoon) {
    return `<article class="card card--soon" style="${style}" data-collection="${p.collection}" data-colors="${p.colors.join(' ')}" data-name="${esc(p.name)}">
<div class="card__media-wrap"><div class="card__media">${plushSvg(p.accent, { rim: '#111' })}<div class="badges"><span class="badge badge--soon">Bientôt</span></div></div></div>
<div class="card__body"><p class="card__coll">${coll.name}</p><h3 class="card__title">${esc(p.name)}</h3><p class="card__price muted small">Bientôt disponible</p></div></article>`;
  }
  const siblings = PRODUCTS.filter((x) => x.collection === p.collection && !x.comingSoon);
  return `<article class="card" style="${style}" data-collection="${p.collection}" data-colors="${p.colors.join(' ')}" data-name="${esc(p.name)}" data-slug="${p.slug}">
<div class="card__media-wrap"><a class="card__media" href="${pUrl(p)}" tabindex="-1" aria-hidden="true"><img src="${img(p, '600')}" alt="${esc(p.alt)}" width="600" height="600" ${eager ? 'fetchpriority="high"' : 'loading="lazy"'}></a>
<button class="card__quick" type="button" data-quick-add="${p.slug}" aria-label="Ajout rapide : ${esc(p.name)}">${icon('plus')}</button></div>
<div class="card__body"><p class="card__coll">${coll.name}</p><h3 class="card__title"><a href="${pUrl(p)}">${esc(p.name)}</a></h3>
<p class="card__price" data-card-price>${euro(defSize.price)} <small>· ${defSize.label} ${defSize.cm} cm</small></p>
<div class="card__dots" aria-label="Autres couleurs de la collection">${siblings.map((s) => `<a href="${pUrl(s)}" style="background:${s.accent}" title="${esc(s.name)}" aria-label="${esc(s.name)}" ${s.slug === p.slug ? 'aria-current="true"' : ''}></a>`).join('')}</div></div></article>`;
}

function breadcrumb(items) {
  const ld = {
    '@context': 'https://schema.org', '@type': 'BreadcrumbList',
    itemListElement: items.map(([name, url], i) => ({ '@type': 'ListItem', position: i + 1, name, ...(url ? { item: `${SITE_URL}/${url}` } : {}) })),
  };
  const html = `<nav class="breadcrumb" aria-label="Fil d'Ariane"><ol>${items
    .map(([name, url], i) => `<li>${url && i < items.length - 1 ? `<a href="${url}">${esc(name)}</a>` : `<span aria-current="page" data-crumb-last>${esc(name)}</span>`}</li>`)
    .join('')}</ol></nav>`;
  return { html, ld };
}

// ---------- Gabarit de page ----------
function layout({ file, title, description, body, ld = [], ogImage, accent, noindex = false, current = '' }) {
  const fullTitle = title.includes(C.brand) ? title : `${title} | ${C.brand}`;
  const og = ogImage ? `${SITE_URL}/${ogImage}` : `${SITE_URL}/${img(live[0], 'og')}`;
  const nav = [
    ['Toutes les peluches', 'peluches.html'],
    ['__collections'],
    ['Packs', 'creer-mon-pack.html'],
    ['Porte-clés', 'peluches.html?taille=porte-cles'],
    ['Idées cadeaux', 'idees-cadeaux.html'],
    ['Notre histoire', 'notre-histoire.html'],
    ['Aide', 'faq.html'],
  ];
  const mega = `<div class="nav__item"><button type="button" aria-haspopup="true">Collections ${icon('down')}</button>
<div class="mega">${COLLECTIONS.map((c) => `<a class="mega__tile" href="${cUrl(c)}" style="--accent:${c.accent}">${collage(c)}<strong>${c.name}${c.comingSoon ? ' · bientôt' : ''}</strong></a>`).join('')}
<div class="mega__best"><h3>Coups de cœur</h3>${live.filter((p) => ['edition-rose', 'ultra-noire', 'edition-classique'].includes(p.slug)).map((p) => `<a href="${pUrl(p)}" style="--accent:${p.accent}"><img src="${img(p, '300')}" alt="" loading="lazy" width="48" height="48">${esc(p.name)}</a>`).join('')}</div></div></div>`;
  const announce = [
    [icon('truck'), `Livraison offerte dès ${C.freeShipping} €`],
    [icon('return'), `${C.returnDays} jours pour changer d'avis`],
    [icon('pin'), `Expédié depuis la ${C.shipFrom}`],
    [icon('gift'), 'Emballage cadeau disponible'],
  ];
  const announceHtml = announce.map(([i, t]) => `<span>${i.replace('<svg', '<svg width="16" height="16"')}${t}</span>`).join('');

  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(description)}">
${noindex ? '<meta name="robots" content="noindex">' : `<link rel="canonical" href="${SITE_URL}/${file === 'index.html' ? '' : file}">`}
<meta name="theme-color" content="#ffffff">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${C.brand}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(description)}">
<meta property="og:image" content="${og}">
<meta property="og:locale" content="fr_FR">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="data:image/svg+xml,${encodeURIComponent(LOGO_CAN.replace('<svg', '<svg xmlns="http://www.w3.org/2000/svg"'))}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Nunito:wght@800;900&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/styles.css">
${ld.map((x) => `<script type="application/ld+json">${JSON.stringify(x)}</script>`).join('\n')}
<script src="assets/data.js" defer></script>
<script src="assets/app.js" defer></script>
</head>
<body${accent ? ` style="--accent:${accent}"` : ''}>
<a class="skip-link" href="#contenu">Aller au contenu</a>
<div class="announce" role="region" aria-label="Informations"><div class="announce__track">${announceHtml}${announceHtml.replace(/<span>/g, '<span aria-hidden="true">')}</div></div>
<header class="header" id="header">
  <div class="container header__inner">
    <button class="icon-btn header__burger" type="button" data-open="menu-drawer" aria-label="Ouvrir le menu" aria-controls="menu-drawer" aria-expanded="false">${icon('menu')}</button>
    ${LOGO}
    <nav class="nav" aria-label="Navigation principale">${nav.map(([t, u]) => (t === '__collections' ? mega : `<a href="${u}"${current === u ? ' aria-current="page"' : ''}>${t}</a>`)).join('')}</nav>
    <div class="header__actions">
      <button class="icon-btn" type="button" data-open-search aria-label="Rechercher">${icon('search')}</button>
      <a class="icon-btn" href="panier.html" data-open="cart-drawer" aria-label="Panier" aria-controls="cart-drawer">${icon('bag')}<span class="cart-count" data-cart-count>0</span></a>
    </div>
  </div>
</header>

<div class="search-panel" id="search-panel" role="dialog" aria-modal="true" aria-label="Recherche">
  <div class="container">
    <form class="search-panel__bar" action="recherche.html" role="search">
      <label class="visually-hidden" for="search-input">Rechercher une peluche</label>
      <input class="input" id="search-input" name="q" type="search" placeholder="Rechercher une peluche, une couleur…" autocomplete="off">
      <button class="icon-btn" type="button" data-close-search aria-label="Fermer la recherche">${icon('close')}</button>
    </form>
    <div class="search-results" id="search-results" aria-live="polite"></div>
  </div>
</div>

<nav class="drawer drawer--left" id="menu-drawer" aria-label="Menu" aria-hidden="true">
  <div class="drawer__head">${LOGO}<button class="icon-btn" type="button" data-close aria-label="Fermer le menu">${icon('close')}</button></div>
  <div class="drawer__body">
    <div class="menu-tiles">${COLLECTIONS.map((c) => `<a href="${cUrl(c)}" style="--accent:${c.accent}">${collage(c)}<strong>${c.name}</strong></a>`).join('')}<a href="creer-mon-pack.html" style="--accent:#111"><div class="collage" aria-hidden="true">${live.slice(4, 7).map((p) => `<img src="${img(p, '300')}" alt="" loading="lazy">`).join('')}</div><strong>Créer mon pack</strong></a></div>
    <ul class="menu-links">${nav.filter(([t]) => t !== '__collections').map(([t, u]) => `<li><a href="${u}">${t}${icon('right').replace('<svg', '<svg width="18" height="18"')}</a></li>`).join('')}<li><a href="contact.html">Contact${icon('right').replace('<svg', '<svg width="18" height="18"')}</a></li></ul>
  </div>
</nav>

<aside class="drawer drawer--right" id="cart-drawer" aria-label="Panier" aria-hidden="true">
  <div class="drawer__head"><h2>Ton panier</h2><button class="icon-btn" type="button" data-close aria-label="Fermer le panier">${icon('close')}</button></div>
  <div class="drawer__body" id="cart-drawer-body"></div>
  <div class="drawer__foot" id="cart-drawer-foot"></div>
</aside>
<div class="backdrop" data-close></div>
<div class="toast-zone" id="toast-zone" aria-live="polite"></div>

<main id="contenu">
${body}
</main>

<footer class="footer">
  <div class="container">
    <div class="footer__news">
      <div><h2>Les nouveautés en avant-première</h2><p class="muted mb-0">Sorties de collections, réassorts et idées cadeaux. Un email par mois, pas plus.</p></div>
      <form data-newsletter novalidate>
        <label class="visually-hidden" for="nl-email">Ton adresse email</label>
        <input class="input" id="nl-email" type="email" name="email" placeholder="ton@email.fr" required autocomplete="email">
        <button class="btn" type="submit">Je m'inscris</button>
      </form>
    </div>
    <div class="footer__cols">
      <div>${LOGO}<p class="muted small" style="margin-top:12px">${esc(C.slogan)}</p><p class="small">${marks(C.company.name)}<br>${marks(C.company.city)}</p>
        <div class="socials"><a href="${C.social.tiktok}" aria-label="TikTok" rel="noopener" target="_blank">${icon('tiktok')}</a><a href="${C.social.instagram}" aria-label="Instagram" rel="noopener" target="_blank">${icon('instagram')}</a></div></div>
      <div><h3>Boutique</h3><ul><li><a href="peluches.html">Toutes les peluches</a></li>${COLLECTIONS.map((c) => `<li><a href="${cUrl(c)}">Collection ${c.name}</a></li>`).join('')}<li><a href="creer-mon-pack.html">Créer mon pack</a></li><li><a href="idees-cadeaux.html">Idées cadeaux</a></li></ul></div>
      <div><h3>Aide</h3><ul><li><a href="faq.html">FAQ</a></li><li><a href="livraison.html">Livraison</a></li><li><a href="retours.html">Retours</a></li><li><a href="suivi-de-commande.html">Suivi de commande</a></li><li><a href="contact.html">Contact</a></li><li><a href="guide-des-tailles.html">Guide des tailles</a></li></ul></div>
      <div><h3>Marque</h3><ul><li><a href="notre-histoire.html">Notre histoire</a></li><li><a href="${C.social.tiktok}" rel="noopener" target="_blank">TikTok</a></li><li><a href="${C.social.instagram}" rel="noopener" target="_blank">Instagram</a></li></ul></div>
      <div><h3>Légal</h3><ul><li><a href="mentions-legales.html">Mentions légales</a></li><li><a href="cgv.html">CGV</a></li><li><a href="confidentialite.html">Confidentialité</a></li><li><a href="cookies.html">Cookies</a></li></ul></div>
    </div>
    <div class="footer__bottom"><span>© ${C.year} ${C.brand}. Tous droits réservés.</span>${PAYMENTS}</div>
  </div>
</footer>
</body>
</html>`;
}

// ---------- Données structurées globales ----------
const LD_ORG = { '@context': 'https://schema.org', '@type': 'Organization', name: C.brand, url: SITE_URL, email: C.email, sameAs: [C.social.tiktok, C.social.instagram] };
const LD_SITE = { '@context': 'https://schema.org', '@type': 'WebSite', name: C.brand, url: SITE_URL, potentialAction: { '@type': 'SearchAction', target: `${SITE_URL}/recherche.html?q={search_term_string}`, 'query-input': 'required name=search_term_string' } };
const ldFaq = (items) => ({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: items.map((f) => ({ '@type': 'Question', name: f.q, acceptedAnswer: { '@type': 'Answer', text: f.a.replace(/\s*\[À[^\]]*\]/g, '') } })) });

const faqAccordion = (items) => `<div class="accordion">${items.map((f) => `<details><summary>${esc(f.q)}</summary><div class="accordion__body"><p>${marks(f.a)}</p></div></details>`).join('')}</div>`;
const railNav = (id) => `<div class="rail-nav"><button type="button" data-rail="${id}" data-dir="-1" aria-label="Précédent">${icon('left')}</button><button type="button" data-rail="${id}" data-dir="1" aria-label="Suivant">${icon('right')}</button></div>`;

const pages = [];
const page = (file, opts) => pages.push({ file, html: layout({ file, ...opts }) });

// =====================================================================
// 1) ACCUEIL
// =====================================================================
{
  const featured = ['edition-rose', 'ultra-noire', 'edition-classique', 'ultra-verte', 'edition-hiver', 'ultra-violette', 'ultra-rose', 'edition-coco'].map((s) => PRODUCTS.find((p) => p.slug === s));
  const homeFaq = FAQ.filter((f) => /taille réelle|laver|délais|mélanger|retourner une/.test(f.q));
  const body = `
<section class="hero">
  <div class="container hero__text">
    <p class="eyebrow">Peluches canettes kawaii</p>
    <h1>La peluche canette qui fait <em>craquer tout le monde</em></h1>
    <p class="lead" style="margin-inline:auto">Toute douce, brodée avec soin et pleine de bonne humeur. Le cadeau parfait pour un gamer, une meilleure amie, ou ta propre chambre.</p>
    <div class="hero__ctas"><a class="btn btn--lg" href="peluches.html">Je choisis ma peluche</a><a class="btn btn--lg btn--secondary" href="creer-mon-pack.html">Créer mon pack</a></div>
    <p class="hero__proof"><span>${icon('check')}Livraison offerte dès ${C.freeShipping} €</span><span>${icon('check')}${C.returnDays} jours pour changer d'avis</span><span>${icon('check')}Expédié depuis la ${C.shipFrom}</span></p>
  </div>
  <div class="family">${live.map((p, i) => `<a href="${pUrl(p)}" aria-label="${esc(p.name)}"><img src="${img(p, '300')}" alt="${esc(p.alt)}" width="300" height="300" ${i < 7 ? 'fetchpriority="high"' : 'loading="lazy"'}></a>`).join('')}</div>
</section>

<section class="trust" aria-label="Nos engagements"><div class="container"><ul class="trust__list">${REASSURANCE.map((r) => `<li><span class="trust__icon">${icon(r.icon)}</span><span><strong>${r.title}</strong><span class="muted small">${r.text}</span></span></li>`).join('')}</ul></div></section>

<section class="section"><div class="container">
  <div class="section__head"><div><p class="eyebrow">Nos coups de cœur</p><h2>Les plus craquantes</h2></div>${railNav('rail-best')}</div>
  <div class="rail" id="rail-best">${featured.map((p) => card(p)).join('')}</div>
</div></section>

<section class="section section--soft"><div class="container">
  <div class="section__head"><div><p class="eyebrow">3 collections</p><h2>Trouve ta team</h2></div><a class="link" href="peluches.html">Tout voir</a></div>
  <div class="tiles">${COLLECTIONS.map((c) => `<a class="tile reveal" href="${cUrl(c)}" style="--accent:${c.accent}">${collage(c)}<div class="tile__body"><h3>${c.name}</h3><p>${esc(c.short)}</p><span class="tile__cta">${c.comingSoon ? 'Découvrir en avant-première' : 'Voir la collection'} ${icon('right')}</span></div></a>`).join('')}</div>
</div></section>

<section class="section"><div class="container">
  <div class="section__head"><div><p class="eyebrow">Pourquoi on les adore</p><h2>Petites canettes, gros câlins</h2></div></div>
  <div class="benefits">${BENEFITS.map((b, i) => `<div class="benefit reveal" style="--accent:${['#E8358A', '#2E8BE6', '#7AC943', '#6B3FA0'][i]}"><div class="benefit__icon">${icon(b.icon)}</div><h3>${b.title}</h3><p>${b.text}</p></div>`).join('')}</div>
</div></section>

<section class="section pt-0"><div class="container">
  <div class="pack-banner reveal">
    <div><p class="eyebrow" style="color:#aaa">Créer mon pack</p><h2>2 peluches = -${C.packs[1].discount} %<br>3 peluches = -${C.packs[2].discount} %</h2><p>Mélange les collections comme tu veux. La remise s'applique toute seule dans ton panier.</p><a class="btn btn--white btn--lg" href="creer-mon-pack.html">Je compose mon pack</a></div>
    <div class="pack-banner__slots">${['edition-rose', 'ultra-verte', 'edition-hiver'].map((s, i) => `${i ? '<span class="pack-banner__plus" aria-hidden="true">+</span>' : ''}<img src="${img(PRODUCTS.find((p) => p.slug === s), '300')}" alt="" loading="lazy" width="140" height="140">`).join('')}</div>
  </div>
</div></section>

<section class="section section--soft"><div class="container">
  <div class="section__head"><div><p class="eyebrow">Vu sur TikTok et Instagram</p><h2>Ta peluche, ta vidéo</h2></div><a class="link" href="${C.social.tiktok}" rel="noopener" target="_blank">Suis-nous</a></div>
  <div class="ugc">${[1, 2, 3, 4].map(() => `<div class="ugc__item">${icon('video')}<span>Bientôt : les vidéos de nos clients.<br>Poste la tienne avec <b>#${C.brand.toLowerCase()}</b></span></div>`).join('')}</div>
</div></section>

<section class="section"><div class="container">
  <div class="season reveal"><div><p class="eyebrow">Guide cadeau</p><h2>${esc(C.seasonal.title)}</h2><p>${marks(C.seasonal.text)}</p></div><a class="btn btn--lg" href="idees-cadeaux.html">${esc(C.seasonal.cta)}</a></div>
</div></section>

<section class="section section--soft"><div class="container" style="max-width:860px">
  <div class="section__head"><h2>Tes questions</h2><a class="link" href="faq.html">Toute la FAQ</a></div>
  ${faqAccordion(homeFaq)}
</div></section>

<section class="section"><div class="container seo-text">
  <h2 style="font-size:1.375rem">La peluche canette, le cadeau original qui fait l'unanimité</h2>
  <details><summary>Lire la suite</summary><div class="seo-body">
  <p>La <strong>peluche canette</strong> est devenue l'objet déco préféré des chambres d'ados et des setups gamer. Le principe est simple : une canette de boisson énergisante transformée en peluche toute douce, avec de petits bras, des pieds ronds et un visage kawaii brodé. Le résultat fait sourire tout le monde, des collégiens aux adultes qui télétravaillent.</p>
  <p>Chez ${C.brand}, chaque peluche canette existe en trois tailles. Le format <strong>porte-clés</strong> de ${sizeById('porte-cles').cm} cm s'accroche à un sac ou à une trousse. La <strong>Classique</strong> de ${defSize.cm} cm trouve sa place sur un bureau, à côté du clavier ou de l'écran. La <strong>XL</strong> de ${sizeById('xl').cm} cm devient un vrai coussin pour le lit ou le canapé. Le guide des tailles compare chaque format à une canette de 33 cl et à une main.</p>
  <p>Nos peluches sont réparties en collections. Les <strong>Éditions</strong> sont fines et élancées, avec de grosses lettres brodées. Les <strong>Ultra</strong> sont rondes et dodues, avec une grosse griffe sur le ventre, en sept couleurs. La collection <strong>Pétillante</strong> arrive bientôt.</p>
  <p>C'est une <strong>idée cadeau originale</strong> pour un anniversaire, Noël ou la Saint-Valentin, surtout pour un <strong>ado gamer</strong> ou une fan de déco kawaii. Pour aller plus loin, compose un pack de 2 ou 3 peluches avec une remise automatique, ajoute un prénom brodé pour un cadeau unique, et choisis l'emballage cadeau avec une carte message.</p>
  <p>Toutes les commandes partent de la ${C.shipFrom}, la livraison est offerte dès ${C.freeShipping} € d'achat, et tu as ${C.returnDays} jours pour changer d'avis. Une peluche canette, c'est le genre de cadeau qu'on garde des années, et qu'on montre à tout le monde.</p>
  </div></details>
</div></section>`;
  page('index.html', {
    title: `Peluche canette kawaii : le cadeau doux et original | ${C.brand}`,
    description: `Peluches canettes kawaii toutes douces, en 3 tailles. Le cadeau original pour un gamer ou une fan de déco. Livraison offerte dès ${C.freeShipping} €, expédié depuis la ${C.shipFrom}.`,
    body, ld: [LD_ORG, LD_SITE], current: 'index.html',
  });
}

// =====================================================================
// 2) COLLECTIONS (toutes + une par collection)
// =====================================================================
function collectionPage({ file, coll }) {
  const items = coll ? PRODUCTS.filter((p) => p.collection === coll.id) : [...live, ...PRODUCTS.filter((p) => p.comingSoon)];
  const name = coll ? `Peluches canettes ${coll.name}` : 'Toutes les peluches canettes';
  const accent = coll ? coll.accent : '#3B4FD8';
  const bc = breadcrumb([['Accueil', 'index.html'], ...(coll ? [['Toutes les peluches', 'peluches.html']] : []), [coll ? `Collection ${coll.name}` : 'Toutes les peluches', file]]);
  const usedColors = [...new Set(items.flatMap((p) => p.colors))];
  const body = `
<div class="container" id="collection-root" data-collection="${coll ? coll.id : 'all'}" style="--accent:${accent}">
  ${bc.html}
  <header class="coll-banner">
    <div><h1>${esc(name)}</h1><p>${esc(coll ? coll.short : 'Toutes nos peluches canettes kawaii, en un coup d’œil. Choisis ta collection, ta couleur et ta taille.')}</p></div>
    <div class="collage" aria-hidden="true">${(coll ? items : live).filter((p) => p.image).slice(0, 3).map((p) => `<img src="${img(p, '300')}" alt="" width="300" height="300">`).join('') || items.slice(0, 3).map((p) => plushSvg(p.accent, { rim: '#111' })).join('')}</div>
  </header>
  <div class="toolbar">
    <button class="btn btn--secondary btn--sm filter-toggle" type="button" data-open-filters>Filtrer</button>
    <p class="toolbar__count" id="count" aria-live="polite"></p>
    <label class="row small"><span class="muted">Trier</span><select class="select" id="sort">
      <option value="featured">Nos coups de cœur</option><option value="new">Nouveautés</option><option value="price-asc">Prix croissant</option><option value="price-desc">Prix décroissant</option><option value="az">De A à Z</option>
    </select></label>
  </div>
  <div class="coll-layout">
    <form class="filters" id="filters" aria-label="Filtres">
      <div class="filters__head"><h2 class="h3" style="font-size:1.25rem;margin:0">Filtres</h2><button class="icon-btn" type="button" data-close-filters aria-label="Fermer les filtres">${icon('close')}</button></div>
      ${coll ? '' : `<fieldset><legend>Collection</legend>${COLLECTIONS.map((c) => `<label class="check"><input type="checkbox" name="collection" value="${c.id}"> ${c.name}<small>${PRODUCTS.filter((p) => p.collection === c.id).length}</small></label>`).join('')}</fieldset>`}
      <fieldset><legend>Couleur</legend><div class="color-filters">${usedColors.map((k) => `<label title="${k}"><input type="checkbox" name="color" value="${k}" aria-label="${k}"><span style="background:${COLOR_FAMILIES[k]}"></span></label>`).join('')}</div></fieldset>
      <fieldset><legend>Taille</legend><div class="size-filters">${C.sizes.map((s) => `<label><input type="radio" name="size" value="${s.id}" ${s.id === C.defaultSize ? 'checked' : ''}><span>${s.label} · ${s.cm} cm</span></label>`).join('')}</div><p class="small muted" style="margin:8px 0 0">Toutes nos peluches existent dans les 3 tailles. Les prix affichés suivent la taille choisie.</p></fieldset>
      <fieldset><legend>Disponibilité</legend><label class="check"><input type="checkbox" name="available" value="1"> En stock uniquement</label></fieldset>
      <div class="filters__actions"><button class="btn btn--secondary btn--sm" type="reset">Effacer</button><button class="btn btn--sm" type="button" data-close-filters>Voir les peluches</button></div>
    </form>
    <div>
      <div class="grid" id="grid">${items.map((p, i) => card(p, { eager: i < 2 })).join('')}</div>
      <div class="load-more" id="load-more" hidden><p class="small muted" id="load-count"></p><div class="progress"><div class="progress__bar" id="load-bar"></div></div><button class="btn btn--secondary" type="button" id="load-btn">Voir plus</button></div>
    </div>
  </div>
  <section class="section seo-text"><h2 style="font-size:1.375rem">${esc(coll ? `À propos de la collection ${coll.name}` : 'Nos peluches canettes')}</h2><p class="muted">${esc(coll ? coll.long : COLLECTIONS.map((c) => c.long).join(' '))}</p></section>
</div>`;
  page(file, {
    title: `${name} | ${C.brand}`,
    description: coll ? `${coll.short} Dès ${euro(minPrice)}, livraison offerte dès ${C.freeShipping} €.` : `Toutes nos peluches canettes kawaii : Éditions, Ultra et bientôt Pétillante. 3 tailles, dès ${euro(minPrice)}.`,
    body, ld: [bc.ld, { '@context': 'https://schema.org', '@type': 'CollectionPage', name, url: `${SITE_URL}/${file}` }], accent, current: file === 'peluches.html' ? file : '',
  });
}
collectionPage({ file: 'peluches.html' });
COLLECTIONS.forEach((coll) => collectionPage({ file: cUrl(coll), coll }));

// =====================================================================
// 3) FICHES PRODUIT
// =====================================================================
for (const p of live) {
  const coll = collById(p.collection);
  const file = pUrl(p);
  const bc = breadcrumb([['Accueil', 'index.html'], [`Collection ${coll.name}`, cUrl(coll)], [p.name, file]]);
  const others = live.filter((x) => x.slug !== p.slug);
  const swatchGroups = COLLECTIONS.map((c) => {
    const ps = PRODUCTS.filter((x) => x.collection === c.id);
    return `<div class="swatch-group"><p class="swatch-group__title">${c.name}${c.comingSoon ? ' · bientôt' : ''}</p><div class="swatches">${ps
      .map((x) => (x.comingSoon
        ? `<span class="swatch swatch--soon" style="--accent:${x.accent}" title="${esc(x.name)} : bientôt" aria-label="${esc(x.name)} : bientôt disponible">${plushSvg(x.accent, { rim: '#111' })}</span>`
        : `<a class="swatch" href="${pUrl(x)}" data-swatch="${x.slug}" style="--accent:${x.accent}" aria-label="${esc(x.name)}" ${x.slug === p.slug ? 'aria-current="true"' : ''}><img src="${img(x, '300')}" alt="" width="80" height="80" loading="lazy"></a>`))
      .join('')}</div></div>`;
  }).join('');
  const ldProduct = {
    '@context': 'https://schema.org', '@type': 'Product',
    name: `Peluche canette ${p.name}`, image: [`${SITE_URL}/${img(p, 'full')}`], description: `${p.hook} ${p.text}`,
    sku: `PL-${p.collection.toUpperCase()}-${p.slug.split('-').slice(1).join('-').toUpperCase()}`,
    brand: { '@type': 'Brand', name: C.brand }, color: p.name,
    offers: { '@type': 'AggregateOffer', priceCurrency: 'EUR', lowPrice: minPrice.toFixed(2), highPrice: maxPrice.toFixed(2), offerCount: C.sizes.length, availability: 'https://schema.org/InStock', url: `${SITE_URL}/${file}` },
  };
  const body = `
<div class="container pdp" id="pdp" data-slug="${p.slug}" style="--accent:${p.accent}">
  ${bc.html}
  <div class="pdp__grid">
    <div class="gallery" aria-label="Photos de la peluche">
      <figure class="gallery__item gallery__item--main" id="gallery-main">
        <img id="main-img" src="${img(p, 'full')}" alt="${esc(p.alt)}" width="1024" height="1024" fetchpriority="high">
        <span class="emb-preview" id="emb-preview" aria-hidden="true"></span>
        <span class="gallery__zoom-hint">Survole pour zoomer · clique pour agrandir</span>
        <span class="gallery__counter">1/2</span>
      </figure>
      <figure class="gallery__item gallery__item--scale">
        ${scaleSvg(p.accent)}
        <figcaption>Les 3 tailles, à côté d'une canette de 33 cl</figcaption>
        <span class="gallery__counter">2/2</span>
      </figure>
    </div>

    <div class="buy">
      <div class="buy__top">
        <a class="link--blue small" href="${cUrl(coll)}" data-p-coll>Collection ${coll.name}</a>
        <p class="buy__brand">${C.brand}</p>
        <h1 class="buy__name">Peluche canette <span data-p-name>${esc(p.name)}</span></h1>
        <p class="buy__hook" data-p-hook>${esc(p.hook)}</p>
        <div class="buy__reviews"><span>Pas encore d'avis</span><span class="sep"></span><a class="link" href="#avis">Donner mon avis</a></div>
      </div>

      <div class="price" aria-live="polite">
        <p class="price__now mb-0"><span id="price-now">${euro(defSize.price)}</span><small>Taxes incluses.</small></p>
        <p class="price__was mb-0" id="price-was" hidden></p>
      </div>

      <div>
        <p class="option__label">Couleur : <b data-p-name>${esc(p.name)}</b></p>
        ${swatchGroups}
      </div>

      <div>
        <p class="option__label">Taille : <b id="size-label">${defSize.cm} cm de hauteur</b> <button class="link" type="button" data-open-modal="size-modal">Guide des tailles</button></p>
        <div class="sizes" role="radiogroup" aria-label="Taille">${C.sizes.map((s) => `<button class="size-btn" type="button" role="radio" data-size="${s.id}" aria-checked="${s.id === C.defaultSize}"><strong>${s.label}</strong><span>${s.cm} cm · ${euro(s.price)}</span></button>`).join('')}</div>
      </div>

      <div>
        <p class="option__label">Formule : <b id="pack-label">1 peluche</b></p>
        <div class="packs" role="radiogroup" aria-label="Formule">${C.packs.map((k) => `<button class="pack-card" type="button" role="radio" data-pack="${k.n}" aria-checked="${k.n === 1}">${k.badge ? `<span class="badge badge--best">${k.badge}</span>` : ''}<strong>${k.label}</strong><span data-pack-price="${k.n}"></span>${k.discount ? `<em>-${k.discount} %</em>` : '<span>Juste elle</span>'}</button>`).join('')}</div>
      </div>
      <div class="pack-picks" id="pack-picks" hidden></div>

      <div class="extras">
        ${C.embroidery.enabled ? `<label class="check" id="emb-wrap"><input type="checkbox" id="emb-toggle"> Ajouter un prénom brodé (+${euro(C.embroidery.price)})</label>
        <div class="extras__field" id="emb-field" hidden><label class="visually-hidden" for="emb-input">Prénom à broder</label><input class="input" id="emb-input" maxlength="${C.embroidery.maxLength}" placeholder="Ex. Léa" autocomplete="off"><span class="counter"><span id="emb-count">0</span>/${C.embroidery.maxLength} caractères · aperçu en direct sur la photo</span><span class="small muted">Une peluche personnalisée ne peut pas être retournée (sauf défaut).</span></div>` : ''}
        ${C.giftWrap.enabled ? `<label class="check"><input type="checkbox" id="gift-toggle"> Emballage cadeau + carte message (+${euro(C.giftWrap.price)})</label>
        <div class="extras__field" id="gift-field" hidden><label class="visually-hidden" for="gift-msg">Message de la carte</label><textarea class="textarea" id="gift-msg" maxlength="200" placeholder="Ton message (facultatif)"></textarea></div>` : ''}
      </div>

      <div class="atc-row">
        <span class="stock">En stock</span>
        <button class="btn btn--block atc" type="button" id="atc">${icon('bag')}<span>Ajouter au panier · <span id="atc-price">${euro(defSize.price)}</span></span></button>
        <div class="delivery">${icon('truck')}<span id="delivery-text">Calcul de la date de livraison…</span></div>
      </div>

      <ul class="reassure">${REASSURANCE.map((r) => `<li>${icon(r.icon)}<span>${r.title}</span></li>`).join('')}</ul>
      ${PAYMENTS}
    </div>
  </div>

  <div class="below">
    <div class="pdp-info">
      <div class="accordion">
        <details open><summary>Description</summary><div class="accordion__body"><p data-p-text>${esc(p.text)}</p><p><b data-p-gift>${esc(p.gift)}</b></p></div></details>
        <details><summary>Matières et entretien</summary><div class="accordion__body"><ul><li>Tissu peluche doux en polyester, rembourrage en ouate de polyester ${todo('[À VÉRIFIER : fiche fournisseur]')}</li><li>Visage et motifs brodés (pas imprimés)</li><li>Lavable en machine à 30 °C, dans un filet, cycle délicat</li><li>Séchage à l'air libre, pas de sèche-linge</li></ul></div></details>
        <details><summary>Dimensions</summary><div class="accordion__body"><ul>${C.sizes.map((s) => `<li><b>${s.label}</b> : environ ${s.cm} cm de hauteur</li>`).join('')}</ul><p class="small muted">Les dimensions peuvent varier de ±1 cm (fabrication artisanale du rembourrage). <a class="link" href="guide-des-tailles.html">Voir le guide des tailles</a></p></div></details>
        <details><summary>Sécurité</summary><div class="accordion__body"><p>Âge conseillé : à partir de ${C.ageMin} ans.</p><p><b>Porte-clés :</b> contient un anneau métallique et de petites pièces. Ne convient pas aux enfants de moins de 36 mois.</p>${C.ceCompliant ? '<p>Conforme à la norme européenne EN71 · marquage CE.</p>' : `<p>${todo('[À COMPLÉTER : marquage CE et norme EN71, avec les certificats du fournisseur]')}</p>`}</div></details>
        <details><summary>Livraison et retours</summary><div class="accordion__body"><p>Expédié depuis la ${C.shipFrom}. Commande avant ${C.cutoffHour} h un jour ouvré : ta peluche part le jour même, puis ${C.deliveryDays[0]} à ${C.deliveryDays[1]} jours ouvrés de livraison. Livraison offerte dès ${C.freeShipping} €.</p><p>Tu as ${C.returnDays} jours pour changer d'avis. Les peluches avec un prénom brodé ne sont pas reprises (sauf défaut). <a class="link" href="retours.html">Tout savoir sur les retours</a></p></div></details>
      </div>
      <div class="pdp-promise">
        <h2>Pourquoi tu vas l'adorer</h2>
        <ul>${BENEFITS.map((b) => `<li>${icon('check')}<span><b>${b.title}.</b> ${b.text}</span></li>`).join('')}</ul>
        <p class="small muted mb-0">Elle n'est pas aussi belle qu'en photo ? Tu as ${C.returnDays} jours pour nous la renvoyer.</p>
      </div>
    </div>

    <section class="together" aria-labelledby="together-title">
      <h2 id="together-title" class="mb-0" style="font-size:var(--h3)">Souvent achetés ensemble</h2>
      <div class="together__items">
        <div class="together__item"><img src="${img(p, '300')}" alt="" width="96" height="96" loading="lazy">Peluche ${esc(p.name)}<span class="muted">${defSize.label} · ${euro(defSize.price)}</span></div>
        <span class="together__plus" aria-hidden="true">+</span>
        <div class="together__item"><img src="${img(p, '300')}" alt="" width="96" height="96" loading="lazy" style="transform:scale(.6)">Porte-clés assorti<span class="muted">${euro(sizeById('porte-cles').price)}</span></div>
        <span class="together__plus" aria-hidden="true">+</span>
        <div class="together__item"><span class="gift-ico">${icon('gift')}</span>Emballage cadeau<span class="muted">${euro(C.giftWrap.price)}</span></div>
      </div>
      <div class="together__foot"><p class="mb-0">Total : <b>${euro(defSize.price + sizeById('porte-cles').price + C.giftWrap.price)}</b></p><button class="btn" type="button" id="together-add">Tout ajouter au panier</button></div>
    </section>

    <section aria-labelledby="more-title">
      <div class="section__head"><h2 id="more-title">Complète ta collection</h2>${railNav('rail-more')}</div>
      <div class="rail" id="rail-more">${[...others.filter((x) => x.collection === p.collection), ...others.filter((x) => x.collection !== p.collection)].map((x) => card(x)).join('')}</div>
    </section>

    <section id="avis" aria-labelledby="avis-title">
      <h2 id="avis-title">Avis clients</h2>
      <div class="reviews-empty"><svg viewBox="0 0 120 24" aria-hidden="true">${[0, 1, 2, 3, 4].map((i) => `<g transform="translate(${i * 24} 0)" fill="none" stroke="currentColor" stroke-width="2">${P.star}</g>`).join('')}</svg>
        <h3>Pas encore d'avis sur cette peluche</h3><p class="muted">Tu l'as reçue ? Dis-nous ce que tu en penses, avec une photo si tu veux : on la publiera ici.</p><a class="btn btn--secondary" href="mailto:${C.email}?subject=${encodeURIComponent(`Mon avis sur la peluche ${p.name}`)}">Donner mon avis</a></div>
    </section>
  </div>
</div>

<dialog class="modal" id="size-modal" aria-labelledby="size-modal-title">
  <div class="modal__head"><h2 id="size-modal-title">Guide des tailles</h2><button class="icon-btn" type="button" data-close-modal aria-label="Fermer">${icon('close')}</button></div>
  <div class="modal__body">${scaleSvg(p.accent)}<p class="small muted center">Hauteurs approximatives, peluche assise. <a class="link" href="guide-des-tailles.html">Voir le guide complet</a></p></div>
</dialog>
<dialog class="modal modal--image" id="image-modal" aria-label="Photo agrandie">
  <div class="modal__head"><h2 class="visually-hidden">Photo agrandie</h2><span></span><button class="icon-btn" type="button" data-close-modal aria-label="Fermer">${icon('close')}</button></div>
  <img id="image-modal-img" src="" alt="">
</dialog>

<div class="sticky-atc" id="sticky-atc" aria-hidden="true">
  <img id="sticky-img" src="${img(p, '300')}" alt="" width="48" height="48">
  <div class="sticky-atc__info"><strong data-p-name>${esc(p.name)}</strong><span id="sticky-price">${euro(defSize.price)}</span></div>
  <button class="btn btn--sm" type="button" data-sticky-add tabindex="-1">Ajouter</button>
</div>`;
  page(file, {
    title: `Peluche canette ${p.name} – ${defSize.label} ${defSize.cm} cm | ${C.brand}`,
    description: `${p.hook} Peluche canette ${p.name} toute douce, brodée, en 3 tailles dès ${euro(minPrice)}. Livraison offerte dès ${C.freeShipping} €.`.slice(0, 160),
    body, ld: [ldProduct, bc.ld], ogImage: img(p, 'og'), accent: p.accent,
  });
}

// =====================================================================
// 4) CONSTRUCTEUR DE PACK
// =====================================================================
{
  const bc = breadcrumb([['Accueil', 'index.html'], ['Créer mon pack', 'creer-mon-pack.html']]);
  const body = `
<div class="container" style="--accent:#3B4FD8">
  ${bc.html}
  <header class="page-head"><h1>Crée ton pack de peluches</h1><p class="lead">Choisis 2 ou 3 peluches, mélange les collections : la remise s'applique toute seule.</p></header>
  <div class="builder" id="builder">
    <section class="step"><h2 class="step__title"><span class="step__num">1</span>Combien de peluches ?</h2>
      <div class="packs" role="radiogroup" aria-label="Taille du pack" style="max-width:640px">${C.packs.filter((k) => k.n > 1).map((k, i) => `<button class="pack-card" type="button" role="radio" data-pack-n="${k.n}" aria-checked="${i === 0}">${k.badge ? `<span class="badge badge--best">${k.badge}</span>` : ''}<strong>${k.label}</strong><em>-${k.discount} %</em></button>`).join('')}</div>
    </section>
    <section class="step"><h2 class="step__title"><span class="step__num">2</span>Quelle taille ?</h2>
      <div class="sizes" role="radiogroup" aria-label="Taille" style="max-width:640px">${C.sizes.map((s) => `<button class="size-btn" type="button" role="radio" data-builder-size="${s.id}" aria-checked="${s.id === C.defaultSize}"><strong>${s.label}</strong><span>${s.cm} cm · ${euro(s.price)}</span></button>`).join('')}</div>
    </section>
    <section class="step"><h2 class="step__title"><span class="step__num">3</span>Choisis tes peluches</h2>
      <div class="slots" id="slots" aria-live="polite"></div>
      ${COLLECTIONS.filter((c) => !c.comingSoon).map((c) => `<h3 style="margin:8px 0 0">${c.name}</h3><div class="pick-grid">${live.filter((p) => p.collection === c.id).map((p) => `<button class="pick" type="button" data-pick="${p.slug}" style="--accent:${p.accent}"><img src="${img(p, '300')}" alt="" width="140" height="140" loading="lazy">${esc(p.name)}</button>`).join('')}</div>`).join('')}
    </section>
    <section class="step"><h2 class="step__title"><span class="step__num">4</span>Ton récap</h2>
      <div class="recap" id="recap"></div>
    </section>
  </div>
</div>`;
  page('creer-mon-pack.html', { title: `Créer mon pack de peluches canettes | ${C.brand}`, description: `Compose ton pack de 2 ou 3 peluches canettes : -${C.packs[1].discount} % ou -${C.packs[2].discount} % automatiquement. Mélange les collections comme tu veux.`, body, ld: [bc.ld], current: 'creer-mon-pack.html' });
}

// =====================================================================
// 5) PANIER
// =====================================================================
page('panier.html', {
  title: 'Mon panier', description: 'Ton panier de peluches canettes.', noindex: true,
  body: `<div class="container"><header class="page-head"><h1>Ton panier</h1></header><div class="cart-page" id="cart-page"><div id="cart-page-lines"></div><aside class="cart-page__aside" id="cart-page-aside"></aside></div></div>`,
});

// =====================================================================
// 6) PAGES DE CONTENU
// =====================================================================
function contentPage(file, { title, h1, description, lead = '', html, ld = [], wide = false }) {
  const bc = breadcrumb([['Accueil', 'index.html'], [h1, file]]);
  page(file, { title, description, body: `<div class="container">${bc.html}<header class="page-head"><h1>${esc(h1)}</h1>${lead ? `<p class="lead">${lead}</p>` : ''}</header><div class="${wide ? '' : 'prose'}">${html}</div></div>`, ld: [bc.ld, ...ld], current: file });
}

// FAQ
{
  const themes = [...new Set(FAQ.map((f) => f.theme))];
  contentPage('faq.html', {
    title: 'FAQ : toutes tes questions sur nos peluches canettes', h1: 'Questions fréquentes', description: 'Tailles, matières, lavage, livraison, retours, paiement : toutes les réponses sur nos peluches canettes.',
    lead: `Tu ne trouves pas ta réponse ? <a class="link" href="contact.html">Écris-nous</a>, on répond ${C.replyDelay}.`,
    html: themes.map((t) => `<section class="faq-group"><h2>${t}</h2>${faqAccordion(FAQ.filter((f) => f.theme === t))}</section>`).join(''),
    ld: [ldFaq(FAQ)],
  });
}

// Guide des tailles
contentPage('guide-des-tailles.html', {
  title: 'Guide des tailles : quelle peluche canette choisir ?', h1: 'Guide des tailles', description: 'Porte-clés 12 cm, Classique 22 cm ou XL 35 cm : compare la taille de nos peluches canettes à une canette de 33 cl et à une main.',
  lead: 'Chaque peluche existe en 3 tailles. Voici à quoi elles ressemblent à côté d’une vraie canette de 33 cl et d’une main d’adulte.',
  html: `<div style="background:var(--bg-soft);border-radius:var(--r-lg);padding:24px;margin-bottom:32px">${scaleSvg('#E8358A')}</div>
<table><thead><tr><th>Taille</th><th>Hauteur</th><th>Idéale pour</th><th>Prix</th></tr></thead><tbody>
<tr><td><b>Porte-clés</b></td><td>≈ ${sizeById('porte-cles').cm} cm</td><td>Sac, trousse, clés. Déconseillé aux moins de 3 ans.</td><td>${euro(sizeById('porte-cles').price)}</td></tr>
<tr><td><b>Classique</b></td><td>≈ ${defSize.cm} cm</td><td>Bureau, étagère, à côté de l'écran</td><td>${euro(defSize.price)}</td></tr>
<tr><td><b>XL</b></td><td>≈ ${sizeById('xl').cm} cm</td><td>Lit, canapé, câlins</td><td>${euro(sizeById('xl').price)}</td></tr>
</tbody></table>
<h2>Comment on mesure ?</h2><p>La hauteur est mesurée peluche assise, du bas des pieds jusqu'au haut du rebord. Le rembourrage étant fait à la main, compte ±1 cm.</p>
<h2>Notre conseil</h2><p>Pour un premier cadeau, la <b>Classique</b> est la plus polyvalente. Pour un vrai doudou à câliner, prends la <b>XL</b>. Et pour une collection complète sans manquer de place, les <b>porte-clés</b> sont parfaits.</p>`,
});

// Notre histoire
contentPage('notre-histoire.html', {
  title: 'Notre histoire', h1: 'Notre histoire', description: `L'histoire de ${C.brand}, les peluches canettes kawaii nées d'une idée toute simple : rendre les canettes câlinables.`,
  html: `<p class="legal-warning">Brouillon [À VALIDER] : remplace ce texte par ta vraie histoire. Aucun fait vérifiable n'a été inventé.</p>
<h2>Tout est parti d'une canette sur un bureau</h2>
<p>Tu connais ce moment : il est tard, la partie n'est pas finie, et une canette traîne à côté du clavier. Un soir, on s'est dit qu'elle méritait mieux que la poubelle de recyclage. Et si elle avait des petits bras, des pieds tout ronds et un sourire ? ${C.brand} est né de cette idée un peu absurde, et franchement adorable.</p>
<p>On a voulu des peluches qu'on a envie de serrer, mais aussi de montrer. Des couleurs qui claquent sur un setup gamer, un visage brodé qui ne s'efface pas au premier lavage, et trois tailles pour que chacun trouve la sienne : un porte-clés pour le sac, une Classique pour le bureau, une XL pour le lit.</p>
<p>${todo('[À COMPLÉTER : qui tu es, comment tu as commencé, où tu travailles, une anecdote vraie, 3 ou 4 phrases]')}</p>
<p>Aujourd'hui, chaque commande est préparée avec soin depuis la ${C.shipFrom}. On lit tous vos messages, on répond ${C.replyDelay}, et on adore voir nos peluches dans vos vidéos.</p>
<h2>Ce qui compte pour nous</h2>
<div class="values">
<div class="value"><h3>La douceur d'abord</h3><p>Si on n'a pas envie de la serrer, elle ne rejoint pas la collection.</p></div>
<div class="value"><h3>Des prix honnêtes</h3><p>Pas de faux prix barrés, pas de fausses promos. Le prix affiché est le vrai.</p></div>
<div class="value"><h3>De vrais avis</h3><p>On publie tous les avis, les bons comme les moins bons, et on répond à chacun.</p></div>
<div class="value"><h3>Une vraie équipe</h3><p>Derrière l'adresse ${esc(C.email)}, il y a des humains qui te répondent.</p></div>
</div>
<p style="margin-top:32px"><a class="btn" href="peluches.html">Découvrir les peluches</a></p>`,
});

// Livraison
contentPage('livraison.html', {
  title: 'Livraison', h1: 'Livraison', description: `Expédition depuis la ${C.shipFrom}, livraison en ${C.deliveryDays[0]} à ${C.deliveryDays[1]} jours ouvrés, offerte dès ${C.freeShipping} €.`,
  html: `<table><thead><tr><th>Destination</th><th>Délai</th><th>Prix</th></tr></thead><tbody>
<tr><td>France métropolitaine</td><td>${C.deliveryDays[0]} à ${C.deliveryDays[1]} jours ouvrés ${todo('[À VÉRIFIER]')}</td><td>Offerte dès ${C.freeShipping} € · sinon ${todo('[À COMPLÉTER : tarif]')}</td></tr>
<tr><td>Belgique, Luxembourg</td><td>${todo('[À COMPLÉTER]')}</td><td>${todo('[À COMPLÉTER]')}</td></tr>
<tr><td>Suisse</td><td>${todo('[À COMPLÉTER]')}</td><td>${todo('[À COMPLÉTER : + droits de douane éventuels]')}</td></tr>
</tbody></table>
<h2>Quand part ma commande ?</h2><p>Toute commande passée avant ${C.cutoffHour} h un jour ouvré (du lundi au vendredi, hors jours fériés) est expédiée le jour même. Après ${C.cutoffHour} h, elle part le jour ouvré suivant.</p>
<h2>Suivi</h2><p>Dès l'expédition, tu reçois un email avec ton numéro de suivi. <a class="link" href="suivi-de-commande.html">Suivre ma commande</a></p>
<h2>Transporteur</h2><p>${todo('[À COMPLÉTER : Colissimo, Mondial Relay, Chronopost…]')}</p>
<h2>Colis abîmé ou perdu ?</h2><p>Écris-nous à <a class="link" href="mailto:${C.email}">${esc(C.email)}</a> avec une photo : on renvoie une peluche ou on te rembourse.</p>`,
});

// Retours
contentPage('retours.html', {
  title: 'Retours et remboursement', h1: 'Retours et remboursement', description: `${C.returnDays} jours pour changer d'avis : comment retourner une peluche et être remboursé.`,
  html: `<h2>${C.returnDays} jours pour changer d'avis</h2><p>La loi t'accorde 14 jours pour te rétracter. Chez ${C.brand}, tu as <b>${C.returnDays} jours</b> à compter de la réception de ta commande.</p>
<h2>Comment faire ?</h2><ol><li>Écris-nous à <a class="link" href="mailto:${C.email}">${esc(C.email)}</a> avec ton numéro de commande.</li><li>On t'envoie l'adresse et les instructions de retour.</li><li>Renvoie la peluche neuve, non lavée, dans son emballage d'origine.</li><li>On te rembourse sous 14 jours après réception, avec le même moyen de paiement.</li></ol>
<h2>Qui paie le retour ?</h2><p>${todo('[À COMPLÉTER : retour gratuit ou à la charge du client]')}</p>
<h2>Exception : les peluches personnalisées</h2><p>Une peluche avec un <b>prénom brodé</b> est fabriquée spécialement pour toi. Elle n'ouvre pas droit à la rétractation (article L221-28, 3° du Code de la consommation).</p>
<h2>Produit défectueux ou abîmé</h2><p>Tu bénéficies de la garantie légale de conformité (2 ans) et de la garantie des vices cachés. Envoie-nous une photo : on remplace ou on rembourse, y compris pour une peluche personnalisée.</p>`,
});

// Suivi de commande
contentPage('suivi-de-commande.html', {
  title: 'Suivi de commande', h1: 'Suivi de commande', description: 'Suis ta commande de peluches canettes.',
  html: `<p>Ton numéro de suivi est dans l'email d'expédition. Entre-le ci-dessous, ou écris-nous si tu ne le trouves pas.</p>
<form class="form track-form" data-track><div class="field"><label for="track-n">Numéro de commande ou de suivi</label><input class="input" id="track-n" name="n" required placeholder="Ex. 1001 ou 6A123456789"></div><div class="field"><label for="track-e">Ton email</label><input class="input" id="track-e" type="email" name="e" required autocomplete="email"></div><button class="btn" type="submit">Suivre ma commande</button></form>
<p class="small muted" style="margin-top:16px">${todo('[À COMPLÉTER : brancher ici le service de suivi de ton transporteur ou de ta plateforme]')}</p>`,
});

// Contact
contentPage('contact.html', {
  title: 'Contact', h1: 'Contact', description: `Une question sur une peluche ou une commande ? Écris-nous, on répond ${C.replyDelay}.`, wide: true,
  lead: `Une question sur une peluche, une commande ou un cadeau ? On te répond ${C.replyDelay}.`,
  html: `<div class="contact-grid"><form class="form" data-contact>
<div class="field"><label for="c-name">Ton prénom</label><input class="input" id="c-name" name="name" required autocomplete="given-name"></div>
<div class="field"><label for="c-mail">Ton email</label><input class="input" id="c-mail" type="email" name="email" required autocomplete="email"></div>
<div class="field"><label for="c-order">Numéro de commande (facultatif)</label><input class="input" id="c-order" name="order"></div>
<div class="field"><label for="c-msg">Ton message</label><textarea class="textarea" id="c-msg" name="message" required></textarea></div>
<button class="btn" type="submit">Envoyer</button></form>
<aside class="contact-card"><h2 style="font-size:1.25rem">Nous joindre</h2><p class="mb-0">${icon('mail').replace('<svg', '<svg width="18" height="18" style="display:inline;vertical-align:-3px;margin-right:6px"')}<a class="link" href="mailto:${C.email}">${esc(C.email)}</a></p><p class="mb-0 muted">Réponse ${C.replyDelay}.</p><p class="mb-0">${marks(C.company.name)}<br>${marks(C.company.address)}</p><p class="mb-0"><a class="link" href="faq.html">Consulter la FAQ</a></p></aside></div>`,
});

// Idées cadeaux
{
  const k = sizeById('porte-cles'), xl = sizeById('xl');
  const pack2 = defSize.price * 2 * (1 - C.packs[1].discount / 100);
  contentPage('idees-cadeaux.html', {
    title: 'Idées cadeaux originales : peluches canettes pour ado et gamer', h1: 'Idées cadeaux', description: 'Des idées cadeaux originales pour un ado, un gamer ou une fan de kawaii, classées par budget. Emballage cadeau et prénom brodé disponibles.', wide: true,
    lead: 'Un cadeau qui fait réagir dès le déballage. Choisis par budget :',
    html: `<div class="gift-budget">
<a class="budget-card" href="peluches.html?taille=porte-cles" style="--accent:#7AC943"><span class="muted">Moins de 10 €</span><strong>Porte-clés</strong><span>${k.cm} cm, à accrocher au sac. ${euro(k.price)}</span><span class="tile__cta">Voir les porte-clés ${icon('right')}</span></a>
<a class="budget-card" href="peluches.html" style="--accent:#E8358A"><span class="muted">Moins de 25 €</span><strong>Classique</strong><span>${defSize.cm} cm, la star des bureaux. ${euro(defSize.price)}</span><span class="tile__cta">Voir les peluches ${icon('right')}</span></a>
<a class="budget-card" href="creer-mon-pack.html" style="--accent:#2E8BE6"><span class="muted">Moins de 35 €</span><strong>Pack de 2</strong><span>2 Classiques pour ${euro(pack2)} au lieu de ${euro(defSize.price * 2)}. Ou une XL à ${euro(xl.price)}.</span><span class="tile__cta">Créer mon pack ${icon('right')}</span></a>
</div>
<section class="section"><h2>Pour qui ?</h2><div class="grid grid--4">${['ultra-noire', 'edition-rose', 'edition-hiver', 'ultra-blanche'].map((s) => card(PRODUCTS.find((p) => p.slug === s))).join('')}</div>
<div class="prose" style="margin-top:32px"><ul><li><b>Pour un ado gamer :</b> l'Ultra Noire ou l'Ultra Verte, à poser à côté du clavier.</li><li><b>Pour une meilleure amie :</b> l'Édition Rose, avec son prénom brodé.</li><li><b>Pour Noël :</b> l'Édition Hiver, dans son emballage cadeau.</li><li><b>Pour un collègue :</b> l'Ultra Blanche, sobre et élégante pour un bureau de télétravail.</li></ul></div></section>
<div class="season"><div><h2>${esc(C.seasonal.title)}</h2><p>${marks(C.seasonal.text)}</p></div><a class="btn btn--lg" href="peluches.html">Je choisis</a></div>`,
  });
}

// Recherche
page('recherche.html', {
  title: 'Recherche', description: 'Rechercher une peluche canette.', noindex: true,
  body: `<div class="container"><header class="page-head"><h1>Recherche</h1><form class="search-panel__bar" action="recherche.html" role="search" style="max-width:560px"><label class="visually-hidden" for="q">Rechercher</label><input class="input" id="q" name="q" type="search" placeholder="Rechercher une peluche, une couleur…"><button class="btn" type="submit">Rechercher</button></form></header><p class="muted" id="search-page-count"></p><div class="grid grid--4" id="search-page-results"></div></div>`,
});

// 404
page('404.html', {
  title: 'Page introuvable', description: 'Cette page n’existe pas.', noindex: true,
  body: `<div class="container"><div class="not-found">${plushSvg('#2E8BE6', { sad: true })}<h1>Oups, cette page s'est vidée…</h1><p class="lead">La page que tu cherches n'existe pas ou a été déplacée. Mais les peluches, elles, sont toujours là.</p><form action="recherche.html" role="search"><label class="visually-hidden" for="nf-q">Rechercher</label><input class="input" id="nf-q" name="q" type="search" placeholder="Rechercher une peluche…"><button class="btn" type="submit">Chercher</button></form></div>
<section class="section"><h2>Les plus craquantes</h2><div class="grid grid--4">${live.slice(0, 4).map((p) => card(p)).join('')}</div></section></div>`,
});

// Pages légales
for (const [file, l] of Object.entries(LEGAL)) {
  contentPage(file, { title: l.title, h1: l.title, description: `${l.title} du site ${C.brand}.`, html: `<p class="legal-warning">Modèle à faire relire par un professionnel. Les champs surlignés en jaune sont à compléter.</p>${l.html}` });
}

// =====================================================================
// ÉCRITURE DES FICHIERS
// =====================================================================
await mkdir(join(OUT, 'assets'), { recursive: true });
for (const { file, html } of pages) await writeFile(join(OUT, file), html);

// Données pour le JavaScript du navigateur
const clientData = {
  config: { brand: C.brand, sizes: C.sizes, defaultSize: C.defaultSize, packs: C.packs, freeShipping: C.freeShipping, embroidery: C.embroidery, giftWrap: C.giftWrap, deliveryDays: C.deliveryDays, cutoffHour: C.cutoffHour, returnDays: C.returnDays, email: C.email },
  collections: COLLECTIONS.map(({ id, name, accent, comingSoon }) => ({ id, name, accent, comingSoon: !!comingSoon })),
  products: PRODUCTS.map((p, i) => ({
    slug: p.slug, name: p.name, collection: p.collection, accent: p.accent, colors: p.colors, order: i,
    comingSoon: !!p.comingSoon, url: p.comingSoon ? null : pUrl(p),
    img: p.image ? img(p, 'full') : null, card: p.image ? img(p, '600') : null, thumb: p.image ? img(p, '300') : null,
    alt: p.alt || '', hook: p.hook || '', text: p.text || '', gift: p.gift || '',
  })),
};
await writeFile(join(OUT, 'assets', 'data.js'), `// Généré par site/build.mjs : ne pas modifier à la main\nwindow.PL = ${JSON.stringify(clientData)};\n`);
for (const f of await readdir(join(ROOT, 'site', 'assets'))) await copyFile(join(ROOT, 'site', 'assets', f), join(OUT, 'assets', f));

// Plan du site et robots
const indexable = pages.filter((p) => !/panier|recherche|404/.test(p.file)).map((p) => p.file);
await writeFile(join(OUT, 'sitemap.xml'), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${indexable.map((f) => `  <url><loc>${SITE_URL}/${f === 'index.html' ? '' : f}</loc></url>`).join('\n')}\n</urlset>\n`);
await writeFile(join(OUT, 'robots.txt'), `User-agent: *\nDisallow: /panier.html\nDisallow: /recherche.html\nSitemap: ${SITE_URL}/sitemap.xml\n`);

console.log(`✓ ${pages.length} pages générées dans /public`);
