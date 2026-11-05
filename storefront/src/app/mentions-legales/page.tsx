import type { Metadata } from "next"
import { ContentPage, ToComplete } from "@/components/ContentPage"

export const metadata: Metadata = { title: "Mentions légales" }

export default function LegalPage() {
  return (
    <ContentPage title="Mentions légales" intro="Modèle à compléter et à faire valider par un juriste avant la mise en ligne.">
      <h2>Éditeur du site</h2>
      <p><ToComplete>raison sociale, forme juridique, capital</ToComplete></p>
      <p><ToComplete>adresse du siège, SIRET, RCS, n° de TVA intracommunautaire</ToComplete></p>
      <p><ToComplete>e-mail et téléphone de contact</ToComplete></p>
      <h2>Directeur de la publication</h2>
      <p><ToComplete>nom</ToComplete></p>
      <h2>Hébergeur</h2>
      <p><ToComplete>nom, adresse et téléphone de l'hébergeur</ToComplete></p>
      <h2>Propriété intellectuelle</h2>
      <p>Les marques et logos appartiennent à leurs propriétaires respectifs. <ToComplete>références des accords de licence, le cas échéant</ToComplete></p>
    </ContentPage>
  )
}
