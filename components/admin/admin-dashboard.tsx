"use client"

import dynamic from "next/dynamic"
import Image from "next/image"
import { getOrders, getProducts, getCustomers } from "@/lib/services"
import { formatPrice, getStatusColor, getStatusLabel } from "@/lib/formatters"
import { useReviewsStore } from "@/lib/stores/reviews-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  DollarSign, ShoppingCart, Users, TrendingUp,
  Package, AlertTriangle, Star, Clock,
} from "lucide-react"
import { AdminChartsSkeleton } from "./admin-charts-skeleton"

const LazyDashboardCharts = dynamic(
  () => import("./admin-dashboard-charts").then((m) => ({ default: m.AdminDashboardCharts })),
  { loading: () => <AdminChartsSkeleton /> }
)

export function AdminDashboard() {
  const orders = getOrders()
  const products = getProducts()
  const customers = getCustomers()
  const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0)
  const pendingOrders = orders.filter(o => o.status === "pending").length
  const totalCustomers = customers.length
  const averageOrder = orders.filter(o => o.status !== "cancelled").length > 0
    ? totalRevenue / orders.filter(o => o.status !== "cancelled").length
    : 0
  const lowStockProducts = products.filter(p => p.stock <= 10)
  const reviews = useReviewsStore((s) => s.reviews)
  const pendingReviews = reviews.filter((r) => r.status === "pending")

  return (
    <div className="flex flex-col gap-6">
      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Revenus totaux</p>
                <p className="text-2xl font-bold mt-1">{formatPrice(totalRevenue)}</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Données démo
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Commandes</p>
                <p className="text-2xl font-bold mt-1">{orders.length}</p>
                <p className="text-xs text-amber-600 mt-1">{pendingOrders} en attente</p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Clients</p>
                <p className="text-2xl font-bold mt-1">{totalCustomers}</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Données démo
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Panier moyen</p>
                <p className="text-2xl font-bold mt-1">{formatPrice(averageOrder)}</p>
                <p className="text-xs text-emerald-600 mt-1 flex items-center gap-1">
                  <TrendingUp className="h-3 w-3" /> Données démo
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Package className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts - lazy loaded (Recharts) */}
      <LazyDashboardCharts />

      {/* Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Low Stock */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              Stock faible
            </CardTitle>
          </CardHeader>
          <CardContent>
            {lowStockProducts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tous les stocks sont OK</p>
            ) : (
              <div className="flex flex-col gap-3">
                {lowStockProducts.map(p => (
                  <div key={p.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Image src={p.images[0] ?? "/placeholder.svg"} alt={p.name} width={32} height={32} className="h-8 w-8 rounded object-cover" />
                      <span className="text-sm truncate max-w-[200px]">{p.name}</span>
                    </div>
                    <Badge variant="destructive" className="text-xs">{p.stock} restant{p.stock > 1 ? "s" : ""}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pending Reviews */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Star className="h-4 w-4 text-amber-500" />
              Avis en attente ({pendingReviews.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {pendingReviews.length === 0 ? (
              <p className="text-sm text-muted-foreground">Aucun avis en attente</p>
            ) : (
              <div className="flex flex-col gap-3">
                {pendingReviews.map(r => {
                  const product = products.find(p => p.id === r.productId)
                  return (
                    <div key={r.id} className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium">{r.customerName}</p>
                        <p className="text-xs text-muted-foreground">{product?.name}</p>
                      </div>
                      <div className="flex items-center gap-1">
                        {Array.from({ length: r.rating }).map((_, i) => (
                          <Star key={i} className="h-3 w-3 fill-amber-400 text-amber-400" />
                        ))}
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Orders */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Commandes récentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-2 font-medium text-muted-foreground">Commande</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Client</th>
                    <th className="text-left py-2 font-medium text-muted-foreground">Statut</th>
                    <th className="text-right py-2 font-medium text-muted-foreground">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.slice(0, 5).map(order => {
                    const customer = customers.find(c => c.id === order.customerId)
                    return (
                      <tr key={order.id} className="border-b border-border last:border-0">
                        <td className="py-3 font-mono text-xs">{order.orderNumber}</td>
                        <td className="py-3">{customer?.firstName} {customer?.lastName}</td>
                        <td className="py-3">
                          <Badge className={`${getStatusColor(order.status)} text-xs`}>
                            {getStatusLabel(order.status)}
                          </Badge>
                        </td>
                        <td className="py-3 text-right font-medium">{formatPrice(order.total)}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
