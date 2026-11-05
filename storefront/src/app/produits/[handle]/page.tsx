import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Breadcrumbs } from "@/components/Common"
import { ProductDetail } from "@/components/ProductDetail"
import { ProductRail } from "@/components/ProductCard"
import { Reviews } from "@/components/Reviews"
import { getProduct, isAvailable, listProducts } from "@/lib/medusa"
import { site, universes } from "@/lib/site"

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const product = await getProduct((await params).handle)
  if (!product) return {}
  const description = product.description ?? undefined
  return {
    title: product.title,
    description,
    alternates: { canonical: `/produits/${product.handle}` },
    openGraph: { title: product.title, description, images: product.images?.[0]?.url },
  }
}

export default async function ProductPage({ params }: { params: Promise<{ handle: string }> }) {
  const { handle } = await params
  const [product, all, giftWrap] = await Promise.all([getProduct(handle), listProducts(), getProduct("emballage-cadeau")])
  if (!product || product.metadata?.badge === "hidden") notFound()

  const others = all.filter((p) => p.id !== product.id)
  const sameBrand = others.filter((p) => p.metadata?.brand === product.metadata?.brand).slice(0, 4)
  const otherBrand = others.filter((p) => p.metadata?.brand !== product.metadata?.brand).slice(0, 8)
  const brand = product.metadata?.brand ? universes[product.metadata.brand] : null

  // La note n'est déclarée à Google que lorsqu'elle provient de vrais avis
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images?.map((i) => i.url),
    sku: product.variants[0]?.id,
    url: `${site.url}/produits/${product.handle}`,
    offers: product.variants.map((v) => ({
      "@type": "Offer",
      name: v.title,
      price: v.calculated_price?.calculated_amount,
      priceCurrency: "EUR",
      availability: isAvailable(v) ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${site.url}/produits/${product.handle}`,
    })),
  }

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
      <div className="wrap" style={{ paddingBlock: 16 }}>
        <Breadcrumbs items={[...(brand ? [{ name: brand.name, href: `/collections/${brand.handle}` }] : []), { name: product.title }]} />
      </div>
      <div className="wrap"><ProductDetail product={product} giftWrapVariantId={giftWrap?.variants[0]?.id} /></div>

      <section id="avis" className="section wrap" aria-labelledby="avis-t">
        <div className="head"><h2 id="avis-t" className="title">Avis clients</h2></div>
        <Reviews />
      </section>

      {otherBrand.length ? (
        <section className="section wrap" style={{ paddingTop: 0 }} aria-labelledby="duo-t">
          <div className="head">
            <div>
              <h2 id="duo-t" className="title">Complète ton duo</h2>
              <p className="lead">-15 % dès 2 peluches, appliqués dans le panier.</p>
            </div>
          </div>
          <ProductRail products={otherBrand} />
        </section>
      ) : null}
      {sameBrand.length ? (
        <section className="section wrap" style={{ paddingTop: 0 }} aria-labelledby="like-t">
          <div className="head"><h2 id="like-t" className="title">Tu aimeras aussi</h2></div>
          <ProductRail products={sameBrand} />
        </section>
      ) : null}
    </>
  )
}
