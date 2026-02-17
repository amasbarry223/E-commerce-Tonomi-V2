/**
 * Store Zustand pour le panier
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../types'

interface CartStore {
  items: CartItem[]
  addItem: (item: CartItem) => void
  removeItem: (productId: string, color?: string, size?: string) => void
  updateQuantity: (productId: string, quantity: number, color?: string, size?: string) => void
  clearCart: () => void
  getTotal: () => number
  getCount: () => number
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existingIndex = state.items.findIndex(
          (i) => i.productId === item.productId && i.color === item.color && i.size === item.size
        )
        
        if (existingIndex >= 0) {
          const newItems = [...state.items]
          newItems[existingIndex] = {
            ...newItems[existingIndex],
            quantity: newItems[existingIndex].quantity + item.quantity,
          }
          return { items: newItems }
        }
        
        return { items: [...state.items, item] }
      }),
      
      removeItem: (productId, color, size) => set((state) => ({
        items: state.items.filter(
          (i) => !(i.productId === productId && i.color === color && i.size === size)
        ),
      })),
      
      updateQuantity: (productId, quantity, color, size) => set((state) => ({
        items: state.items.map((i) =>
          i.productId === productId && i.color === color && i.size === size
            ? { ...i, quantity: Math.max(1, quantity) }
            : i
        ),
      })),
      
      clearCart: () => set({ items: [] }),
      
      getTotal: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0)
      },
      
      getCount: () => {
        const { items } = get()
        return items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'cart-storage',
    }
  )
)

