"use client"

import { getOrders, getProducts } from "@/lib/services"
import { getStatusLabel } from "@/lib/formatters"
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

const monthlySales = [
  { month: "Sep", revenue: 1250, orders: 8 },
  { month: "Oct", revenue: 2890, orders: 15 },
  { month: "Nov", revenue: 3420, orders: 22 },
  { month: "Dec", revenue: 4100, orders: 28 },
  { month: "Jan", revenue: 3650, orders: 24 },
  { month: "Fev", revenue: 2980, orders: 19 },
]

const COLORS = ["#C19A6B", "#1a1a1a", "#808080", "#8B4513", "#556B2F", "#722F37"]
const categoryData = [
  { name: "Sacs à main", value: 35 },
  { name: "Sacs à dos", value: 20 },
  { name: "Portefeuilles", value: 18 },
  { name: "Accessoires", value: 27 },
]

export function AdminDashboardCharts() {
  const orders = getOrders()
  const products = getProducts()
  const topProducts = [...products]
    .sort((a, b) => b.reviewCount - a.reviewCount)
    .slice(0, 5)
    .map(p => ({
      name: p.name.length > 20 ? p.name.slice(0, 20) + "..." : p.name,
      sales: p.reviewCount * 3,
      revenue: p.price * p.reviewCount,
    }))
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
          <CardDescription>Revenus mensuels — données démo</CardDescription>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Produits les plus notés</CardTitle>
          <CardDescription>Classement par nombre d&apos;avis (données démo)</CardDescription>
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

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Répartition par catégorie</CardTitle>
          <CardDescription>Pourcentage des ventes (données démo)</CardDescription>
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
  )
}
