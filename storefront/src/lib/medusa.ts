// Accès à l'API Store de Medusa, côté serveur comme côté navigateur.
const BASE = process.env.NEXT_PUBLIC_MEDUSA_URL ?? "http://localhost:9000"
const KEY = process.env.NEXT_PUBLIC_MEDUSA_KEY ?? ""
export const REGION_ID = process.env.NEXT_PUBLIC_MEDUSA_REGION ?? ""

export type Price = {
  calculated_amount: number
  original_amount: number
  calculated_price?: { price_list_type?: string | null }
}
export type Variant = {
  id: string
  title: string
  inventory_quantity?: number
  manage_inventory?: boolean
  calculated_price?: Price
  metadata?: { dimensions?: string } | null
}
export type Product = {
  id: string
  title: string
  handle: string
  description: string | null
  thumbnail: string | null
  images?: { id: string; url: string }[]
  variants: Variant[]
  categories?: { id: string; handle: string; name: string }[]
  collection?: { handle: string; title: string } | null
  metadata?: { color?: string; brand?: "redbull" | "monster" | "celsius"; badge?: string } | null
  created_at?: string
}
export type LineItem = {
  id: string
  title: string
  subtitle?: string
  thumbnail?: string | null
  quantity: number
  unit_price: number
  total: number
  variant_id: string
  product_handle?: string
  product?: { metadata?: Product["metadata"] }
  metadata?: Record<string, unknown>
}
export type Cart = {
  id: string
  email?: string
  items: LineItem[]
  item_total: number
  item_subtotal?: number
  subtotal: number
  total: number
  tax_total: number
  discount_total: number
  shipping_total: number
  shipping_methods?: { shipping_option_id: string }[]
  promotions?: { code?: string; is_automatic?: boolean }[]
  shipping_address?: Address | null
  payment_collection?: { id: string; payment_sessions?: { id: string; provider_id: string; data: { client_secret?: string } }[] } | null
}
export type Address = {
  first_name: string
  last_name: string
  address_1: string
  address_2?: string
  postal_code: string
  city: string
  country_code: string
  phone?: string
}
export type ShippingOption = { id: string; name: string; amount?: number; calculated_price?: { calculated_amount: number }; type?: { description?: string } }

type Options = {
  method?: string
  body?: unknown
  query?: Record<string, string | number | string[] | undefined>
  token?: string
  revalidate?: number
}

export async function store<T>(path: string, { method = "GET", body, query, token, revalidate }: Options = {}): Promise<T> {
  const params = new URLSearchParams()
  for (const [key, value] of Object.entries(query ?? {})) {
    if (Array.isArray(value)) value.forEach((v) => params.append(`${key}[]`, v))
    else if (value !== undefined) params.set(key, String(value))
  }
  const search = params.size ? `?${params}` : ""
  const response = await fetch(`${BASE}${path}${search}`, {
    method,
    headers: {
      "content-type": "application/json",
      "x-publishable-api-key": KEY,
      ...(token ? { authorization: `Bearer ${token}` } : {}),
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    ...(revalidate === undefined ? { cache: "no-store" as const } : { next: { revalidate } }),
  })
  const data = await response.json().catch(() => ({}))
  if (!response.ok) throw new Error(data.message ?? `Erreur ${response.status}`)
  return data as T
}

export const PRODUCT_FIELDS =
  "*variants.calculated_price,+variants.inventory_quantity,+variants.metadata,+metadata,*categories,*collection,*images,+created_at"

export async function listProducts(query: Record<string, string | string[] | number | undefined> = {}): Promise<Product[]> {
  const { products } = await store<{ products: Product[] }>("/store/products", {
    query: { region_id: REGION_ID, fields: PRODUCT_FIELDS, limit: 100, ...query },
    revalidate: 60,
  })
  return products.filter((p) => p.metadata?.badge !== "hidden")
}

export async function getProduct(handle: string): Promise<Product | null> {
  const { products } = await store<{ products: Product[] }>("/store/products", {
    query: { region_id: REGION_ID, fields: PRODUCT_FIELDS, handle },
    revalidate: 60,
  })
  return products[0] ?? null
}

// --- Prix et stock

export function cheapestVariant(product: Product): Variant {
  return [...product.variants].sort(
    (a, b) => (a.calculated_price?.calculated_amount ?? 0) - (b.calculated_price?.calculated_amount ?? 0)
  )[0]
}

export function isAvailable(variant: Variant): boolean {
  return !variant.manage_inventory || (variant.inventory_quantity ?? 0) > 0
}

export function isProductAvailable(product: Product): boolean {
  return product.variants.some(isAvailable)
}

export function discountPercent(price?: Price): number {
  if (!price || price.original_amount <= price.calculated_amount) return 0
  return Math.round((1 - price.calculated_amount / price.original_amount) * 100)
}

export function formatMoney(amount: number, locale = "fr-FR"): string {
  return new Intl.NumberFormat(locale, { style: "currency", currency: "EUR" }).format(amount)
}
