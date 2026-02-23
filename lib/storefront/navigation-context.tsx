"use client"

import { createContext } from "react"
import { PAGES } from "@/lib/routes"
import type { NavigationStoreContextType } from "./types"

export type { NavigationStoreContextType }

const defaultNavState: {
  currentView: "store" | "admin"
  currentPage: string
  selectedProductId: string | null
  selectedCategoryId: string | null
  selectedOrderId: string | null
  selectedCustomerId: string | null
  searchQuery: string
} = {
  currentView: "store",
  currentPage: PAGES.store.home,
  selectedProductId: null,
  selectedCategoryId: null,
  selectedOrderId: null,
  selectedCustomerId: null,
  searchQuery: "",
}

export const NavigationStoreContext = createContext<NavigationStoreContextType | undefined>(undefined)

export { defaultNavState }
