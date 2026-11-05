import Link from "next/link"
import type { CSSProperties } from "react"
import { Reassurance } from "@/components/Footer"
import { Ticker } from "@/components/Header"
import { Countdown, Hero, LimitedAdd, Newsletter } from "@/components/Home"
import { Photo } from "@/components/Photo"
import { ProductGrid, ProductRail, Stars } from "@/components/ProductCard"
import { testimonials } from "@/lib/content"
import { cheapestVariant, isAvailable, listProducts, type Product } from "@/lib/medusa"
import { site, themes, universes } from "@/lib/site"

const inCollection = (products: Product[], handle: string) => products.filter((p) => p.collection?.handle === handle)

export default async function HomePage() {
  const products = await listProducts()
  const fresh = inCollection(products, "nouveautes")
  const best = inCollection(products, "meilleures-ventes").slice(0, 4)
  const limited = inCollection(products, "editions-limitees")[0]
  const limitedVariant = limited?.variants.find(isAvailable)
  const limitedStock = limited?.variants.reduce((sum, v) => sum + (v.inventory_quantity ?? 0), 0) ?? 0

  return (
    <>
      <Hero />
      <Ticker className="marquee" items={["Doux à l'extérieur, survolté à l'intérieur", "Ta canette préférée ne se boit plus, elle se câline", "L'énergie, version câlin"]} />

      <section className="section wrap" aria-labelledby="camps">
        <div className="head"><h2 id="camps" className="title">Choisis ton camp</h2></div>
        <div className="camps">
          {Object.values(universes).map((u) => (
            <Link key={u.handle} className="camp" href={`/collections/${u.handle}`} style={{ "--bg": u.bg, "--fg": u.fg } as CSSProperties}>
              <span className="camp-txt">
                <span className="camp-name">{u.name}</span>
                <span>{u.tagline}</span>
                <span className="camp-cta">Voir le camp</span>
              </span>
              <span className="camp-art"><Photo name={u.photo} alt="" /></span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section wrap" style={{ paddingTop: 0 }} aria-labelledby="new">
        <div className="head">
          <h2 id="new" className="title">Tout juste arrivées</h2>
          <Link className="link" href="/collections/nouveautes">Toutes les nouveautés</Link>
        </div>
        <ProductRail products={fresh} />
      </section>

      <section className="section wrap" style={{ paddingTop: 0 }} aria-labelledby="best">
        <div className="head">
          <h2 id="best" className="title">Les plus câlinées</h2>
          <Link className="link" href="/collections/meilleures-ventes">Toutes les meilleures ventes</Link>
        </div>
        <ProductGrid products={best} wide />
      </section>

      <section className="section wrap" style={{ paddingTop: 0 }} aria-labelledby="uni">
        <div className="head"><h2 id="uni" className="title">Choisis ton univers</h2></div>
        <ul className="rail-track" tabIndex={0} aria-labelledby="uni">
          {themes.map((theme) => (
            <li key={theme.handle}>
              <Link className="tile" href={`/collections/${theme.handle}`} style={{ "--tile": theme.tile } as CSSProperties}>
                <span className="tile-name">{theme.name}</span>
                <span className="tile-art"><Photo name={theme.photo} alt="" /></span>
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="wrap" aria-labelledby="duo">
        <div className="offer">
          <div>
            <h2 id="duo" className="title">Compose ton duo : -15 % sur 2 peluches</h2>
            <p className="lead">Réduction appliquée automatiquement dans ton panier.</p>
            <Link className="btn" style={{ marginTop: 24 }} href="/boutique">Je compose</Link>
          </div>
          <div className="offer-duo" aria-hidden="true"><span className="art-plate"><Photo name="redbull" /></span><span className="art-plate"><Photo name="monster_vert" /></span></div>
        </div>
      </section>

      {limited ? (
        <section className="limited section" style={{ marginTop: "var(--section)" }} aria-labelledby="lim">
          <div className="wrap limited-grid">
            <Link className="limited-plate" href={`/produits/${limited.handle}`} style={{ "--plush": limited.metadata?.color } as CSSProperties} aria-label={limited.title}>
              <Photo src={limited.images?.[0]?.url} alt="" />
            </Link>
            <div>
              <p className="eyebrow">Édition limitée</p>
              <h2 id="lim" className="title">{limited.title}</h2>
              <p className="lead">{limited.description}</p>
              <Countdown end={site.limitedEndsAt} />
              {limitedStock > 0 ? <p style={{ fontWeight: 800, color: "var(--color-yellow)", marginBottom: 16 }}>Plus que {limitedStock} exemplaires</p> : null}
              {limitedVariant ? <LimitedAdd variantId={limitedVariant.id} /> : null}
              <Link className="link" style={{ marginLeft: 16 }} href={`/produits/${limited.handle}`}>Voir la fiche</Link>
            </div>
          </div>
        </section>
      ) : null}

      {site.demoContent ? (
        <section className="section wrap" aria-labelledby="quotes">
          <div className="head">
            <div>
              <h2 id="quotes" className="title">Ils ont craqué</h2>
              <p style={{ marginTop: 8 }}><span className="demo-tag">Témoignages de démonstration</span></p>
            </div>
            <Link className="link" href="/avis">Tous les avis</Link>
          </div>
          <ul className="rail-track" tabIndex={0} aria-labelledby="quotes">
            {testimonials.map((quote) => (
              <li key={quote.name}>
                <figure className="quote" style={{ "--tile": `color-mix(in srgb, ${quote.color} 16%, #fff)` } as CSSProperties}>
                  <Stars rating={quote.rating} />
                  <blockquote>{quote.text}</blockquote>
                  <figcaption>
                    <span className="avatar">{quote.name[0]}</span>
                    {quote.name}
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      <section className="section wrap" style={site.demoContent ? { paddingTop: 0 } : undefined} aria-labelledby="wall">
        <div className="head">
          <h2 id="wall" className="title">Montre ta peluche {site.hashtag}</h2>
          
        </div>
        <div className="wall">
          {[["monster_bleu", "#2f9de0"], ["redbull_rose", "#ff5fa8"], ["monster_vert", "#39ff14"], ["celsius", "#ff8a1f"], ["monster_violet", "#7b3ff2"], ["redbull", "#2348c7"]].map(([name, color]) => (
            <div key={name} style={{ "--plush": color } as CSSProperties}><Photo name={name} alt="" /></div>
          ))}
        </div>
      </section>

      <section className="section wrap" style={{ paddingTop: 0 }}>
        <div className="duo">
          <div className="panel" style={{ "--tile": "var(--color-sky)" } as CSSProperties}>
            <h2>1 € dépensé, 1 point gagné</h2>
            <p>Cumule des points à chaque commande, bonus à l'anniversaire et pour chaque avis.</p>
            <Link className="btn btn-light" href="/fidelite">Le programme</Link>
          </div>
          <div className="panel" style={{ "--tile": "var(--color-accent-soft)" } as CSSProperties}>
            <h2>Parraine, gagne 10 €</h2>
            <p>10 € pour toi, 10 € pour ton filleul. Tout le monde recharge ses batteries.</p>
            <Link className="btn btn-light" href="/fidelite#parrainage">Parrainer</Link>
          </div>
        </div>
      </section>

      <Newsletter />
      <Reassurance />
    </>
  )
}
