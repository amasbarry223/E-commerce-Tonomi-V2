"use client"

import { useState, useMemo } from "react"
import { orders, products, customers, formatPrice } from "@/lib/data"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Area, AreaChart, Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid,
  ResponsiveContainer, PieChart, Pie, Cell,
} from "recharts"
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Eye } from "lucide-react"

const COLORS = ["#C19A6B", "#1a1a1a", "#808080", "#8B4513", "#556B2F"]

const sourceData = [
  { source: "Recherche organique", visits: 420, percentage: 35 },
  { source: "Reseaux sociaux", visits: 300, percentage: 25 },
  { source: "Email marketing", visits: 180, percentage: 15 },
  { source: "Acces direct", visits: 156, percentage: 13 },
  { source: "Publicite payante", visits: 144, percentage: 12 },
]

const deviceData = [
  { name: "Mobile", value: 58 },
  { name: "Desktop", value: 32 },
  { name: "Tablette", value: 10 },
]

const topCities = [
  { city: "Paris", orders: 42 },
  { city: "Lyon", orders: 18 },
  { city: "Marseille", orders: 14 },
  { city: "Bordeaux", orders: 11 },
  { city: "Lille", orders: 9 },
]

export function AdminAnalytics() {
  const [period, setPeriod] = useState<"7d" | "30d" | "3m" | "6m" | "1y">("6m")

  // Calculate date range based on period
  const dateRange = useMemo(() => {
    const now = new Date()
    const ranges = {
      "7d": new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000),
      "30d": new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000),
      "3m": new Date(now.getTime() - 3 * 30 * 24 * 60 * 60 * 1000),
      "6m": new Date(now.getTime() - 6 * 30 * 24 * 60 * 60 * 1000),
      "1y": new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000),
    }
    return ranges[period]
  }, [period])

  // Filter orders by period
  const filteredOrders = useMemo(() => {
    return orders.filter(o => {
      const orderDate = new Date(o.createdAt)
      return orderDate >= dateRange && o.status !== "cancelled"
    })
  }, [dateRange])

  // Monthly sales data
  const monthlySales = useMemo(() => {
    const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Fev"]
    return months.map(month => {
      const monthIndex = months.indexOf(month)
      const targetMonth = monthIndex + 8 // September = 8
      const targetYear = monthIndex >= 4 ? 2025 : 2026 // Jan, Fev are 2026
      const monthStart = new Date(targetYear, targetMonth, 1)
      const monthEnd = new Date(targetYear, targetMonth + 1, 0, 23, 59, 59)
      
      const monthOrders = orders.filter(o => {
        const orderDate = new Date(o.createdAt)
        return orderDate >= monthStart && orderDate <= monthEnd && o.status !== "cancelled"
      })
      
      const revenue = monthOrders.reduce((sum, o) => sum + o.total, 0)
      const orderCount = monthOrders.length
      // Estimate visitors based on conversion rate (simplified)
      const visitors = Math.round(orderCount * 33.33) // ~3% conversion rate
      
      return { month, revenue, orders: orderCount, visitors }
    })
  }, [])

  // Conversion rate data
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
      
      // Estimate visitors and calculate conversion rate
      const estimatedVisitors = Math.max(100, monthOrders.length * 33.33)
      const rate = estimatedVisitors > 0 ? (monthOrders.length / estimatedVisitors) * 100 : 0
      
      return { month, rate: Math.round(rate * 10) / 10 }
    })
  }, [])

  // Performance KPIs
  const totalRevenue = useMemo(() => {
    return filteredOrders.reduce((s, o) => s + o.total, 0)
  }, [filteredOrders])

  const conversionRate = useMemo(() => {
    const estimatedVisitors = Math.max(100, filteredOrders.length * 33.33)
    return estimatedVisitors > 0 ? (filteredOrders.length / estimatedVisitors) * 100 : 0
  }, [filteredOrders])

  const avgOrderValue = useMemo(() => {
    return filteredOrders.length > 0 ? totalRevenue / filteredOrders.length : 0
  }, [filteredOrders, totalRevenue])

  const totalVisitors = useMemo(() => {
    return Math.round(filteredOrders.length * 33.33)
  }, [filteredOrders])

  // Revenue by product (Top 10)
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
          revenue: Math.round(revenue)
        }
      })
      .sort((a, b) => {
        const diff = b.revenue - a.revenue
        return diff !== 0 ? diff : a.name.localeCompare(b.name)
      })
      .slice(0, 10)
  }, [filteredOrders, products])

  // Revenue by customer segment
  const revenueBySegment = useMemo(() => {
    const segmentRevenue: Record<string, number> = {}
    
    filteredOrders.forEach(order => {
      const customer = customers.find(c => c.id === order.customerId)
      if (customer) {
        const segment = customer.segment
        if (!segmentRevenue[segment]) {
          segmentRevenue[segment] = 0
        }
        segmentRevenue[segment] += order.total
      }
    })

    const segmentLabels: Record<string, string> = {
      vip: "VIP",
      new: "Nouveau",
      regular: "Régulier",
      inactive: "Inactif"
    }

    return Object.entries(segmentRevenue)
      .map(([segment, revenue]) => ({
        segment: segmentLabels[segment] || segment,
        revenue: Math.round(revenue)
      }))
      .sort((a, b) => {
        const diff = b.revenue - a.revenue
        return diff !== 0 ? diff : a.segment.localeCompare(b.segment)
      })
  }, [filteredOrders, customers])
  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Analytics</h2>
          <p className="text-sm text-muted-foreground">Vue d{"'"}ensemble des performances</p>
        </div>
        <Select value={period} onValueChange={(value) => setPeriod(value as typeof period)}>
          <SelectTrigger className="w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="7d">7 derniers jours</SelectItem>
            <SelectItem value="30d">30 derniers jours</SelectItem>
            <SelectItem value="3m">3 derniers mois</SelectItem>
            <SelectItem value="6m">6 derniers mois</SelectItem>
            <SelectItem value="1y">1 an</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center">
                <DollarSign className="h-5 w-5 text-emerald-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Revenus</p>
                <p className="text-xl font-bold">{formatPrice(totalRevenue)}</p>
                <p className="text-xs text-emerald-600 flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> +12.5%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                <Eye className="h-5 w-5 text-blue-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Visiteurs</p>
                <p className="text-xl font-bold">{totalVisitors.toLocaleString()}</p>
                <p className="text-xs text-emerald-600 flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> +8.3%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center">
                <ShoppingCart className="h-5 w-5 text-amber-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Taux conversion</p>
                <p className="text-xl font-bold">{conversionRate.toFixed(1)}%</p>
                <p className="text-xs text-red-500 flex items-center gap-0.5"><TrendingDown className="h-3 w-3" /> -0.1%</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
                <Users className="h-5 w-5 text-purple-600" />
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Panier moyen</p>
                <p className="text-xl font-bold">{formatPrice(avgOrderValue)}</p>
                <p className="text-xs text-emerald-600 flex items-center gap-0.5"><TrendingUp className="h-3 w-3" /> +5.2%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Revenue & Visitors */}
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
                <AreaChart data={monthlySales} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
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
                <LineChart data={conversionData} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} domain={[0, 5]} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Line type="monotone" dataKey="rate" stroke="#C19A6B" strokeWidth={2} dot={{ r: 4, fill: "#C19A6B" }} name="Taux %" />
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Sources & Devices */}
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
                <BarChart data={sourceData} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="source" type="category" width={130} tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
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
                  <Pie data={deviceData} cx="50%" cy="50%" innerRadius={50} outerRadius={90} paddingAngle={3} dataKey="value" label={({ name, value }) => `${name}: ${value}%`}>
                    {deviceData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <ChartTooltip content={<ChartTooltipContent />} />
                </PieChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Revenue by Product & Segment */}
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
                <BarChart data={revenueByProduct} layout="vertical" margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis type="number" tick={{ fontSize: 12 }} />
                  <YAxis dataKey="name" type="category" width={120} tick={{ fontSize: 11 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
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
                <BarChart data={revenueBySegment} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                  <XAxis dataKey="segment" tick={{ fontSize: 12 }} />
                  <YAxis tick={{ fontSize: 12 }} />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Bar dataKey="revenue" fill="#C19A6B" radius={[4, 4, 0, 0]} name="Revenus" />
                </BarChart>
              </ResponsiveContainer>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Top Cities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Top villes</CardTitle>
          <CardDescription>Repartition geographique des commandes</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-3">
            {topCities.map((city, i) => (
              <div key={city.city} className="flex items-center gap-4">
                <span className="text-sm font-medium w-6 text-muted-foreground">{i + 1}.</span>
                <span className="text-sm font-medium flex-1">{city.city}</span>
                <div className="w-48 h-2 bg-secondary rounded-full overflow-hidden hidden md:block">
                  <div className="h-full rounded-full" style={{ width: `${(city.orders / topCities[0].orders) * 100}%`, backgroundColor: "#C19A6B" }} />
                </div>
                <span className="text-sm text-muted-foreground w-20 text-right">{city.orders} cmd</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
