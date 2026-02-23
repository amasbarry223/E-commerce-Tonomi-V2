/**
 * Service commandes.
 * À terme : appels API (getOrders, getOrderById, createOrder, etc.).
 * Pour l'instant : réexporte les données depuis lib/data pour centraliser l'accès.
 */

import { orders } from "@/lib/data"
import type { Order } from "@/lib/types"

export function getOrders(): Order[] {
  return orders
}

export function getOrderById(id: string): Order | undefined {
  return orders.find((o) => o.id === id)
}
