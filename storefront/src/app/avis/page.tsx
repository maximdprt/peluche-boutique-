import type { Metadata } from "next"
import { ContentPage } from "@/components/ContentPage"
import { Reviews } from "@/components/Reviews"

export const metadata: Metadata = { title: "Avis clients", description: "Ce que nos clients pensent de leurs peluches." }

export default function ReviewsPage() {
  return (
    <ContentPage title="Avis clients" intro="Les avis de cette page sont des exemples de démonstration." width={false}>
      <Reviews />
    </ContentPage>
  )
}
