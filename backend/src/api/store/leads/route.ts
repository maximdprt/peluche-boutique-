import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { LEADS_MODULE } from "../../../modules/leads"
import type LeadsModuleService from "../../../modules/leads/service"

const TYPES = ["newsletter", "restock", "contact"] as const
type LeadType = (typeof TYPES)[number]
type Body = { type?: LeadType; email?: string; data?: Record<string, unknown> }

export async function POST(req: MedusaRequest<Body>, res: MedusaResponse) {
  const { type, email, data } = req.body
  const validEmail = typeof email === "string" && email.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
  const size = JSON.stringify(data ?? {}).length
  if (!type || !TYPES.includes(type) || !validEmail || size > 4000) {
    res.status(400).json({ message: "Données invalides." })
    return
  }
  const leads = req.scope.resolve<LeadsModuleService>(LEADS_MODULE)
  await leads.createLeads({ type, email: email!.toLowerCase(), data: data ?? null })
  res.status(201).json({ ok: true })
}
