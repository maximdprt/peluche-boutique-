import type { Metadata } from "next"
import { ContentPage } from "@/components/ContentPage"

export const metadata: Metadata = { title: "Cookies" }

export default function CookiesPage() {
  return (
    <ContentPage title="Cookies" intro="Ce qu'on dépose, et ce qu'on attend ton accord pour déposer.">
      <h2>Nécessaires</h2>
      <p>Panier, connexion, langue et mémorisation de ton choix sur les cookies. Ils ne demandent pas de consentement.</p>
      <h2>Mesure d'audience et publicité</h2>
      <p>Google Analytics 4, Meta Pixel et TikTok Pixel ne se chargent que si tu cliques sur « Accepter » et si la boutique les a activés.</p>
      <h2>Changer d'avis</h2>
      <p>Utilise le lien « Gérer mes cookies » en bas de chaque page. Ton choix est valable sur cet appareil.</p>
    </ContentPage>
  )
}
