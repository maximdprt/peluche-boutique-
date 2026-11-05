"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type ReactNode } from "react"
import { Icon } from "./Icons"
import { Modal } from "./Modal"
import { Photo } from "./Photo"
import { useStore } from "./StoreProvider"
import { formats, highlights, site, themes, universes } from "@/lib/site"

export function Logo() {
  return (
    <Link href="/" className="logo" aria-label={`${site.fullName}, accueil`}>
      {site.name.first}<b>{site.name.second}</b>
    </Link>
  )
}

export function Ticker({ items, className = "ticker" }: { items: string[]; className?: string }) {
  const group = (hidden: boolean) => (
    <div className="ticker-group" aria-hidden={hidden || undefined}>
      {[...items, ...items, ...items].map((item, i) => <span key={i} className="ticker-item">{item}</span>)}
    </div>
  )
  return (
    <div className={className}>
      <div className="ticker-track">{group(false)}{group(true)}</div>
    </div>
  )
}

type Tile = { name: string; href: string; photo: string }
type Menu = { label: string; title: string; links: { name: string; href: string }[]; tiles: Tile[] }
const col = (handle: string) => `/collections/${handle}`

function useMenus(): Menu[] {
  const { t } = useStore()
  return [
    {
      label: t.brands,
      title: "Choisis ton camp",
      links: [
        ...Object.values(universes).map((u) => ({ name: u.name, href: col(u.handle) })),
        { name: "Toute la boutique", href: "/boutique" },
      ],
      tiles: Object.values(universes).map((u) => ({ name: u.name, href: col(u.handle), photo: u.photo })),
    },
    {
      label: t.universes,
      title: "Choisis ton univers",
      links: themes.map((u) => ({ name: u.name, href: col(u.handle) })),
      tiles: themes.map((u) => ({ name: u.name, href: col(u.handle), photo: u.photo })),
    },
    {
      label: t.formats,
      title: "Choisis ta taille",
      links: formats.map((f) => ({ name: f.name, href: col(f.handle) })),
      tiles: [
        { name: "Mini", href: col("mini"), photo: "monster_rose" },
        { name: "Medium", href: col("medium"), photo: "monster_vert" },
        { name: "XXL", href: col("xxl"), photo: "redbull" },
      ],
    },
    {
      label: t.gifts,
      title: "Offrir une peluche",
      links: [
        { name: "Guide cadeaux", href: "/guide-cadeaux" },
        { name: "Moins de 20 €", href: "/guide-cadeaux#budget" },
        { name: "Noël et Secret Santa", href: "/guide-cadeaux#occasion" },
        ...highlights.slice(0, 3).map((h) => ({ name: h.name, href: col(h.handle) })),
      ],
      tiles: [{ name: "Coffrets", href: col("coffrets"), photo: "coffret_redbull" }, { name: "Éditions limitées", href: col("editions-limitees"), photo: "monster_violet" }],
    },
  ]
}

function IconLink({ label, href, children }: { label: string; href: string; children: ReactNode }) {
  return <Link className="iconbtn" href={href} aria-label={label}>{children}</Link>
}

export function Header() {
  const { t, count, wishlist, setCartOpen, setSearchOpen } = useStore()
  const menus = useMenus()
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const [mobile, setMobile] = useState(false)
  const navRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpenIndex(null)
    const onClick = (e: MouseEvent) => {
      if (!navRef.current?.contains(e.target as Node)) setOpenIndex(null)
    }
    document.addEventListener("keydown", onKey)
    document.addEventListener("click", onClick)
    return () => {
      document.removeEventListener("keydown", onKey)
      document.removeEventListener("click", onClick)
    }
  }, [])

  return (
    <header className="header" onMouseLeave={() => setOpenIndex(null)}>
      <div className="wrap header-bar">
        <div className="mobile-only" style={{ justifySelf: "start" }}>
          <button type="button" className="iconbtn" aria-label={t.menu} onClick={() => setMobile(true)}><Icon name="menu" /></button>
        </div>
        <Logo />
        <nav className="nav" aria-label="Navigation principale" ref={navRef}>
          <ul className="nav-list">
            {menus.map((menu, i) => (
              <li key={menu.label} className="nav-item" data-open={openIndex === i} onMouseEnter={() => setOpenIndex(i)}>
                <button type="button" className="nav-top" aria-expanded={openIndex === i} onClick={() => setOpenIndex(openIndex === i ? null : i)}>{menu.label}</button>
                {openIndex === i ? (
                  <div className="mega">
                    <div className="wrap mega-grid">
                      <div>
                        <h3>{menu.title}</h3>
                        <ul>{menu.links.map((l) => <li key={l.href}><Link href={l.href} onClick={() => setOpenIndex(null)}>{l.name}</Link></li>)}</ul>
                      </div>
                      <div className="mega-tiles">
                        {menu.tiles.map((tile) => (
                          <Link key={tile.href} className="mega-tile" href={tile.href} onClick={() => setOpenIndex(null)}>
                            <span className="mega-art"><Photo name={tile.photo} sizes="160px" alt="" /></span>{tile.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </li>
            ))}
            <li><Link className="nav-top nav-promo" href={col("promotions")}>{t.promos}</Link></li>
          </ul>
        </nav>
        <div className="header-icons">
          <button type="button" className="iconbtn" aria-label={t.search} onClick={() => setSearchOpen(true)}><Icon name="search" /></button>
          <span className="desktop-only"><IconLink label={t.account} href="/compte"><Icon name="user" /></IconLink></span>
          <span className="desktop-only">
            <IconLink label={t.wishlist} href="/liste-envies">
              <Icon name="heart" />
              {wishlist.length ? <span className="count">{wishlist.length}</span> : null}
            </IconLink>
          </span>
          <button id="cart-button" type="button" className="iconbtn" aria-label={`${t.cart}, ${count}`} onClick={() => setCartOpen(true)}>
            <Icon name="bag" />
            {count ? <span className="count">{count}</span> : null}
          </button>
        </div>
      </div>

      <Modal open={mobile} onClose={() => setMobile(false)} variant="left" label={t.menu}>
        <div className="dialog-head">
          <Logo />
          <button type="button" className="iconbtn" aria-label={t.close} onClick={() => setMobile(false)}><Icon name="close" /></button>
        </div>
        <div style={{ padding: 16 }} className="acc" onClick={(e) => (e.target as HTMLElement).closest("a") && setMobile(false)}>
          {menus.map((menu) => (
            <details key={menu.label}>
              <summary>{menu.label}</summary>
              <ul className="acc-body">
                {menu.links.map((l) => <li key={l.href}><Link style={{ display: "block", padding: "10px 0", fontWeight: 600 }} href={l.href}>{l.name}</Link></li>)}
              </ul>
            </details>
          ))}
          <ul style={{ paddingBlock: 12 }}>
            {[{ n: t.promos, h: col("promotions") }, { n: t.account, h: "/compte" }, { n: t.wishlist, h: "/liste-envies" }, { n: "Notre histoire", h: "/notre-histoire" }].map((l) => (
              <li key={l.h}><Link style={{ display: "block", padding: "12px 0", fontWeight: 800 }} href={l.h}>{l.n}</Link></li>
            ))}
          </ul>
        </div>
      </Modal>
    </header>
  )
}
