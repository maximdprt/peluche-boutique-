import type { Metadata } from "next"
import { ContentPage } from "@/components/ContentPage"
import { site } from "@/lib/site"

export const metadata: Metadata = { title: "Livraison et retours", description: "Délais, tarifs et retours sous 30 jours." }

export default function ShippingPage() {
  return (
    <ContentPage title="Livraison et retours" intro={`Livraison offerte dès ${site.freeShippingThreshold} €. Retours sous 30 jours.`}>
      <h2>Livraison</h2>
      <table className="spec" style={{ marginBottom: 24 }}>
        <thead><tr><th scope="col">Transporteur</th><th scope="col">Délai</th><th scope="col">Tarif</th></tr></thead>
        <tbody>
          <tr><td>Mondial Relay</td><td>3 à 5 jours ouvrés</td><td>3,90 €, offert dès {site.freeShippingThreshold} €</td></tr>
          <tr><td>Colissimo</td><td>2 à 3 jours ouvrés</td><td>5,90 €, offert dès {site.freeShippingThreshold} €</td></tr>
          <tr><td>Chronopost</td><td>Livré le lendemain</td><td>12,90 €</td></tr>
        </tbody>
      </table>
      <p>Commande passée avant {site.shippingCutoffHour} h un jour ouvré : expédition le jour même.</p>
      <h2>Retours</h2>
      <p>Tu as 30 jours après réception pour nous renvoyer une peluche neuve, dans son emballage. Le remboursement arrive sous 14 jours après réception du retour.</p>
      <h2>Droit de rétractation</h2>
      <p>Conformément à la loi, tu disposes de 14 jours pour te rétracter sans donner de motif. Notre garantie de 30 jours s'ajoute à ce droit.</p>
    </ContentPage>
  )
}
