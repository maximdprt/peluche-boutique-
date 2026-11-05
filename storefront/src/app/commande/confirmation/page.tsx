import type { Metadata } from "next"
import Link from "next/link"
import { Photo } from "@/components/Photo"

export const metadata: Metadata = { title: "Commande confirmée", robots: { index: false } }

export default async function ConfirmationPage({ searchParams }: { searchParams: Promise<{ numero?: string }> }) {
  const { numero } = await searchParams
  return (
    <div className="wrap lost">
      <span style={{ width: 220 }}><Photo name="monster_vert" sizes="220px" /></span>
      <h1 className="title">Commande reçue !</h1>
      {numero ? <p className="lead">Ta commande n° <b>{numero}</b> est bien enregistrée. Garde ce numéro : il te servira si tu contactes le service client.</p> : null}
      <Link className="btn btn-accent" href="/boutique">Retour à la boutique</Link>
    </div>
  )
}
