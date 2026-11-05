import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { Catalog, type Params } from "@/components/Catalog"
import { listProducts } from "@/lib/medusa"
import { formats, highlights, themes, universes } from "@/lib/site"

const descriptions: Record<string, string> = {
  "red-bull": "Bleu nuit, argent, éclats de rouge et de jaune. Les peluches canettes pour celles et ceux qui visent la ligne d'arrivée.",
  monster: "Noir profond et griffes néon. Les peluches canettes qui ne dorment jamais.",
  celsius: "Pétillante et solaire. La canette qu'on a vraiment envie de câliner.",
  "sport-auto": "Des peluches qui sentent presque la gomme chaude, pour ton bureau ou ton paddock.",
  "sports-extremes": "Pour celles et ceux qui descendent trop vite, et qui aiment rentrer au chaud.",
  "gaming-esport": "Le coéquipier idéal de ton setup : il ne rage jamais et ne quitte jamais la partie.",
  canettes: "Ta canette préférée ne se boit plus, elle se câline.",
  mini: "Moins de 15 cm, avec porte-clés. À accrocher partout.",
  medium: "De 20 à 30 cm. La taille parfaite pour le bureau, le lit et le canapé.",
  xxl: "Plus de 50 cm. Pour les câlins qui prennent de la place.",
  coffrets: "Prêts à offrir, sans emballage à gérer.",
  nouveautes: "Tout juste arrivées, encore pleines d'énergie.",
  "meilleures-ventes": "Celles que tout le monde s'arrache.",
  "editions-limitees": "Tirages courts. Quand c'est parti, c'est parti.",
  promotions: "Les bons plans du moment, avec des stocks limités.",
}

const titles = Object.fromEntries(
  [...Object.values(universes), ...themes, ...formats, ...highlights].map((c) => [c.handle, c.name])
)

export async function generateMetadata({ params }: { params: Promise<{ handle: string }> }): Promise<Metadata> {
  const { handle } = await params
  if (!titles[handle]) return {}
  return { title: titles[handle], description: descriptions[handle], alternates: { canonical: `/collections/${handle}` }, openGraph: { title: titles[handle], description: descriptions[handle] } }
}

export default async function CollectionPage({ params, searchParams }: { params: Promise<{ handle: string }>; searchParams: Promise<Params> }) {
  const { handle } = await params
  if (!titles[handle]) notFound()
  const all = await listProducts()
  const products = all.filter((p) => p.collection?.handle === handle || p.categories?.some((c) => c.handle === handle))
  const universe = (Object.keys(universes) as (keyof typeof universes)[]).find((key) => universes[key].handle === handle)
  return (
    <Catalog
      title={titles[handle]}
      description={descriptions[handle]}
      universe={universe}
      products={products}
      params={await searchParams}
      crumbs={[{ name: "Boutique", href: "/boutique" }, { name: titles[handle] }]}
    />
  )
}
