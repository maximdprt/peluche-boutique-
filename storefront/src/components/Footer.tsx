"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { Logo } from "./Header"
import { Icon } from "./Icons"
import { OPEN_CONSENT_EVENT } from "./CookieBanner"
import { useStore } from "./StoreProvider"
import { formats, site, themes, universes } from "@/lib/site"

export function Reassurance() {
  return (
    <ul className="reassure wrap">
      <li><Icon name="bolt" />{site.licensed ? "Produits officiels" : "Sélection de collectionneurs"}</li>
      <li><Icon name="truck" />Livraison rapide</li>
      <li><Icon name="back" />Retours 30 jours</li>
      {site.paymentsEnabled ? <li><Icon name="lock" />Paiement sécurisé</li> : null}
    </ul>
  )
}

export function Footer() {
  const { t, locale } = useStore()
  const router = useRouter()
  const columns = [
    {
      title: t.footerShop,
      links: [
        { n: "Toute la boutique", h: "/boutique" },
        ...Object.values(universes).map((u) => ({ n: u.name, h: `/collections/${u.handle}` })),
        ...themes.slice(0, 3).map((u) => ({ n: u.name, h: `/collections/${u.handle}` })),
        { n: formats[3].name, h: `/collections/${formats[3].handle}` },
        { n: "Guide cadeaux", h: "/guide-cadeaux" },
      ],
    },
    {
      title: t.footerHelp,
      links: [
        { n: "FAQ", h: "/faq" },
        { n: "Livraison et retours", h: "/livraison-retours" },
        { n: "Suivi de commande", h: "/suivi-commande" },
        { n: "Contact", h: "/contact" },
      ],
    },
    {
      title: t.footerAbout,
      links: [
        { n: "Notre histoire", h: "/notre-histoire" },
        { n: "Programme de fidélité", h: "/fidelite" },
        { n: "Avis clients", h: "/avis" },
        { n: "Mentions légales", h: "/mentions-legales" },
        { n: "CGV", h: "/cgv" },
        { n: "Confidentialité", h: "/confidentialite" },
        { n: "Cookies", h: "/cookies" },
      ],
    },
  ]
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div className="footer-brand">
            <Logo />
            <p style={{ marginTop: 12, maxWidth: "34ch" }}>L'énergie, version câlin. Doux à l'extérieur, survolté à l'intérieur.</p>
            <p style={{ marginTop: 12, fontWeight: 700 }}>{site.hashtag}</p>
            <button type="button" className="link" style={{ marginTop: 12 }} onClick={() => window.dispatchEvent(new Event(OPEN_CONSENT_EVENT))}>Gérer mes cookies</button>
          </div>
          {columns.map((col) => (
            <nav key={col.title} aria-label={col.title}>
              <h3>{col.title}</h3>
              <ul>{col.links.map((l) => <li key={l.h}><Link href={l.h}>{l.n}</Link></li>)}</ul>
            </nav>
          ))}
        </div>
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} {site.fullName}. {t.allRights}</p>
          {site.paymentsEnabled ? (
            <ul className="pay" aria-label="Moyens de paiement">
              {["CB", "Visa", "Mastercard", "PayPal", "Apple Pay", "Google Pay"].map((p) => <li key={p}>{p}</li>)}
            </ul>
          ) : null}
          <label>
            <span className="sr-only">{t.language}</span>
            <select
              value={locale}
              onChange={(e) => {
                document.cookie = `locale=${e.target.value}; path=/; max-age=31536000; samesite=lax`
                router.refresh()
              }}
            >
              <option value="fr">Français · €</option>
              <option value="en">English · €</option>
            </select>
          </label>
        </div>
      </div>
    </footer>
  )
}
