/**
 * Service codes promo.
 * À terme : appels API. Pour l'instant : accès via lib/data.
 */

import { promoCodes } from "@/lib/data"
import type { PromoCode } from "@/lib/types"

export function getPromoCodes(): PromoCode[] {
  return promoCodes
}

export function getPromoByCode(code: string): PromoCode | undefined {
  return promoCodes.find(p => p.code === code && p.active)
}
