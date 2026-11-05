"use client"

import Link from "next/link"
import { useEffect, useState } from "react"
import { ProductGrid } from "@/components/ProductCard"
import { useStore } from "@/components/StoreProvider"
import { listProducts, type Product } from "@/lib/medusa"

export default function WishlistPage() {
  const { wishlist, t } = useStore()
  const [products, setProducts] = useState<Product[]>([])
  useEffect(() => {
    listProducts().then(setProducts).catch(() => setProducts([]))
  }, [])
  const selected = products.filter((p) => wishlist.includes(p.handle))
  return (
    <div className="wrap section">
      <h1 className="title" style={{ marginBottom: 8 }}>{t.wishlist}</h1>
      <p className="muted" style={{ marginBottom: 24 }}>Ta liste reste enregistrée sur cet appareil.</p>
      {selected.length ? <ProductGrid products={selected} wide /> : (
        <div>
          <p style={{ marginBottom: 16 }}>Rien pour l'instant. Clique sur un cœur pour garder une peluche sous le coude.</p>
          <Link className="btn btn-accent" href="/boutique">Voir la boutique</Link>
        </div>
      )}
    </div>
  )
}
