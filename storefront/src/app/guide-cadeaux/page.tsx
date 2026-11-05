import type { Metadata } from "next"
import Link from "next/link"
import { ContentPage } from "@/components/ContentPage"
import { ProductGrid } from "@/components/ProductCard"
import { listProducts, type Product } from "@/lib/medusa"

export const metadata: Metadata = { title: "Guide cadeaux", description: "Une peluche à offrir, par budget ou par occasion : anniversaire, Noël, Secret Santa." }

const lowest = (p: Product) => Math.min(...p.variants.map((v) => v.calculated_price?.calculated_amount ?? Infinity))
const occasions = [
  { name: "Anniversaire", text: "Un coffret prêt à offrir, zéro papier cadeau à gérer.", href: "/collections/coffrets" },
  { name: "Noël", text: "Une XXL sous le sapin, ça ne passe pas inaperçu.", href: "/collections/xxl" },
  { name: "Secret Santa", text: "Une Mini à moins de 20 €, et tu deviens la légende du bureau.", href: "/collections/mini" },
]

export default async function GiftPage() {
  const products = await listProducts()
  return (
    <ContentPage title="Guide cadeaux" intro="Tu cherches, on a trié." width={false}>
      <div id="budget" className="grid gap-12">
        {[20, 40, 80].map((budget) => {
          const picks = products.filter((p) => lowest(p) < budget).sort((a, b) => lowest(b) - lowest(a)).slice(0, 4)
          return (
            <section key={budget} aria-labelledby={`b${budget}`}>
              <div className="head" style={{ marginBottom: 16 }}>
                <h2 id={`b${budget}`} className="title" style={{ fontSize: "clamp(24px, 3vw, 38px)" }}>Moins de {budget} €</h2>
                <Link className="link" href={`/boutique?prix=${budget}`}>Tout voir</Link>
              </div>
              <ProductGrid products={picks} wide />
            </section>
          )
        })}
      </div>
      <section id="occasion" style={{ marginTop: 48 }} aria-labelledby="occ">
        <h2 id="occ" className="title" style={{ fontSize: "clamp(24px, 3vw, 38px)", marginBottom: 16 }}>Par occasion</h2>
        <div className="cards3">
          {occasions.map((o) => (
            <div key={o.name} className="panel">
              <h3>{o.name}</h3>
              <p>{o.text}</p>
              <Link className="btn btn-light" href={o.href}>Voir la sélection</Link>
            </div>
          ))}
        </div>
      </section>
    </ContentPage>
  )
}
