/* =====================================================================
   CANETTOU : JavaScript du site (vanilla, sans dépendance)
   Panier · tiroirs · recherche · collection · fiche produit · pack
   ===================================================================== */
(() => {
  'use strict';
  document.documentElement.classList.add('js');
  const PL = window.PL;
  if (!PL) return;
  const CFG = PL.config;

  // ---------- Utilitaires ----------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const euro = (n) => n.toFixed(2).replace('.', ',') + ' €';
  const esc = (s = '') => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
  const norm = (s = '') => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
  const bySlug = Object.fromEntries(PL.products.map((p) => [p.slug, p]));
  const live = PL.products.filter((p) => !p.comingSoon);
  const sizeOf = (id) => CFG.sizes.find((s) => s.id === id) || CFG.sizes[0];
  const packOf = (n) => CFG.packs.find((k) => k.n === n) || { discount: 0 };
  const collName = (id) => (PL.collections.find((c) => c.id === id) || {}).name || '';
  const ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m5 12 5 5 9-10"/></svg>';
  const ICON_LOCK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 0 1 8 0v3"/></svg>';

  // Stockage local protégé (navigation privée, stockage bloqué…)
  const store = {
    get(k, d) { try { const v = localStorage.getItem(k); return v ? JSON.parse(v) : d; } catch { return d; } },
    set(k, v) { try { localStorage.setItem(k, JSON.stringify(v)); } catch { /* ignoré */ } },
  };

  // ---------- Toast ----------
  function toast(msg, { error = false } = {}) {
    const zone = $('#toast-zone');
    if (!zone) return;
    const el = document.createElement('div');
    el.className = 'toast';
    el.innerHTML = `${error ? '' : ICON_CHECK}<span>${esc(msg)}</span>`;
    zone.append(el);
    setTimeout(() => { el.classList.add('is-leaving'); setTimeout(() => el.remove(), 220); }, 3200);
  }

  // =====================================================================
  // PANIER
  // =====================================================================
  const Cart = {
    state: store.get('pl-cart', { lines: [], giftWrap: false, note: '' }),
    init() {
      // On retire les lignes devenues invalides (produit supprimé, taille changée)
      this.state.lines = (this.state.lines || []).filter((l) => Array.isArray(l.slugs) && l.slugs.every((s) => bySlug[s] && !bySlug[s].comingSoon) && CFG.sizes.some((s) => s.id === l.size));
    },
    save() { store.set('pl-cart', this.state); renderCart(); },
    key: (l) => [l.slugs.join('+'), l.size, l.prenom || ''].join('|'),
    add(line) {
      const k = this.key(line);
      const found = this.state.lines.find((l) => this.key(l) === k);
      if (found) found.qty += line.qty || 1;
      else this.state.lines.push({ id: Date.now().toString(36) + Math.random().toString(36).slice(2, 6), qty: 1, prenom: '', ...line });
      this.save();
      const c = $$('[data-cart-count]');
      c.forEach((el) => { el.classList.remove('bump'); void el.offsetWidth; el.classList.add('bump'); });
    },
    setQty(id, qty) {
      const l = this.state.lines.find((x) => x.id === id);
      if (!l) return;
      l.qty = Math.max(0, Math.min(99, qty));
      if (!l.qty) this.state.lines = this.state.lines.filter((x) => x.id !== id);
      this.save();
    },
    // Prix d'une unité de ligne (pack remisé + broderie)
    unit(l) {
      const base = sizeOf(l.size).price * l.slugs.length;
      const disc = l.slugs.length > 1 ? packOf(l.slugs.length).discount : 0;
      return base * (1 - disc / 100) + (l.prenom ? CFG.embroidery.price : 0);
    },
    full(l) { return sizeOf(l.size).price * l.slugs.length + (l.prenom ? CFG.embroidery.price : 0); },
    count() { return this.state.lines.reduce((n, l) => n + l.qty, 0); },
    goods() { return this.state.lines.reduce((n, l) => n + this.unit(l) * l.qty, 0); },
    total() { return this.goods() + (this.state.giftWrap && this.count() ? CFG.giftWrap.price : 0); },
  };
  Cart.init();

  function lineHtml(l) {
    const ps = l.slugs.map((s) => bySlug[s]);
    const size = sizeOf(l.size);
    const isPack = l.slugs.length > 1;
    const title = isPack ? `Pack de ${l.slugs.length} peluches` : `Peluche ${ps[0].name}`;
    return `<li class="line">
      <a class="line__img" href="${ps[0].url}" style="--accent:${ps[0].accent}" tabindex="-1" aria-hidden="true">${ps.slice(0, 4).map((p) => `<img src="${p.thumb}" alt="" width="80" height="80">`).join('')}</a>
      <div>
        <p class="line__title"><a href="${ps[0].url}">${esc(title)}</a></p>
        ${isPack ? `<p class="line__meta">${ps.map((p) => esc(p.name)).join(' + ')}</p>` : ''}
        <p class="line__meta">Taille : <b>${size.label} · ${size.cm} cm</b></p>
        ${l.prenom ? `<p class="line__meta">Prénom brodé : <b>${esc(l.prenom)}</b></p>` : ''}
        <div class="qty" role="group" aria-label="Quantité"><button type="button" data-qty="${l.id}" data-d="-1" aria-label="Retirer un">−</button><span>${l.qty}</span><button type="button" data-qty="${l.id}" data-d="1" aria-label="Ajouter un">+</button></div>
        <button class="line__remove" type="button" data-remove="${l.id}">Supprimer</button>
      </div>
      <div class="line__price">${isPack ? `<s>${euro(Cart.full(l) * l.qty)}</s>` : ''}${euro(Cart.unit(l) * l.qty)}</div>
    </li>`;
  }

  function shipGoalHtml() {
    const sub = Cart.total();
    const left = CFG.freeShipping - sub;
    const pct = Math.min(100, (sub / CFG.freeShipping) * 100);
    return `<div class="ship-goal${left <= 0 ? ' is-done' : ''}">
      <span>${left > 0 ? `Plus que <b>${euro(left)}</b> pour la livraison offerte` : 'Bravo, la livraison est offerte !'}</span>
      <div class="progress" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow="${Math.round(pct)}" aria-label="Progression vers la livraison offerte"><div class="progress__bar" style="width:${pct}%"></div></div></div>`;
  }

  function upsellHtml() {
    // Propose le porte-clés assorti à la première peluche seule (hors porte-clés) du panier
    const base = Cart.state.lines.find((l) => l.slugs.length === 1 && l.size !== 'porte-cles');
    if (!base) return '';
    const p = bySlug[base.slugs[0]];
    if (Cart.state.lines.some((l) => l.slugs.length === 1 && l.slugs[0] === p.slug && l.size === 'porte-cles')) return '';
    const k = sizeOf('porte-cles');
    return `<div class="upsell" style="--accent:${p.accent}"><img src="${p.thumb}" alt="" width="56" height="56"><p><b>Ajoute le porte-clés assorti ?</b>${esc(p.name)} · ${k.cm} cm · ${euro(k.price)}</p><button class="btn btn--sm btn--secondary" type="button" data-upsell="${p.slug}">Ajouter</button></div>`;
  }

  const extrasHtml = (idp) => `<div class="cart-extras">
    ${CFG.giftWrap.enabled ? `<label class="check"><input type="checkbox" data-gift ${Cart.state.giftWrap ? 'checked' : ''}> Emballage cadeau + carte message (+${euro(CFG.giftWrap.price)})</label>` : ''}
    <div class="field"><label for="${idp}-note" class="small">Message cadeau ou note de commande</label><textarea class="textarea" id="${idp}-note" data-note maxlength="300" placeholder="Facultatif">${esc(Cart.state.note || '')}</textarea></div></div>`;

  const totalsHtml = () => `<div class="totals">
    ${Cart.state.giftWrap && Cart.count() ? `<div class="totals__row totals__row--sub"><span>Emballage cadeau</span><span>${euro(CFG.giftWrap.price)}</span></div>` : ''}
    <div class="totals__row"><span>Sous-total</span><span>${euro(Cart.total())}</span></div>
    <small>Taxes incluses. Frais de livraison calculés à l'étape suivante.</small></div>
    <button class="btn btn--block btn--lg" type="button" data-checkout>${ICON_LOCK.replace('<svg', '<svg width="18" height="18"')} Commander</button>
    <div class="payments" style="justify-content:center">${['CB', 'VISA', 'MC', 'PayPal', 'Apple Pay', 'G Pay'].map((x) => `<span>${x}</span>`).join('')}</div>
    <div class="guarantees"><span>${ICON_CHECK}${CFG.returnDays} jours pour changer d'avis</span><span>${ICON_CHECK}Paiement sécurisé</span><span>${ICON_CHECK}Expédié depuis la France</span></div>`;

  const emptyHtml = `<div class="cart-empty"><svg class="plush-svg" viewBox="0 0 100 140" aria-hidden="true"><rect x="20" y="14" width="60" height="112" rx="24" fill="#e6e4e0"/><rect x="26" y="8" width="48" height="14" rx="7" fill="#c9c6c0"/><circle cx="40" cy="72" r="5" fill="#111"/><circle cx="60" cy="72" r="5" fill="#111"/><path d="M42 88q8-7 16 0" stroke="#111" stroke-width="3" fill="none" stroke-linecap="round"/></svg><p><b>Ton panier est vide.</b><br><span class="muted">Une petite canette pour lui tenir compagnie ?</span></p><a class="btn" href="peluches.html">Voir les peluches</a></div>`;

  function renderCart() {
    const n = Cart.count();
    $$('[data-cart-count]').forEach((el) => { el.textContent = n; el.classList.toggle('has-items', n > 0); });
    const has = Cart.state.lines.length > 0;
    // Tiroir
    const body = $('#cart-drawer-body'), foot = $('#cart-drawer-foot');
    if (body) {
      body.innerHTML = has ? `${shipGoalHtml()}<ul class="lines">${Cart.state.lines.map(lineHtml).join('')}</ul>${upsellHtml()}${extrasHtml('d')}` : emptyHtml;
      foot.innerHTML = has ? totalsHtml() : '';
      foot.hidden = !has;
    }
    // Page panier
    const pl = $('#cart-page-lines'), pa = $('#cart-page-aside');
    if (pl) {
      pl.innerHTML = has ? `${shipGoalHtml()}<ul class="lines">${Cart.state.lines.map(lineHtml).join('')}</ul>${upsellHtml()}` : emptyHtml;
      pa.innerHTML = has ? `${extrasHtml('p')}${totalsHtml()}` : '';
      pa.hidden = !has;
    }
  }

  // =====================================================================
  // TIROIRS, RECHERCHE, MODALES
  // =====================================================================
  let lastFocus = null;
  function openDrawer(id) {
    const d = document.getElementById(id);
    if (!d) return;
    closeAll();
    lastFocus = document.activeElement;
    d.classList.add('is-open');
    d.setAttribute('aria-hidden', 'false');
    $('.backdrop').classList.add('is-visible');
    document.body.classList.add('is-locked');
    $$(`[aria-controls="${id}"]`).forEach((b) => b.setAttribute('aria-expanded', 'true'));
    setTimeout(() => (d.querySelector('[data-close]') || d).focus(), 50);
  }
  function closeAll() {
    $$('.drawer.is-open, .filters.is-open, .search-panel.is-open').forEach((d) => { d.classList.remove('is-open'); d.setAttribute('aria-hidden', 'true'); });
    $$('[aria-expanded="true"]').forEach((b) => b.setAttribute('aria-expanded', 'false'));
    $('.backdrop')?.classList.remove('is-visible');
    document.body.classList.remove('is-locked');
    if (lastFocus && document.contains(lastFocus)) lastFocus.focus();
    lastFocus = null;
  }
  const openCart = () => { if (!$('#cart-page')) openDrawer('cart-drawer'); };

  // Recherche prédictive
  const searchPanel = $('#search-panel');
  const searchInput = $('#search-input');
  const searchResults = $('#search-results');
  const matchProducts = (q) => {
    const t = norm(q.trim());
    if (!t) return [];
    return PL.products.filter((p) => norm(`${p.name} ${collName(p.collection)} ${p.colors.join(' ')} ${p.hook}`).includes(t));
  };
  function renderSearch() {
    const q = searchInput.value;
    const res = matchProducts(q);
    searchResults.innerHTML = !q.trim() ? live.slice(0, 6).map(resultHtml).join('') : res.length ? res.map(resultHtml).join('') : `<p class="empty">Aucune peluche ne correspond à « ${esc(q)} ». Essaie « rose », « bleu » ou « ultra ».</p>`;
  }
  const resultHtml = (p) => (p.comingSoon
    ? `<a href="collection-${p.collection}.html" style="--accent:${p.accent}"><span class="badge badge--soon" style="justify-self:start">Bientôt</span>${esc(p.name)}</a>`
    : `<a href="${p.url}" style="--accent:${p.accent}"><img src="${p.thumb}" alt="" width="150" height="150" loading="lazy">${esc(p.name)}</a>`);
  function openSearch() {
    closeAll();
    lastFocus = document.activeElement;
    searchPanel.classList.add('is-open');
    $('.backdrop').classList.add('is-visible');
    renderSearch();
    setTimeout(() => searchInput.focus(), 60);
  }
  searchInput?.addEventListener('input', renderSearch);

  // =====================================================================
  // CLICS (délégation unique)
  // =====================================================================
  document.addEventListener('click', (e) => {
    const t = e.target.closest('button, a, [data-close]');
    if (!t) { closeQuick(e); return; }

    if (t.matches('[data-open]')) { e.preventDefault(); if (t.dataset.open === 'cart-drawer' && $('#cart-page')) return; openDrawer(t.dataset.open); return; }
    if (t.matches('[data-close]')) { closeAll(); return; }
    if (t.matches('[data-open-search]')) { openSearch(); return; }
    if (t.matches('[data-close-search]')) { closeAll(); return; }
    if (t.matches('[data-open-modal]')) { document.getElementById(t.dataset.openModal)?.showModal(); return; }
    if (t.matches('[data-close-modal]')) { t.closest('dialog')?.close(); return; }

    // Carrousels
    if (t.matches('[data-rail]')) {
      const r = document.getElementById(t.dataset.rail);
      r?.scrollBy({ left: r.clientWidth * 0.8 * Number(t.dataset.dir), behavior: 'smooth' });
      return;
    }

    // Ajout rapide depuis une carte produit
    if (t.matches('[data-quick-add]')) { e.preventDefault(); openQuick(t); return; }
    if (t.matches('[data-quick-size]')) {
      Cart.add({ slugs: [t.dataset.slug], size: t.dataset.quickSize });
      toast(`${bySlug[t.dataset.slug].name} (${sizeOf(t.dataset.quickSize).label}) ajoutée au panier`);
      closeQuick();
      openCart();
      return;
    }
    if (t.matches('[data-quick-close]')) { closeQuick(); return; }

    // Panier
    if (t.matches('[data-qty]')) { const l = Cart.state.lines.find((x) => x.id === t.dataset.qty); if (l) Cart.setQty(l.id, l.qty + Number(t.dataset.d)); return; }
    if (t.matches('[data-remove]')) { Cart.setQty(t.dataset.remove, 0); return; }
    if (t.matches('[data-upsell]')) { Cart.add({ slugs: [t.dataset.upsell], size: 'porte-cles' }); toast('Porte-clés ajouté'); return; }
    if (t.matches('[data-checkout]')) { checkout(); return; }
    closeQuick(e);
  });

  document.addEventListener('change', (e) => {
    if (e.target.matches('[data-gift]')) { Cart.state.giftWrap = e.target.checked; Cart.save(); }
  });
  document.addEventListener('input', (e) => {
    if (e.target.matches('[data-note]')) { Cart.state.note = e.target.value; store.set('pl-cart', Cart.state); }
  });
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') { closeQuick(); closeAll(); }
  });

  // Paiement : point d'entrée unique, à brancher sur ton prestataire (Stripe, Shopify Buy Button…)
  function checkout() {
    toast('Le paiement en ligne ouvre très bientôt !');
  }

  // Mini-sélecteur de taille sur les cartes
  let quickEl = null;
  function openQuick(btn) {
    closeQuick();
    const slug = btn.dataset.quickAdd;
    const wrap = btn.closest('.card__media-wrap');
    quickEl = document.createElement('div');
    quickEl.className = 'quick-sizes';
    quickEl.setAttribute('role', 'dialog');
    quickEl.setAttribute('aria-label', 'Choisis ta taille');
    quickEl.innerHTML = `<p>Choisis ta taille <button type="button" data-quick-close aria-label="Fermer">×</button></p>${CFG.sizes.map((s) => `<button class="size-row" type="button" data-quick-size="${s.id}" data-slug="${slug}"><span>${s.label} · ${s.cm} cm</span><span>${euro(s.price)}</span></button>`).join('')}`;
    wrap.append(quickEl);
    quickEl.querySelector('.size-row').focus();
  }
  function closeQuick(e) {
    if (!quickEl) return;
    if (e && quickEl.contains(e.target)) return;
    quickEl.remove();
    quickEl = null;
  }

  // =====================================================================
  // EN-TÊTE, APPARITIONS, FORMULAIRES
  // =====================================================================
  const header = $('#header');
  const onScroll = () => header?.classList.toggle('is-scrolled', window.scrollY > 8);
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries) => entries.forEach((en) => { if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); } }), { rootMargin: '0px 0px -10% 0px' });
    $$('.reveal').forEach((el) => io.observe(el));
  } else $$('.reveal').forEach((el) => el.classList.add('is-in'));

  // Newsletter : à brancher sur ton outil d'emailing (Brevo, Klaviyo, Shopify Email…)
  $$('[data-newsletter]').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = f.email.value.trim();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { toast('Entre une adresse email valide', { error: true }); f.email.focus(); return; }
    toast('Les inscriptions ouvrent très bientôt, merci !');
    f.reset();
  }));

  // Contact et suivi : ouvrent l'application email du visiteur avec un message prérempli
  $$('[data-contact]').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!f.reportValidity()) return;
    const d = new FormData(f);
    const body = `${d.get('message')}\n\n${d.get('name')} (${d.get('email')})${d.get('order') ? `\nCommande : ${d.get('order')}` : ''}`;
    location.href = `mailto:${CFG.email}?subject=${encodeURIComponent(`Contact ${CFG.brand}${d.get('order') ? ` · commande ${d.get('order')}` : ''}`)}&body=${encodeURIComponent(body)}`;
  }));
  $$('[data-track]').forEach((f) => f.addEventListener('submit', (e) => {
    e.preventDefault();
    if (!f.reportValidity()) return;
    location.href = `mailto:${CFG.email}?subject=${encodeURIComponent(`Suivi de ma commande ${f.n.value}`)}&body=${encodeURIComponent(`Bonjour, où en est ma commande ${f.n.value} ?\nEmail : ${f.e.value}`)}`;
  }));

  // =====================================================================
  // ESTIMATION DE LIVRAISON (saute les dimanches et les jours fériés français)
  // =====================================================================
  function easter(y) {
    const a = y % 19, b = Math.floor(y / 100), c = y % 100, d = Math.floor(b / 4), e = b % 4, f = Math.floor((b + 8) / 25);
    const g = Math.floor((b - f + 1) / 3), h = (19 * a + b - d - g + 15) % 30, i = Math.floor(c / 4), k = c % 4;
    const l = (32 + 2 * e + 2 * i - h - k) % 7, m = Math.floor((a + 11 * h + 22 * l) / 451);
    const month = Math.floor((h + l - 7 * m + 114) / 31), day = ((h + l - 7 * m + 114) % 31) + 1;
    return new Date(y, month - 1, day);
  }
  const holidayCache = {};
  function isHoliday(d) {
    const y = d.getFullYear();
    if (!holidayCache[y]) {
      const e = easter(y);
      const plus = (n) => { const x = new Date(e); x.setDate(x.getDate() + n); return `${x.getMonth() + 1}-${x.getDate()}`; };
      holidayCache[y] = new Set(['1-1', '5-1', '5-8', '7-14', '8-15', '11-1', '11-11', '12-25', plus(1), plus(39), plus(50)]);
    }
    return holidayCache[y].has(`${d.getMonth() + 1}-${d.getDate()}`);
  }
  const isShipDay = (d) => d.getDay() !== 0 && d.getDay() !== 6 && !isHoliday(d);
  const isDeliveryDay = (d) => d.getDay() !== 0 && !isHoliday(d);
  const addDays = (d, n, test) => { const x = new Date(d); let c = 0; while (c < n) { x.setDate(x.getDate() + 1); if (test(x)) c++; } return x; };
  const fmt = (d) => d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
  function deliveryText(now = new Date()) {
    let ship = new Date(now);
    const sameDay = isShipDay(now) && now.getHours() < CFG.cutoffHour;
    if (!sameDay) { ship = addDays(now, 1, isShipDay); }
    const from = addDays(ship, CFG.deliveryDays[0], isDeliveryDay);
    const to = addDays(ship, CFG.deliveryDays[1], isDeliveryDay);
    if (sameDay) {
      const left = new Date(now); left.setHours(CFG.cutoffHour, 0, 0, 0);
      const mins = Math.round((left - now) / 60000);
      const h = Math.floor(mins / 60), m = mins % 60;
      return `Commande dans les <b>${h ? `${h} h ` : ''}${String(m).padStart(h ? 2 : 1, '0')} min</b> : livrée entre le <b>${fmt(from)}</b> et le <b>${fmt(to)}</b>.`;
    }
    return `Commande aujourd'hui, expédiée le ${fmt(ship)} : livrée entre le <b>${fmt(from)}</b> et le <b>${fmt(to)}</b>.`;
  }

  // =====================================================================
  // PAGE COLLECTION
  // =====================================================================
  const collRoot = $('#collection-root');
  if (collRoot) {
    const grid = $('#grid');
    const form = $('#filters');
    const cards = $$('.card', grid);
    cards.forEach((c, i) => { c.dataset.index = i; });
    const PAGE = 12;
    let shown = PAGE;
    const params = new URLSearchParams(location.search);
    if (params.get('taille') && form.size) { const r = form.querySelector(`[name=size][value="${params.get('taille')}"]`); if (r) r.checked = true; }
    if (params.get('collection')) form.querySelector(`[name=collection][value="${params.get('collection')}"]`)?.click();

    function apply() {
      const fd = new FormData(form);
      const cols = fd.getAll('collection'), colors = fd.getAll('color'), size = sizeOf(fd.get('size') || CFG.defaultSize), avail = fd.get('available');
      const sort = $('#sort').value;
      let list = cards.filter((c) => (!cols.length || cols.includes(c.dataset.collection))
        && (!colors.length || c.dataset.colors.split(' ').some((x) => colors.includes(x)))
        && (!avail || !c.classList.contains('card--soon')));
      const soon = (c) => (c.classList.contains('card--soon') ? 1 : 0);
      const idx = (c) => Number(c.dataset.index);
      const sorters = {
        featured: (a, b) => soon(a) - soon(b) || idx(a) - idx(b),
        new: (a, b) => soon(a) - soon(b) || idx(b) - idx(a),
        'price-asc': (a, b) => soon(a) - soon(b) || a.dataset.name.localeCompare(b.dataset.name, 'fr'),
        'price-desc': (a, b) => soon(a) - soon(b) || b.dataset.name.localeCompare(a.dataset.name, 'fr'),
        az: (a, b) => a.dataset.name.localeCompare(b.dataset.name, 'fr'),
      };
      list.sort(sorters[sort] || sorters.featured);
      cards.forEach((c) => { c.hidden = true; });
      list.forEach((c, i) => { grid.append(c); c.hidden = i >= shown; });
      // Prix selon la taille choisie
      $$('[data-card-price]', grid).forEach((p) => { p.innerHTML = `${euro(size.price)} <small>· ${size.label} ${size.cm} cm</small>`; });
      const visible = Math.min(shown, list.length);
      $('#count').textContent = `${list.length} peluche${list.length > 1 ? 's' : ''}`;
      const lm = $('#load-more');
      lm.hidden = list.length <= PAGE;
      $('#load-count').textContent = `${visible} sur ${list.length} peluches`;
      $('#load-bar').style.width = `${(visible / Math.max(1, list.length)) * 100}%`;
      $('#load-btn').hidden = visible >= list.length;
      if (!list.length) grid.insertAdjacentHTML('beforeend', '<p class="muted" data-empty style="grid-column:1/-1">Aucune peluche ne correspond à ces filtres. <button class="link" type="reset" form="filters">Effacer les filtres</button></p>');
      else $$('[data-empty]', grid).forEach((x) => x.remove());
    }
    form.addEventListener('change', () => { shown = PAGE; $$('[data-empty]', grid).forEach((x) => x.remove()); apply(); });
    form.addEventListener('reset', () => setTimeout(() => { form.querySelector(`[name=size][value="${CFG.defaultSize}"]`).checked = true; shown = PAGE; $$('[data-empty]', grid).forEach((x) => x.remove()); apply(); }));
    $('#sort').addEventListener('change', apply);
    $('#load-btn').addEventListener('click', () => { shown += PAGE; apply(); });
    $('[data-open-filters]').addEventListener('click', () => { lastFocus = document.activeElement; form.classList.add('is-open'); $('.backdrop').classList.add('is-visible'); document.body.classList.add('is-locked'); });
    $$('[data-close-filters]').forEach((b) => b.addEventListener('click', closeAll));
    apply();
  }

  // =====================================================================
  // PAGE RECHERCHE
  // =====================================================================
  const searchPage = $('#search-page-results');
  if (searchPage) {
    const q = new URLSearchParams(location.search).get('q') || '';
    $('#q').value = q;
    const res = q ? matchProducts(q) : live;
    $('#search-page-count').textContent = q ? `${res.length} résultat${res.length > 1 ? 's' : ''} pour « ${q} »` : 'Toutes nos peluches';
    searchPage.innerHTML = res.length ? res.map((p) => (p.comingSoon
      ? `<article class="card card--soon" style="--accent:${p.accent}"><div class="card__media" style="display:grid;place-items:center"><span class="badge badge--soon">Bientôt</span></div><div class="card__body"><p class="card__coll">${esc(collName(p.collection))}</p><h3 class="card__title">${esc(p.name)}</h3></div></article>`
      : `<article class="card" style="--accent:${p.accent}"><div class="card__media-wrap"><a class="card__media" href="${p.url}" tabindex="-1"><img src="${p.card}" alt="${esc(p.alt)}" width="600" height="600" loading="lazy"></a><button class="card__quick" type="button" data-quick-add="${p.slug}" aria-label="Ajout rapide : ${esc(p.name)}"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true"><path d="M12 5v14M5 12h14"/></svg></button></div><div class="card__body"><p class="card__coll">${esc(collName(p.collection))}</p><h3 class="card__title"><a href="${p.url}">${esc(p.name)}</a></h3><p class="card__price">dès ${euro(Math.min(...CFG.sizes.map((s) => s.price)))}</p></div></article>`)).join('')
      : '<p class="muted" style="grid-column:1/-1">Aucun résultat. Essaie « rose », « bleu », « ultra » ou « édition ».</p>';
  }

  // =====================================================================
  // FICHE PRODUIT
  // =====================================================================
  const pdp = $('#pdp');
  if (pdp) {
    const st = { slug: pdp.dataset.slug, size: CFG.defaultSize, pack: 1, picks: [], emb: false, prenom: '', gift: false };
    const embToggle = $('#emb-toggle'), embInput = $('#emb-input'), embPreview = $('#emb-preview');
    const giftToggle = $('#gift-toggle');

    const defaultPicks = (n) => {
      const pool = live.filter((p) => p.slug !== st.slug);
      const cur = bySlug[st.slug];
      pool.sort((a, b) => (a.collection === cur.collection ? 0 : 1) - (b.collection === cur.collection ? 0 : 1));
      return pool.slice(0, n - 1).map((p) => p.slug);
    };

    function price() {
      const s = sizeOf(st.size);
      const n = st.pack;
      const d = n > 1 ? packOf(n).discount : 0;
      const emb = st.emb && st.prenom.trim() ? CFG.embroidery.price : 0;
      return { now: s.price * n * (1 - d / 100) + emb, was: s.price * n + emb, d };
    }

    function update() {
      const s = sizeOf(st.size);
      const pr = price();
      $('#price-now').textContent = euro(pr.now);
      $('#price-now').parentElement.classList.toggle('is-promo', pr.d > 0);
      const was = $('#price-was');
      was.hidden = !pr.d;
      if (pr.d) was.innerHTML = `Au lieu de : <s>${euro(pr.was)}</s> <b>(-${pr.d} %)</b>`;
      $('#atc-price').textContent = euro(pr.now);
      $('#sticky-price').textContent = euro(pr.now);
      $('#size-label').textContent = `${s.cm} cm de hauteur`;
      $('#pack-label').textContent = packOf(st.pack).label || '1 peluche';
      $$('[data-pack-price]').forEach((el) => { const n = Number(el.dataset.packPrice); el.textContent = euro(s.price * n * (1 - (n > 1 ? packOf(n).discount : 0) / 100)); });
      $$('[data-size]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.size === st.size)));
      $$('[data-pack]').forEach((b) => b.setAttribute('aria-checked', String(Number(b.dataset.pack) === st.pack)));
      // Pas de broderie sur les porte-clés
      const embWrap = $('#emb-wrap');
      if (embWrap) {
        const kc = st.size === 'porte-cles';
        embWrap.hidden = kc;
        if (kc && st.emb) { embToggle.checked = false; st.emb = false; $('#emb-field').hidden = true; }
      }
      embPreview.textContent = st.prenom;
      embPreview.classList.toggle('is-visible', st.emb && !!st.prenom.trim());
    }

    function renderPicks() {
      const box = $('#pack-picks');
      if (st.pack === 1) { box.hidden = true; box.innerHTML = ''; return; }
      while (st.picks.length < st.pack - 1) st.picks.push(defaultPicks(st.pack)[st.picks.length]);
      st.picks = st.picks.slice(0, st.pack - 1);
      box.hidden = false;
      box.innerHTML = `<p class="mb-0 small"><b>Peluche 1 :</b> ${esc(bySlug[st.slug].name)}</p>${st.picks.map((sel, i) => `<div class="pack-picks__slot"><p>Peluche ${i + 2} : <b>${esc(bySlug[sel].name)}</b></p><div class="mini-swatches" role="group" aria-label="Choisis la peluche ${i + 2}">${live.map((p) => `<button type="button" data-pick-slot="${i}" data-pick-slug="${p.slug}" aria-pressed="${p.slug === sel}" aria-label="${esc(p.name)}" title="${esc(p.name)}" style="background:color-mix(in srgb, ${p.accent} 10%, #fff)"><img src="${p.thumb}" alt="" width="52" height="52" loading="lazy"></button>`).join('')}</div></div>`).join('')}`;
    }

    pdp.addEventListener('click', (e) => {
      const b = e.target.closest('button, a');
      if (!b) return;
      if (b.dataset.size) { st.size = b.dataset.size; update(); }
      else if (b.dataset.pack) { st.pack = Number(b.dataset.pack); renderPicks(); update(); }
      else if (b.dataset.pickSlot) { st.picks[Number(b.dataset.pickSlot)] = b.dataset.pickSlug; renderPicks(); }
      else if (b.dataset.swatch && !e.metaKey && !e.ctrlKey && !e.shiftKey) { e.preventDefault(); switchProduct(b.dataset.swatch, true); }
    });

    // Navigation clavier dans les groupes radio (flèches)
    $$('[role="radiogroup"]', pdp).forEach((g) => g.addEventListener('keydown', (e) => {
      if (!['ArrowRight', 'ArrowLeft', 'ArrowDown', 'ArrowUp'].includes(e.key)) return;
      const items = $$('[role="radio"]', g);
      const i = items.indexOf(document.activeElement);
      const next = items[(i + (e.key === 'ArrowRight' || e.key === 'ArrowDown' ? 1 : -1) + items.length) % items.length];
      e.preventDefault(); next.focus(); next.click();
    }));

    embToggle?.addEventListener('change', () => { st.emb = embToggle.checked; $('#emb-field').hidden = !st.emb; if (st.emb) embInput.focus(); update(); });
    embInput?.addEventListener('input', () => { st.prenom = embInput.value.slice(0, CFG.embroidery.maxLength); $('#emb-count').textContent = st.prenom.length; update(); });
    giftToggle?.addEventListener('change', () => { st.gift = giftToggle.checked; $('#gift-field').hidden = !st.gift; });

    function addToCart() {
      if (st.emb && !st.prenom.trim()) { toast('Écris le prénom à broder, ou décoche l’option', { error: true }); embInput.focus(); return; }
      Cart.add({ slugs: [st.slug, ...(st.pack > 1 ? st.picks : [])], size: st.size, prenom: st.emb ? st.prenom.trim() : '' });
      if (st.gift) { Cart.state.giftWrap = true; const msg = $('#gift-msg').value.trim(); if (msg) Cart.state.note = msg; Cart.save(); }
      toast(st.pack > 1 ? `Pack de ${st.pack} ajouté au panier` : `${bySlug[st.slug].name} ajoutée au panier`);
      openCart();
    }
    $('#atc').addEventListener('click', addToCart);
    $('[data-sticky-add]').addEventListener('click', addToCart);
    $('#together-add')?.addEventListener('click', () => {
      const size = st.size === 'porte-cles' ? CFG.defaultSize : st.size;
      Cart.add({ slugs: [st.slug], size });
      Cart.add({ slugs: [st.slug], size: 'porte-cles' });
      Cart.state.giftWrap = true; Cart.save();
      toast('Peluche, porte-clés et emballage cadeau ajoutés');
      openCart();
    });

    // Estimation de livraison (mise à jour chaque minute)
    const dt = $('#delivery-text');
    const tick = () => { dt.innerHTML = deliveryText(); };
    tick(); setInterval(tick, 60000);

    // Barre d'achat collante : visible quand le bouton principal est sorti de l'écran par le haut
    const sticky = $('#sticky-atc');
    if ('IntersectionObserver' in window) {
      new IntersectionObserver(([en]) => {
        const show = !en.isIntersecting && en.boundingClientRect.top < 0;
        sticky.classList.toggle('is-visible', show);
        sticky.setAttribute('aria-hidden', String(!show));
        sticky.querySelector('button').tabIndex = show ? 0 : -1;
      }).observe($('#atc'));
    }

    // Zoom au survol (souris) et agrandissement au clic
    const main = $('#gallery-main'), mainImg = $('#main-img');
    if (matchMedia('(hover: hover) and (pointer: fine)').matches) {
      main.addEventListener('mouseenter', () => main.classList.add('is-zooming'));
      main.addEventListener('mouseleave', () => { main.classList.remove('is-zooming'); mainImg.style.transformOrigin = ''; });
      main.addEventListener('mousemove', (e) => { const r = main.getBoundingClientRect(); mainImg.style.transformOrigin = `${((e.clientX - r.left) / r.width) * 100}% ${((e.clientY - r.top) / r.height) * 100}%`; });
    }
    main.addEventListener('click', () => { const m = $('#image-modal'); $('#image-modal-img').src = mainImg.src; $('#image-modal-img').alt = mainImg.alt; m.showModal(); });
    $$('dialog').forEach((d) => d.addEventListener('click', (e) => { if (e.target === d) d.close(); }));

    // Info-bulle d'aperçu au survol des pastilles (desktop)
    const tip = document.createElement('div');
    tip.className = 'swatch-tip';
    document.body.append(tip);
    $$('[data-swatch]').forEach((a) => {
      a.addEventListener('mouseenter', () => {
        const p = bySlug[a.dataset.swatch];
        tip.innerHTML = `<img src="${p.thumb}" alt="" width="144" height="144">${esc(p.name)}`;
        const r = a.getBoundingClientRect();
        tip.style.left = `${Math.min(window.innerWidth - 170, Math.max(8, r.left + r.width / 2 - 80))}px`;
        tip.style.top = `${r.top - 200 < 8 ? r.bottom + 8 : r.top - 200}px`;
        tip.classList.add('is-visible');
      });
      a.addEventListener('mouseleave', () => tip.classList.remove('is-visible'));
    });

    // Changer de peluche sans recharger la page (URL mise à jour, lien partageable)
    function switchProduct(slug, push) {
      const p = bySlug[slug];
      if (!p || p.comingSoon) return;
      tip.classList.remove('is-visible');
      st.slug = slug;
      st.picks = st.picks.map((s) => (s === slug ? defaultPicks(st.pack).find((x) => !st.picks.includes(x)) || s : s));
      pdp.dataset.slug = slug;
      pdp.style.setProperty('--accent', p.accent);
      document.body.style.setProperty('--accent', p.accent);
      mainImg.src = p.img; mainImg.alt = p.alt;
      main.classList.remove('bounce'); void main.offsetWidth; main.classList.add('bounce');
      $('#sticky-img').src = p.thumb;
      $$('[data-p-name]').forEach((el) => { el.textContent = p.name; });
      $$('[data-p-hook]').forEach((el) => { el.textContent = p.hook; });
      $$('[data-p-text]').forEach((el) => { el.textContent = p.text; });
      $$('[data-p-gift]').forEach((el) => { el.textContent = p.gift; });
      const coll = $('[data-p-coll]'); coll.textContent = `Collection ${collName(p.collection)}`; coll.href = `collection-${p.collection}.html`;
      const crumb = $('[data-crumb-last]'); if (crumb) crumb.textContent = p.name;
      const prev = crumb?.closest('li')?.previousElementSibling?.querySelector('a'); if (prev) { prev.textContent = `Collection ${collName(p.collection)}`; prev.href = `collection-${p.collection}.html`; }
      $$('[data-swatch]').forEach((a) => a.setAttribute('aria-current', String(a.dataset.swatch === slug)));
      document.title = document.title.replace(/Peluche canette .+? –/, `Peluche canette ${p.name} –`);
      if (push) history.pushState({ slug }, '', p.url);
      renderPicks();
      update();
    }
    window.addEventListener('popstate', () => {
      const slug = PL.products.find((p) => p.url && location.pathname.endsWith(p.url))?.slug;
      if (slug) switchProduct(slug, false);
    });

    update();
  }

  // =====================================================================
  // CONSTRUCTEUR DE PACK
  // =====================================================================
  const builder = $('#builder');
  if (builder) {
    const st = { n: 2, size: CFG.defaultSize, picks: [] };
    function render() {
      $$('[data-pack-n]').forEach((b) => b.setAttribute('aria-checked', String(Number(b.dataset.packN) === st.n)));
      $$('[data-builder-size]').forEach((b) => b.setAttribute('aria-checked', String(b.dataset.builderSize === st.size)));
      st.picks = st.picks.slice(0, st.n);
      const full = st.picks.length === st.n;
      $('#slots').innerHTML = `${Array.from({ length: st.n }, (_, i) => {
        const p = bySlug[st.picks[i]];
        return p ? `<div class="slot is-filled" style="--accent:${p.accent}"><img src="${p.thumb}" alt="${esc(p.name)}" width="88" height="88"><button type="button" data-unpick="${i}" aria-label="Retirer ${esc(p.name)}">×</button></div>` : `<div class="slot" aria-label="Place libre">${i + 1}</div>`;
      }).join('')}<p class="slots__summary"><b>${st.picks.length}/${st.n}</b> choisies<br><span class="muted small">${full ? 'Ton pack est prêt !' : 'Clique sur une peluche'}</span></p>`;
      $$('[data-pick]').forEach((b) => {
        const c = st.picks.filter((s) => s === b.dataset.pick).length;
        b.querySelector('.count')?.remove();
        if (c) b.insertAdjacentHTML('beforeend', `<span class="count">×${c}</span>`);
        b.disabled = full && !c;
      });
      const s = sizeOf(st.size), d = packOf(st.n).discount;
      const normal = s.price * st.n, packPrice = normal * (1 - d / 100);
      $('#recap').innerHTML = `${st.picks.length ? `<ul class="mb-0" style="padding-left:1.2em">${st.picks.map((x) => `<li>${esc(bySlug[x].name)} · ${s.label} ${s.cm} cm</li>`).join('')}</ul>` : '<p class="mb-0 muted">Choisis tes peluches juste au-dessus.</p>'}
        <div class="recap__row"><span>Prix normal</span><s>${euro(normal)}</s></div>
        <div class="recap__row" style="font-weight:800;font-size:1.25rem"><span>Prix du pack (-${d} %)</span><span>${euro(packPrice)}</span></div>
        <div class="recap__row recap__save"><span>Tu économises</span><span>${euro(normal - packPrice)}</span></div>
        <button class="btn btn--block btn--lg" type="button" id="builder-add" ${full ? '' : 'disabled'}>${full ? 'Ajouter le pack au panier' : `Encore ${st.n - st.picks.length} peluche${st.n - st.picks.length > 1 ? 's' : ''} à choisir`}</button>`;
    }
    builder.addEventListener('click', (e) => {
      const b = e.target.closest('button');
      if (!b) return;
      if (b.dataset.packN) { st.n = Number(b.dataset.packN); render(); }
      else if (b.dataset.builderSize) { st.size = b.dataset.builderSize; render(); }
      else if (b.dataset.pick && st.picks.length < st.n) { st.picks.push(b.dataset.pick); render(); }
      else if (b.dataset.unpick) { st.picks.splice(Number(b.dataset.unpick), 1); render(); }
      else if (b.id === 'builder-add') {
        Cart.add({ slugs: [...st.picks], size: st.size });
        toast(`Pack de ${st.n} ajouté au panier`);
        st.picks = [];
        render();
        openCart();
      }
    });
    render();
  }

  renderCart();
})();
