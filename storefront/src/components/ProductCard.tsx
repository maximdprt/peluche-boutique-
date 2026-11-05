"use client"

import Image from "next/image"
import Link from "next/link"
import type { CSSProperties } from "react"
import { Icon } from "./Icons"
import { Photo } from "./Photo"
import { useStore } from "./StoreProvider"
import { cheapestVariant, discountPercent, formatMoney, isAvailable, isProductAvailable, type Product, type Variant } from "@/lib/medusa"
import { demoRating } from "@/lib/demo"
import { site, universes } from "@/lib/site"

export function Price({ variant, showFrom }: { variant?: Variant; showFrom?: boolean }) {
  const { t } = useStore()
  const price = variant?.calculated_price
  if (!price) return null
  const sale = discountPercent(price) > 0
  return (
    <p className={`price${sale ? " price-sale" : ""}`}>
      <span>{showFrom ? `${t.from} ` : ""}{formatMoney(price.calculated_amount)}</span>
      {sale ? <s><span className="sr-only">Au lieu de </span>{formatMoney(price.original_amount)}</s> : null}
    </p>
  )
}

export function Stars({ rating, count }: { rating: number; count?: number }) {
  return (
    <span className="rating">
      <span className="stars" style={{ "--pct": `${(rating / 5) * 100}%` } as CSSProperties} aria-hidden="true">★★★★★</span>
      <span className="sr-only">{rating} sur 5</span>
      {count !== undefined ? <span>{rating.toLocaleString("fr-FR")} ({count})</span> : null}
    </span>
  )
}

export function Badges({ product }: { product: Product }) {
  const { t } = useStore()
  const discount = Math.max(...product.variants.map((v) => discountPercent(v.calculated_price)))
  return (
    <div className="badges">
      {!isProductAvailable(product) ? <span className="badge badge-out">{t.soldOut}</span> : null}
      {discount > 0 ? <span className="badge badge-sale">-{discount} %</span> : null}
      {product.metadata?.badge === "new" ? <span className="badge">{t.new}</span> : null}
      {product.metadata?.badge === "limited" ? <span className="badge badge-limited">{t.limited}</span> : null}
    </div>
  )
}

export function brandName(product: Product) {
  return product.metadata?.brand ? universes[product.metadata.brand].name : ""
}

export function WishButton({ handle, title, className = "" }: { handle: string; title: string; className?: string }) {
  const { wishlist, toggleWish, t } = useStore()
  return (
    <button type="button" className={`iconbtn iconbtn-boxed wish ${className}`} aria-pressed={wishlist.includes(handle)} aria-label={`${t.wishlist} : ${title}`} onClick={() => toggleWish(handle)}>
      <Icon name="heart" />
    </button>
  )
}

export function ProductCard({ product, priority }: { product: Product; priority?: boolean }) {
  const { addItem, openQuickView, t } = useStore()
  const variant = cheapestVariant(product)
  const available = isProductAvailable(product)
  const single = product.variants.length === 1
  const color = product.metadata?.color
  const [first, second] = product.images ?? []
  const rating = site.demoContent ? demoRating(product.handle) : null

  return (
    <article className="card" style={{ "--plush": color } as CSSProperties}>
      <div className="card-media">
        <Photo src={first?.url} alt={product.title} priority={priority} sizes="(max-width: 750px) 50vw, 25vw" />
        {second ? <Image className="lifestyle" src={second.url} alt="" fill sizes="(max-width: 750px) 50vw, 25vw" /> : null}
        <Badges product={product} />
      </div>
      <WishButton handle={product.handle} title={product.title} className="card-wish" />
      <div className="card-body">
        <span className="card-vendor">{brandName(product)}</span>
        <h3 className="card-title"><Link href={`/produits/${product.handle}`}>{product.title}</Link></h3>
        {rating ? <span><Stars rating={rating.rating} count={rating.count} /> <span className="demo-tag" style={{ fontSize: 10 }}>démo</span></span> : null}
        <div className="card-foot"><Price variant={variant} showFrom={!single} /></div>
        <div className="card-actions">
          {available && single ? (
            <button type="button" className="btn btn-accent" onClick={(e) => addItem(variant.id, 1, { source: e.currentTarget })} disabled={!isAvailable(variant)}>{t.add}</button>
          ) : (
            <button type="button" className="btn btn-accent" onClick={() => openQuickView(product.handle)}>{available ? t.choose : t.notifyMe}</button>
          )}
          <button type="button" className="btn btn-light desktop-only" style={{ flex: "0 1 auto" }} onClick={() => openQuickView(product.handle)} aria-label={`${t.quickView} : ${product.title}`}>
            <span style={{ width: 20, height: 20, display: "inline-grid" }}><Icon name="search" /></span>
          </button>
        </div>
      </div>
    </article>
  )
}

export function ProductRail({ products }: { products: Product[] }) {
  return (
    <ul className="rail-track" tabIndex={0} aria-label="Liste de produits, à faire défiler">
      {products.map((p) => <li key={p.id}><ProductCard product={p} /></li>)}
    </ul>
  )
}

export function ProductGrid({ products, wide }: { products: Product[]; wide?: boolean }) {
  return (
    <ul className={`grid-products${wide ? " grid-4" : ""}`}>
      {products.map((p, i) => <li key={p.id}><ProductCard product={p} priority={i < 2} /></li>)}
    </ul>
  )
}
