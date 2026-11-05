"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import type { ReactNode } from "react"
import { site } from "@/lib/site"

export function Breadcrumbs({ items }: { items: { name: string; href?: string }[] }) {
  const all = [{ name: "Accueil", href: "/" }, ...items]
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: all.map((item, i) => ({ "@type": "ListItem", position: i + 1, name: item.name, ...(item.href ? { item: `${site.url}${item.href}` } : {}) })),
  }
  return (
    <nav className="crumbs" aria-label="Fil d'Ariane">
      <ol>
        {all.map((item) => <li key={item.name}>{item.href ? <Link href={item.href}>{item.name}</Link> : <span aria-current="page">{item.name}</span>}</li>)}
      </ol>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }} />
    </nav>
  )
}

// Le filtre s'applique dès qu'une case change. Sans JavaScript, le formulaire reste envoyable.
export function AutoSubmit({ children }: { children: ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  return (
    <form
      method="get"
      onChange={(event) => {
        const data = new FormData(event.currentTarget)
        const params = new URLSearchParams()
        data.forEach((value, key) => {
          if (value && !(key === "tri" && value === "popularite")) params.append(key, String(value))
        })
        router.replace(params.size ? `${pathname}?${params}` : pathname, { scroll: false })
      }}
    >
      {children}
    </form>
  )
}
