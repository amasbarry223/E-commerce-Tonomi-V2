/**
 * Repository pour les commandes
 */

import { prisma } from "@/lib/db/prisma"
import { BaseRepository } from "./base-repository"
import type { Order, Prisma } from "@prisma/client"

type OrderWithRelations = Prisma.OrderGetPayload<{
  include: {
    customer: true
    items: { include: { product: true } }
    shippingAddress: true
    billingAddress: true
    promoCode: true
  }
}>

export class OrderRepository extends BaseRepository<
  OrderWithRelations,
  Prisma.OrderCreateInput,
  Prisma.OrderUpdateInput
> {
  protected model = prisma.order

  /**
   * Récupère toutes les commandes avec leurs relations
   */
  async findAll(options?: {
    where?: Prisma.OrderWhereInput
    skip?: number
    take?: number
    orderBy?: Prisma.OrderOrderByWithRelationInput
  }): Promise<OrderWithRelations[]> {
    return prisma.order.findMany({
      include: {
        customer: true,
        items: { include: { product: true } },
        shippingAddress: true,
        billingAddress: true,
        promoCode: true,
      },
      ...options,
    })
  }

  /**
   * Récupère une commande par ID avec ses relations
   */
  async findById(id: string): Promise<OrderWithRelations | null> {
    return prisma.order.findUnique({
      where: { id },
      include: {
        customer: true,
        items: { include: { product: true } },
        shippingAddress: true,
        billingAddress: true,
        promoCode: true,
      },
    })
  }

  /**
   * Récupère une commande par numéro de commande
   */
  async findByOrderNumber(orderNumber: string): Promise<OrderWithRelations | null> {
    return prisma.order.findUnique({
      where: { orderNumber },
      include: {
        customer: true,
        items: { include: { product: true } },
        shippingAddress: true,
        billingAddress: true,
        promoCode: true,
      },
    })
  }

  /**
   * Récupère les commandes d'un client
   */
  async findByCustomer(customerId: string): Promise<OrderWithRelations[]> {
    return this.findAll({
      where: { customerId },
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Crée une commande avec ses items
   */
  async createWithItems(data: {
    order: Prisma.OrderCreateInput
    items: Array<{
      productId: string
      name: string
      price: number
      quantity: number
      color?: string
      size?: string
      image: string
    }>
  }): Promise<OrderWithRelations> {
    return prisma.order.create({
      data: {
        ...data.order,
        items: {
          create: data.items,
        },
      },
      include: {
        customer: true,
        items: { include: { product: true } },
        shippingAddress: true,
        billingAddress: true,
        promoCode: true,
      },
    })
  }

  /**
   * Génère un numéro de commande unique
   */
  async generateOrderNumber(): Promise<string> {
    const year = new Date().getFullYear()
    const count = await prisma.order.count({
      where: {
        orderNumber: { startsWith: `CMD-${year}-` },
      },
    })
    const sequence = String(count + 1).padStart(4, "0")
    return `CMD-${year}-${sequence}`
  }

  /**
   * Met à jour le statut d'une commande
   */
  async updateStatus(id: string, status: string, trackingNumber?: string): Promise<Order> {
    return prisma.order.update({
      where: { id },
      data: {
        status,
        trackingNumber,
        updatedAt: new Date(),
      },
    })
  }
}

export const orderRepository = new OrderRepository()
