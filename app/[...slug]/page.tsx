import { redirect } from "next/navigation"
import { ROUTES, PAGES } from "@/lib/routes"

/** Segments reconnus pour la boutique SPA → query params (?page=...&id=...&category=...) */
const STORE_SEGMENT_MAP: Record<string, string> = {
  panier: PAGES.store.cart,
  cart: PAGES.store.cart,
  catalogue: PAGES.store.catalog,
  catalog: PAGES.store.catalog,
  compte: PAGES.store.account,
  account: PAGES.store.account,
  wishlist: PAGES.store.wishlist,
  favoris: PAGES.store.wishlist,
  checkout: PAGES.store.checkout,
  produit: PAGES.store.product,
  product: PAGES.store.product,
  // Pages informations (footer)
  "a-propos": PAGES.store.about,
  livraison: PAGES.store.delivery,
  "retours-echanges": PAGES.store.returns,
  "conditions-generales": PAGES.store.terms,
  "politique-confidentialite": PAGES.store.privacy,
  faq: PAGES.store.faq,
}

/**
 * Toute URL non gérée (ex. /catalogue, /panier, /product/xyz) est mappée vers
 * l'URL canonique SPA avec query params. Sinon redirection vers l'accueil.
 */
export default async function CatchAllPage({
  params,
}: {
  params: Promise<{ slug?: string[] }>
}) {
  const { slug } = await params
  const segments = slug ?? []
  if (segments.length === 0) {
    redirect(ROUTES.home)
  }

  const first = segments[0].toLowerCase()
  const page = STORE_SEGMENT_MAP[first]

  if (page) {
    // /product/[id] ou /produit/[id]
    if ((first === "product" || first === "produit") && segments.length >= 2) {
      const id = segments[1]
      redirect(`/?page=product&id=${encodeURIComponent(id)}`)
    }
    // /catalogue/[category] ou /catalog/[category] (optionnel)
    if ((first === "catalogue" || first === "catalog") && segments.length >= 2) {
      const category = segments[1]
      redirect(`/?page=catalog&category=${encodeURIComponent(category)}`)
    }
    // page simple
    redirect(`/?page=${page}`)
  }

  redirect(ROUTES.home)
}
