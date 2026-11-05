// PostgreSQL local pour le développement, sans installation système ni Docker.
// Les données restent hors de OneDrive : la synchronisation corromprait la base.
import EmbeddedPostgres from "embedded-postgres"
import { existsSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"

const base = process.env.LOCALAPPDATA || join(homedir(), ".local", "share")
const databaseDir = join(base, "voltoudou", "pg")
const alreadyInitialised = existsSync(join(databaseDir, "PG_VERSION"))

const pg = new EmbeddedPostgres({
  databaseDir,
  user: "postgres",
  password: "postgres",
  port: 5432,
  persistent: true,
})

if (!alreadyInitialised) {
  await pg.initialise()
}
await pg.start()

const client = pg.getPgClient()
await client.connect()
const { rows } = await client.query("select 1 from pg_database where datname = 'voltoudou'")
if (!rows.length) {
  await client.query("create database voltoudou encoding 'UTF8' template template0 lc_collate 'C' lc_ctype 'C'")
}
await client.end()

console.log(`PostgreSQL prêt sur le port 5432 (${databaseDir})`)

const stop = async () => {
  await pg.stop()
  process.exit(0)
}
process.on("SIGINT", stop)
process.on("SIGTERM", stop)
