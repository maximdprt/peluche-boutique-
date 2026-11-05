import type { Metadata } from "next"
import { ContentPage, ToComplete } from "@/components/ContentPage"

export const metadata: Metadata = { title: "Politique de confidentialité" }

export default function PrivacyPage() {
  return (
    <ContentPage title="Politique de confidentialité" intro="Modèle à compléter et à faire valider par un juriste avant la mise en ligne.">
      <h2>Responsable du traitement</h2>
      <p><ToComplete>identité et contact, éventuel DPO</ToComplete></p>
      <h2>Données collectées</h2>
      <ul>
        <li>Commande : identité, adresse, e-mail, téléphone, historique d'achat.</li>
        <li>Compte client : e-mail et mot de passe chiffré.</li>
        <li>Newsletter et alertes de retour en stock : e-mail et date du consentement.</li>
        <li>Contact : les informations de ton message.</li>
      </ul>
      <h2>Finalités et bases légales</h2>
      <p>Exécution du contrat pour les commandes, consentement pour la newsletter et la mesure d'audience, obligation légale pour la comptabilité.</p>
      <h2>Durées de conservation</h2>
      <p><ToComplete>durées retenues pour chaque catégorie de données</ToComplete></p>
      <h2>Destinataires</h2>
      <p><ToComplete>hébergeur, prestataire de paiement, transporteurs, outil d'e-mailing</ToComplete></p>
      <h2>Tes droits</h2>
      <p>Tu peux accéder à tes données, les rectifier, les effacer, t'opposer à leur traitement et en demander la portabilité. Tu peux aussi saisir la CNIL. <ToComplete>adresse d'exercice des droits</ToComplete></p>
    </ContentPage>
  )
}
