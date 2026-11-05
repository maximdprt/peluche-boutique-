import type { Metadata } from "next"
import { ContentPage, ToComplete } from "@/components/ContentPage"

export const metadata: Metadata = { title: "Conditions générales de vente" }

export default function TermsPage() {
  return (
    <ContentPage title="Conditions générales de vente" intro="Modèle à compléter et à faire valider par un juriste avant la mise en ligne.">
      <h2>1. Vendeur</h2>
      <p><ToComplete>identité complète, identique aux mentions légales</ToComplete></p>
      <h2>2. Prix</h2>
      <p>Les prix sont en euros, TVA incluse, hors frais de livraison indiqués avant le paiement.</p>
      <h2>3. Commande et paiement</h2>
      <p>La commande est ferme après validation du paiement. <ToComplete>moyens de paiement réellement proposés et conditions du paiement en 3 fois</ToComplete></p>
      <h2>4. Livraison</h2>
      <p>Les délais et tarifs figurent sur la page Livraison et retours. En l'absence de date convenue, la livraison intervient au plus tard 30 jours après la commande.</p>
      <h2>5. Droit de rétractation</h2>
      <p>Tu disposes de 14 jours à compter de la réception pour te rétracter, sans motif. Un formulaire type doit être mis à disposition. <ToComplete>formulaire et adresse de retour</ToComplete></p>
      <h2>6. Garanties légales</h2>
      <p>Les garanties légales de conformité et contre les vices cachés s'appliquent. <ToComplete>texte légal à reproduire</ToComplete></p>
      <h2>7. Médiation</h2>
      <p><ToComplete>nom et coordonnées du médiateur de la consommation</ToComplete></p>
      <h2>8. Programme de fidélité, parrainage et cartes cadeaux</h2>
      <p><ToComplete>conditions, à rédiger lorsque ces services seront activés</ToComplete></p>
    </ContentPage>
  )
}
