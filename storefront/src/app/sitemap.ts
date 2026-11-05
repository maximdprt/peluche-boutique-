import type { MetadataRoute } from "next"
import { listProducts } from "@/lib/medusa"
import { formats, highlights, site, themes, universes } from "@/lib/site"

const PAGES = ["", "/boutique", "/guide-cadeaux", "/notre-histoire", "/fidelite", "/avis", "/faq", "/livraison-retours", "/suivi-commande", "/contact", "/mentions-legales", "/cgv", "/confidentialite", "/cookies"]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await listProducts()
  const collections = [...Object.values(universes), ...themes, ...formats, ...highlights]
  return [
    ...PAGES.map((path) => ({ url: `${site.url}${path}` })),
    ...collections.map((c) => ({ url: `${site.url}/collections/${c.handle}` })),
    ...products.map((p) => ({ url: `${site.url}/produits/${p.handle}` })),
  ]
}
