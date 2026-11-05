import type { Metadata } from "next"
import { Catalog, type Params } from "@/components/Catalog"
import { listProducts } from "@/lib/medusa"

export const metadata: Metadata = {
  title: "Boutique",
  description: "Toutes nos peluches canettes : formats Mini, Medium, XXL et coffrets. Livraison offerte dès 50 €.",
  alternates: { canonical: "/boutique" },
}

export default async function ShopPage({ searchParams }: { searchParams: Promise<Params> }) {
  return (
    <Catalog
      title="Toute la boutique"
      description="Toutes les peluches, tous les camps, tous les formats. À toi de choisir."
      products={await listProducts()}
      params={await searchParams}
      crumbs={[{ name: "Boutique" }]}
    />
  )
}
