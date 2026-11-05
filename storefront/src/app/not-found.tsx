import Link from "next/link"
import { Photo } from "@/components/Photo"

export default function NotFound() {
  return (
    <div className="wrap lost">
      <span className="lost-plush"><Photo name="monster_blanc" className="asleep" alt="Peluche endormie" sizes="280px" /></span>
      <span className="battery" aria-hidden="true"><i /><i /><i /><i /></span>
      <h1 className="title">404 : peluche en panne d'énergie</h1>
      <p className="lead">Cette page s'est endormie. On la laisse recharger et on retourne au stand ?</p>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center" }}>
        <Link className="btn btn-accent" href="/">Retour à l'accueil</Link>
        <Link className="btn btn-light" href="/boutique">Voir la boutique</Link>
      </div>
    </div>
  )
}
