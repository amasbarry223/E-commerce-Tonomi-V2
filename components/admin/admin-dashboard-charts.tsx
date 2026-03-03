"use client"

import { useProducts, useOrders, useCategories } from "@/hooks"
import { getStatusLabel } from "@/lib/formatters"
import { calculateMonthlySales, calculateCategoryDistribution, calculateTopProducts } from "@/lib/utils/chart-data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Bar,
  BarChart,
  Line,
  LineChart,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts"

const COLORS = ["#C19A6B", "#1a1a1a", "#808080", "#8B4513", "#556B2F", "#722F37"]

export function AdminDashboardCharts() {
  const { orders } = useOrders()
  const { products } = useProducts()
  const { categories } = useCategories()

  // Calculer les données dynamiques
  const monthlySales = calculateMonthlySales(orders)
  const categoryData = calculateCategoryDistribution(categories, products, orders)
  const topProducts = calculateTopProducts(products, orders, 5)
  const orderStatusData = [
    { status: getStatusLabel("pending"), count: orders.filter((o) => o.status === "pending").length },
    { status: getStatusLabel("confirmed"), count: orders.filter((o) => o.status === "confirmed").length },
    { status: getStatusLabel("shipped"), count: orders.filter((o) => o.status === "shipped").length },
    { status: getStatusLabel("delivered"), count: orders.filter((o) => o.status === "delivered").length },
    { status: getStatusLabel("cancelled"), count: orders.filter((o) => o.status === "cancelled").length },
  ]

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Evolution des ventes</CardTitle>
          <CardDescription>Revenus mensuels</CardDescription>
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
              <LineChart data={monthlySales} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="month" 
                  className="text-xs" 
                  tick={{ fontSize: 12 }} 
                  label={{ value: "Mois", position: "insideBottom", offset: -5, style: { textAnchor: "middle", fontSize: 11 } }}
                />
                <YAxis 
                  className="text-xs" 
                  tick={{ fontSize: 12 }} 
                  label={{ value: "Revenus (€)", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fontSize: 11 } }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any) => [`${new Intl.NumberFormat("fr-FR", { style: "currency", currency: "EUR" }).format(value)}`, "Revenus"]}
                />
                <Line type="monotone" dataKey="revenue" stroke="#C19A6B" strokeWidth={2} dot={{ r: 4 }} name="Revenus" />
              </LineChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Produits les plus vendus</CardTitle>
          <CardDescription>Classement par nombre de ventes</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              sales: { label: "Ventes", color: "#C19A6B" },
            }}
            className="h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topProducts} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12 }} 
                  label={{ value: "Nombre de ventes", position: "insideBottom", offset: -5, style: { textAnchor: "middle", fontSize: 11 } }}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={110} 
                  tick={{ fontSize: 11 }} 
                  label={{ value: "Produit", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fontSize: 11 } }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any) => [`${value} ventes`, "Ventes"]}
                />
                <Bar dataKey="sales" fill="#C19A6B" radius={[0, 4, 4, 0]} name="Ventes" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Répartition par catégorie</CardTitle>
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
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Statut des commandes</CardTitle>
          <CardDescription>Répartition actuelle</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              count: { label: "Commandes", color: "#C19A6B" },
            }}
            className="h-[280px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={orderStatusData} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="status" 
                  tick={{ fontSize: 11 }} 
                  label={{ value: "Statut", position: "insideBottom", offset: -5, style: { textAnchor: "middle", fontSize: 11 } }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  label={{ value: "Nombre de commandes", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fontSize: 11 } }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any) => [`${value} commandes`, "Nombre"]}
                />
                <Bar dataKey="count" fill="#C19A6B" radius={[4, 4, 0, 0]} name="Commandes" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  )
}
