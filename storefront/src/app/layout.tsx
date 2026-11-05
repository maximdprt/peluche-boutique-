import type { Metadata } from "next"
import { Archivo_Black, Inter } from "next/font/google"
import { cookies } from "next/headers"
import type { ReactNode } from "react"
import "./globals.css"
import { CartDrawer } from "@/components/CartContents"
import { CookieBanner } from "@/components/CookieBanner"
import { Footer } from "@/components/Footer"
import { Header, Ticker } from "@/components/Header"
import { QuickView, SearchOverlay } from "@/components/Overlays"
import { StoreProvider } from "@/components/StoreProvider"
import { dictionaries, type Locale } from "@/lib/i18n"
import { site } from "@/lib/site"

const archivo = Archivo_Black({ weight: "400", subsets: ["latin"], variable: "--font-archivo-black", display: "swap" })
const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: { default: `${site.fullName} | Peluches de boissons énergisantes`, template: `%s | ${site.fullName}` },
  description: "L'énergie, version câlin. Peluches canettes pour fans de sport auto, de gaming et de sports extrêmes. Livraison offerte dès 50 €, retours 30 jours.",
  openGraph: { siteName: site.fullName, locale: "fr_FR", type: "website" },
}

export default async function RootLayout({ children }: { children: ReactNode }) {
  const stored = (await cookies()).get("locale")?.value
  const locale: Locale = stored === "en" ? "en" : "fr"
  return (
    <html lang={locale} className={`${archivo.variable} ${inter.variable}`}>
      <body>
        <StoreProvider locale={locale}>
          <a href="#contenu" className="skip btn btn-accent">{dictionaries[locale].skip}</a>
          <Ticker items={[`Livraison offerte dès ${site.freeShippingThreshold} €`, "Nouvelle collection", "Retours 30 jours"]} />
          <Header />
          <main id="contenu">{children}</main>
          <Footer />
          <CartDrawer />
          <QuickView />
          <SearchOverlay />
          <CookieBanner />
        </StoreProvider>
      </body>
    </html>
  )
}
