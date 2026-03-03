/**
 * Service avis
 */

import { reviewRepository } from "@/lib/repositories"
import type { Review } from "@/lib/types"

export type ReviewWithRelations = Awaited<ReturnType<typeof reviewRepository.findAll>>[0]

function transformReview(prismaReview: ReviewWithRelations): Review {
  return {
    id: prismaReview.id,
    productId: prismaReview.productId,
    customerId: prismaReview.customerId,
    customerName: `${prismaReview.customer.firstName} ${prismaReview.customer.lastName}`,
    rating: prismaReview.rating,
    title: prismaReview.title,
    comment: prismaReview.comment,
    status: prismaReview.status as Review["status"],
    createdAt: prismaReview.createdAt.toISOString(),
  }
}

/**
 * Récupère les avis d'un produit
 */
export async function getReviewsByProduct(productId: string, options?: { skip?: number; take?: number }): Promise<Review[]> {
  const reviews = await reviewRepository.findByProduct(productId, options)
  return reviews.map(transformReview)
}

/**
 * Récupère tous les avis
 */
export async function getReviews(options?: { skip?: number; take?: number }): Promise<Review[]> {
  const reviews = await reviewRepository.findAll({
    orderBy: { createdAt: "desc" },
    ...options,
  })
  return reviews.map(transformReview)
}

/**
 * Récupère les avis en attente de modération
 */
export async function getPendingReviews(): Promise<Review[]> {
  const reviews = await reviewRepository.findPending()
  return reviews.map(transformReview)
}

/**
 * Crée un nouvel avis
 */
export async function createReview(data: {
  productId: string
  customerId: string
  rating: number
  title: string
  comment: string
}): Promise<Review> {
  const review = await reviewRepository.create({
    productId: data.productId,
    customerId: data.customerId,
    rating: data.rating,
    title: data.title,
    comment: data.comment,
    status: "pending", // En attente de modération
  })

  // Recalculer la note moyenne du produit
  await reviewRepository.calculateProductRating(data.productId)

  const reviewWithRelations = await reviewRepository.findById(review.id)
  if (!reviewWithRelations) {
    throw new Error("Failed to fetch created review")
  }

  // Logger l'action
  const { logActions } = await import("@/lib/utils/logger-service")
  await logActions.reviewCreated(review.id, data.productId, data.customerId, data.rating, data.customerId)

  return transformReview(reviewWithRelations)
}

/**
 * Met à jour le statut d'un avis
 */
export async function updateReviewStatus(id: string, status: "approved" | "rejected"): Promise<Review> {
  const updatedReview = await reviewRepository.updateStatus(id, status)
  
  // Recalculer la note moyenne du produit si approuvé
  if (status === "approved") {
    const review = await reviewRepository.findById(id)
    if (review) {
      await reviewRepository.calculateProductRating(review.productId)
    }
  }

  const reviewWithRelations = await reviewRepository.findById(id)
  if (!reviewWithRelations) {
    throw new Error("Failed to fetch updated review")
  }

  // Logger l'action
  const { logActions } = await import("@/lib/utils/logger-service")
  if (status === "approved") {
    await logActions.reviewApproved(id)
  } else {
    await logActions.reviewRejected(id)
  }

  return transformReview(reviewWithRelations)
}
