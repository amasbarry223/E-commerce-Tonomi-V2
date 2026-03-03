/**
 * Service clients
 */

import { customerRepository } from "@/lib/repositories"
import type { Customer } from "@/lib/types"

export type CustomerWithRelations = Awaited<ReturnType<typeof customerRepository.findAll>>[0]

function transformCustomer(prismaCustomer: CustomerWithRelations): Customer {
  return {
    id: prismaCustomer.id,
    firstName: prismaCustomer.firstName,
    lastName: prismaCustomer.lastName,
    email: prismaCustomer.email,
    phone: prismaCustomer.phone || "",
    avatar: prismaCustomer.avatar || "",
    segment: prismaCustomer.segment as Customer["segment"],
    totalSpent: Number(prismaCustomer.totalSpent),
    orderCount: prismaCustomer.orderCount,
    createdAt: prismaCustomer.createdAt.toISOString(),
    addresses: prismaCustomer.addresses.map((addr) => ({
      id: addr.id,
      label: addr.label,
      street: addr.street,
      city: addr.city,
      zipCode: addr.zipCode,
      country: addr.country,
      isDefault: addr.isDefault,
    })),
  }
}

/**
 * Récupère tous les clients
 */
export async function getCustomers(options?: { skip?: number; take?: number }): Promise<Customer[]> {
  const customers = await customerRepository.findAll({
    orderBy: { createdAt: "desc" },
    ...options,
  })
  return customers.map(transformCustomer)
}

/**
 * Récupère un client par ID
 */
export async function getCustomerById(id: string): Promise<Customer | undefined> {
  const customer = await customerRepository.findById(id)
  return customer ? transformCustomer(customer) : undefined
}

/**
 * Récupère un client par email
 */
export async function getCustomerByEmail(email: string): Promise<Customer | undefined> {
  const customer = await customerRepository.findByEmail(email)
  return customer ? transformCustomer(customer) : undefined
}
