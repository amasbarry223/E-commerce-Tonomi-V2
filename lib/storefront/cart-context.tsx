"use client"

import { createContext } from "react"
import type { CartStoreContextType, CartStateContextType, CartActionsContextType } from "./types"
import type { CartItem } from "@/lib/types"

export type { CartStoreContextType, CartStateContextType, CartActionsContextType }

const defaultCartState = { cart: [] as CartItem[], promoDiscount: 0, appliedPromo: null as string | null }

export const CartStoreContext = createContext<CartStoreContextType | undefined>(undefined)
export const CartStateContext = createContext<CartStateContextType | undefined>(undefined)
export const CartActionsContext = createContext<CartActionsContextType | undefined>(undefined)

export { defaultCartState }
