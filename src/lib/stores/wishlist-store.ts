/**
 * Store Zustand pour la wishlist
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { WishlistItem } from '../types'

interface WishlistStore {
  items: WishlistItem[]
  toggle: (productId: string) => void
  isInWishlist: (productId: string) => boolean
  clear: () => void
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      toggle: (productId) => set((state) => {
        const exists = state.items.some((i) => i.productId === productId)
        return {
          items: exists
            ? state.items.filter((i) => i.productId !== productId)
            : [...state.items, { productId }],
        }
      }),
      
      isInWishlist: (productId) => {
        const { items } = get()
        return items.some((i) => i.productId === productId)
      },
      
      clear: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
)

