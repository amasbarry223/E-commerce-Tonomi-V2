/**
 * Utilitaires pour calculer les données des graphiques à partir des données réelles
 */

import type { Order } from "@/lib/types"
import type { Product } from "@/lib/types"
import type { Category } from "@/lib/types"

/**
 * Calcule les ventes mensuelles à partir des commandes
 */
export function calculateMonthlySales(orders: Order[]): Array<{ month: string; revenue: number; orders: number }> {
  const now = new Date()
  const months: Array<{ month: string; revenue: number; orders: number }> = []
  const monthNames = ["Jan", "Fev", "Mar", "Avr", "Mai", "Jun", "Jul", "Aou", "Sep", "Oct", "Nov", "Dec"]

  // Calculer les 6 derniers mois
  for (let i = 5; i >= 0; i--) {
    const date = new Date(now.getFullYear(), now.getMonth() - i, 1)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`
    const monthName = monthNames[date.getMonth()]

    const monthOrders = orders.filter(order => {
      const orderDate = new Date(order.createdAt)
      const orderMonth = `${orderDate.getFullYear()}-${String(orderDate.getMonth() + 1).padStart(2, "0")}`
      return orderMonth === monthKey && order.status !== "cancelled"
    })

    const revenue = monthOrders.reduce((sum, order) => sum + order.total, 0)
    months.push({
      month: monthName,
      revenue: Math.round(revenue),
      orders: monthOrders.length,
    })
  }

  return months
}

/**
 * Calcule la répartition par catégorie à partir des produits et commandes
 */
export function calculateCategoryDistribution(
  categories: Category[],
  products: Product[],
  orders: Order[]
): Array<{ name: string; value: number }> {
  // Compter les ventes par catégorie
  const categorySales: Record<string, number> = {}
  let totalSales = 0

  orders
    .filter(order => order.status !== "cancelled")
    .forEach(order => {
      order.items.forEach(item => {
        const product = products.find(p => p.id === item.productId)
        if (product && product.category) {
          categorySales[product.category] = (categorySales[product.category] || 0) + item.quantity
          totalSales += item.quantity
        }
      })
    })

  // Convertir en pourcentages
  const distribution = categories
    .map(category => {
      const sales = categorySales[category.id] || 0
      const percentage = totalSales > 0 ? Math.round((sales / totalSales) * 100) : 0
      return {
        name: category.name,
        value: percentage,
      }
    })
    .filter(item => item.value > 0)
    .sort((a, b) => b.value - a.value)

  return distribution
}

/**
 * Calcule les produits les plus vendus
 */
export function calculateTopProducts(products: Product[], orders: Order[], limit: number = 5): Array<{ name: string; sales: number; revenue: number }> {
  const productSales: Record<string, { sales: number; revenue: number }> = {}

  orders
    .filter(order => order.status !== "cancelled")
    .forEach(order => {
      order.items.forEach(item => {
        if (!productSales[item.productId]) {
          productSales[item.productId] = { sales: 0, revenue: 0 }
        }
        productSales[item.productId].sales += item.quantity
        productSales[item.productId].revenue += item.price * item.quantity
      })
    })

  return Object.entries(productSales)
    .map(([productId, data]) => {
      const product = products.find(p => p.id === productId)
      return {
        name: product ? (product.name.length > 20 ? product.name.slice(0, 20) + "..." : product.name) : "Produit inconnu",
        sales: data.sales,
        revenue: Math.round(data.revenue),
      }
    })
    .sort((a, b) => b.sales - a.sales)
    .slice(0, limit)
}
