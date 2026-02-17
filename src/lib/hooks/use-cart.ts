/**
 * Hook personnalisé pour le panier
 */
import { useCartStore } from '../stores/cart-store'
import { useMemo } from 'react'

export function useCart() {
  const store = useCartStore()
  
  const total = useMemo(() => store.getTotal(), [store.items])
  const count = useMemo(() => store.getCount(), [store.items])
  
  return {
    items: store.items,
    total,
    count,
    addItem: store.addItem,
    removeItem: store.removeItem,
    updateQuantity: store.updateQuantity,
    clearCart: store.clearCart,
  }
}

