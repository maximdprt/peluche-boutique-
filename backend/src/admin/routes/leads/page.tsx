import { defineRouteConfig } from "@medusajs/admin-sdk"
import { useEffect, useState } from "react"

type Lead = { id: string; type: string; email: string; created_at: string; data: Record<string, unknown> | null }

const LABELS: Record<string, string> = { newsletter: "Newsletter", restock: "Retour en stock", contact: "Contact" }

const LeadsPage = () => {
  const [leads, setLeads] = useState<Lead[] | null>(null)
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    fetch("/admin/leads", { credentials: "include" })
      .then((response) => response.json())
      .then((body) => setLeads(body.leads))
      .catch(() => setFailed(true))
  }, [])

  return (
    <div style={{ padding: 24 }}>
      <h1 style={{ fontSize: 24, fontWeight: 600, marginBottom: 16 }}>Inscriptions et messages</h1>
      {failed ? <p>Chargement impossible.</p> : null}
      {leads && !leads.length ? <p>Rien pour le moment.</p> : null}
      {leads?.length ? (
        <table style={{ width: "100%", textAlign: "left" }}>
          <thead><tr><th>Date</th><th>Type</th><th>E-mail</th><th>Détails</th></tr></thead>
          <tbody>
            {leads.map((lead) => (
              <tr key={lead.id} style={{ borderTop: "1px solid #ddd" }}>
                <td style={{ padding: "8px 8px 8px 0" }}>{new Date(lead.created_at).toLocaleString("fr-FR")}</td>
                <td>{LABELS[lead.type] ?? lead.type}</td>
                <td>{lead.email}</td>
                <td style={{ whiteSpace: "pre-wrap" }}>{lead.data ? JSON.stringify(lead.data) : ""}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : null}
    </div>
  )
}

export const config = defineRouteConfig({ label: "Inscriptions" })

export default LeadsPage
