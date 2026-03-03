/**
 * Service utilitaire pour logger les actions importantes
 * Utilise le service logs pour écrire dans la base de données
 */

import { createLog } from "@/lib/services/logs"

/**
 * Log une action importante
 */
export async function logAction(data: {
  action: string
  entityType: string
  entityId?: string
  description: string
  userId?: string
  metadata?: Record<string, any>
}): Promise<void> {
  try {
    await createLog(data)
  } catch (error) {
    // Ne pas faire échouer l'action principale si le log échoue
    console.error("Failed to log action:", error)
  }
}

/**
 * Helpers pour les actions courantes
 */
export const logActions = {
  productCreated: (productId: string, productName: string, userId?: string) =>
    logAction({
      action: "product_created",
      entityType: "product",
      entityId: productId,
      description: `Produit créé: ${productName}`,
      userId,
    }),

  productUpdated: (productId: string, productName: string, userId?: string) =>
    logAction({
      action: "product_updated",
      entityType: "product",
      entityId: productId,
      description: `Produit modifié: ${productName}`,
      userId,
    }),

  productDeleted: (productId: string, productName: string, userId?: string) =>
    logAction({
      action: "product_deleted",
      entityType: "product",
      entityId: productId,
      description: `Produit supprimé: ${productName}`,
      userId,
    }),

  orderCreated: (
    orderId: string,
    orderNumber: string,
    customerId: string,
    customerName: string | undefined,
    total: number,
    userId?: string
  ) =>
    logAction({
      action: "order_created",
      entityType: "order",
      entityId: orderId,
      description: `Commande créée: ${orderNumber} (Total: ${total}€)${
        customerName ? ` pour ${customerName}` : ""
      }`,
      userId: userId || customerId,
      metadata: { orderNumber, customerId, customerName, total },
    }),

  orderUpdated: (orderId: string, orderNumber: string, status: string, userId?: string) =>
    logAction({
      action: "order_updated",
      entityType: "order",
      entityId: orderId,
      description: `Commande modifiée: ${orderNumber} (Statut: ${status})`,
      userId,
      metadata: { orderNumber, status },
    }),

  customerCreated: (customerId: string, customerEmail: string, userId?: string) =>
    logAction({
      action: "customer_created",
      entityType: "customer",
      entityId: customerId,
      description: `Client créé: ${customerEmail}`,
      userId: userId || customerId,
    }),

  reviewCreated: (reviewId: string, productId: string, customerId: string, rating: number, userId?: string) =>
    logAction({
      action: "review_created",
      entityType: "review",
      entityId: reviewId,
      description: `Avis créé: ${rating}/5 étoiles`,
      userId: userId || customerId,
      metadata: { productId, customerId, rating },
    }),

  reviewApproved: (reviewId: string, userId?: string) =>
    logAction({
      action: "review_approved",
      entityType: "review",
      entityId: reviewId,
      description: `Avis approuvé`,
      userId,
    }),

  reviewRejected: (reviewId: string, userId?: string) =>
    logAction({
      action: "review_rejected",
      entityType: "review",
      entityId: reviewId,
      description: `Avis rejeté`,
      userId,
    }),

  categoryCreated: (categoryId: string, categoryName: string, userId?: string) =>
    logAction({
      action: "category_created",
      entityType: "category",
      entityId: categoryId,
      description: `Catégorie créée: ${categoryName}`,
      userId,
    }),

  categoryUpdated: (categoryId: string, categoryName: string, userId?: string) =>
    logAction({
      action: "category_updated",
      entityType: "category",
      entityId: categoryId,
      description: `Catégorie modifiée: ${categoryName}`,
      userId,
    }),

  categoryDeleted: (categoryId: string, categoryName: string, userId?: string) =>
    logAction({
      action: "category_deleted",
      entityType: "category",
      entityId: categoryId,
      description: `Catégorie supprimée: ${categoryName}`,
      userId,
    }),

  promoCreated: (promoId: string, promoCode: string, userId?: string) =>
    logAction({
      action: "promo_created",
      entityType: "promo",
      entityId: promoId,
      description: `Code promo créé: ${promoCode}`,
      userId,
    }),

  promoUpdated: (promoId: string, promoCode: string, userId?: string) =>
    logAction({
      action: "promo_updated",
      entityType: "promo",
      entityId: promoId,
      description: `Code promo modifié: ${promoCode}`,
      userId,
    }),

  promoDeleted: (promoId: string, promoCode: string, userId?: string) =>
    logAction({
      action: "promo_deleted",
      entityType: "promo",
      entityId: promoId,
      description: `Code promo supprimé: ${promoCode}`,
      userId,
    }),

  settingsUpdated: (key: string, userId?: string) =>
    logAction({
      action: "settings_updated",
      entityType: "settings",
      description: `Paramètre modifié: ${key}`,
      userId,
    }),
}
