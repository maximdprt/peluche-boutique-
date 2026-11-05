"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Icon } from "./Icons"
import { Photo } from "./Photo"
import { useStore } from "./StoreProvider"
import { store } from "@/lib/medusa"
import { site } from "@/lib/site"

const slides = [
  { title: "L'énergie, version câlin.", sub: "La nouvelle collection arrive. Tout doux dehors, survolté dedans.", cta: "Voir les nouveautés", href: "/collections/nouveautes", bg: "#fafaf7", fg: "#14141a", accent: "#ff5a1f", photo: "redbull_bleu", sticker: "Nouvelle collection" },
  { title: "Compose ton duo.", sub: "Prends-en deux, on enlève 15 %. Parce qu'une peluche seule, ça s'ennuie.", cta: "Former mon duo", href: "/boutique", bg: "#ff5a1f", fg: "#14141a", accent: "#ffd84d", photo: "redbull_rose", sticker: "-15 % sur 2" },
  { title: "Le violet ne reviendra pas.", sub: "Violet électrique, tirage court. Quand c'est parti, c'est parti.", cta: "Voir l'édition limitée", href: "/collections/editions-limitees", bg: "#14141a", fg: "#ffffff", accent: "#7b3ff2", photo: "monster_violet", sticker: "Édition limitée" },
]

export function Hero() {
  const track = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [playing, setPlaying] = useState(false)

  useEffect(() => {
    setPlaying(!matchMedia("(prefers-reduced-motion: reduce)").matches)
  }, [])

  const go = (index: number) => {
    const el = track.current
    if (el) el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" })
  }

  useEffect(() => {
    if (!playing) return
    const timer = setInterval(() => {
      const el = track.current
      if (el) el.scrollTo({ left: ((Math.round(el.scrollLeft / el.clientWidth) + 1) % slides.length) * el.clientWidth, behavior: "smooth" })
    }, 6000)
    return () => clearInterval(timer)
  }, [playing])

  return (
    <section className="hero" aria-roledescription="carrousel" aria-label="À la une" onFocus={() => setPlaying(false)}>
      <div className="hero-track" ref={track} onScroll={(e) => setCurrent(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}>
        {slides.map((s, i) => (
          <div key={s.title} className="slide" aria-roledescription="diapositive" aria-label={`${i + 1} sur ${slides.length}`} style={{ "--slide-bg": s.bg, "--slide-fg": s.fg, "--slide-accent": s.accent } as CSSProperties}>
            <div className="wrap slide-inner">
              <div>
                {i === 0 ? <h1 className="slide-title">{s.title}</h1> : <h2 className="slide-title">{s.title}</h2>}
                <p className="slide-sub">{s.sub}</p>
                <Link className={`btn ${s.bg === "#fafaf7" ? "btn-accent" : "btn-light"}`} href={s.href} tabIndex={current === i ? 0 : -1}>{s.cta}</Link>
              </div>
              <div className="slide-art">
                <span className="art-plate"><Photo name={s.photo} priority={i === 0} sizes="(max-width: 900px) 62vw, 480px" alt="" /></span>
                <span className="sticker">{s.sticker}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
      <div className="hero-controls">
        <div className="wrap">
          <button type="button" className="iconbtn iconbtn-boxed" style={{ color: "var(--color-ink)" }} aria-label={playing ? "Mettre le défilement en pause" : "Lancer le défilement"} onClick={() => setPlaying(!playing)}>
            <Icon name={playing ? "pause" : "play"} />
          </button>
          {slides.map((s, i) => (
            <button key={s.title} type="button" className="dot" aria-label={`Diapositive ${i + 1}`} aria-current={current === i} onClick={() => { setPlaying(false); go(i) }} />
          ))}
        </div>
      </div>
    </section>
  )
}

export function Countdown({ end }: { end: string }) {
  const [left, setLeft] = useState<number | null>(null)
  useEffect(() => {
    const update = () => setLeft(new Date(end).getTime() - Date.now())
    update()
    const timer = setInterval(update, 1000)
    return () => clearInterval(timer)
  }, [end])
  if (left === null || left <= 0) return null
  const seconds = Math.floor(left / 1000)
  const parts = [
    { v: Math.floor(seconds / 86400), l: "jours" },
    { v: Math.floor(seconds / 3600) % 24, l: "heures" },
    { v: Math.floor(seconds / 60) % 60, l: "min" },
    { v: seconds % 60, l: "sec" },
  ]
  return (
    <div className="countdown" role="timer" aria-label="Temps restant">
      {parts.map((p) => <div key={p.l}><b>{String(p.v).padStart(2, "0")}</b><span>{p.l}</span></div>)}
    </div>
  )
}

export function LimitedAdd({ variantId }: { variantId: string }) {
  const { addItem, t } = useStore()
  return <button type="button" className="btn btn-accent" onClick={(e) => addItem(variantId, 1, { source: e.currentTarget })}>{t.addToCart}</button>
}

export function Newsletter() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle")
  return (
    <section className="news section" aria-labelledby="news-title">
      <div className="wrap news-grid">
        <div>
          <h2 id="news-title" className="title">-10 % sur ta première commande</h2>
          <p className="lead">Nouveautés, éditions limitées et ventes flash. Pas de spam, juste de l'énergie.</p>
        </div>
        {state === "done" ? (
          <p role="status" style={{ fontWeight: 800, fontSize: 19 }}>Bienvenue dans l'équipe ! Ton code : BIENVENUE10</p>
        ) : (
          <form
            onSubmit={(event) => {
              event.preventDefault()
              const email = new FormData(event.currentTarget).get("email")
              setState("sending")
              store("/store/leads", { method: "POST", body: { type: "newsletter", email, data: { consent: true, consented_at: new Date().toISOString() } } })
                .then(() => setState("done"))
                .catch(() => setState("error"))
            }}
          >
            <div className="news-form">
              <label htmlFor="news-email" className="sr-only">Ton e-mail</label>
              <input id="news-email" name="email" type="email" required autoComplete="email" className="input" placeholder="ton@email.fr" />
              <button className="btn" disabled={state === "sending"}>Je m'inscris</button>
            </div>
            <label className="check" style={{ marginTop: 12 }}>
              <input type="checkbox" required />
              <span>J'accepte de recevoir les e-mails de {site.fullName}. Désinscription possible à tout moment. <Link className="link" href="/confidentialite">Confidentialité</Link></span>
            </label>
            {state === "error" ? <p role="alert" style={{ marginTop: 8, fontWeight: 700 }}>Inscription impossible pour l'instant, réessaie.</p> : null}
          </form>
        )}
      </div>
    </section>
  )
}
