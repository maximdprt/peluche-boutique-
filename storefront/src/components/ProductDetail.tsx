"use client"

import Link from "next/link"
import { useEffect, useRef, useState, type CSSProperties } from "react"
import { Icon } from "./Icons"
import { Photo } from "./Photo"
import { Badges, brandName, Price, Stars, WishButton } from "./ProductCard"
import { useStore } from "./StoreProvider"
import { discountPercent, formatMoney, isAvailable, store, type Product, type Variant } from "@/lib/medusa"
import { demoRating } from "@/lib/demo"
import { site, universes } from "@/lib/site"

export function SizePicker({ product, variantId, onChange }: { product: Product; variantId: string; onChange: (id: string) => void }) {
  if (product.variants.length < 2) return null
  const current = product.variants.find((v) => v.id === variantId)
  const order = ["Mini", "Medium", "XXL"]
  const sorted = [...product.variants].sort((a, b) => order.indexOf(a.title) - order.indexOf(b.title))
  return (
    <fieldset className="opt">
      <legend>Taille : {current?.title}{current?.metadata?.dimensions ? ` (${current.metadata.dimensions})` : ""}</legend>
      <div className="opt-list">
        {sorted.map((v) => (
          <label key={v.id} className="pill" data-out={!isAvailable(v)}>
            <input type="radio" name={`size-${product.id}`} checked={v.id === variantId} onChange={() => onChange(v.id)} />
            <span>{v.title}{isAvailable(v) ? "" : " (rupture)"}</span>
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function StockLine({ variant }: { variant: Variant }) {
  const { t } = useStore()
  const quantity = variant.inventory_quantity ?? 0
  if (!isAvailable(variant)) return <p className="stock" data-state="out">{t.soldOut}</p>
  if (variant.manage_inventory && quantity <= site.lowStockThreshold) return <p className="stock" data-state="low">{t.lowStock.replace("{n}", String(quantity))}</p>
  return <p className="stock" data-state="ok">{t.inStock}</p>
}

export function RestockForm({ variant, handle }: { variant: Variant; handle: string }) {
  const { t } = useStore()
  const [state, setState] = useState<"idle" | "done" | "error">("idle")
  if (state === "done") return <p role="status" style={{ fontWeight: 700 }}>C'est noté, on te prévient dès son retour.</p>
  return (
    <form
      className="news-form"
      style={{ width: "100%" }}
      onSubmit={(event) => {
        event.preventDefault()
        const email = new FormData(event.currentTarget).get("email")
        store("/store/leads", { method: "POST", body: { type: "restock", email, data: { handle, variant_id: variant.id, size: variant.title } } })
          .then(() => setState("done"))
          .catch(() => setState("error"))
      }}
    >
      <label htmlFor={`restock-${variant.id}`} className="sr-only">Ton e-mail</label>
      <input id={`restock-${variant.id}`} name="email" type="email" required className="input" placeholder="ton@email.fr" />
      <button className="btn btn-accent">{t.notifyMe}</button>
      {state === "error" ? <p role="alert" style={{ color: "var(--color-danger)" }}>Inscription impossible, réessaie.</p> : null}
    </form>
  )
}

function shippingMessage(): string {
  const now = new Date()
  const day = now.getDay()
  if (day === 0 || day === 6) return "Commande ce week-end, expédition lundi."
  if (now.getHours() < site.shippingCutoffHour) return `Commandé avant ${site.shippingCutoffHour} h, expédié aujourd'hui.`
  return day === 5 ? "Commande maintenant, expédition lundi." : "Commande maintenant, expédition demain."
}

function Gallery({ product }: { product: Product }) {
  const track = useRef<HTMLDivElement>(null)
  const [current, setCurrent] = useState(0)
  const [zoom, setZoom] = useState<number | null>(null)
  const images = product.images ?? []
  const go = (index: number) => {
    setCurrent(index)
    const el = track.current
    if (el) el.scrollTo({ left: index * el.clientWidth, behavior: "smooth" })
  }
  return (
    <div style={{ position: "relative" }}>
      <div
        className="gallery-track"
        ref={track}
        tabIndex={0}
        aria-label="Galerie photo"
        onScroll={(e) => setCurrent(Math.round(e.currentTarget.scrollLeft / e.currentTarget.clientWidth))}
      >
        {images.map((image, i) => (
          <button key={image.id} type="button" className="gallery-item" data-zoom={zoom === i} aria-label={`Zoomer sur la photo ${i + 1}`} aria-pressed={zoom === i} onClick={() => setZoom(zoom === i ? null : i)}>
            <Photo src={image.url} alt={`${product.title}, photo ${i + 1}`} priority={i === 0} sizes="(max-width: 990px) 100vw, 55vw" />
          </button>
        ))}
      </div>
      <Badges product={product} />
      {images.length > 1 ? (
        <div className="gallery-thumbs">
          {images.map((image, i) => (
            <button key={image.id} type="button" className="gallery-thumb" aria-label={`Afficher la photo ${i + 1}`} aria-current={current === i} onClick={() => go(i)}>
              <Photo src={image.url} sizes="72px" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  )
}

export function ProductDetail({ product, giftWrapVariantId }: { product: Product; giftWrapVariantId?: string }) {
  const { addItem, t } = useStore()
  const initial = (product.variants.find(isAvailable) ?? product.variants[0]).id
  const [variantId, setVariantId] = useState(initial)
  const [quantity, setQuantity] = useState(1)
  const [gift, setGift] = useState(false)
  const [message, setMessage] = useState("")
  const [shipping, setShipping] = useState("")
  const [sticky, setSticky] = useState(false)
  const buyRef = useRef<HTMLDivElement>(null)
  const variant = product.variants.find((v) => v.id === variantId) ?? product.variants[0]
  const available = isAvailable(variant)
  const stockLimit = variant.manage_inventory ? (variant.inventory_quantity ?? 1) : 99
  const rating = site.demoContent ? demoRating(product.handle) : null
  const brand = product.metadata?.brand

  useEffect(() => setShipping(shippingMessage()), [])
  useEffect(() => setQuantity(1), [variantId])
  useEffect(() => {
    const el = buyRef.current
    if (!el) return
    const observer = new IntersectionObserver(([entry]) => setSticky(!entry.isIntersecting))
    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  const add = async (source: HTMLElement) => {
    await addItem(variant.id, quantity, { source })
    if (gift && giftWrapVariantId) await addItem(giftWrapVariantId, 1, { metadata: { gift_message: message.trim() } })
  }

  return (
    <div className="pdp" style={{ "--plush": product.metadata?.color } as CSSProperties}>
      <Gallery product={product} />
      <div className="pdp-buy">
        {brand ? <Link className="eyebrow" href={`/collections/${universes[brand].handle}`}>{brandName(product)}</Link> : null}
        <h1 className="pdp-title">{product.title}</h1>
        {rating ? <a href="#avis"><Stars rating={rating.rating} count={rating.count} /> <span className="demo-tag">démo</span></a> : null}
        <div className="pdp-price"><Price variant={variant} /></div>
        <p className="muted" style={{ fontSize: 14 }}>
          {t.taxIncluded}
          {discountPercent(variant.calculated_price) > 0 ? ` · Soit -${discountPercent(variant.calculated_price)} %` : ""}
        </p>
        <SizePicker product={product} variantId={variant.id} onChange={setVariantId} />
        <StockLine variant={variant} />

        {available ? (
          <>
            <div className="buy" ref={buyRef}>
              <div className="qty">
                <button type="button" aria-label="Retirer 1" onClick={() => setQuantity((q) => Math.max(1, q - 1))}>−</button>
                <output aria-live="polite">{quantity}</output>
                <button type="button" aria-label="Ajouter 1" onClick={() => setQuantity((q) => Math.min(stockLimit, q + 1))}>+</button>
              </div>
              <button type="button" className="btn btn-accent" onClick={(e) => add(e.currentTarget)}>{t.addToCart}</button>
              <WishButton handle={product.handle} title={product.title} />
            </div>
            {giftWrapVariantId ? (
              <div className="giftbox">
                <label className="check">
                  <input type="checkbox" checked={gift} onChange={(e) => setGift(e.target.checked)} />
                  <span><b>Emballage cadeau avec message</b> (+{formatMoney(site.giftWrapPrice)})</span>
                </label>
                {gift ? (
                  <>
                    <label htmlFor="gift-message" className="sr-only">Ton message</label>
                    <textarea id="gift-message" className="input" maxLength={180} placeholder="Ton message (180 caractères maximum)" value={message} onChange={(e) => setMessage(e.target.value)} />
                  </>
                ) : null}
              </div>
            ) : null}
            <p style={{ marginTop: 12, fontWeight: 600 }}>{shipping}</p>
            {site.paymentsEnabled ? <p className="muted" style={{ marginTop: 4, fontSize: 14 }}>Apple Pay, Google Pay et PayPal disponibles au paiement, selon ton appareil.</p> : null}
          </>
        ) : (
          <div className="buy" ref={buyRef}><RestockForm variant={variant} handle={product.handle} /></div>
        )}
        {site.licensed ? <p className="licence">Produit officiel sous licence</p> : null}

        <div className="acc">
          <details open>
            <summary>Description</summary>
            <div className="acc-body"><p>{product.description}</p></div>
          </details>
          <details>
            <summary>Caractéristiques</summary>
            <div className="acc-body">
              <table className="spec"><tbody>
                <tr><th scope="row">Dimensions</th><td>{variant.metadata?.dimensions ?? "À renseigner"}</td></tr>
                <tr><th scope="row">Matières</th><td>À renseigner selon la fiche fournisseur</td></tr>
                <tr><th scope="row">Âge recommandé</th><td>À renseigner selon le certificat</td></tr>
                <tr><th scope="row">Normes CE / EN 71</th><td>À renseigner à réception du certificat</td></tr>
              </tbody></table>
            </div>
          </details>
          <details>
            <summary>Entretien</summary>
            <div className="acc-body"><p>Lavage à 30 °C dans un filet, sans essorage, puis séchage à l'air libre. Pas de sèche-linge.</p></div>
          </details>
          <details>
            <summary>Livraison et retours</summary>
            <div className="acc-body">
              <p>Livraison offerte dès {site.freeShippingThreshold} € avec Mondial Relay et Colissimo. Retours sous 30 jours.</p>
              <Link className="link" href="/livraison-retours">Tout savoir</Link>
            </div>
          </details>
        </div>
      </div>

      <div className="stickybar" data-visible={sticky && available}>
        <div className="stickybar-info">
          <span>{product.title}</span>
          <span>{formatMoney(variant.calculated_price?.calculated_amount ?? 0)}</span>
        </div>
        <button type="button" className="btn btn-accent" tabIndex={sticky ? 0 : -1} onClick={(e) => add(e.currentTarget)}>
          <span style={{ width: 20, height: 20, display: "inline-grid" }}><Icon name="bag" /></span>
          {t.add}
        </button>
      </div>
    </div>
  )
}
