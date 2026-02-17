"use client"

import { orders, products, customers, reviews, formatPrice } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts"
import {
  DollarSign, ShoppingCart, Users, TrendingUp,
  Package, AlertTriangle, Star, Clock,
} from "lucide-react"

// Computed KPIs
const totalRevenue = orders.filter(o => o.status !== "cancelled").reduce((s, o) => s + o.total, 0)
const pendingOrders = orders.filter(o => o.status === "pending").length
const totalCustomers = customers.length
const averageOrder = totalRevenue / orders.filter(o => o.status !== "cancelled").length
const lowStockProducts = products.filter(p => p.stock <= 10)
const pendingReviews = reviews.filter(r => r.status === "pending")

// Monthly sales data
const monthlySales = [
  { month: "Sep", revenue: 1250, orders: 8 },
  { month: "Oct", revenue: 2890, orders: 15 },
  { month: "Nov", revenue: 3420, orders: 22 },
  { month: "Dec", revenue: 4100, orders: 28 },
  { month: "Jan", revenue: 3650, orders: 24 },
  { month: "Fev", revenue: 2980, orders: 19 },
]

// Top products
const topProducts = [...products]
  .sort((a, b) => b.reviewCount - a.reviewCount)
  .slice(0, 5)
  .map(p => ({ name: p.name.length > 20 ? p.name.slice(0, 20) + "..." : p.name, sales: p.reviewCount * 3, revenue: p.price * p.reviewCount }))

// Category distribution
const COLORS = ["#C19A6B", "#1a1a1a", "#808080", "#8B4513", "#556B2F", "#722F37"]
const categoryData = [
  { name: "Sacs a main", value: 35 },
  { name: "Sacs a dos", value: 20 },
  { name: "Portefeuilles", value: 18 },
  { name: "Accessoires", value: 27 },
]

// Order status distribution
const orderStatusData = [
  { status: "En attente", count: orders.filter(o => o.status === "pending").length },
  { status: "Confirmees", count: orders.filter(o => o.status === "confirmed").length },
  { status: "Expediees", count: orders.filter(o => o.status === "shipped").length },
  { status: "Livrees", count: orders.filter(o => o.status === "delivered").length },
  { status: "Annulees", count: orders.filter(o => o.status === "cancelled").length },
]

export function AdminDashboard() {
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
                  <TrendingUp className="h-3 w-3" /> +12.5% vs mois dernier
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
                  <TrendingUp className="h-3 w-3" /> +2 ce mois
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
                  <TrendingUp className="h-3 w-3" /> +5.2%
                </p>
              </div>
              <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <Package className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Evolution des ventes</CardTitle>
            <CardDescription>Revenus mensuels (6 derniers mois)</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenus", color: "#C19A6B" },
                orders: { label: "Commandes", color: "#1a1a1a" },
              }}
              className="h-[280px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlySales} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" className="text-xs" tick={{ fontSize: 12 }} />
                  <YAxis className="text-xs" tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="revenue" stroke="#C19A6B" strokeWidth={2} dot={{ r: 4 }} name="Revenus" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Produits les plus vendus</CardTitle>
            <CardDescription>Par nombre de ventes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                sales: { label: "Ventes", color: "#C19A6B" },
              }}
              className="h-[280px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={topProducts} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" width={110} tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="sales" fill="#C19A6B" radius={[0, 4, 4, 0]} name="Ventes" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Repartition par categorie</CardTitle>
            <CardDescription>Pourcentage des ventes</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                value: { label: "Pourcentage" },
              }}
              className="h-[280px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={100} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                    {categoryData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Order Status */}
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Statut des commandes</CardTitle>
            <CardDescription>Repartition actuelle</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                count: { label: "Commandes", color: "#C19A6B" },
              }}
              className="h-[280px]"
            >
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={orderStatusData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="status" tick={{ fontSize: 11 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="count" fill="#C19A6B" radius={[4, 4, 0, 0]} name="Commandes" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

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
                      <img src={p.images[0]} alt={p.name} className="h-8 w-8 rounded object-cover" crossOrigin="anonymous" />
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
              Commandes recentes
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
                          <Badge className={`${
                            order.status === "delivered" ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400" :
                            order.status === "shipped" ? "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400" :
                            order.status === "pending" ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400" :
                            order.status === "confirmed" ? "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400" :
                            "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400"
                          } text-xs`}>
                            {order.status === "pending" ? "En attente" : order.status === "confirmed" ? "Confirmee" : order.status === "shipped" ? "Expediee" : order.status === "delivered" ? "Livree" : "Annulee"}
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
