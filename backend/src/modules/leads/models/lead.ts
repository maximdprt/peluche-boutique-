import { model } from "@medusajs/framework/utils"

// Inscriptions newsletter, alertes de retour en stock et messages de contact
const Lead = model.define("lead", {
  id: model.id().primaryKey(),
  type: model.enum(["newsletter", "restock", "contact"]),
  email: model.text(),
  data: model.json().nullable(),
})

export default Lead
