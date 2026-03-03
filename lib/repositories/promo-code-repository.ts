/**
 * Repository pour les codes promo
 */

import { prisma } from "@/lib/db/prisma"
import { BaseRepository } from "./base-repository"
import type { PromoCode, Prisma } from "@prisma/client"

type PromoCodeWithRelations = Prisma.PromoCodeGetPayload<{
  include: {
    categories: true
    products: { include: { product: true } }
  }
}>

export class PromoCodeRepository extends BaseRepository<
  PromoCodeWithRelations,
  Prisma.PromoCodeCreateInput,
  Prisma.PromoCodeUpdateInput
> {
  protected model = prisma.promoCode

  /**
   * Surcharge findById pour inclure les relations nécessaires
   * (categories, products.product) afin que les services puissent
   * transformer correctement le résultat.
   */
  async findById(id: string): Promise<PromoCodeWithRelations | null> {
    return prisma.promoCode.findUnique({
      where: { id },
      include: {
        categories: true,
        products: { include: { product: true } },
      },
    })
  }

  /**
   * Surcharge findMany pour inclure les relations (utilisé côté admin)
   */
  async findMany(
    where?: Prisma.PromoCodeWhereInput,
    options?: { skip?: number; take?: number; orderBy?: Prisma.PromoCodeOrderByWithRelationInput }
  ): Promise<PromoCodeWithRelations[]> {
    return prisma.promoCode.findMany({
      where,
      include: {
        categories: true,
        products: { include: { product: true } },
      },
      ...options,
    })
  }

  /**
   * Récupère tous les codes promo actifs
   */
  async findActive(): Promise<PromoCodeWithRelations[]> {
    const now = new Date()
    return prisma.promoCode.findMany({
      where: {
        active: true,
        startDate: { lte: now },
        endDate: { gte: now },
      },
      include: {
        categories: true,
        products: { include: { product: true } },
      },
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Récupère un code promo par code
   */
  async findByCode(code: string): Promise<PromoCodeWithRelations | null> {
    return prisma.promoCode.findUnique({
      where: { code },
      include: {
        categories: true,
        products: { include: { product: true } },
      },
    })
  }

  /**
   * Vérifie si un code promo est valide
   */
  async validateCode(code: string, amount: number, productIds?: string[], categoryIds?: string[]): Promise<{
    valid: boolean
    promo?: PromoCodeWithRelations
    error?: string
  }> {
    const promo = await this.findByCode(code)

    if (!promo) {
      return { valid: false, error: "Code promo introuvable" }
    }

    const now = new Date()
    if (!promo.active) {
      return { valid: false, error: "Code promo inactif" }
    }

    if (promo.startDate > now || promo.endDate < now) {
      return { valid: false, error: "Code promo expiré" }
    }

    if (promo.usedCount >= promo.maxUses) {
      return { valid: false, error: "Code promo épuisé" }
    }

    if (promo.minAmount && amount < Number(promo.minAmount)) {
      return { valid: false, error: `Montant minimum requis: ${promo.minAmount}€` }
    }

    // Vérifier les restrictions de catégories
    if (promo.categories.length > 0 && categoryIds) {
      const promoCategoryIds = promo.categories.map((c) => c.categoryId)
      const hasValidCategory = categoryIds.some((id) => promoCategoryIds.includes(id))
      if (!hasValidCategory) {
        return { valid: false, error: "Code promo non applicable à cette catégorie" }
      }
    }

    // Vérifier les restrictions de produits
    if (promo.products.length > 0 && productIds) {
      const promoProductIds = promo.products.map((p) => p.productId)
      const hasValidProduct = productIds.some((id) => promoProductIds.includes(id))
      if (!hasValidProduct) {
        return { valid: false, error: "Code promo non applicable à ce produit" }
      }
    }

    return { valid: true, promo }
  }

  /**
   * Incrémente le compteur d'utilisation
   */
  async incrementUsage(id: string): Promise<PromoCode> {
    return prisma.promoCode.update({
      where: { id },
      data: { usedCount: { increment: 1 } },
    })
  }
}

export const promoCodeRepository = new PromoCodeRepository()
