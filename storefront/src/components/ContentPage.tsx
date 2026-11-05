import type { ReactNode } from "react"
import { Breadcrumbs } from "./Common"

export function ContentPage({ title, intro, children, width = true }: { title: string; intro?: string; children: ReactNode; width?: boolean }) {
  return (
    <>
      <div className="colhead">
        <div className="wrap">
          <Breadcrumbs items={[{ name: title }]} />
          <h1 style={{ fontSize: "var(--title-md)" }}>{title}</h1>
          {intro ? <p className="lead">{intro}</p> : null}
        </div>
      </div>
      <div className={`wrap section ${width ? "prose-hv" : ""}`} style={width ? { marginInline: "auto" } : undefined}>{children}</div>
    </>
  )
}

export function ToComplete({ children }: { children: ReactNode }) {
  return <mark style={{ padding: "0 4px", background: "var(--color-yellow)", fontWeight: 700 }}>[À compléter : {children}]</mark>
}
