"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { getOrders, getCustomers } from "@/lib/services"
import type { Order } from "@/lib/types"
import { formatPrice, formatDate, getStatusColor, getStatusLabel, pluralize } from "@/lib/formatters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Download, Eye, Printer, Package, Truck } from "lucide-react"
import { toast } from "sonner"
import { TOAST_MESSAGES, LAYOUT_CONSTANTS, ORDER_LABELS } from "@/lib/constants"
import { downloadCsv, csvFilename } from "@/lib/utils/export-csv"
import { PaginationSimple as Pagination } from "@/components/ui/pagination"
import { usePagination } from "@/hooks/use-pagination"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { AdminTableToolbar } from "@/components/admin/admin-table-toolbar"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"

/** Statuts affichés dans le filtre et le sélecteur de détail (admin) */
const ADMIN_ORDER_STATUS_OPTIONS: Order["status"][] = ["pending", "confirmed", "shipped", "delivered", "cancelled", "refunded"]

export function AdminOrders() {
  const orders = getOrders()
  const customers = getCustomers()
  const customersMap = useMemo(() => new Map(customers.map(c => [c.id, c])), [customers])
  const [search, setSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("all")
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null)
  const [orderUpdates, setOrderUpdates] = useState<Record<string, { status?: Order["status"]; trackingNumber?: string }>>({})
  const [isUpdating, setIsUpdating] = useState(false)
  const filtered = useMemo(() => {
    let result = [...orders]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(o => {
        const cust = customersMap.get(o.customerId)
        return o.orderNumber.toLowerCase().includes(q) ||
          `${cust?.firstName ?? ""} ${cust?.lastName ?? ""}`.trim().toLowerCase().includes(q)
      })
    }
    if (statusFilter !== "all") {
      result = result.filter(o => {
        const currentStatus = orderUpdates[o.id]?.status ?? o.status
        return currentStatus === statusFilter
      })
    }
    return result.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime()
      const dateB = new Date(b.createdAt).getTime()
      return dateB - dateA !== 0 ? dateB - dateA : a.id.localeCompare(b.id)
    })
  }, [search, statusFilter, orderUpdates, orders, customersMap])

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

  const handleStatusUpdate = async (orderId: string, newStatus: Order["status"]) => {
    setIsUpdating(true)
    await new Promise(r => setTimeout(r, 600))
    setOrderUpdates(prev => ({
      ...prev,
      [orderId]: { ...prev[orderId], status: newStatus }
    }))
    toast.success("Statut de la commande mis à jour")
    setIsUpdating(false)
  }

  const handleTrackingUpdate = async (orderId: string, trackingNumber: string) => {
    setIsUpdating(true)
    await new Promise(r => setTimeout(r, 600))
    setOrderUpdates(prev => ({
      ...prev,
      [orderId]: { ...prev[orderId], trackingNumber: trackingNumber || undefined }
    }))
    toast.success(trackingNumber ? "Numéro de suivi ajouté" : "Numéro de suivi supprimé")
    setIsUpdating(false)
  }

  const handleExport = () => {
    const headers = ["Numéro", "Client", "Date", "Statut", "Paiement", "Total", "Articles"]
    const rows = filtered.map(order => {
      const customer = customersMap.get(order.customerId)
      const status = orderUpdates[order.id]?.status ?? order.status
      return [
        order.orderNumber,
        `${customer?.firstName ?? ""} ${customer?.lastName ?? ""}`.trim(),
        formatDate(order.createdAt),
        getStatusLabel(status),
        order.paymentMethod,
        order.total.toString(),
        order.items.length.toString()
      ]
    })
    downloadCsv(headers, rows, csvFilename("commandes"))
    toast.success(TOAST_MESSAGES.EXPORT_SUCCESS)
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminSectionHeader
        title="Gestion des commandes"
        description={`${orders.length} commandes`}
      >
        <Button variant="outline" size="sm" className="gap-1.5" onClick={handleExport}>
          <Download className="h-3.5 w-3.5" /> Exporter
        </Button>
      </AdminSectionHeader>

      <AdminTableToolbar
        searchPlaceholder="Rechercher par numéro ou client..."
        searchValue={search}
        onSearchChange={setSearch}
      >
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            {ADMIN_ORDER_STATUS_OPTIONS.map(status => (
              <SelectItem key={status} value={status}>{getStatusLabel(status)}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </AdminTableToolbar>

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
                const customer = customersMap.get(order.customerId)
                const orderStatus = orderUpdates[order.id]?.status ?? order.status
                return (
                  <tr key={order.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-mono text-xs font-bold">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{order.items.length} {pluralize(order.items.length, "article")}</p>
                    </td>
                    <td className="py-3 px-4 hidden md:table-cell">
                      <div className="flex items-center gap-2">
                        {customer && (
                          <Image
                            src={customer.avatar}
                            alt={`Avatar de ${customer.firstName} ${customer.lastName}`}
                            width={24}
                            height={24}
                            className="h-6 w-6 rounded-full object-cover"
                          />
                        )}
                        <span>{customer?.firstName} {customer?.lastName}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs hidden lg:table-cell">{formatDate(order.createdAt)}</td>
                    <td className="py-3 px-4">
                      <Badge className={`${getStatusColor(orderStatus)} text-xs`}>
                        {getStatusLabel(orderStatus)}
                      </Badge>
                    </td>
                    <td className="py-3 px-4 text-xs hidden md:table-cell">{order.paymentMethod}</td>
                    <td className="py-3 px-4 text-right font-medium">{formatPrice(order.total)}</td>
                    <td className="py-3 px-4 text-right">
                      <Button variant="ghost" size="icon" className="h-11 w-11 sm:h-8 sm:w-8" onClick={() => setSelectedOrder(order.id)} aria-label={`Voir la commande ${order.orderNumber}`}>
                        <Eye className="h-4 w-4" aria-hidden />
                      </Button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
        {filtered.length === 0 && (
          <AdminEmptyState
            title="Aucune commande trouvée"
            description="Les commandes apparaîtront ici."
            icon={Package}
          />
        )}
        {/* Pagination dans la carte : toujours visible sous le tableau */}
        {filtered.length > 0 && (
          <div className="border-t border-border bg-muted/20 px-4 py-3 sm:px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={goToPage}
              itemLabel="commandes"
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Order Detail Dialog */}
      <Dialog open={!!selectedOrder} onOpenChange={() => setSelectedOrder(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>Commande {viewOrder?.orderNumber}</span>
              {viewOrder && currentStatus != null && <Badge className={`${getStatusColor(currentStatus)} text-xs`}>{getStatusLabel(currentStatus)}</Badge>}
            </DialogTitle>
          </DialogHeader>
          {viewOrder && (
            <div className="flex flex-col gap-6">
              {/* Client info */}
              <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
                {viewCustomer && (
                  <Image
                    src={viewCustomer.avatar}
                    alt={`Avatar de ${viewCustomer.firstName} ${viewCustomer.lastName}`}
                    width={40}
                    height={40}
                    className="h-10 w-10 rounded-full object-cover"
                  />
                )}
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
                    <div key={`${item.productId}-${item.name}-${i}`} className="flex gap-3 items-center">
                      <Image src={item.image} alt={item.name} width={48} height={48} className="h-12 w-12 rounded object-cover" />
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
                  {viewOrder && (
                    <OrderTrackingInput
                      key={viewOrder.id}
                      orderId={viewOrder.id}
                      initialTracking={currentTracking ?? ""}
                      currentTracking={currentTracking}
                      onSave={handleTrackingUpdate}
                      disabled={isUpdating}
                    />
                  )}
                </div>
              </div>

              {/* Totals */}
              <div className="border-t border-border pt-4 flex flex-col gap-2 text-sm">
                <div className="flex justify-between"><span className="text-muted-foreground">Sous-total</span><span>{formatPrice(viewOrder.subtotal)}</span></div>
                <div className="flex justify-between"><span className="text-muted-foreground">Livraison</span><span>{viewOrder.shipping === 0 ? LAYOUT_CONSTANTS.FREE_SHIPPING_LABEL : formatPrice(viewOrder.shipping)}</span></div>
                {viewOrder.discount > 0 && <div className="flex justify-between text-emerald-600"><span>{ORDER_LABELS.DISCOUNT}</span><span>-{formatPrice(viewOrder.discount)}</span></div>}
                <div className="flex justify-between"><span className="text-muted-foreground">TVA</span><span>{formatPrice(viewOrder.tax)}</span></div>
                <div className="flex justify-between font-bold text-lg border-t border-border pt-2"><span>Total</span><span>{formatPrice(viewOrder.total)}</span></div>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <Select
                  value={currentStatus ?? ""}
                  onValueChange={(value) => handleStatusUpdate(viewOrder.id, value as Order["status"])}
                  disabled={isUpdating}
                >
                  <SelectTrigger className="w-48"><SelectValue placeholder="Statut" /></SelectTrigger>
                  <SelectContent>
                    {ADMIN_ORDER_STATUS_OPTIONS.map(status => (
                      <SelectItem key={status} value={status}>{getStatusLabel(status)}</SelectItem>
                    ))}
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

function OrderTrackingInput({
  orderId,
  initialTracking,
  currentTracking,
  onSave,
  disabled
}: {
  orderId: string
  initialTracking: string
  currentTracking: string | undefined
  onSave: (id: string, value: string) => void
  disabled?: boolean
}) {
  const [trackingInput, setTrackingInput] = useState(initialTracking)
  return (
    <div className="flex gap-2">
      <Input
        id="tracking-number"
        value={trackingInput}
        onChange={(e) => setTrackingInput(e.target.value)}
        placeholder="Numéro de suivi"
        className="text-sm font-mono"
        disabled={disabled}
      />
      <Button variant="outline" size="sm" onClick={() => onSave(orderId, trackingInput)} loading={disabled}>
        Enregistrer
      </Button>
      {currentTracking && (
        <Button
          variant="ghost"
          size="sm"
          disabled={disabled}
          onClick={() => {
            onSave(orderId, "")
            setTrackingInput("")
          }}
        >
          Supprimer
        </Button>
      )}
    </div>
  )
}
