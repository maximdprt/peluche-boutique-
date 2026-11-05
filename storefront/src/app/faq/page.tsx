import type { Metadata } from "next"
import { ContentPage } from "@/components/ContentPage"
import { faq } from "@/lib/content"

export const metadata: Metadata = { title: "FAQ", description: "Livraison, retours, paiement, entretien : toutes les réponses à tes questions." }

export default function FaqPage() {
  return (
    <ContentPage title="FAQ" intro="Les questions qu'on nous pose le plus. Une autre ? Écris-nous.">
      <div className="acc">
        {faq.map((item, i) => (
          <details key={item.q} open={i === 0}>
            <summary>{item.q}</summary>
            <div className="acc-body"><p>{item.a}</p></div>
          </details>
        ))}
      </div>
    </ContentPage>
  )
}
