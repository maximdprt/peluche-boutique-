import type { Metadata } from "next"
import Link from "next/link"
import { ContentPage } from "@/components/ContentPage"

export const metadata: Metadata = { title: "Suivi de commande", description: "Où en est ta peluche ?" }

export default function TrackingPage() {
  return (
    <ContentPage title="Suivi de commande" intro="Où en est ta peluche ?">
      <h2>Tu as un compte</h2>
      <p>Toutes tes commandes sont dans ton espace client.</p>
      <p><Link className="btn btn-accent" href="/compte">Mon compte</Link></p>
      <h2>Tu as commandé sans compte</h2>
      <p>Écris-nous avec ton numéro de commande et l'e-mail utilisé, et on regarde ça pour toi.</p>
      <p><Link className="btn btn-light" href="/contact">Nous contacter</Link></p>
    </ContentPage>
  )
}
