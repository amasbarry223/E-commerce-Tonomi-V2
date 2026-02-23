"use client"

import { createContext } from "react"
import type { UIStoreContextType } from "./types"
import type { WishlistItem } from "@/lib/types"

export type { UIStoreContextType }

const defaultUIState = {
  wishlist: [] as WishlistItem[],
  compareList: [] as string[],
  darkMode: false,
  newsletterSubscribed: false,
}

export const UIStoreContext = createContext<UIStoreContextType | undefined>(undefined)

export { defaultUIState }
