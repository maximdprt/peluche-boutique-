import type { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { LEADS_MODULE } from "../../../modules/leads"
import type LeadsModuleService from "../../../modules/leads/service"

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const leads = req.scope.resolve<LeadsModuleService>(LEADS_MODULE)
  const list = await leads.listLeads({}, { order: { created_at: "DESC" }, take: 500 })
  res.json({ leads: list })
}
