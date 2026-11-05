"use client"

import Link from "next/link"
import { useEffect, useState, type CSSProperties } from "react"
import { Icon } from "./Icons"
import { Modal } from "./Modal"
import { Photo } from "./Photo"
import { Badges, brandName, Price } from "./ProductCard"
import { useStore } from "./StoreProvider"
import { RestockForm, SizePicker, StockLine } from "./ProductDetail"
import { formatMoney, getProduct, isAvailable, listProducts, cheapestVariant, type Product } from "@/lib/medusa"
import { highlights, themes } from "@/lib/site"

export function QuickView() {
  const { quickViewHandle, openQuickView, addItem, t } = useStore()
  const [product, setProduct] = useState<Product | null>(null)
  const [variantId, setVariantId] = useState<string | null>(null)

  useEffect(() => {
    setProduct(null)
    if (!quickViewHandle) return
    getProduct(quickViewHandle).then((p) => {
      setProduct(p)
      setVariantId(p ? (p.variants.find(isAvailable) ?? p.variants[0]).id : null)
    })
  }, [quickViewHandle])

  const variant = product?.variants.find((v) => v.id === variantId)
  const close = () => openQuickView(null)
  return (
    <Modal open={!!quickViewHandle} onClose={close} variant="center" label={t.quickView}>
      <div className="dialog-head">
        <h2 style={{ fontSize: 16 }}>{t.quickView}</h2>
        <button type="button" className="iconbtn" aria-label={t.close} onClick={close}><Icon name="close" /></button>
      </div>
      {product && variant ? (
        <div className="qv" style={{ "--plush": product.metadata?.color } as CSSProperties}>
          <div className="qv-media" style={{ position: "relative" }}>
            <Photo src={product.images?.[0]?.url} alt={product.title} sizes="(max-width: 750px) 90vw, 460px" />
            <Badges product={product} />
          </div>
          <div className="qv-info">
            <span className="eyebrow">{brandName(product)}</span>
            <h3>{product.title}</h3>
            <Price variant={variant} />
            <SizePicker product={product} variantId={variant.id} onChange={setVariantId} />
            <StockLine variant={variant} />
            <div className="buy">
              {isAvailable(variant) ? (
                <button type="button" className="btn btn-accent" onClick={(e) => addItem(variant.id, 1, { source: e.currentTarget })}>{t.addToCart}</button>
              ) : (
                <RestockForm variant={variant} handle={product.handle} />
              )}
            </div>
            <p style={{ marginTop: 16 }}><Link className="link" href={`/produits/${product.handle}`} onClick={close}>{t.viewProduct}</Link></p>
          </div>
        </div>
      ) : (
        <p style={{ padding: 32 }} role="status">Chargement…</p>
      )}
    </Modal>
  )
}

export function SearchOverlay() {
  const { searchOpen, setSearchOpen, t } = useStore()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<Product[] | null>(null)
  const close = () => setSearchOpen(false)

  useEffect(() => {
    const q = query.trim()
    if (q.length < 2) {
      setResults(null)
      return
    }
    const timer = setTimeout(() => {
      listProducts({ q, limit: 6 }).then(setResults).catch(() => setResults([]))
    }, 180)
    return () => clearTimeout(timer)
  }, [query])

  return (
    <Modal open={searchOpen} onClose={close} variant="top" label={t.search}>
      <form action="/recherche" className="search-form" role="search" onSubmit={close}>
        <label htmlFor="search-q" className="sr-only">{t.search}</label>
        <input id="search-q" name="q" className="input" type="search" autoFocus autoComplete="off" placeholder={t.searchPlaceholder} value={query} onChange={(e) => setQuery(e.target.value)} />
        <button type="button" className="iconbtn" aria-label={t.close} onClick={close}><Icon name="close" /></button>
      </form>
      <div className="search-results" aria-live="polite">
        {results === null ? (
          <>
            <h2 style={{ fontSize: 16, textTransform: "uppercase" }}>{t.popular}</h2>
            <ul className="chips">
              {["canette", "néon", "coffret", "XXL", "rose"].map((word) => (
                <li key={word}><button type="button" className="chip" onClick={() => setQuery(word)}>{word}</button></li>
              ))}
              {[...highlights.slice(0, 2), themes[2]].map((item) => (
                <li key={item.handle}><Link className="chip" href={`/collections/${item.handle}`} onClick={close}>{item.name}</Link></li>
              ))}
            </ul>
          </>
        ) : results.length ? (
          <ul className="suggest">
            {results.map((p) => (
              <li key={p.id}>
                <Link href={`/produits/${p.handle}`} onClick={close}>
                  <span className="thumb" style={{ "--plush": p.metadata?.color, width: 64 } as CSSProperties}><Photo src={p.images?.[0]?.url} sizes="64px" /></span>
                  <span><b>{p.title}</b><br /><span className="muted">{formatMoney(cheapestVariant(p).calculated_price?.calculated_amount ?? 0)}</span></span>
                </Link>
              </li>
            ))}
          </ul>
        ) : (
          <p>{t.noResult}</p>
        )}
      </div>
    </Modal>
  )
}
