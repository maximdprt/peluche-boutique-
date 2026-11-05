"use client"

import Link from "next/link"
import { useEffect, useState } from "react"

export const OPEN_CONSENT_EVENT = "voltoudou:consent"
const KEY = "voltoudou-consent"

function addScript(src: string) {
  const script = document.createElement("script")
  script.async = true
  script.src = src
  document.head.append(script)
}

// Mesure d'audience et pixels ne se chargent qu'après un accord explicite.
function loadTrackers() {
  type TrackerWindow = Window & { dataLayer?: unknown[]; gtag?: (...args: unknown[]) => void; fbq?: (...args: unknown[]) => void; ttq?: unknown }
  const w = window as TrackerWindow
  const ga = process.env.NEXT_PUBLIC_GA4_ID
  if (ga) {
    addScript(`https://www.googletagmanager.com/gtag/js?id=${ga}`)
    w.dataLayer = w.dataLayer ?? []
    w.gtag = (...args) => w.dataLayer!.push(args)
    w.gtag("js", new Date())
    w.gtag("config", ga)
  }
  const meta = process.env.NEXT_PUBLIC_META_PIXEL_ID
  if (meta) {
    const queue: unknown[][] = []
    w.fbq = Object.assign((...args: unknown[]) => void queue.push(args), { queue, version: "2.0", loaded: true, push: (...args: unknown[]) => queue.push(args) })
    addScript("https://connect.facebook.net/en_US/fbevents.js")
    w.fbq("init", meta)
    w.fbq("track", "PageView")
  }
  const tiktok = process.env.NEXT_PUBLIC_TIKTOK_PIXEL_ID
  if (tiktok) addScript(`https://analytics.tiktok.com/i18n/pixel/events.js?sdkid=${tiktok}`)
}

export function CookieBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let saved: string | null = null
    try {
      saved = localStorage.getItem(KEY)
    } catch {
      // Stockage indisponible : on redemandera à la prochaine visite
    }
    if (saved === "accepted") loadTrackers()
    if (!saved) setVisible(true)
    const open = () => setVisible(true)
    window.addEventListener(OPEN_CONSENT_EVENT, open)
    return () => window.removeEventListener(OPEN_CONSENT_EVENT, open)
  }, [])

  const decide = (value: "accepted" | "refused") => {
    try {
      localStorage.setItem(KEY, value)
    } catch {
      // Le choix vaut au moins pour cette page
    }
    if (value === "accepted") loadTrackers()
    setVisible(false)
  }

  if (!visible) return null
  return (
    <section className="consent" aria-label="Cookies">
      <h2>Un cookie ?</h2>
      <p>
        On utilise des cookies de mesure et de publicité seulement si tu es d'accord. Le site marche très bien sans.{" "}
        <Link className="link" href="/cookies">En savoir plus</Link>
      </p>
      <div className="consent-actions">
        <button type="button" className="btn btn-light" onClick={() => decide("refused")}>Refuser</button>
        <button type="button" className="btn btn-light" onClick={() => decide("accepted")}>Accepter</button>
      </div>
    </section>
  )
}
