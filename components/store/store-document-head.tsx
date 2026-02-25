"use client"

import { useEffect } from "react"
import { useNavigationStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"
import { INFO_PAGES } from "@/lib/content/info-pages"
import type { InfoPageKey } from "@/lib/content/info-pages"

const SITE_TITLE = "TONOMI ACCESSOIRES"
const DEFAULT_DESCRIPTION = "Découvrez notre collection de sacs, portefeuilles et accessoires de mode haut de gamme."

const INFO_PAGE_KEYS: InfoPageKey[] = ["about", "delivery", "returns", "terms", "privacy", "faq"]

/**
 * Met à jour document.title et la meta description selon la page store (produit, catalogue, etc.).
 * À rendre à l'intérieur de StoreProvider.
 */
export function StoreDocumentHead() {
  const { currentView, currentPage, selectedProductId, getProduct } = useNavigationStore()

  useEffect(() => {
    if (currentView !== "store") return

    if (currentPage === PAGES.store.product && selectedProductId) {
      const product = getProduct(selectedProductId)
      if (product) {
        document.title = `${product.name} | ${SITE_TITLE}`
        updateMetaDescription(product.shortDescription || product.description.slice(0, 160))
        return
      }
    }

    if (currentPage === PAGES.store.catalog || currentPage === PAGES.store.category || currentPage === PAGES.store.promotions) {
      document.title = currentPage === PAGES.store.promotions ? `Promotions | ${SITE_TITLE}` : `Catalogue | ${SITE_TITLE}`
      updateMetaDescription("Parcourez notre catalogue de sacs, portefeuilles et accessoires.")
      return
    }

    if (currentPage === PAGES.store.cart) {
      document.title = `Panier | ${SITE_TITLE}`
      updateMetaDescription("Votre panier Tonomi Accessoires.")
      return
    }

    if (currentPage === PAGES.store.checkout) {
      document.title = `Commander | ${SITE_TITLE}`
      updateMetaDescription("Finalisez votre commande.")
      return
    }

    const infoKey = INFO_PAGE_KEYS.find((k) => PAGES.store[k] === currentPage)
    if (infoKey) {
      const info = INFO_PAGES[infoKey]
      document.title = `${info.title} | ${SITE_TITLE}`
      updateMetaDescription(info.metaDescription)
      return
    }

    document.title = SITE_TITLE
    updateMetaDescription(DEFAULT_DESCRIPTION)
  }, [currentView, currentPage, selectedProductId, getProduct])

  return null
}

function updateMetaDescription(content: string) {
  const el = document.querySelector('meta[name="description"]')
  if (el && el.getAttribute("content") !== content) {
    el.setAttribute("content", content)
  }
}
