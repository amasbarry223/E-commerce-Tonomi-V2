/**
 * Service clients.
 * À terme : appels API. Pour l'instant : accès via lib/data.
 * Les clients inscrits côté boutique sont gérés par customer-auth-store (getCustomerById du store fusionne inscrits + données statiques).
 */

import { customers } from "@/lib/data"
import type { Customer } from "@/lib/types"

export function getCustomers(): Customer[] {
  return customers
}

export function getCustomerById(id: string): Customer | undefined {
  return customers.find(c => c.id === id)
}
