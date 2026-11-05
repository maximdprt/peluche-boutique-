const paths = {
  search: "M11 19a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm10 2-4.3-4.3",
  user: "M20 21a8 8 0 1 0-16 0M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z",
  heart: "M12 21s-8-5.2-8-11.3A4.7 4.7 0 0 1 12 7a4.7 4.7 0 0 1 8 2.7C20 15.8 12 21 12 21Z",
  bag: "M5 8h14l1 13H4L5 8Zm4 0V6a3 3 0 0 1 6 0v2",
  menu: "M3 6h18M3 12h18M3 18h18",
  close: "M5 5l14 14M19 5 5 19",
  left: "M15 5l-7 7 7 7",
  right: "M9 5l7 7-7 7",
  pause: "M8 5v14M16 5v14",
  play: "M7 4l13 8-13 8V4Z",
  truck: "M2 6h13v11H2zM15 10h4l3 3v4h-7M6 20a2 2 0 1 0 0-4 2 2 0 0 0 0 4Zm12 0a2 2 0 1 0 0-4 2 2 0 0 0 0 4Z",
  back: "M9 14 4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3",
  lock: "M6 11h12v10H6zM8 11V7a4 4 0 0 1 8 0v4",
  bolt: "M13 2 4 14h7l-1 8 9-12h-7l1-8Z",
} as const

export function Icon({ name }: { name: keyof typeof paths }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={paths[name]} />
    </svg>
  )
}
