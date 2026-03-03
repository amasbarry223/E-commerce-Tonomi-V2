/**
 * Service commandes
 */

import { orderRepository } from "@/lib/repositories"
import { prisma } from "@/lib/db/prisma"
import type { Order } from "@/lib/types"

export type OrderWithRelations = Awaited<ReturnType<typeof orderRepository.findAll>>[0]

function transformOrder(prismaOrder: OrderWithRelations): Order {
  return {
    id: prismaOrder.id,
    orderNumber: prismaOrder.orderNumber,
    customerId: prismaOrder.customerId,
    items: prismaOrder.items.map((item) => ({
      productId: item.productId,
      name: item.name,
      price: Number(item.price),
      quantity: item.quantity,
      color: item.color || undefined,
      size: item.size || undefined,
      image: item.image,
    })),
    subtotal: Number(prismaOrder.subtotal),
    shipping: Number(prismaOrder.shipping),
    discount: Number(prismaOrder.discount),
    tax: Number(prismaOrder.tax),
    total: Number(prismaOrder.total),
    status: prismaOrder.status as Order["status"],
    paymentMethod: prismaOrder.paymentMethod,
    shippingAddress: {
      id: prismaOrder.shippingAddress.id,
      label: prismaOrder.shippingAddress.label,
      street: prismaOrder.shippingAddress.street,
      city: prismaOrder.shippingAddress.city,
      zipCode: prismaOrder.shippingAddress.zipCode,
      country: prismaOrder.shippingAddress.country,
      isDefault: prismaOrder.shippingAddress.isDefault,
    },
    billingAddress: {
      id: prismaOrder.billingAddress.id,
      label: prismaOrder.billingAddress.label,
      street: prismaOrder.billingAddress.street,
      city: prismaOrder.billingAddress.city,
      zipCode: prismaOrder.billingAddress.zipCode,
      country: prismaOrder.billingAddress.country,
      isDefault: prismaOrder.billingAddress.isDefault,
    },
    trackingNumber: prismaOrder.trackingNumber || undefined,
    notes: prismaOrder.notes || undefined,
    createdAt: prismaOrder.createdAt.toISOString(),
    updatedAt: prismaOrder.updatedAt.toISOString(),
  }
}

/**
 * Récupère toutes les commandes
 */
export async function getOrders(options?: { skip?: number; take?: number }): Promise<Order[]> {
  const orders = await orderRepository.findAll({
    orderBy: { createdAt: "desc" },
    ...options,
  })
  return orders.map(transformOrder)
}

/**
 * Récupère une commande par ID
 */
export async function getOrderById(id: string): Promise<Order | undefined> {
  const order = await orderRepository.findById(id)
  return order ? transformOrder(order) : undefined
}

/**
 * Récupère une commande par numéro
 */
export async function getOrderByNumber(orderNumber: string): Promise<Order | undefined> {
  const order = await orderRepository.findByOrderNumber(orderNumber)
  return order ? transformOrder(order) : undefined
}

/**
 * Récupère les commandes d'un client
 */
export async function getOrdersByCustomer(customerId: string): Promise<Order[]> {
  const orders = await orderRepository.findByCustomer(customerId)
  return orders.map(transformOrder)
}

/**
 * Crée une nouvelle commande avec ses items
 */
export async function createOrder(data: {
  customerId: string
  shippingAddress: {
    label: string
    street: string
    city: string
    zipCode: string
    country: string
    isDefault: boolean
  }
  billingAddress: {
    label: string
    street: string
    city: string
    zipCode: string
    country: string
    isDefault: boolean
  }
  items: Array<{
    productId: string
    name: string
    price: number
    quantity: number
    color?: string
    size?: string
    image: string
  }>
  subtotal: number
  shipping: number
  discount: number
  tax: number
  total: number
  paymentMethod: string
  promoCodeId?: string
  notes?: string
}): Promise<Order> {
  // Générer le numéro de commande
  const orderNumber = await orderRepository.generateOrderNumber()

  // Créer les adresses
  const shippingAddress = await prisma.address.create({
    data: {
      customerId: data.customerId,
      label: data.shippingAddress.label,
      street: data.shippingAddress.street,
      city: data.shippingAddress.city,
      zipCode: data.shippingAddress.zipCode,
      country: data.shippingAddress.country,
      isDefault: data.shippingAddress.isDefault,
    },
  })

  const billingAddress = await prisma.address.create({
    data: {
      customerId: data.customerId,
      label: data.billingAddress.label,
      street: data.billingAddress.street,
      city: data.billingAddress.city,
      zipCode: data.billingAddress.zipCode,
      country: data.billingAddress.country,
      isDefault: data.billingAddress.isDefault,
    },
  })

  // Créer la commande avec ses items
  const order = await orderRepository.createWithItems({
    order: {
      orderNumber,
      customer: { connect: { id: data.customerId } },
      subtotal: data.subtotal,
      shipping: data.shipping,
      discount: data.discount,
      tax: data.tax,
      total: data.total,
      status: "pending",
      paymentMethod: data.paymentMethod,
      shippingAddress: { connect: { id: shippingAddress.id } },
      billingAddress: { connect: { id: billingAddress.id } },
      promoCode: data.promoCodeId ? { connect: { id: data.promoCodeId } } : undefined,
      notes: data.notes,
    },
    items: data.items,
  })

  // Décrémenter le stock des produits
  const { productRepository } = await import("@/lib/repositories")
  for (const item of data.items) {
    const product = await productRepository.findById(item.productId)
    if (product && product.stock >= item.quantity) {
      await productRepository.update(item.productId, {
        stock: { decrement: item.quantity },
      })
    } else {
      throw new Error(`Stock insuffisant pour le produit ${item.name}`)
    }
  }

  // Mettre à jour les stats du client et récupérer son nom pour les logs
  const { customerRepository } = await import("@/lib/repositories")
  await customerRepository.updateStats(data.customerId)
  const customer = await customerRepository.findById(data.customerId)
  const customerName =
    customer ? `${customer.firstName} ${customer.lastName}`.trim() || customer.email : undefined

  // Logger l'action
  const { logActions } = await import("@/lib/utils/logger-service")
  await logActions.orderCreated(
    order.id,
    order.orderNumber,
    data.customerId,
    customerName,
    data.total
  )

  return transformOrder(order)
}
