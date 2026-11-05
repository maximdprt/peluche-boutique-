"use client"

import Link from "next/link"
import { CartLines, CartTotals, EmptyCart, PromoField, ShippingProgress } from "@/components/CartContents"
import { useStore } from "@/components/StoreProvider"

export default function CartPage() {
  const { count, t } = useStore()
  return (
    <div className="wrap section">
      <h1 className="title" style={{ marginBottom: 24 }}>{t.cart}</h1>
      {count ? (
        <div className="checkout">
          <div><CartLines /></div>
          <aside className="checkout-summary panel" style={{ alignItems: "stretch", padding: 0, overflow: "hidden" }}>
            <ShippingProgress />
            <div style={{ padding: 16 }}>
              <PromoField />
              <CartTotals />
              <Link className="btn btn-accent btn-block" style={{ marginTop: 12 }} href="/commande">{t.checkout}</Link>
            </div>
          </aside>
        </div>
      ) : (
        <div style={{ maxWidth: 420, marginInline: "auto" }}><EmptyCart /></div>
      )}
    </div>
  )
}
