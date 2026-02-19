"use client"

import { useState, useMemo } from "react"
import { orders, customers, formatPrice, formatDate, getStatusColor, getStatusLabel, type Order } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Search, Download, Eye, Printer, Package, Truck } from "lucide-react"
import { toast } from "sonner"
import { PaginationSimple as Pagination } from "@/components/ui/pagination"
import { usePagination } from "@/hooks/use-pagination"

export function AdminOrders() {
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [orderUpdates, setOrderUpdates] = useState<Record<string, { status?: Order["status"]; trackingNumber?: string }>>({})

  const filtered = useMemo(() => {
    let result = [...orders]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(o => {
        const cust = customers.find(c => c.id === o.customerId)
        return o.orderNumber.toLowerCase().includes(q) ||
          `${cust?.firstName} ${cust?.lastName}`.toLowerCase().includes(q)
      })
    }
    if (statusFilter !== "all") result = result.filter(o => {
      const update = orderUpdates[o.id]
      const currentStatus = update?.status || o.status
      return currentStatus === statusFilter
    })
    return result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA !== 0 ? dateB - dateA : a.id.localeCompare(b.id)
    })
  }, [search, statusFilter, orderUpdates])

  const {
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage,
  } = usePagination(filtered, { itemsPerPage: 10 })

  const viewOrder = orders.find(o => o.id === selectedOrder)
  const viewCustomer = viewOrder ? customers.find(c => c.id === viewOrder.customerId) : null
  const orderUpdate = selectedOrder ? orderUpdates[selectedOrder] : null
  const currentStatus = orderUpdate?.status || viewOrder?.status
  const currentTracking = orderUpdate?.trackingNumber !== undefined ? orderUpdate.trackingNumber : viewOrder?.trackingNumber

  const handleStatusUpdate = (orderId: string, newStatus: Order["status"]) => {
    setOrderUpdates(prev => ({
      ...prev,
      [orderId]: { ...prev[orderId], status: newStatus }
    }))
    toast.success("Statut de la commande mis à jour")
  }

  const handleTrackingUpdate = (orderId: string, trackingNumber: string) => {
    setOrderUpdates(prev => ({
      ...prev,
      [orderId]: { ...prev[orderId], trackingNumber: trackingNumber || undefined }
    }))
    toast.success(trackingNumber ? "Numéro de suivi ajouté" : "Numéro de suivi supprimé")
  }

  const handleExport = () => {
    const headers = ["Numéro", "Client", "Date", "Statut", "Paiement", "Total", "Articles"]
    const rows = filtered.map(order => {
      const customer = customers.find(c => c.id === order.customerId)
      const update = orderUpdates[order.id]
      const status = update?.status || order.status
      return [
        order.orderNumber,
        `${customer?.firstName || ""} ${customer?.lastName || ""}`.trim(),
        formatDate(order.createdAt),
        getStatusLabel(status),
        order.paymentMethod,
        order.total.toString(),
        order.items.length.toString()
      ]
    })

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n")

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)
    link.setAttribute("href", url)
    link.setAttribute("download", `commandes_${new Date().toISOString().split("T")[0]}.csv`)
    link.style.visibility = "hidden"
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    toast.success("Export réussi")
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Gestion des commandes</h2>
          <p className="text-sm text-muted-foreground">{orders.length} commandes</p>
        </div>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport}>
          <Download className="h-3.5 w-3.5" /> Exporter
        </Button>
      </div>

      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Rechercher par numero ou client..." className="pl-10" />
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="confirmed">Confirmee</SelectItem>
            <SelectItem value="shipped">Expediee</SelectItem>
            <SelectItem value="delivered">Livree</SelectItem>
            <SelectItem value="cancelled">Annulee</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Commande</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Client</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Date</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground">Statut</th>
                <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Paiement</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Total</th>
                <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {paginatedData.map(order => {
                const customer = customers.find(c => c.id === order.customerId)
                return (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-mono text-xs font-bold">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.items.length} article{order.items.length > 1 ? "s" : ""}</p>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        {customer && <img src={customer.avatar} alt="" className="h-6 w-6 rounded-full object-cover" crossOrigin="anonymous" />}
                        <span>{customer?.firstName} {customer?.lastName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs hidden lg:table-cell">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-4">
                      <Badge className={`${getStatusColor(orderUpdates[order.id]?.status || order.status)} text-xs`}>
                        {getStatusLabel(orderUpdates[order.id]?.status || order.status)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-xs hidden md:table-cell">{order.paymentMethod}</td>
                    <td className="py-3 px-4 text-right font-medium">{formatPrice(order.total)}</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setSelectedOrder(order.id)}>
                        <Eye className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Aucune commande trouvee</p>
          </div>
        )}
      </div>

      {/* Pagination */}
      {filtered.length > 0 && (
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          totalItems={totalItems}
          itemsPerPage={itemsPerPage}
          onPageChange={goToPage}
        />
      )}

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Commande {viewOrder?.orderNumber}</span>
              {viewOrder && <Badge className={`${getStatusColor(viewOrder.status)} text-xs`}>{getStatusLabel(viewOrder.status)}</Badge>}
            </DialogTitle>
          </DialogHeader>
          {viewOrder && (
            <div className="flex flex-col gap-6">
              {/* Client info */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                {viewCustomer && <img src={viewCustomer.avatar} alt="" className="h-10 w-10 rounded-full object-cover" crossOrigin="anonymous" />}
                <div>
                  <p className="font-medium">{viewCustomer?.firstName} {viewCustomer?.lastName}</p>
                  <p className="text-sm text-muted-foreground">{viewCustomer?.email}</p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h4 className="font-semibold text-sm mb-3">Articles</h4>
                <div className="flex flex-col gap-3">
                  {viewOrder.items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <img src={item.image} alt={item.name} className="h-12 w-12 rounded object-cover" crossOrigin="anonymous" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{item.name}</p>
                        <p className="text-xs text-muted-foreground">{item.color} {item.size ? `| ${item.size}` : ""} | x{item.quantity}</p>
                      </div>
                      <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Address */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2">Adresse de livraison</h4>
                  <p className="text-sm text-muted-foreground">{viewOrder.shippingAddress.street}</p>
                  <p className="text-sm text-muted-foreground">{viewOrder.shippingAddress.zipCode} {viewOrder.shippingAddress.city}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2 flex items-center gap-1.5"><Truck className="h-4 w-4" /> Numéro de suivi</h4>
                  <div className="flex gap-2">
                    <Input
                      value={currentTracking || ""}
                      onChange={(e) => handleTrackingUpdate(viewOrder.id, e.target.value)}
                      placeholder="Numéro de suivi"
                      className="text-sm font-mono"
                    />
                    {currentTracking && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleTrackingUpdate(viewOrder.id, "")}
                      >
                        Supprimer
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-border pt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{formatPrice(viewOrder.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span>{viewOrder.shipping === 0 ? "Gratuite" : formatPrice(viewOrder.shipping)}</span></div>
                {viewOrder.discount > 0 && <div className="flex justify-between text-emerald-600"><span>Reduction</span><span>-{formatPrice(viewOrder.discount)}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">TVA</span><span>{formatPrice(viewOrder.tax)}</span></div>
                <div className="flex justify-between font-bold text-lg border-t border-border pt-2"><span>Total</span><span>{formatPrice(viewOrder.total)}</span></div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Select value={currentStatus} onValueChange={(value) => handleStatusUpdate(viewOrder.id, value as Order["status"])}>
                  <SelectTrigger className="w-48"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pending">En attente</SelectItem>
                    <SelectItem value="confirmed">Confirmee</SelectItem>
                    <SelectItem value="shipped">Expediee</SelectItem>
                    <SelectItem value="delivered">Livree</SelectItem>
                    <SelectItem value="cancelled">Annulee</SelectItem>
                  </SelectContent>
                </Select>
                <Button variant="outline" size="sm" className="gap-1.5"><Printer className="h-3.5 w-3.5" /> Facture</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
