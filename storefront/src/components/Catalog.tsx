import { ProductGrid } from "./ProductCard"
import { AutoSubmit, Breadcrumbs } from "./Common"
import { isProductAvailable, type Product } from "@/lib/medusa"
import { themes, universes } from "@/lib/site"

export type Params = { [key: string]: string | string[] | undefined }

const asList = (value: string | string[] | undefined) => (Array.isArray(value) ? value : value ? [value] : [])
const lowestPrice = (p: Product) => Math.min(...p.variants.map((v) => v.calculated_price?.calculated_amount ?? Infinity))

function applyFilters(products: Product[], params: Params): Product[] {
  const brands = asList(params.marque)
  const worlds = asList(params.univers)
  const sizes = asList(params.taille)
  const max = Number(params.prix) || Infinity
  let result = products.filter(
    (p) =>
      (!brands.length || brands.includes(p.metadata?.brand ?? "")) &&
      (!worlds.length || p.categories?.some((c) => worlds.includes(c.handle))) &&
      (!sizes.length || p.variants.some((v) => sizes.includes(v.title))) &&
      lowestPrice(p) <= max &&
      (!params.dispo || isProductAvailable(p)) &&
      (!params.nouveau || p.metadata?.badge === "new")
  )
  const isBest = (p: Product) => (p.collection?.handle === "meilleures-ventes" ? 0 : 1)
  switch (params.tri) {
    case "prix-asc": result = result.toSorted((a, b) => lowestPrice(a) - lowestPrice(b)); break
    case "prix-desc": result = result.toSorted((a, b) => lowestPrice(b) - lowestPrice(a)); break
    case "nouveaute": result = result.toSorted((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? "")); break
    default: result = result.toSorted((a, b) => isBest(a) - isBest(b))
  }
  return result
}

function CheckGroup({ legend, name, options, params }: { legend: string; name: string; options: { value: string; label: string }[]; params: Params }) {
  const active = asList(params[name])
  return (
    <fieldset>
      <legend>{legend}</legend>
      <div>
        {options.map((o) => (
          <label key={o.value} className="check">
            <input type="checkbox" name={name} value={o.value} defaultChecked={active.includes(o.value)} />
            {o.label}
          </label>
        ))}
      </div>
    </fieldset>
  )
}

export function Catalog({ title, description, universe, products, params, crumbs }: { title: string; description?: string; universe?: keyof typeof universes; products: Product[]; params: Params; crumbs: { name: string; href?: string }[] }) {
  const visible = applyFilters(products, params)
  const sizes = ["Mini", "Medium", "XXL", "Coffret"]
  return (
    <>
      <div className="colhead" data-universe={universe}>
        <div className="wrap">
          <Breadcrumbs items={crumbs} />
          <h1>{title}</h1>
          {description ? <p className="lead">{description}</p> : null}
        </div>
      </div>
      <div className="wrap section" style={{ paddingTop: 32 }}>
        <AutoSubmit>
          <div className="shop">
            <details className="filters-toggle filters-panel" open>
              <summary>Filtres</summary>
              <div className="filters">
                {universe ? null : <CheckGroup legend="Marque" name="marque" params={params} options={Object.entries(universes).map(([value, u]) => ({ value, label: u.name }))} />}
                <CheckGroup legend="Univers" name="univers" params={params} options={themes.map((u) => ({ value: u.handle, label: u.name }))} />
                <CheckGroup legend="Taille" name="taille" params={params} options={sizes.map((s) => ({ value: s, label: s }))} />
                <fieldset>
                  <legend>Prix</legend>
                  <div>
                    <label htmlFor="prix">Jusqu'à</label>
                    <select id="prix" name="prix" className="input" defaultValue={asList(params.prix)[0] ?? ""}>
                      <option value="">Tous les prix</option>
                      <option value="20">20 €</option>
                      <option value="40">40 €</option>
                      <option value="80">80 €</option>
                    </select>
                  </div>
                </fieldset>
                <CheckGroup legend="Disponibilité" name="dispo" params={params} options={[{ value: "1", label: "En stock uniquement" }]} />
                <CheckGroup legend="Nouveauté" name="nouveau" params={params} options={[{ value: "1", label: "Nouveautés uniquement" }]} />
                <noscript><button className="btn btn-block" style={{ marginTop: 16 }}>Filtrer</button></noscript>
              </div>
            </details>
            <div>
              <div className="toolbar">
                <p role="status" style={{ fontWeight: 800 }}>{visible.length} peluche{visible.length > 1 ? "s" : ""}</p>
                <label style={{ display: "flex", gap: 8, alignItems: "center", fontWeight: 700 }}>
                  Trier
                  <select name="tri" className="input" style={{ width: "auto", minHeight: 44 }} defaultValue={asList(params.tri)[0] ?? "popularite"}>
                    <option value="popularite">Popularité</option>
                    <option value="prix-asc">Prix croissant</option>
                    <option value="prix-desc">Prix décroissant</option>
                    <option value="nouveaute">Nouveauté</option>
                  </select>
                </label>
              </div>
              {visible.length ? <ProductGrid products={visible} /> : <p>Aucune peluche ne correspond. Retire un filtre pour recharger la liste.</p>}
            </div>
          </div>
        </AutoSubmit>
      </div>
    </>
  )
}
