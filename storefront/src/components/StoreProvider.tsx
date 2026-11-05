"use client"

import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react"
import { dictionaries, type Dictionary, type Locale } from "@/lib/i18n"
import { REGION_ID, store, type Cart } from "@/lib/medusa"

const CART_FIELDS = "*items,*items.product,+items.product.metadata,*items.variant,*promotions,*shipping_methods,*shipping_address,*payment_collection.payment_sessions"
const CART_KEY = "voltoudou-cart"
const WISH_KEY = "voltoudou-wishlist"

type AddOptions = { color?: string; source?: HTMLElement | null; metadata?: Record<string, unknown> }

type StoreValue = {
  t: Dictionary
  locale: Locale
  cart: Cart | null
  count: number
  cartOpen: boolean
  setCartOpen: (open: boolean) => void
  quickViewHandle: string | null
  openQuickView: (handle: string | null) => void
  searchOpen: boolean
  setSearchOpen: (open: boolean) => void
  addItem: (variantId: string, quantity?: number, options?: AddOptions) => Promise<void>
  setQuantity: (lineId: string, quantity: number) => Promise<void>
  applyPromo: (code: string) => Promise<void>
  removePromo: (code: string) => Promise<void>
  refreshCart: () => Promise<Cart | null>
  ensureCart: () => Promise<Cart>
  clearCart: () => void
  error: string | null
  wishlist: string[]
  toggleWish: (handle: string) => void
}

const StoreContext = createContext<StoreValue | null>(null)

export function useStore(): StoreValue {
  const value = useContext(StoreContext)
  if (!value) throw new Error("useStore doit être utilisé dans StoreProvider")
  return value
}

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key)
  } catch {
    return null
  }
}

function writeStorage(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key)
    else localStorage.setItem(key, value)
  } catch {
    // Navigation privée ou stockage bloqué : le site reste utilisable pour la session
  }
}

// La peluche saute vers l'icône panier
function flyToCart(source: HTMLElement | null | undefined) {
  const target = document.getElementById("cart-button")
  if (!source || !target || matchMedia("(prefers-reduced-motion: reduce)").matches) return
  const art = source.closest(".card, .pdp, .qv")?.querySelector("svg[role=img], img")
  const from = (art ?? source).getBoundingClientRect()
  const to = target.getBoundingClientRect()
  const flyer = document.createElement("div")
  flyer.className = "flyer"
  flyer.style.left = `${from.left + from.width / 2 - 36}px`
  flyer.style.top = `${from.top + from.height / 2 - 44}px`
  if (art) flyer.append(art.cloneNode(true))
  document.body.append(flyer)
  const dx = to.left + to.width / 2 - from.left - from.width / 2
  const dy = to.top + to.height / 2 - from.top - from.height / 2
  flyer
    .animate(
      [
        { transform: "translate(0, 0) scale(1) rotate(0)", opacity: 1 },
        { transform: `translate(${dx * 0.5}px, ${dy * 0.5 - 120}px) scale(.9) rotate(-14deg)`, opacity: 1, offset: 0.55 },
        { transform: `translate(${dx}px, ${dy}px) scale(.2) rotate(12deg)`, opacity: 0.4 },
      ],
      { duration: 650, easing: "cubic-bezier(.3,.7,.4,1)" }
    )
    .finished.finally(() => {
      flyer.remove()
      target.classList.remove("bump")
      void target.getBoundingClientRect()
      target.classList.add("bump")
    })
}

export function StoreProvider({ locale, children }: { locale: Locale; children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null)
  const [cartOpen, setCartOpen] = useState(false)
  const [quickViewHandle, openQuickView] = useState<string | null>(null)
  const [searchOpen, setSearchOpen] = useState(false)
  const [wishlist, setWishlist] = useState<string[]>([])
  const [error, setError] = useState<string | null>(null)

  const fetchCart = useCallback(async (id: string) => {
    const { cart } = await store<{ cart: Cart }>(`/store/carts/${id}`, { query: { fields: CART_FIELDS } })
    setCart(cart)
    return cart
  }, [])

  const refreshCart = useCallback(async () => {
    const id = readStorage(CART_KEY)
    if (!id) return null
    try {
      return await fetchCart(id)
    } catch {
      writeStorage(CART_KEY, null)
      setCart(null)
      return null
    }
  }, [fetchCart])

  const ensureCart = useCallback(async () => {
    const existing = await refreshCart()
    if (existing) return existing
    const { cart } = await store<{ cart: Cart }>("/store/carts", { method: "POST", body: { region_id: REGION_ID } })
    writeStorage(CART_KEY, cart.id)
    return fetchCart(cart.id)
  }, [fetchCart, refreshCart])

  useEffect(() => {
    void refreshCart()
    try {
      setWishlist(JSON.parse(readStorage(WISH_KEY) ?? "[]"))
    } catch {
      setWishlist([])
    }
  }, [refreshCart])

  const run = useCallback(async (action: () => Promise<unknown>) => {
    setError(null)
    try {
      await action()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.")
    }
  }, [])

  const value = useMemo<StoreValue>(
    () => ({
      t: dictionaries[locale],
      locale,
      cart,
      count: cart?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0,
      cartOpen,
      setCartOpen,
      quickViewHandle,
      openQuickView,
      searchOpen,
      setSearchOpen,
      error,
      refreshCart,
      ensureCart,
      clearCart: () => {
        writeStorage(CART_KEY, null)
        setCart(null)
      },
      addItem: (variantId, quantity = 1, options = {}) =>
        run(async () => {
          flyToCart(options.source)
          const { id } = await ensureCart()
          await store(`/store/carts/${id}/line-items`, {
            method: "POST",
            body: { variant_id: variantId, quantity, metadata: options.metadata },
          })
          await fetchCart(id)
          openQuickView(null)
          setCartOpen(true)
        }),
      setQuantity: (lineId, quantity) =>
        run(async () => {
          if (!cart) return
          if (quantity < 1) await store(`/store/carts/${cart.id}/line-items/${lineId}`, { method: "DELETE" })
          else await store(`/store/carts/${cart.id}/line-items/${lineId}`, { method: "POST", body: { quantity } })
          await fetchCart(cart.id)
        }),
      applyPromo: (code) =>
        run(async () => {
          const { id } = await ensureCart()
          await store(`/store/carts/${id}/promotions`, { method: "POST", body: { promo_codes: [code.trim().toUpperCase()] } })
          const updated = await fetchCart(id)
          if (!updated.promotions?.some((p) => p.code === code.trim().toUpperCase())) throw new Error("Ce code n'est pas valable.")
        }),
      removePromo: (code) =>
        run(async () => {
          if (!cart) return
          await store(`/store/carts/${cart.id}/promotions`, { method: "DELETE", body: { promo_codes: [code] } })
          await fetchCart(cart.id)
        }),
      wishlist,
      toggleWish: (handle) =>
        setWishlist((current) => {
          const next = current.includes(handle) ? current.filter((h) => h !== handle) : [...current, handle]
          writeStorage(WISH_KEY, JSON.stringify(next))
          return next
        }),
    }),
    [locale, cart, cartOpen, quickViewHandle, searchOpen, error, wishlist, refreshCart, ensureCart, fetchCart, run]
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}
