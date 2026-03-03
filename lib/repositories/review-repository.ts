/**
 * Repository pour les avis
 */

import { prisma } from "@/lib/db/prisma"
import { BaseRepository } from "./base-repository"
import type { Review, Prisma } from "@prisma/client"

type ReviewWithRelations = Prisma.ReviewGetPayload<{
  include: {
    customer: true
    product: { select: { id: true; name: true; slug: true; images: { take: 1 } } }
  }
}>

export class ReviewRepository extends BaseRepository<
  ReviewWithRelations,
  Prisma.ReviewCreateInput,
  Prisma.ReviewUpdateInput
> {
  protected model = prisma.review

  /**
   * Récupère tous les avis avec leurs relations
   */
  async findAll(options?: {
    where?: Prisma.ReviewWhereInput
    skip?: number
    take?: number
    orderBy?: Prisma.ReviewOrderByWithRelationInput
  }): Promise<ReviewWithRelations[]> {
    return prisma.review.findMany({
      include: {
        customer: true,
        product: {
          select: {
            id: true,
            name: true,
            slug: true,
            images: { take: 1, orderBy: { order: "asc" } },
          },
        },
      },
      ...options,
    })
  }

  /**
   * Récupère les avis d'un produit
   */
  async findByProduct(productId: string, options?: { skip?: number; take?: number }): Promise<ReviewWithRelations[]> {
    return this.findAll({
      where: { productId, status: "approved" },
      orderBy: { createdAt: "desc" },
      ...options,
    })
  }

  /**
   * Récupère les avis en attente de modération
   */
  async findPending(): Promise<ReviewWithRelations[]> {
    return this.findAll({
      where: { status: "pending" },
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Met à jour le statut d'un avis
   */
  async updateStatus(id: string, status: "approved" | "rejected"): Promise<Review> {
    return prisma.review.update({
      where: { id },
      data: { status },
    })
  }

  /**
   * Calcule la note moyenne d'un produit
   */
  async calculateProductRating(productId: string): Promise<{ rating: number; count: number }> {
    const reviews = await prisma.review.findMany({
      where: { productId, status: "approved" },
      select: { rating: true },
    })

    if (reviews.length === 0) {
      return { rating: 0, count: 0 }
    }

    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0)
    const averageRating = totalRating / reviews.length

    // Mettre à jour le produit
    await prisma.product.update({
      where: { id: productId },
      data: {
        rating: Math.round(averageRating * 100) / 100,
        reviewCount: reviews.length,
      },
    })

    return { rating: Math.round(averageRating * 100) / 100, count: reviews.length }
  }
}

export const reviewRepository = new ReviewRepository()
