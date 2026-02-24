"use client"

import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import { getOrders } from "@/lib/services"
import { formatPrice } from "@/lib/formatters"
import { Card, CardContent } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { TrendingUp, TrendingDown, Users, ShoppingCart, DollarSign, Eye } from "lucide-react"
import { AdminChartsSkeleton } from "./admin-charts-skeleton"

const LazyAnalyticsCharts = dynamic(
  () => import("./admin-analytics-charts").then((m) => ({ default: m.AdminAnalyticsCharts })),
  { loading: () => <AdminChartsSkeleton /> }
)

export function AdminAnalytics() {
  const orders = getOrders()
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
  }, [dateRange, orders])

  // Performance KPIs (for the cards above charts)
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

      {/* Charts - lazy loaded (Recharts) */}
      <LazyAnalyticsCharts period={period} />
    </div>
  )
}
