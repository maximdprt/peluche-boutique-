"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useState, type FormEvent } from "react"
import { CartLines, CartTotals, EmptyCart, PromoField } from "@/components/CartContents"
import { useStore } from "@/components/StoreProvider"
import { formatMoney, store, type Address, type ShippingOption } from "@/lib/medusa"
import { site } from "@/lib/site"

const STEPS = ["Informations", "Livraison", "Paiement"]
const COUNTRIES = [["fr", "France"], ["be", "Belgique"], ["lu", "Luxembourg"], ["de", "Allemagne"], ["es", "Espagne"], ["it", "Italie"], ["nl", "Pays-Bas"]]

type Completed = { type: string; order?: { id: string; display_id: number }; error?: { message: string } }

export default function CheckoutPage() {
  const { cart, count, refreshCart, clearCart } = useStore()
  const router = useRouter()
  const [step, setStep] = useState(0)
  const [options, setOptions] = useState<ShippingOption[]>([])
  const [optionId, setOptionId] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  useEffect(() => setError(null), [step])

  const guard = async (action: () => Promise<void>) => {
    setBusy(true)
    setError(null)
    try {
      await action()
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.")
    }
    setBusy(false)
  }

  const submitInfo = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const form = new FormData(event.currentTarget)
    const field = (name: string) => String(form.get(name) ?? "").trim()
    const address: Address = {
      first_name: field("first_name"),
      last_name: field("last_name"),
      address_1: field("address_1"),
      address_2: field("address_2"),
      postal_code: field("postal_code"),
      city: field("city"),
      country_code: field("country_code"),
      phone: field("phone"),
    }
    void guard(async () => {
      await store(`/store/carts/${cart!.id}`, { method: "POST", body: { email: field("email"), shipping_address: address, billing_address: address } })
      const { shipping_options } = await store<{ shipping_options: ShippingOption[] }>("/store/shipping-options", { query: { cart_id: cart!.id } })
      setOptions(shipping_options)
      setOptionId(shipping_options[0]?.id ?? "")
      await refreshCart()
      setStep(1)
    })
  }

  const submitShipping = (event: FormEvent) => {
    event.preventDefault()
    void guard(async () => {
      await store(`/store/carts/${cart!.id}/shipping-methods`, { method: "POST", body: { option_id: optionId } })
      if (site.testCheckout) {
        const { payment_collection } = await store<{ payment_collection: { id: string } }>("/store/payment-collections", { method: "POST", body: { cart_id: cart!.id } })
        await store(`/store/payment-collections/${payment_collection.id}/payment-sessions`, { method: "POST", body: { provider_id: "pp_system_default" } })
      }
      await refreshCart()
      setStep(2)
    })
  }

  const complete = async () => {
    const result = await store<Completed>(`/store/carts/${cart!.id}/complete`, { method: "POST" })
    if (result.type !== "order" || !result.order) throw new Error(result.error?.message ?? "La commande n'a pas pu être validée.")
    clearCart()
    router.push(`/commande/confirmation?numero=${result.order.display_id}`)
  }

  if (!count || !cart) {
    return <div className="wrap section" style={{ maxWidth: 480 }}><EmptyCart /></div>
  }

  const address = cart.shipping_address

  return (
    <div className="wrap section" style={{ paddingTop: 32 }}>
      <h1 className="title" style={{ marginBottom: 24 }}>Commande</h1>
      <ol className="steps">
        {STEPS.map((label, i) => <li key={label} aria-current={i === step ? "step" : undefined}>{i + 1}. {label}</li>)}
      </ol>
      <div className="checkout">
        <div>
          {error ? <p role="alert" style={{ marginBottom: 16, padding: 12, fontWeight: 700, color: "#fff", background: "var(--color-danger)", borderRadius: 12 }}>{error}</p> : null}

          {step === 0 ? (
            <form onSubmit={submitInfo}>
              <p className="muted" style={{ marginBottom: 16 }}>Pas besoin de compte pour commander. <Link className="link" href="/compte">J'ai déjà un compte</Link></p>
              <div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" required autoComplete="email" className="input" defaultValue={cart.email ?? ""} /></div>
              <div className="form-2">
                <div className="field"><label htmlFor="first_name">Prénom</label><input id="first_name" name="first_name" required autoComplete="given-name" className="input" defaultValue={address?.first_name} /></div>
                <div className="field"><label htmlFor="last_name">Nom</label><input id="last_name" name="last_name" required autoComplete="family-name" className="input" defaultValue={address?.last_name} /></div>
              </div>
              <div className="field"><label htmlFor="address_1">Adresse</label><input id="address_1" name="address_1" required autoComplete="address-line1" className="input" defaultValue={address?.address_1} /></div>
              <div className="field"><label htmlFor="address_2">Complément (facultatif)</label><input id="address_2" name="address_2" autoComplete="address-line2" className="input" defaultValue={address?.address_2} /></div>
              <div className="form-2">
                <div className="field"><label htmlFor="postal_code">Code postal</label><input id="postal_code" name="postal_code" required autoComplete="postal-code" className="input" defaultValue={address?.postal_code} /></div>
                <div className="field"><label htmlFor="city">Ville</label><input id="city" name="city" required autoComplete="address-level2" className="input" defaultValue={address?.city} /></div>
                <div className="field">
                  <label htmlFor="country_code">Pays</label>
                  <select id="country_code" name="country_code" required className="input" defaultValue={address?.country_code ?? "fr"}>
                    {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
                  </select>
                </div>
                <div className="field"><label htmlFor="phone">Téléphone (pour le transporteur)</label><input id="phone" name="phone" type="tel" autoComplete="tel" className="input" defaultValue={address?.phone} /></div>
              </div>
              <button className="btn btn-accent btn-block" disabled={busy}>Choisir la livraison</button>
            </form>
          ) : null}

          {step === 1 ? (
            <form onSubmit={submitShipping}>
              <fieldset>
                <legend className="sr-only">Mode de livraison</legend>
                {options.map((option) => (
                  <label key={option.id} className="choice">
                    <input type="radio" name="shipping" checked={optionId === option.id} onChange={() => setOptionId(option.id)} />
                    <span style={{ flex: 1 }}>{option.name}<br /><span className="muted" style={{ fontWeight: 500, fontSize: 14 }}>{option.type?.description}</span></span>
                    <span>{option.calculated_price?.calculated_amount === 0 ? "Offerte" : formatMoney(option.calculated_price?.calculated_amount ?? 0)}</span>
                  </label>
                ))}
              </fieldset>
              <div className="row" style={{ marginTop: 16 }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(0)}>Retour</button>
                <button className="btn btn-accent" disabled={busy || !optionId}>Passer au paiement</button>
              </div>
            </form>
          ) : null}

          {step === 2 ? (
            <div>
              <div className="panel" style={{ "--tile": "var(--color-yellow)" } as React.CSSProperties}>
                <h2 style={{ fontSize: 22 }}>Le paiement n'est pas encore activé</h2>
                {site.testCheckout ? (
                  <>
                    <p>Mode test : ce bouton crée une commande sans encaisser d'argent.</p>
                    <button type="button" className="btn" disabled={busy} onClick={() => guard(complete)}>Valider la commande de test</button>
                  </>
                ) : (
                  <p>Les commandes ouvriront bientôt. Ton panier reste enregistré sur cet appareil.</p>
                )}
              </div>
              <button type="button" className="link" style={{ marginTop: 16 }} onClick={() => setStep(1)}>Modifier la livraison</button>
            </div>
          ) : null}
        </div>

        <aside className="checkout-summary panel" style={{ alignItems: "stretch", gap: 0, padding: 16 }} aria-label="Récapitulatif">
          <h2 style={{ fontSize: 20 }}>Récap</h2>
          <CartLines />
          <PromoField />
          <CartTotals showShipping />
        </aside>
      </div>
    </div>
  )
}
