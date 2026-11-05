import Image from "next/image"

// Photo de peluche : le fond blanc se fond dans la plaque colorée du conteneur (mix-blend-mode dans globals.css).
export function Photo({ name, src, alt = "", priority, sizes = "(max-width: 750px) 60vw, 30vw", className = "" }: { name?: string; src?: string | null; alt?: string; priority?: boolean; sizes?: string; className?: string }) {
  const url = src ?? (name ? `/produits/${name}.webp` : null)
  if (!url) return <span className="photo-empty" aria-hidden="true" />
  return <Image className={`photo ${className}`} src={url} alt={alt} width={1000} height={1000} priority={priority} sizes={sizes} />
}
