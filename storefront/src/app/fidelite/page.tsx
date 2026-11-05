import type { Metadata } from "next"
import { ContentPage } from "@/components/ContentPage"

export const metadata: Metadata = { title: "Programme de fidélité", description: "1 € dépensé = 1 point. Récompenses, bonus d'anniversaire et parrainage." }

const rewards = [
  { points: "100 points", reward: "5 € de réduction" },
  { points: "250 points", reward: "15 € de réduction" },
  { points: "500 points", reward: "Une peluche Mini offerte" },
]

export default function LoyaltyPage() {
  return (
    <ContentPage title="Programme de fidélité" intro="Plus tu câlines, plus tu gagnes." width={false}>
      <p className="demo-tag" style={{ marginBottom: 24 }}>Bientôt disponible : les points ne sont pas encore comptabilisés</p>
      <div className="cards3">
        {rewards.map((r) => (
          <div key={r.points} className="panel">
            <h2>{r.points}</h2>
            <p>{r.reward}</p>
          </div>
        ))}
      </div>
      <div className="duo" style={{ marginTop: 24 }}>
        <section className="panel" style={{ "--tile": "var(--color-sky)" } as React.CSSProperties}>
          <h2>Comment gagner des points</h2>
          <ul>
            <li>1 € dépensé = 1 point</li>
            <li>50 points pour ton anniversaire</li>
            <li>10 points par avis publié</li>
          </ul>
        </section>
        <section id="parrainage" className="panel" style={{ "--tile": "var(--color-accent-soft)" } as React.CSSProperties}>
          <h2>Parrainage</h2>
          <p>10 € offerts au parrain comme au filleul, dès la première commande du filleul.</p>
        </section>
      </div>
    </ContentPage>
  )
}
