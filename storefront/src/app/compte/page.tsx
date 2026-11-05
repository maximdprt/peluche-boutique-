"use client"

import Link from "next/link"
import { useEffect, useState, type FormEvent } from "react"
import { formatMoney, store } from "@/lib/medusa"

const TOKEN_KEY = "voltoudou-token"
const BASE = process.env.NEXT_PUBLIC_MEDUSA_URL ?? "http://localhost:9000"

type Customer = { first_name?: string; email: string; addresses?: { id: string; address_1: string; postal_code: string; city: string }[] }
type Order = { id: string; display_id: number; created_at: string; total: number; fulfillment_status: string }

async function auth(path: string, email: string, password: string): Promise<string> {
  const response = await fetch(`${BASE}/auth/customer/emailpass${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ email, password }),
  })
  const data = await response.json()
  if (!response.ok) throw new Error(data.message === "Invalid email or password" ? "E-mail ou mot de passe incorrect." : data.message)
  return data.token
}

export default function AccountPage() {
  const [token, setToken] = useState<string | null>(null)
  const [customer, setCustomer] = useState<Customer | null>(null)
  const [orders, setOrders] = useState<Order[]>([])
  const [mode, setMode] = useState<"login" | "register">("login")
  const [error, setError] = useState<string | null>(null)
  const [ready, setReady] = useState(false)

  const logout = () => {
    localStorage.removeItem(TOKEN_KEY)
    setToken(null)
    setCustomer(null)
  }

  useEffect(() => {
    try {
      setToken(localStorage.getItem(TOKEN_KEY))
    } catch {
      setToken(null)
    }
    setReady(true)
  }, [])

  useEffect(() => {
    if (!token) return
    Promise.all([
      store<{ customer: Customer }>("/store/customers/me", { token, query: { fields: "*addresses" } }),
      store<{ orders: Order[] }>("/store/orders", { token, query: { order: "-created_at" } }),
    ])
      .then(([me, list]) => {
        setCustomer(me.customer)
        setOrders(list.orders)
      })
      .catch(logout)
  }, [token])

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    setError(null)
    const form = new FormData(event.currentTarget)
    const email = String(form.get("email"))
    const password = String(form.get("password"))
    try {
      let next: string
      if (mode === "register") {
        const registration = await auth("/register", email, password)
        await store("/store/customers", { method: "POST", token: registration, body: { email, first_name: String(form.get("first_name")) } })
        next = await auth("", email, password)
      } else {
        next = await auth("", email, password)
      }
      localStorage.setItem(TOKEN_KEY, next)
      setToken(next)
    } catch (e) {
      setError(e instanceof Error ? e.message : "Une erreur est survenue.")
    }
  }

  if (!ready) return <div className="wrap section" />

  if (!customer) {
    return (
      <div className="wrap section" style={{ maxWidth: 520 }}>
        <h1 className="title" style={{ marginBottom: 24 }}>{mode === "login" ? "Connexion" : "Créer mon compte"}</h1>
        {error ? <p role="alert" style={{ marginBottom: 16, fontWeight: 700, color: "var(--color-danger)" }}>{error}</p> : null}
        <form onSubmit={submit}>
          {mode === "register" ? <div className="field"><label htmlFor="first_name">Prénom</label><input id="first_name" name="first_name" required autoComplete="given-name" className="input" /></div> : null}
          <div className="field"><label htmlFor="email">E-mail</label><input id="email" name="email" type="email" required autoComplete="email" className="input" /></div>
          <div className="field"><label htmlFor="password">Mot de passe</label><input id="password" name="password" type="password" required minLength={8} autoComplete={mode === "login" ? "current-password" : "new-password"} className="input" /></div>
          <button className="btn btn-accent btn-block">{mode === "login" ? "Me connecter" : "Créer mon compte"}</button>
        </form>
        <button type="button" className="link" style={{ marginTop: 16 }} onClick={() => setMode(mode === "login" ? "register" : "login")}>
          {mode === "login" ? "Pas encore de compte ? Crée-le ici" : "J'ai déjà un compte"}
        </button>
      </div>
    )
  }

  return (
    <div className="wrap section">
      <div className="head">
        <h1 className="title">Salut {customer.first_name ?? ""} !</h1>
        <button type="button" className="btn btn-ghost" onClick={logout}>Me déconnecter</button>
      </div>
      <div className="duo">
        <section className="panel" aria-labelledby="orders">
          <h2 id="orders">Mes commandes</h2>
          {orders.length ? (
            <ul style={{ width: "100%" }}>
              {orders.map((order) => (
                <li key={order.id} className="row" style={{ paddingBlock: 8, borderBottom: "1px solid #ddd" }}>
                  <span><b>N° {order.display_id}</b><br /><span className="muted" style={{ fontSize: 14 }}>{new Date(order.created_at).toLocaleDateString("fr-FR")}</span></span>
                  <b>{formatMoney(order.total)}</b>
                </li>
              ))}
            </ul>
          ) : <p>Aucune commande pour l'instant.</p>}
        </section>
        <section className="panel" aria-labelledby="addr">
          <h2 id="addr">Mes adresses</h2>
          {customer.addresses?.length ? (
            <ul>{customer.addresses.map((a) => <li key={a.id}>{a.address_1}, {a.postal_code} {a.city}</li>)}</ul>
          ) : <p>Aucune adresse enregistrée.</p>}
        </section>
        <section className="panel" aria-labelledby="wish">
          <h2 id="wish">Ma liste d'envies</h2>
          <Link className="btn btn-light" href="/liste-envies">La voir</Link>
        </section>
        <section className="panel" aria-labelledby="pts">
          <h2 id="pts">Mes points</h2>
          <p>Le suivi des points n'est pas encore activé.</p>
          <Link className="btn btn-light" href="/fidelite">Le programme</Link>
        </section>
      </div>
    </div>
  )
}
