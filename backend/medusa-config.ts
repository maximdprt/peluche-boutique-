import { loadEnv, defineConfig } from '@medusajs/framework/utils'

loadEnv(process.env.NODE_ENV || 'development', process.cwd())

if (process.env.NODE_ENV === 'production' && (!process.env.JWT_SECRET || !process.env.COOKIE_SECRET)) {
  throw new Error('JWT_SECRET et COOKIE_SECRET sont obligatoires en production')
}

module.exports = defineConfig({
  projectConfig: {
    databaseUrl: process.env.DATABASE_URL,
    http: {
      storeCors: process.env.STORE_CORS!,
      adminCors: process.env.ADMIN_CORS!,
      authCors: process.env.AUTH_CORS!,
      jwtSecret: process.env.JWT_SECRET || "supersecret",
      cookieSecret: process.env.COOKIE_SECRET || "supersecret",
    }
  },
  modules: [
    { resolve: './src/modules/leads' },
  ],
})
