// Prépare les photos de la racine du dépôt pour le site : carrés WebP dans public/produits, plus les visuels de coffrets.
import sharp from "sharp"
import { mkdirSync, readdirSync, rmSync } from "node:fs"
import { join } from "node:path"

const SOURCE = join(process.cwd(), "..")
const OUT = join(process.cwd(), "public", "produits")
const SIZE = 1000
rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

for (const file of readdirSync(SOURCE).filter((f) => f.endsWith(".jpeg"))) {
  const name = file.replace("peluche_", "").replace("organge", "orange").replace(".jpeg", "").toLowerCase()
  await sharp(join(SOURCE, file)).resize(SIZE, SIZE, { fit: "contain", background: "#ffffff" }).linear(1.08, 0).webp({ quality: 84 }).toFile(join(OUT, `${name}.webp`)) // Blanchit le fond pour qu'il disparaisse sur les plaques
}

// Le mode multiply fusionne les fonds blancs des photos superposées
async function bundle(name, parts) {
  const size = Math.round(SIZE * 0.62)
  const layers = await Promise.all(
    parts.map(async (part, i) => ({
      input: await sharp(join(OUT, `${part}.webp`)).resize(size, size).toBuffer(),
      left: Math.round(((SIZE - size) * i) / (parts.length - 1)),
      top: Math.round((SIZE - size) * (i % 2 ? 0.8 : 0.3)),
      blend: "multiply",
    }))
  )
  await sharp({ create: { width: SIZE, height: SIZE, channels: 3, background: "#ffffff" } }).composite(layers).webp({ quality: 84 }).toFile(join(OUT, `${name}.webp`))
}
await bundle("coffret_redbull", ["redbull", "redbull_rose"])
await bundle("coffret_monster", ["monster_vert", "monster_rose", "monster_violet"])
