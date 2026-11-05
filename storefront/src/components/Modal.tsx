"use client"

import { useEffect, useRef, type ReactNode } from "react"

// <dialog> natif : piège de focus, touche Échap et retour du focus sont gérés par le navigateur.
export function Modal({ open, onClose, variant, label, children }: { open: boolean; onClose: () => void; variant: "right" | "left" | "center" | "top"; label: string; children: ReactNode }) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dialog = ref.current
    if (!dialog) return
    if (open && !dialog.open) dialog.showModal()
    if (!open && dialog.open) dialog.close()
    document.documentElement.style.overflow = open ? "hidden" : ""
    return () => {
      document.documentElement.style.overflow = ""
    }
  }, [open])

  return (
    <dialog
      ref={ref}
      aria-label={label}
      className={`dialog dialog-${variant}`}
      onClose={onClose}
      onClick={(event) => {
        if (event.target === ref.current) onClose()
      }}
    >
      {open ? children : null}
    </dialog>
  )
}
