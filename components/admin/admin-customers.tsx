"use client"

import { useState, useMemo } from "react"
import dynamic from "next/dynamic"
import Image from "next/image"
import { getCustomers, getOrders } from "@/lib/services"
import { formatPrice, formatDate, getSegmentLabel, getSegmentColor } from "@/lib/formatters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Card, CardContent } from "@/components/ui/card"
import { Search, Users, Eye, Mail, ShoppingBag, MapPin, Download } from "lucide-react"
import { toast } from "sonner"
import { TOAST_MESSAGES } from "@/lib/constants"
import { downloadCsv, csvFilename } from "@/lib/utils/export-csv"
import { PaginationSimple as Pagination } from "@/components/ui/pagination"
import { usePagination } from "@/hooks/use-pagination"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { useSimulatedLoading } from "@/hooks/use-simulated-loading"
import { AdminChartsSkeleton } from "./admin-charts-skeleton"

const AdminCustomersCharts = dynamic(
  () => import("./admin-customers-charts").then((m) => ({ default: m.AdminCustomersCharts })),
  { loading: () => <AdminChartsSkeleton /> }
)

export function AdminCustomers() {
  const customers = getCustomers()
  const orders = getOrders()
  const [search, setSearch] = useState("")
  const [segmentFilter, setSegmentFilter] = useState("all")
  const [selectedCustomer, setSelectedCustomer] = useState<string | null>(null)
  const [loading] = useSimulatedLoading(400)

  const filtered = useMemo(() => {
    let result = [...customers]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(c => `${c.firstName} ${c.lastName}`.toLowerCase().includes(q) || c.email.toLowerCase().includes(q))
    }
    if (segmentFilter !== "all") result = result.filter(c => c.segment === segmentFilter)
    return result
  }, [search, segmentFilter])

  const {
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage,
  } = usePagination(filtered, { itemsPerPage: 10 })

  const viewCustomer = customers.find(c => c.id === selectedCustomer)
  const customerOrders = viewCustomer ? orders.filter(o => o.customerId === viewCustomer.id) : []

  // Stats
  const vipCount = customers.filter(c => c.segment === "vip").length
  const newCount = customers.filter(c => c.segment === "new").length
  const totalSpent = customers.reduce((s, c) => s + c.totalSpent, 0)

  // Revenue by segment
  const revenueBySegment = useMemo(() => {
    const segments = ["vip", "new", "regular", "inactive"] as const
    return segments.map(segment => ({
      segment: getSegmentLabel(segment),
      revenue: customers
        .filter(c => c.segment === segment)
        .reduce((sum, c) => sum + c.totalSpent, 0)
    }))
  }, [])

  // Customer growth over time
  const customerGrowth = useMemo(() => {
    const months = ["Sep", "Oct", "Nov", "Dec", "Jan", "Fev"]
    return months.map(month => {
      const monthIndex = months.indexOf(month)
      const targetDate = new Date(2025, monthIndex + 8, 1) // Starting from September 2025
      const count = customers.filter(c => {
        const customerDate = new Date(c.createdAt)
        return customerDate <= targetDate
      }).length
      return { month, count }
    })
  }, [])

  const handleExport = () => {
    const headers = ["Nom", "Email", "Téléphone", "Segment", "Commandes", "Total dépensé", "Inscrit le"]
    const rows = filtered.map(customer => [
      `${customer.firstName} ${customer.lastName}`,
      customer.email,
      customer.phone,
      getSegmentLabel(customer.segment),
      customer.orderCount.toString(),
      customer.totalSpent.toString(),
      formatDate(customer.createdAt)
    ])
    downloadCsv(headers, rows, csvFilename("clients"))
    toast.success(TOAST_MESSAGES.EXPORT_SUCCESS)
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminSectionHeader
        title="Gestion des clients"
        description={`${customers.length} clients enregistrés`}
      >
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport}>
          <Download className="h-3.5 w-3.5" /> Exporter
        </Button>
      </AdminSectionHeader>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-muted-foreground">Total clients</p>
            <p className="text-xl font-bold">{customers.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-muted-foreground">Clients VIP</p>
            <p className="text-xl font-bold">{vipCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-muted-foreground">Nouveaux clients</p>
            <p className="text-xl font-bold">{newCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4 pb-4">
            <p className="text-sm text-muted-foreground">CA total clients</p>
            <p className="text-xl font-bold">{formatPrice(totalSpent)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <AdminCustomersCharts revenueBySegment={revenueBySegment} customerGrowth={customerGrowth} />

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par nom ou email..." className="pl-10" />
        </div>
        <Select value={segmentFilter} onValueChange={setSegmentFilter}>
          <SelectTrigger className="w-48"><SelectValue placeholder="Segment" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les segments</SelectItem>
            <SelectItem value="vip">VIP</SelectItem>
            <SelectItem value="new">Nouveau</SelectItem>
            <SelectItem value="regular">Regulier</SelectItem>
            <SelectItem value="inactive">Inactif</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <TableSkeleton rowCount={10} columnCount={6} />
          ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Client</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Segment</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Commandes</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Total dépensé</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Inscrit le</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map(customer => (
                <tr key={customer.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <Image
                        src={customer.avatar}
                        alt={`Photo de profil de ${customer.firstName} ${customer.lastName}`}
                        width={36}
                        height={36}
                        className="h-9 w-9 rounded-full object-cover"
                      />
                      <div>
                        <p className="font-medium">{customer.firstName} {customer.lastName}</p>
                        <p className="text-xs text-muted-foreground">{customer.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 hidden md:table-cell">
                    <Badge className={`${getSegmentColor(customer.segment)} text-xs`}>{getSegmentLabel(customer.segment)}</Badge>
                  </td>
                  <td className="py-3 px-4 hidden lg:table-cell">{customer.orderCount}</td>
                  <td className="py-3 px-4 font-medium">{formatPrice(customer.totalSpent)}</td>
                  <td className="py-3 px-4 text-xs text-muted-foreground hidden lg:table-cell">{formatDate(customer.createdAt)}</td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex justify-end gap-1">
                      <Button variant="ghost" size="icon" className="h-11 w-11 sm:h-8 sm:w-8" onClick={() => setSelectedCustomer(customer.id)} aria-label={`Voir le détail de ${customer.firstName} ${customer.lastName}`}>
                        <Eye className="h-4 w-4" aria-hidden />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-11 w-11 sm:h-8 sm:w-8" aria-label={`Envoyer un email à ${customer.firstName} ${customer.lastName}`} onClick={() => window.open(`mailto:${customer.email}`)}>
                        <Mail className="h-4 w-4" aria-hidden />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          )}
        </div>
        {!loading && filtered.length === 0 && (
          <AdminEmptyState
            title={customers.length > 0 ? "Aucun client ne correspond aux critères" : "Aucun client trouvé"}
            description={customers.length > 0 ? "Modifiez les filtres ou la recherche pour afficher des résultats." : "Les clients apparaîtront ici."}
            icon={Users}
          />
        )}
        {/* Pagination dans la carte : toujours visible sous le tableau */}
        {!loading && filtered.length > 0 && (
          <div className="border-t border-border bg-muted/20 px-4 py-3 sm:px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={goToPage}
              itemLabel="clients"
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Customer Detail Dialog */}
      <Dialog open={!!selectedCustomer} onOpenChange={() => setSelectedCustomer(null)}>
        <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Fiche client</DialogTitle>
          </DialogHeader>
          {viewCustomer && (
            <div className="flex flex-col gap-6">
              <div className="flex items-center gap-4">
                <Image
                src={viewCustomer.avatar}
                alt={`Photo de profil de ${viewCustomer.firstName} ${viewCustomer.lastName}`}
                width={64}
                height={64}
                className="h-16 w-16 rounded-full object-cover"
              />
                <div>
                  <h3 className="font-bold text-lg">{viewCustomer.firstName} {viewCustomer.lastName}</h3>
                  <p className="text-sm text-muted-foreground">{viewCustomer.email}</p>
                  <Badge className={`${getSegmentColor(viewCustomer.segment)} text-xs mt-1`}>{getSegmentLabel(viewCustomer.segment)}</Badge>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Commandes</p>
                  <p className="text-lg font-bold">{viewCustomer.orderCount}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Total dépensé</p>
                  <p className="text-lg font-bold">{formatPrice(viewCustomer.totalSpent)}</p>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <p className="text-xs text-muted-foreground">Panier moy.</p>
                  <p className="text-lg font-bold">{viewCustomer.orderCount > 0 ? formatPrice(viewCustomer.totalSpent / viewCustomer.orderCount) : "0"}</p>
                </div>
              </div>

              <div>
                <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5"><MapPin className="h-4 w-4" /> Adresses</h4>
                {viewCustomer.addresses.map(addr => (
                  <div key={addr.id} className="text-sm text-muted-foreground p-3 bg-muted/50 rounded-lg">
                    <p className="font-medium text-foreground">{addr.label}</p>
                    <p>{addr.street}, {addr.zipCode} {addr.city}</p>
                  </div>
                ))}
              </div>

              {customerOrders.length > 0 && (
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5"><ShoppingBag className="h-4 w-4" /> Dernières commandes</h4>
                  <div className="flex flex-col gap-2">
                    {customerOrders.slice(0, 3).map(order => (
                      <div key={order.id} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg text-sm">
                        <div>
                          <p className="font-mono text-xs font-bold">{order.orderNumber}</p>
                          <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                        </div>
                        <span className="font-medium">{formatPrice(order.total)}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
