import { ExecArgs } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createCollectionsWorkflow,
  createInventoryLevelsWorkflow,
  createPriceListsWorkflow,
  createProductCategoriesWorkflow,
  createProductsWorkflow,
  createPromotionsWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
  updateStoresWorkflow,
} from "@medusajs/medusa/core-flows"
import { writeFileSync } from "node:fs"
import { join } from "node:path"

// Données de démonstration : marques, noms et prix fictifs.
// Taux de TVA à faire valider par ton comptable avant de vendre hors de France.
const TAX_RATES: Record<string, number> = {
  fr: 20,
  be: 21,
  lu: 17,
  de: 19,
  es: 21,
  it: 22,
  nl: 21,
}
const FREE_SHIPPING_THRESHOLD = 50

const CATEGORIES = [
  { name: "Red Bull", handle: "red-bull", group: "marque" },
  { name: "Monster", handle: "monster", group: "marque" },
  { name: "Celsius", handle: "celsius", group: "marque" },
  { name: "Sport auto", handle: "sport-auto", group: "univers" },
  { name: "Sports extrêmes", handle: "sports-extremes", group: "univers" },
  { name: "Gaming & e-sport", handle: "gaming-esport", group: "univers" },
  { name: "Canettes en peluche", handle: "canettes", group: "univers" },
  { name: "Mini", handle: "mini", group: "format" },
  { name: "Medium", handle: "medium", group: "format" },
  { name: "XXL", handle: "xxl", group: "format" },
  { name: "Coffrets", handle: "coffrets", group: "format" },
]

const COLLECTIONS = [
  { title: "Nouveautés", handle: "nouveautes" },
  { title: "Meilleures ventes", handle: "meilleures-ventes" },
  { title: "Éditions limitées", handle: "editions-limitees" },
  { title: "Promotions", handle: "promotions" },
]

type Demo = {
  title: string
  handle: string
  brand: "redbull" | "monster" | "celsius"
  color: string
  image: string
  categories: string[]
  collection?: string
  badge?: "new" | "limited" | "hidden"
  description: string
  sizes: { title: string; price: number; stock: number; sale?: number }[]
}

const size = (mini: number, medium: number, xxl: number, stock = [40, 40, 15]) => [
  { title: "Mini", price: mini, stock: stock[0] },
  { title: "Medium", price: medium, stock: stock[1] },
  { title: "XXL", price: xxl, stock: stock[2] },
]

const PRODUCTS: Demo[] = [
  { title: "Peluche Red Bull Classique", handle: "peluche-red-bull-classique", brand: "redbull", color: "#2348c7", image: "redbull", categories: ["canettes", "sport-auto", "mini", "medium", "xxl"], collection: "meilleures-ventes", description: "Le classique. Bleu nuit et argent, tout doux, toujours partant. Elle garde ton bureau sous tension sans jamais te réveiller à 3 h.", sizes: size(14.9, 29.9, 69.9) },
  { title: "Peluche Red Bull Winter", handle: "peluche-red-bull-winter", brand: "redbull", color: "#2f9de0", image: "redbull_bleu", categories: ["canettes", "sports-extremes", "mini", "medium", "xxl"], collection: "nouveautes", badge: "new", description: "Bleu glacier et câlin bien chaud. L'édition qui fait fondre tout le monde, même en plein hiver.", sizes: size(15.9, 32.9, 74.9) },
  { title: "Peluche Red Bull Pink", handle: "peluche-red-bull-pink", brand: "redbull", color: "#ff5fa8", image: "redbull_rose", categories: ["canettes", "sports-extremes", "medium", "xxl"], collection: "promotions", description: "Rose vif, câlin immédiat. Elle passe de 0 à 100 en douceur.", sizes: [{ title: "Medium", price: 34.9, sale: 27.9, stock: 22 }, { title: "XXL", price: 79.9, sale: 64.9, stock: 8 }] },
  { title: "Peluche Red Bull Coco", handle: "peluche-red-bull-coco", brand: "redbull", color: "#c9d1dc", image: "redbull_blanche", categories: ["canettes", "sport-auto", "mini", "medium"], collection: "meilleures-ventes", description: "Blanche comme le sable, douce comme un après-midi sans réunion. Elle tient dans le sac, et rentre dans le cœur.", sizes: [{ title: "Mini", price: 16.9, stock: 60 }, { title: "Medium", price: 31.9, stock: 3 }] },
  { title: "Peluche Monster Vert", handle: "peluche-monster-vert", brand: "monster", color: "#39ff14", image: "monster_vert", categories: ["canettes", "gaming-esport", "mini", "medium", "xxl"], collection: "meilleures-ventes", description: "Vert néon, griffes argentées, zéro lag. Elle veille sur ta manette entre deux parties classées.", sizes: size(14.9, 29.9, 69.9) },
  { title: "Peluche Monster Noir", handle: "peluche-monster-noir", brand: "monster", color: "#6b6b75", image: "monster_noir", categories: ["canettes", "gaming-esport", "medium", "xxl"], collection: "nouveautes", badge: "new", description: "Noire, discrète, redoutablement moelleuse. Le boss final de ta collection.", sizes: [{ title: "Medium", price: 33.9, stock: 30 }, { title: "XXL", price: 79.9, stock: 12 }] },
  { title: "Peluche Monster Rose", handle: "peluche-monster-rose", brand: "monster", color: "#ffb3c7", image: "monster_rose", categories: ["canettes", "gaming-esport", "mini", "medium"], collection: "nouveautes", badge: "new", description: "Rose poudré, énergie maximale. Elle met de bonne humeur tout ton setup.", sizes: [{ title: "Mini", price: 15.9, stock: 50 }, { title: "Medium", price: 30.9, stock: 25 }] },
  { title: "Peluche Monster Violet", handle: "peluche-monster-violet", brand: "monster", color: "#7b3ff2", image: "monster_violet", categories: ["canettes", "sports-extremes", "medium", "xxl"], collection: "editions-limitees", badge: "limited", description: "Édition limitée. Violet électrique et tirage court : quand c'est parti, c'est parti.", sizes: [{ title: "Medium", price: 39.9, stock: 12 }, { title: "XXL", price: 89.9, stock: 4 }] },
  { title: "Peluche Monster Orange", handle: "peluche-monster-orange", brand: "monster", color: "#ff8a1f", image: "monster_orange", categories: ["canettes", "sports-extremes", "mini", "medium"], collection: "promotions", description: "Orange solaire, parfum de vacances (imaginaire, c'est une peluche). Elle part partout avec toi.", sizes: [{ title: "Mini", price: 17.9, sale: 14.9, stock: 35 }, { title: "Medium", price: 32.9, sale: 26.9, stock: 18 }] },
  { title: "Peluche Monster Bleu", handle: "peluche-monster-bleu", brand: "monster", color: "#2f9de0", image: "monster_bleu", categories: ["canettes", "sports-extremes", "mini", "medium"], collection: "meilleures-ventes", description: "Bleu électrique et griffes orange. Le contraste qui claque sur une étagère.", sizes: [{ title: "Mini", price: 16.9, stock: 40 }, { title: "Medium", price: 31.9, stock: 28 }] },
  { title: "Peluche Monster Blanc", handle: "peluche-monster-blanc", brand: "monster", color: "#d8e7ef", image: "monster_blanc", categories: ["canettes", "sports-extremes", "mini", "medium", "xxl"], description: "Blanche comme la poudreuse, douce comme un après-ski. Elle adore les longues nuits d'hiver.", sizes: size(15.9, 31.9, 72.9, [0, 20, 6]) },
  { title: "Peluche Celsius Orange", handle: "peluche-celsius-orange", brand: "celsius", color: "#ff8a1f", image: "celsius", categories: ["canettes", "gaming-esport", "mini", "medium"], collection: "nouveautes", badge: "new", description: "Pétillante, avec sa tranche d'orange brodée. La canette qu'on a vraiment envie de câliner.", sizes: [{ title: "Mini", price: 16.9, stock: 30 }, { title: "Medium", price: 31.9, stock: 24 }] },
  { title: "Coffret Duo Red Bull", handle: "coffret-duo-red-bull", brand: "redbull", color: "#2348c7", image: "coffret_redbull", categories: ["coffrets", "sport-auto"], collection: "meilleures-ventes", description: "Deux canettes Medium dans une boîte prête à offrir. Le cadeau qui démarre au quart de tour.", sizes: [{ title: "Coffret", price: 54.9, stock: 20 }] },
  { title: "Coffret Trio Monster", handle: "coffret-trio-monster", brand: "monster", color: "#39ff14", image: "coffret_monster", categories: ["coffrets", "gaming-esport"], collection: "editions-limitees", badge: "limited", description: "Trois canettes Mini. Pour jouer en équipe, même hors ligne.", sizes: [{ title: "Coffret", price: 49.9, stock: 12 }] },
  // Option vendue avec une peluche, masquée du catalogue par la boutique
  { title: "Emballage cadeau", handle: "emballage-cadeau", brand: "redbull", color: "#ff5a1f", image: "coffret_redbull", categories: [], badge: "hidden", description: "Papier cadeau et carte avec ton message.", sizes: [{ title: "Coffret", price: 3, stock: 10000 }] },
]

const SIZE_DETAILS: Record<string, { dimensions: string; weight: number }> = {
  Mini: { dimensions: "12 cm, avec porte-clés", weight: 80 },
  Medium: { dimensions: "25 cm", weight: 280 },
  XXL: { dimensions: "55 cm", weight: 950 },
  Coffret: { dimensions: "Boîte de 30 × 25 × 15 cm", weight: 700 },
}

export default async function seedDemoData({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillment = container.resolve(Modules.FULFILLMENT)
  const salesChannels = container.resolve(Modules.SALES_CHANNEL)
  const stores = container.resolve(Modules.STORE)
  const countries = Object.keys(TAX_RATES)

  const [store] = await stores.listStores()
  let channels = await salesChannels.listSalesChannels({ name: "Default Sales Channel" })
  if (!channels.length) {
    const { result } = await createSalesChannelsWorkflow(container).run({
      input: { salesChannelsData: [{ name: "Default Sales Channel" }] },
    })
    channels = result
  }
  const channel = channels[0]

  await updateStoresWorkflow(container).run({
    input: {
      selector: { id: store.id },
      update: {
        name: "Voltoudou",
        supported_currencies: [{ currency_code: "eur", is_default: true, is_tax_inclusive: true }],
        default_sales_channel_id: channel.id,
      },
    },
  })

  logger.info("Région et TVA")
  const { result: regions } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Europe",
          currency_code: "eur",
          countries,
          is_tax_inclusive: true,
          // Fournisseur interne de Medusa, sans encaissement : sert seulement aux commandes de test
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  })
  const region = regions[0]

  await createTaxRegionsWorkflow(container).run({
    input: countries.map((country_code) => ({
      country_code,
      provider_id: "tp_system",
      default_tax_rate: {
        name: "TVA",
        code: `TVA-${country_code.toUpperCase()}`,
        rate: TAX_RATES[country_code],
      },
    })),
  })

  logger.info("Stock et livraison")
  const { result: locations } = await createStockLocationsWorkflow(container).run({
    input: {
      locations: [
        { name: "Entrepôt France", address: { city: "Paris", country_code: "FR", address_1: "" } },
      ],
    },
  })
  const location = locations[0]
  await updateStoresWorkflow(container).run({
    input: { selector: { id: store.id }, update: { default_location_id: location.id } },
  })
  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  })

  const profiles = await fulfillment.listShippingProfiles({ type: "default" })
  let profile = profiles[0]
  if (!profile) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: "Standard", type: "default" }] },
    })
    profile = result[0]
  }

  const fulfillmentSet = await fulfillment.createFulfillmentSets({
    name: "Livraison depuis la France",
    type: "shipping",
    service_zones: [
      {
        name: "Europe",
        geo_zones: countries.map((country_code) => ({ country_code, type: "country" as const })),
      },
    ],
  })
  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: location.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
  })

  const rules = [
    { attribute: "enabled_in_store", value: "true", operator: "eq" as const },
    { attribute: "is_return", value: "false", operator: "eq" as const },
  ]
  const shippingOption = (
    label: string,
    code: string,
    description: string,
    amount: number,
    freeAbove: boolean
  ) => ({
    name: label,
    price_type: "flat" as const,
    provider_id: "manual_manual",
    service_zone_id: fulfillmentSet.service_zones[0].id,
    shipping_profile_id: profile.id,
    type: { label, description, code },
    prices: [
      { region_id: region.id, amount },
      ...(freeAbove
        ? [
            {
              region_id: region.id,
              amount: 0,
              rules: [
                { attribute: "item_total", operator: "gte" as const, value: FREE_SHIPPING_THRESHOLD },
              ],
            },
          ]
        : []),
    ],
    rules,
  })
  await createShippingOptionsWorkflow(container).run({
    input: [
      shippingOption("Mondial Relay", "mondial-relay", "En point relais, 3 à 5 jours ouvrés", 3.9, true),
      shippingOption("Colissimo", "colissimo", "À domicile, 2 à 3 jours ouvrés", 5.9, true),
      shippingOption("Chronopost", "chronopost", "Express, livré le lendemain", 12.9, false),
    ],
  })

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: location.id, add: [channel.id] },
  })

  logger.info("Clé API de la boutique")
  const { result: keys } = await createApiKeysWorkflow(container).run({
    input: { api_keys: [{ title: "Boutique", type: "publishable", created_by: "" }] },
  })
  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: keys[0].id, add: [channel.id] },
  })

  logger.info("Catalogue")
  const { result: categories } = await createProductCategoriesWorkflow(container).run({
    input: {
      product_categories: CATEGORIES.map(({ name, handle, group }) => ({
        name,
        handle,
        is_active: true,
        metadata: { group },
      })),
    },
  })
  const { result: collections } = await createCollectionsWorkflow(container).run({
    input: { collections: COLLECTIONS },
  })

  const categoryId = (handle: string) => categories.find((c) => c.handle === handle)!.id
  const collectionId = (handle?: string) => collections.find((c) => c.handle === handle)?.id
  const sku = (handle: string, title: string) =>
    `${handle}-${title}`.toUpperCase().replace(/[^A-Z0-9]+/g, "-")

  const { result: products } = await createProductsWorkflow(container).run({
    input: {
      products: PRODUCTS.map((p) => ({
        title: p.title,
        handle: p.handle,
        description: p.description,
        status: ProductStatus.PUBLISHED,
        shipping_profile_id: profile.id,
        category_ids: [...p.categories, { redbull: "red-bull", monster: "monster", celsius: "celsius" }[p.brand]].map(categoryId),
        thumbnail: `/produits/${p.image}.webp`,
        images: [{ url: `/produits/${p.image}.webp` }],
        collection_id: collectionId(p.collection),
        metadata: { color: p.color, brand: p.brand, badge: p.badge ?? "" },
        options: [{ title: "Taille", values: p.sizes.map((s) => s.title) }],
        variants: p.sizes.map((s) => ({
          title: s.title,
          sku: sku(p.handle, s.title),
          manage_inventory: true,
          options: { Taille: s.title },
          weight: SIZE_DETAILS[s.title].weight,
          metadata: { dimensions: SIZE_DETAILS[s.title].dimensions },
          prices: [{ amount: s.price, currency_code: "eur" }],
        })),
        sales_channels: [{ id: channel.id }],
      })),
    },
  })

  logger.info("Stock")
  const { data: items } = await query.graph({
    entity: "inventory_item",
    fields: ["id", "sku"],
  })
  const stockBySku = new Map(
    PRODUCTS.flatMap((p) => p.sizes.map((s) => [sku(p.handle, s.title), s.stock] as const))
  )
  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: items.map((item) => ({
        location_id: location.id,
        inventory_item_id: item.id,
        stocked_quantity: stockBySku.get(item.sku as string) ?? 0,
      })),
    },
  })

  logger.info("Promotions")
  const variantId = (handle: string, title: string) =>
    products.find((p) => p.handle === handle)!.variants.find((v) => v.title === title)!.id
  const now = new Date()
  await createPriceListsWorkflow(container).run({
    input: {
      price_lists_data: [
        {
          title: "Promotions de démonstration",
          description: "Le prix barré doit rester le prix le plus bas des 30 derniers jours.",
          type: "sale",
          status: "active",
          starts_at: now.toISOString(),
          prices: PRODUCTS.flatMap((p) =>
            p.sizes
              .filter((s) => s.sale)
              .map((s) => ({
                variant_id: variantId(p.handle, s.title),
                amount: s.sale!,
                currency_code: "eur",
              }))
          ),
        },
      ],
    },
  })

  const allProductIds = products.filter((p) => p.handle !== "emballage-cadeau").map((p) => p.id)
  await createPromotionsWorkflow(container).run({
    input: {
      promotionsData: [
        {
          code: "BIENVENUE10",
          type: "standard",
          status: "active",
          is_automatic: false,
          application_method: {
            type: "percentage",
            target_type: "items",
            allocation: "across",
            value: 10,
            currency_code: "eur",
          },
        },
        {
          code: "DUO15",
          type: "buyget",
          status: "active",
          is_automatic: true,
          application_method: {
            type: "percentage",
            target_type: "items",
            allocation: "each",
            value: 15,
            max_quantity: 2,
            apply_to_quantity: 2,
            buy_rules_min_quantity: 2,
            currency_code: "eur",
            buy_rules: [{ attribute: "items.product.id", operator: "in", values: allProductIds }],
            target_rules: [{ attribute: "items.product.id", operator: "in", values: allProductIds }],
          },
        },
      ],
    },
  })

  // Connecte automatiquement la boutique à ce backend en développement
  const envPath = join(process.cwd(), "..", "storefront", ".env.local")
  writeFileSync(
    envPath,
    [
      "NEXT_PUBLIC_MEDUSA_URL=http://localhost:9000",
      `NEXT_PUBLIC_MEDUSA_KEY=${keys[0].token}`,
      `NEXT_PUBLIC_MEDUSA_REGION=${region.id}`,
      "NEXT_PUBLIC_SITE_URL=http://localhost:3000",
      "NEXT_PUBLIC_TEST_CHECKOUT=true",
      "",
    ].join("\n")
  )
  logger.info(`Terminé. Configuration écrite dans ${envPath}`)
}
