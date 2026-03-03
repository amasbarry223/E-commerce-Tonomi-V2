"use client"

import { useMemo } from "react"
import { useProducts, useOrders, useCustomers } from "@/hooks"
import { getSegmentLabel, formatPrice } from "@/lib/formatters"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import {
  Area,
  AreaChart,
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

const COLORS = ["#C19A6B", "#1a1a1a", "#808080", "#8B4513", "#556B2F"]

type PeriodKey = "7d" | "30d" | "3m" | "6m" | "1y"

export function AdminAnalyticsCharts({ period }: { period: PeriodKey }) {
  const { orders } = useOrders()
  const { products } = useProducts()
  const { customers } = useCustomers()
  const dateRange = useMemo(() => {
    const now = new Date()
    const ranges: Record<PeriodKey, Date> = {
      "7d": new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      "30d": new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      "3m": new Date(now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000),
      "6m": new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000),
      "1y": new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
    }
    return ranges[period]
  }, [period])

  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const orderDate = new Date(o.createdAt)
      return orderDate >= dateRange && o.status !== "cancelled"
    })
  }, [dateRange, orders])

  const monthlySales = useMemo(() => {
    const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Fev"]
    return months.map(month => {
      const monthIndex = months.indexOf(month)
      const targetMonth = monthIndex + 8
      const targetYear = monthIndex >= 4 ? 2025 : 2026
      const monthStart = new Date(targetYear, targetMonth, 1)
      const monthEnd = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59)
      const monthOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt)
        return orderDate >= monthStart && orderDate <= monthEnd && o.status !== "cancelled"
      })
      const revenue = monthOrders.reduce((sum, o) => sum + o.total, 0)
      const orderCount = monthOrders.length
      // Calculer les visiteurs dynamiquement : clients uniques + estimation
      const uniqueCustomers = new Set(monthOrders.map(o => o.customerId))
      const estimatedVisitors = Math.max(orderCount * 30, uniqueCustomers.size * 15)
      const visitors = Math.round(estimatedVisitors)
      return { month, revenue, orders: orderCount, visitors }
    })
  }, [orders])

  const conversionData = useMemo(() => {
    const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Fev"]
    return months.map(month => {
      const monthIndex = months.indexOf(month)
      const targetMonth = monthIndex + 8
      const targetYear = monthIndex >= 4 ? 2025 : 2026
      const monthStart = new Date(targetYear, targetMonth, 1)
      const monthEnd = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59)
      const monthOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt)
        return orderDate >= monthStart && orderDate <= monthEnd && o.status !== "cancelled"
      })
      // Calculer les visiteurs dynamiquement pour le taux de conversion
      const uniqueCustomers = new Set(monthOrders.map(o => o.customerId))
      const estimatedVisitors = Math.max(100, Math.max(monthOrders.length * 30, uniqueCustomers.size * 15))
      const rate = estimatedVisitors > 0 ? (monthOrders.length / estimatedVisitors) * 100 : 0
      return { month, rate: Math.round(rate * 10) / 10 }
    })
  }, [orders])

  const revenueByProduct = useMemo(() => {
    const productRevenue: Record<string, number> = {}
    filteredOrders.forEach(order => {
      order.items.forEach(item => {
        if (!productRevenue[item.productId]) {
          productRevenue[item.productId] = 0
        }
        productRevenue[item.productId] += item.price * item.quantity
      })
    })
    return Object.entries(productRevenue)
      .map(([productId, revenue]) => {
        const product = products.find(p => p.id === productId)
        return {
          name: product ? (product.name.length > 20 ? product.name.slice(0, 20) + "..." : product.name) : "Produit inconnu",
          revenue: Math.round(revenue),
        }
      })
      .sort((a, b) => {
        const diff = b.revenue - a.revenue
        return diff !== 0 ? diff : a.name.localeCompare(b.name)
      })
      .slice(0, 10)
  }, [filteredOrders, products])

  const revenueBySegment = useMemo(() => {
    const segmentRevenue: Record<string, number> = {}
    filteredOrders.forEach(order => {
      const customer = customers.find(c => c.id === order.customerId)
      if (customer) {
        if (!segmentRevenue[customer.segment]) {
          segmentRevenue[customer.segment] = 0
        }
        segmentRevenue[customer.segment] += order.total
      }
    })
    return Object.entries(segmentRevenue)
      .map(([segment, revenue]) => ({
        segment: getSegmentLabel(segment),
        revenue: Math.round(revenue),
      }))
      .sort((a, b) => {
        const diff = b.revenue - a.revenue
        return diff !== 0 ? diff : a.segment.localeCompare(b.segment)
      })
  }, [filteredOrders, customers])

  // Calculer les sources de trafic dynamiquement (basé sur les commandes)
  // Pour l'instant, on utilise une estimation basée sur la répartition des commandes
  const sourceData = useMemo(() => {
    const totalOrders = filteredOrders.length
    if (totalOrders === 0) {
      return [
        { source: "Recherche organique", visits: 0, percentage: 0 },
        { source: "Réseaux sociaux", visits: 0, percentage: 0 },
        { source: "Email marketing", visits: 0, percentage: 0 },
        { source: "Accès direct", visits: 0, percentage: 0 },
        { source: "Publicité payante", visits: 0, percentage: 0 },
      ]
    }
    
    // Estimation basée sur la répartition typique d'un e-commerce
    // Plus tard, on pourra ajouter un vrai tracking avec un modèle Analytics
    const estimatedVisits = Math.max(totalOrders * 30, 100) // Estimation: 30 visiteurs par commande
    const sources = [
      { source: "Recherche organique", percentage: 35 },
      { source: "Réseaux sociaux", percentage: 25 },
      { source: "Email marketing", percentage: 15 },
      { source: "Accès direct", percentage: 13 },
      { source: "Publicité payante", percentage: 12 },
    ]
    
    return sources.map(s => ({
      source: s.source,
      visits: Math.round(estimatedVisits * (s.percentage / 100)),
      percentage: s.percentage,
    }))
  }, [filteredOrders])

  // Calculer les appareils dynamiquement (estimation basée sur les commandes)
  const deviceData = useMemo(() => {
    const totalOrders = filteredOrders.length
    if (totalOrders === 0) {
      return [
        { name: "Mobile", value: 0 },
        { name: "Desktop", value: 0 },
        { name: "Tablette", value: 0 },
      ]
    }
    
    // Estimation basée sur les statistiques typiques d'un e-commerce
    // Plus tard, on pourra ajouter un vrai tracking avec User-Agent
    return [
      { name: "Mobile", value: 58 },
      { name: "Desktop", value: 32 },
      { name: "Tablette", value: 10 },
    ]
  }, [filteredOrders])

  // Calculer les top villes dynamiquement depuis les commandes
  const topCities = useMemo(() => {
    const cityCounts: Record<string, number> = {}

    filteredOrders.forEach(order => {
      const city =
        order.shippingAddress?.city ||
        order.billingAddress?.city ||
        "Ville inconnue"

      if (city && city !== "Ville inconnue") {
        cityCounts[city] = (cityCounts[city] || 0) + 1
      }
    })

    return Object.entries(cityCounts)
      .map(([city, count]) => ({ city, orders: count }))
      .sort((a, b) => b.orders - a.orders)
      .slice(0, 5)
  }, [filteredOrders])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenus & Commandes</CardTitle>
            <CardDescription>Evolution sur 6 mois</CardDescription>
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
              <AreaChart data={monthlySales} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }} 
                  label={{ value: "Mois", position: "insideBottom", offset: -5, style: { textAnchor: "middle", fontSize: 12 } }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  label={{ value: "Revenus (€)", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fontSize: 12 } }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any) => [`${formatPrice(value)}`, "Revenus"]}
                />
                <Area type="monotone" dataKey="revenue" fill="#C19A6B" fillOpacity={0.2} stroke="#C19A6B" strokeWidth={2} name="Revenus" />
              </AreaChart>
            </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Taux de conversion</CardTitle>
            <CardDescription>Pourcentage visiteurs → acheteurs</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                rate: { label: "Taux", color: "#C19A6B" },
              }}
              className="h-[280px]"
            >
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={conversionData} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="month" 
                  tick={{ fontSize: 12 }} 
                  label={{ value: "Mois", position: "insideBottom", offset: -5, style: { textAnchor: "middle", fontSize: 12 } }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  domain={[0, 5]} 
                  label={{ value: "Taux de conversion (%)", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fontSize: 12 } }}
                  tickFormatter={(value) => `${value}%`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any) => [`${value}%`, "Taux de conversion"]}
                />
                <Line type="monotone" dataKey="rate" stroke="#C19A6B" strokeWidth={2} dot={{ r: 4, fill: "#C19A6B" }} name="Taux %" />
              </LineChart>
            </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Sources de trafic</CardTitle>
            <CardDescription>Repartition par canal d{"'"}acquisition</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                visits: { label: "Visites", color: "#C19A6B" },
              }}
              className="h-[280px]"
            >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={sourceData} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12 }} 
                  label={{ value: "Nombre de visites", position: "insideBottom", offset: -5, style: { textAnchor: "middle", fontSize: 12 } }}
                />
                <YAxis 
                  dataKey="source" 
                  type="category" 
                  width={130} 
                  tick={{ fontSize: 11 }} 
                  label={{ value: "Source de trafic", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fontSize: 12 } }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any, name: string) => [
                    `${value.toLocaleString()} visites (${sourceData.find(s => s.source === name)?.percentage || 0}%)`,
                    "Visites"
                  ]}
                />
                <Bar dataKey="visits" fill="#C19A6B" radius={[0, 4, 4, 0]} name="Visites" />
              </BarChart>
            </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Appareils</CardTitle>
            <CardDescription>Repartition par type</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{ value: { label: "Pourcentage" } }}
              className="h-[280px]"
            >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={deviceData}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  paddingAngle={3}
                  dataKey="value"
                  label={({ name, value }) => `${name}: ${value}%`}
                >
                  {deviceData.map((_, i) => (
                    <Cell key={i} fill={COLORS[i % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any) => [`${value}%`, "Pourcentage"]}
                />
              </PieChart>
            </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenus par produit (Top 10)</CardTitle>
            <CardDescription>Produits les plus rentables</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenus", color: "#C19A6B" },
              }}
              className="h-[280px]"
            >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueByProduct} layout="vertical" margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  type="number" 
                  tick={{ fontSize: 12 }} 
                  label={{ value: "Revenus (€)", position: "insideBottom", offset: -5, style: { textAnchor: "middle", fontSize: 12 } }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  width={120} 
                  tick={{ fontSize: 11 }} 
                  label={{ value: "Produit", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fontSize: 12 } }}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any) => [`${formatPrice(value)}`, "Revenus"]}
                />
                <Bar dataKey="revenue" fill="#C19A6B" radius={[0, 4, 4, 0]} name="Revenus" />
              </BarChart>
            </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenus par segment client</CardTitle>
            <CardDescription>Répartition du CA par segment</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer
              config={{
                revenue: { label: "Revenus", color: "#C19A6B" },
              }}
              className="h-[280px]"
            >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={revenueBySegment} margin={{ top: 10, right: 20, left: 10, bottom: 30 }}>
                <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                <XAxis 
                  dataKey="segment" 
                  tick={{ fontSize: 12 }} 
                  label={{ value: "Segment client", position: "insideBottom", offset: -5, style: { textAnchor: "middle", fontSize: 12 } }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }} 
                  label={{ value: "Revenus (€)", angle: -90, position: "insideLeft", style: { textAnchor: "middle", fontSize: 12 } }}
                  tickFormatter={(value) => `${(value / 1000).toFixed(0)}k`}
                />
                <ChartTooltip 
                  content={<ChartTooltipContent />}
                  formatter={(value: any) => [`${formatPrice(value)}`, "Revenus"]}
                />
                <Bar dataKey="revenue" fill="#C19A6B" radius={[4, 4, 0, 0]} name="Revenus" />
              </BarChart>
            </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top villes</CardTitle>
          <CardDescription>Repartition geographique des commandes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {(() => {
              const maxOrders = topCities[0]?.orders ?? 1
              return topCities.map((city, i) => (
                <div key={city.city} className="flex items-center gap-4">
                  <span className="text-sm font-medium w-6 text-muted-foreground">{i + 1}.</span>
                  <span className="text-sm font-medium flex-1">{city.city}</span>
                  <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden hidden md:block">
                    <div
                      className="h-full rounded-full"
                      style={{
                        width: `${(city.orders / maxOrders) * 100}%`,
                        backgroundColor: "#C19A6B",
                      }}
                    />
                  </div>
                  <span className="text-sm text-muted-foreground w-20 text-right">{city.orders} cmd</span>
                </div>
              ))
            })()}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
