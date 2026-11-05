import type { Metadata } from "next"
import { Catalog, type Params } from "@/components/Catalog"
import { listProducts } from "@/lib/medusa"

export const metadata: Metadata = { title: "Recherche", robots: { index: false } }

export default async function SearchPage({ searchParams }: { searchParams: Promise<Params> }) {
  const params = await searchParams
  const q = typeof params.q === "string" ? params.q : ""
  return (
    <Catalog
      title={q ? `« ${q} »` : "Recherche"}
      products={q ? await listProducts({ q }) : []}
      params={params}
      crumbs={[{ name: "Recherche" }]}
    />
  )
}
