/**
 * Repository pour les clients
 */

import { prisma } from "@/lib/db/prisma"
import { BaseRepository } from "./base-repository"
import type { Customer, Prisma } from "@prisma/client"

type CustomerWithRelations = Prisma.CustomerGetPayload<{
  include: {
    addresses: true
    _count: { select: { orders: true; reviews: true } }
  }
}>

export class CustomerRepository extends BaseRepository<
  CustomerWithRelations,
  Prisma.CustomerCreateInput,
  Prisma.CustomerUpdateInput
> {
  protected model = prisma.customer

  /**
   * Récupère tous les clients avec leurs relations
   */
  async findAll(options?: {
    where?: Prisma.CustomerWhereInput
    skip?: number
    take?: number
    orderBy?: Prisma.CustomerOrderByWithRelationInput
  }): Promise<CustomerWithRelations[]> {
    return prisma.customer.findMany({
      include: {
        addresses: true,
        _count: { select: { orders: true, reviews: true } },
      },
      ...options,
    })
  }

  /**
   * Récupère un client par ID avec ses relations
   */
  async findById(id: string): Promise<CustomerWithRelations | null> {
    return prisma.customer.findUnique({
      where: { id },
      include: {
        addresses: true,
        _count: { select: { orders: true, reviews: true } },
      },
    })
  }

  /**
   * Récupère un client par email
   */
  async findByEmail(email: string): Promise<CustomerWithRelations | null> {
    return prisma.customer.findUnique({
      where: { email },
      include: {
        addresses: true,
        _count: { select: { orders: true, reviews: true } },
      },
    })
  }

  /**
   * Met à jour le total dépensé et le nombre de commandes
   */
  async updateStats(customerId: string): Promise<void> {
    const orders = await prisma.order.findMany({
      where: { customerId },
      select: { total: true },
    })

    const totalSpent = orders.reduce((sum, order) => sum + Number(order.total), 0)
    const orderCount = orders.length

    await prisma.customer.update({
      where: { id: customerId },
      data: { totalSpent, orderCount },
    })
  }
}

export const customerRepository = new CustomerRepository()
