"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { Photo } from "./Photo"
import { useStore } from "./StoreProvider"
import { Icon } from "./Icons"
import { Modal } from "./Modal"
import { formatMoney, listProducts, cheapestVariant, isAvailable, type Product } from "@/lib/medusa"
import { site, themes, universes } from "@/lib/site"

export function ShippingProgress() {
  const { cart, t } = useStore()
  const total = cart?.item_total ?? 0
  const left = Math.max(site.freeShippingThreshold - total, 0)
  return (
    <div className="progress" role="status">
      {left > 0 ? t.shippingLeft.replace("{amount}", formatMoney(left)) : t.shippingDone}
      <div className="progress-bar" aria-hidden="true">
        <i style={{ width: `${Math.min((total / site.freeShippingThreshold) * 100, 100)}%` }} />
      </div>
    </div>
  )
}

export function CartLines() {
  const { cart, setQuantity, t, setCartOpen } = useStore()
  return (
    <ul>
      {cart?.items
        ?.slice()
        .sort((a, b) => a.id.localeCompare(b.id))
        .map((item) => {
          const color = item.product?.metadata?.color
          const message = item.metadata?.gift_message as string | undefined
          return (
            <li key={item.id} className="line">
              <Link href={`/produits/${item.product_handle}`} onClick={() => setCartOpen(false)} className="line-media" style={{ "--plush": color } as React.CSSProperties}>
                <Photo src={item.thumbnail} sizes="84px" />
              </Link>
              <div>
                <Link href={`/produits/${item.product_handle}`} onClick={() => setCartOpen(false)} className="line-title">
                  {item.title === "Default" ? item.subtitle : item.subtitle ?? item.title}
                </Link>
                <span className="muted" style={{ fontSize: 14 }}>{item.title}</span>
                {message ? <p className="muted" style={{ fontSize: 14 }}>« {message} »</p> : null}
                <div className="qty" style={{ marginTop: 8 }}>
                  <button type="button" aria-label={`${t.remove} 1`} onClick={() => setQuantity(item.id, item.quantity - 1)}>−</button>
                  <output aria-live="polite">{item.quantity}</output>
                  <button type="button" aria-label={`${t.add} 1`} onClick={() => setQuantity(item.id, item.quantity + 1)}>+</button>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <b>{formatMoney(item.total)}</b>
                <button type="button" className="link muted" style={{ display: "block", marginLeft: "auto", padding: "8px 0", fontSize: 14 }} onClick={() => setQuantity(item.id, 0)}>
                  {t.remove}
                </button>
              </div>
            </li>
          )
        })}
    </ul>
  )
}

export function PromoField() {
  const { cart, applyPromo, removePromo, t, error } = useStore()
  const [code, setCode] = useState("")
  const manual = cart?.promotions?.filter((p) => !p.is_automatic && p.code) ?? []
  return (
    <div>
      <form
        className="promo"
        onSubmit={(event) => {
          event.preventDefault()
          if (code.trim()) void applyPromo(code).then(() => setCode(""))
        }}
      >
        <label htmlFor="promo" className="sr-only">{t.promoCode}</label>
        <input id="promo" className="input" style={{ minHeight: 44 }} placeholder={t.promoCode} value={code} autoCapitalize="characters" onChange={(e) => setCode(e.target.value)} />
        <button className="btn btn-light" style={{ minHeight: 44, fontSize: 14 }}>{t.apply}</button>
      </form>
      {manual.map((promo) => (
        <button key={promo.code} type="button" className="chip" style={{ marginBottom: 8 }} onClick={() => removePromo(promo.code!)}>
          {promo.code} ✕<span className="sr-only"> {t.remove}</span>
        </button>
      ))}
      {error ? <p role="alert" style={{ color: "var(--color-danger)", fontSize: 14, fontWeight: 700 }}>{error}</p> : null}
    </div>
  )
}

export function CartTotals({ showShipping = false }: { showShipping?: boolean }) {
  const { cart, t } = useStore()
  if (!cart) return null
  return (
    <div>
      {cart.discount_total > 0 ? (
        <p className="row" style={{ color: "var(--color-danger)", fontWeight: 700 }}>
          <span>{t.discount}</span><span>−{formatMoney(cart.discount_total)}</span>
        </p>
      ) : null}
      {showShipping ? <p className="row"><span>{t.shipping}</span><span>{cart.shipping_methods?.length ? formatMoney(cart.shipping_total) : "—"}</span></p> : null}
      <p className="row"><b>{t.total}</b><span className="total">{formatMoney(showShipping ? cart.total : cart.item_total)}</span></p>
      <p className="muted" style={{ fontSize: 12 }}>{t.taxIncluded}</p>
    </div>
  )
}

export function EmptyCart({ onNavigate }: { onNavigate?: () => void }) {
  const { t } = useStore()
  return (
    <div className="empty">
      <Photo name="monster_blanc" sizes="130px" />
      <p style={{ fontWeight: 800, marginBlock: 16 }}>{t.emptyCart}</p>
      <div style={{ display: "grid", gap: 8 }}>
        {Object.values(universes).map((u) => (
          <Link key={u.handle} className="btn btn-light btn-block" href={`/collections/${u.handle}`} onClick={onNavigate}>{u.name}</Link>
        ))}
        <Link className="btn btn-block" href={`/collections/${themes[0].handle}`} onClick={onNavigate}>{themes[0].name}</Link>
      </div>
    </div>
  )
}

function Suggestions() {
  const { cart, addItem, t } = useStore()
  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {
    listProducts({ limit: 8 }).then(setProducts).catch(() => setProducts([]))
  }, [])
  const inCart = new Set(cart?.items?.map((i) => i.product_handle))
  const picks = products.filter((p) => !inCart.has(p.handle) && p.metadata?.badge !== "hidden" && p.variants.some(isAvailable)).slice(0, 2)
  if (!picks.length) return null
  return (
    <div style={{ marginTop: 24 }}>
      <h3 style={{ fontSize: 16, textTransform: "uppercase", marginBottom: 8 }}>{t.youMayLike}</h3>
      {picks.map((p) => {
        const variant = cheapestVariant(p)
        return (
          <div key={p.id} className="row" style={{ paddingBlock: 8 }}>
            <span className="thumb" style={{ "--plush": p.metadata?.color } as React.CSSProperties}><Photo src={p.images?.[0]?.url} sizes="56px" /></span>
            <span style={{ flex: 1, fontSize: 14, fontWeight: 700 }}>{p.title}<br /><span className="muted">{formatMoney(variant.calculated_price?.calculated_amount ?? 0)}</span></span>
            <button type="button" className="btn btn-light" style={{ minHeight: 44, padding: "8px 14px", fontSize: 13 }} onClick={(e) => addItem(variant.id, 1, { source: e.currentTarget })} aria-label={`${t.add} : ${p.title}`}>{t.add}</button>
          </div>
        )
      })}
    </div>
  )
}

export function CartDrawer() {
  const { cartOpen, setCartOpen, cart, count, t } = useStore()
  const close = () => setCartOpen(false)
  return (
    <Modal open={cartOpen} onClose={close} variant="right" label={t.cart}>
      <div className="cart">
        <div className="dialog-head">
          <h2>{t.cart} ({count})</h2>
          <button type="button" className="iconbtn" aria-label={t.close} onClick={close}><Icon name="close" /></button>
        </div>
        {count ? <ShippingProgress /> : null}
        <div className="cart-body">
          {count ? <><CartLines /><Suggestions /></> : <EmptyCart onNavigate={close} />}
        </div>
        {count && cart ? (
          <div className="cart-foot">
            <PromoField />
            <CartTotals />
            <div style={{ display: "grid", gap: 8, marginTop: 12 }}>
              <Link className="btn btn-accent btn-block" href="/commande" onClick={close}>{t.checkout}</Link>
              <Link className="link" style={{ textAlign: "center", fontSize: 14 }} href="/panier" onClick={close}>{t.viewCart}</Link>
            </div>
          </div>
        ) : null}
      </div>
    </Modal>
  )
}
