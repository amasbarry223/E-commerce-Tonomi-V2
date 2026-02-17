/**
 * Store Zustand pour les codes promo
 */
import { create } from 'zustand'
import { promoCodes } from '@/lib/data'

interface PromoStore {
  appliedPromo: string | null
  promoDiscount: number
  applyPromoCode: (code: string, cartTotal: number) => { success: boolean; discount: number; message: string }
  clearPromo: () => void
}

export const usePromoStore = create<PromoStore>((set) => ({
  appliedPromo: null,
  promoDiscount: 0,
  
  applyPromoCode: (code: string, cartTotal: number) => {
    const promo = promoCodes.find((p) => p.code === code.toUpperCase() && p.active)
    if (!promo) return { success: false, discount: 0, message: 'Code promo invalide' }
    if (promo.usedCount >= promo.maxUses) return { success: false, discount: 0, message: 'Code promo expiré' }
    if (promo.minAmount && cartTotal < promo.minAmount) {
      return { success: false, discount: 0, message: `Montant minimum de ${promo.minAmount}€ requis` }
    }
    
    const discount = promo.type === 'percentage' 
      ? (cartTotal * promo.value) / 100 
      : promo.value
    
    set({ appliedPromo: promo.code, promoDiscount: discount })
    return { success: true, discount, message: `Code ${promo.code} appliqué !` }
  },
  
  clearPromo: () => set({ appliedPromo: null, promoDiscount: 0 }),
}))

