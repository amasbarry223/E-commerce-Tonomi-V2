/**
 * Service codes promo
 */

import { promoCodeRepository } from "@/lib/repositories"
import type { PromoCode } from "@/lib/types"
import type { Prisma } from "@prisma/client"

type PromoCodeWithRelations = Prisma.PromoCodeGetPayload<{
  include: {
    categories: true
    products: { include: { product: true } }
  }
}>

function transformPromoCode(prismaPromo: PromoCodeWithRelations): PromoCode {
  return {
    id: prismaPromo.id,
    code: prismaPromo.code,
    type: prismaPromo.type as "percentage" | "fixed",
    value: Number(prismaPromo.value),
    minAmount: prismaPromo.minAmount ? Number(prismaPromo.minAmount) : undefined,
    maxUses: prismaPromo.maxUses,
    usedCount: prismaPromo.usedCount,
    startDate: prismaPromo.startDate.toISOString(),
    endDate: prismaPromo.endDate.toISOString(),
    active: prismaPromo.active,
    categories: prismaPromo.categories.map((c) => c.categoryId),
  }
}

/**
 * Récupère tous les codes promo actifs
 */
export async function getPromoCodes(): Promise<PromoCode[]> {
  const promos = await promoCodeRepository.findActive()
  return promos.map(transformPromoCode)
}

/**
 * Récupère tous les codes promo (pour l'admin)
 */
export async function getAllPromoCodes(): Promise<PromoCode[]> {
  const promos = await promoCodeRepository.findMany(undefined, {
    orderBy: { createdAt: "desc" },
  } as any)
  return promos.map(transformPromoCode)
}

/**
 * Récupère un code promo par code
 */
export async function getPromoCodeByCode(code: string): Promise<PromoCode | undefined> {
  const promo = await promoCodeRepository.findByCode(code)
  return promo ? transformPromoCode(promo) : undefined
}

/**
 * Valide un code promo
 */
export async function validatePromoCode(
  code: string,
  amount: number,
  productIds?: string[],
  categoryIds?: string[]
): Promise<{ valid: boolean; promo?: PromoCode; error?: string }> {
  const result = await promoCodeRepository.validateCode(code, amount, productIds, categoryIds)
  return {
    ...result,
    promo: result.promo ? transformPromoCode(result.promo) : undefined,
  }
}

/**
 * Crée un nouveau code promo
 */
export async function createPromoCode(data: {
  code: string
  type: "percentage" | "fixed"
  value: number
  minAmount?: number
  maxUses: number
  startDate: string
  endDate: string
}): Promise<PromoCode> {
  const created = await promoCodeRepository.create({
    code: data.code,
    type: data.type,
    value: data.value,
    minAmount: data.minAmount ?? null,
    maxUses: data.maxUses,
    startDate: new Date(data.startDate),
    endDate: new Date(data.endDate),
    active: true,
  } as any)
  // Recharger avec relations complètes
  const full = await promoCodeRepository.findById(created.id)
  if (!full) {
    throw new Error("Failed to create promo code")
  }
  
  // Logger l'action
  const { logActions } = await import("@/lib/utils/logger-service")
  await logActions.promoCreated(created.id, data.code)
  
  return transformPromoCode(full as any)
}

/**
 * Supprime un code promo
 */
export async function deletePromoCode(id: string): Promise<void> {
  // Récupérer le code promo avant suppression pour le log
  const promo = await promoCodeRepository.findById(id)
  const promoCode = promo?.code || "Code inconnu"
  
  await promoCodeRepository.delete(id)
  
  // Logger l'action
  const { logActions } = await import("@/lib/utils/logger-service")
  await logActions.promoDeleted(id, promoCode)
}
