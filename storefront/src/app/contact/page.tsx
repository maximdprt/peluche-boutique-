"use client"

import { useState } from "react"
import { ContentPage } from "@/components/ContentPage"
import { store } from "@/lib/medusa"

export default function ContactPage() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle")
  return (
    <ContentPage title="Contact" intro="Une question, un souci, une idée de peluche ? On te répond.">
      {state === "done" ? (
        <p role="status" style={{ fontWeight: 800, fontSize: 19 }}>Message bien reçu, merci !</p>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            const form = new FormData(event.currentTarget)
            setState("sending")
            store("/store/leads", { method: "POST", body: { type: "contact", email: form.get("email"), data: { name: form.get("name"), order: form.get("order"), message: form.get("message") } } })
              .then(() => setState("done"))
              .catch(() => setState("error"))
          }}
        >
          <div className="field"><label htmlFor="name">Prénom</label><input id="name" name="name" required autoComplete="given-name" className="input" /></div>
          <div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" required autoComplete="email" className="input" /></div>
          <div className="field"><label htmlFor="order">N° de commande (facultatif)</label><input id="order" name="order" className="input" /></div>
          <div className="field"><label htmlFor="message">Ton message</label><textarea id="message" name="message" required maxLength={2000} className="input" /></div>
          {state === "error" ? <p role="alert" style={{ marginBottom: 12, fontWeight: 700, color: "var(--color-danger)" }}>Envoi impossible pour l'instant, réessaie.</p> : null}
          <button className="btn btn-accent" disabled={state === "sending"}>Envoyer</button>
        </form>
      )}
    </ContentPage>
  )
}
