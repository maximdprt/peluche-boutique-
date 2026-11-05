"use client"

import { useState, type CSSProperties } from "react"
import { Stars } from "./ProductCard"
import { demoReviews } from "@/lib/content"
import { site } from "@/lib/site"

export function Reviews() {
  const [filter, setFilter] = useState<number | null>(null)
  if (!site.demoContent) {
    return <p className="muted">Aucun avis pour le moment. Sois le premier ou la première à donner le tien après ta commande.</p>
  }
  const average = demoReviews.reduce((sum, r) => sum + r.rating, 0) / demoReviews.length
  const visible = filter ? demoReviews.filter((r) => r.rating === filter) : demoReviews
  return (
    <div className="reviews">
      <div className="score">
        <b>{average.toLocaleString("fr-FR", { maximumFractionDigits: 1 })}</b>
        <Stars rating={average} />
        <p style={{ marginBottom: 12 }}>{demoReviews.length} avis <span className="demo-tag">démo</span></p>
        {[5, 4, 3, 2, 1].map((star) => {
          const count = demoReviews.filter((r) => r.rating === star).length
          return (
            <button key={star} type="button" className="bar" aria-pressed={filter === star} aria-label={`Filtrer les avis à ${star} étoiles, ${count} avis`} onClick={() => setFilter(filter === star ? null : star)}>
              <span>{star} ★</span>
              <i style={{ "--w": `${(count / demoReviews.length) * 100}%` } as CSSProperties} />
              <span>{count}</span>
            </button>
          )
        })}
      </div>
      <ul aria-live="polite">
        {visible.map((review) => (
          <li key={review.name} className="review">
            <div className="row" style={{ justifyContent: "flex-start" }}>
              <span className="avatar">{review.name[0]}</span>
              <div>
                <b>{review.name}</b> <Stars rating={review.rating} />
                <p className="muted" style={{ fontSize: 14 }}>{review.date}</p>
              </div>
            </div>
            <p style={{ marginTop: 8 }}>{review.text}</p>
          </li>
        ))}
        {!visible.length ? <li className="review">Aucun avis avec cette note.</li> : null}
      </ul>
    </div>
  )
}
