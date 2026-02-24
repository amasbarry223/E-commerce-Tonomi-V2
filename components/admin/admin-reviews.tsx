"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { getProducts } from "@/lib/services"
import { formatDate } from "@/lib/formatters"
import { useReviewsStore } from "@/lib/stores/reviews-store"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Star, Check, X, MessageSquare, Clock } from "lucide-react"
import { toast } from "sonner"
import { PaginationSimple as Pagination } from "@/components/ui/pagination"
import { usePagination } from "@/hooks/use-pagination"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { AdminTableToolbar } from "@/components/admin/admin-table-toolbar"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { useSimulatedLoading } from "@/hooks/use-simulated-loading"

const statusColors: Record<string, string> = {
  approved: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
  pending: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
  rejected: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
}

const statusLabels: Record<string, string> = {
  approved: "Approuve", pending: "En attente", rejected: "Rejete",
}

export function AdminReviews() {
  const products = getProducts()
  const reviews = useReviewsStore((s) => s.reviews)
  const approveReview = useReviewsStore((s) => s.approveReview)
  const rejectReview = useReviewsStore((s) => s.rejectReview)

  const [statusFilter, setStatusFilter] = useState("all")
  const [ratingFilter, setRatingFilter] = useState("all")
  const [isProcessing, setIsProcessing] = useState<string | null>(null)
  const [loading] = useSimulatedLoading(400)

  const filtered = useMemo(() => {
    let result = [...reviews]
    if (statusFilter !== "all") result = result.filter(r => r.status === statusFilter)
    if (ratingFilter !== "all") result = result.filter(r => r.rating === Number(ratingFilter))
    return result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  }, [reviews, statusFilter, ratingFilter])

  const {
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage,
  } = usePagination(filtered, { itemsPerPage: 10 })

  const pendingCount = reviews.filter(r => r.status === "pending").length
  const avgRating = reviews.length > 0
    ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1)
    : "0"

  const handleApproveReview = async (reviewId: string) => {
    setIsProcessing(reviewId)
    await new Promise(r => setTimeout(r, 500))
    const review = reviews.find(r => r.id === reviewId)
    approveReview(reviewId)
    toast.success(review ? `Avis de "${review.customerName}" approuvé` : "Avis approuvé")
    setIsProcessing(null)
  }

  const handleRejectReview = async (reviewId: string) => {
    setIsProcessing(reviewId)
    await new Promise(r => setTimeout(r, 500))
    const review = reviews.find(r => r.id === reviewId)
    rejectReview(reviewId)
    toast.success(review ? `Avis de "${review.customerName}" rejeté` : "Avis rejeté")
    setIsProcessing(null)
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminSectionHeader title="Avis clients" description={`${reviews.length} avis | Note moyenne : ${avgRating}/5 | ${pendingCount} en attente`} />

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <MessageSquare className="h-6 w-6 mx-auto text-muted-foreground mb-1" />
          <p className="text-2xl font-bold">{reviews.length}</p>
          <p className="text-xs text-muted-foreground">Total avis</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Star className="h-6 w-6 mx-auto text-amber-400 mb-1" />
          <p className="text-2xl font-bold">{avgRating}</p>
          <p className="text-xs text-muted-foreground">Note moyenne</p>
        </div>
        <div className="bg-card border border-border rounded-lg p-4 text-center">
          <Clock className="h-6 w-6 mx-auto text-amber-500 mb-1" />
          <p className="text-2xl font-bold">{pendingCount}</p>
          <p className="text-xs text-muted-foreground">En attente</p>
        </div>
      </div>

      <AdminTableToolbar>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Statut" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous</SelectItem>
            <SelectItem value="pending">En attente</SelectItem>
            <SelectItem value="approved">Approuves</SelectItem>
            <SelectItem value="rejected">Rejetes</SelectItem>
          </SelectContent>
        </Select>
        <Select value={ratingFilter} onValueChange={setRatingFilter}>
          <SelectTrigger className="w-40"><SelectValue placeholder="Note" /></SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les notes</SelectItem>
            <SelectItem value="5">5 etoiles</SelectItem>
            <SelectItem value="4">4 etoiles</SelectItem>
            <SelectItem value="3">3 etoiles</SelectItem>
            <SelectItem value="2">2 etoiles</SelectItem>
            <SelectItem value="1">1 etoile</SelectItem>
          </SelectContent>
        </Select>
      </AdminTableToolbar>

      <div className="flex flex-col gap-4">
        {loading ? (
          <TableSkeleton rowCount={5} columnCount={3} />
        ) : (
          <>
            {paginatedData.map(review => {
              const product = products.find(p => p.id === review.productId)
              return (
                <div key={review.id} className="bg-card border border-border rounded-lg p-4 md:p-6">
                  <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-3">
                    <div className="flex items-start gap-4">
                      {product && (
                        <Image src={product.images[0] ?? "/placeholder.svg"} alt={product.name} width={48} height={48} className="h-12 w-12 rounded object-cover shrink-0 hidden md:block" />
                      )}
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <p className="font-medium text-sm">{review.customerName}</p>
                          <Badge className={`${statusColors[review.status]} text-xs`}>{statusLabels[review.status]}</Badge>
                        </div>
                        <p className="text-xs text-muted-foreground">{product?.name} | {formatDate(review.createdAt)}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star key={i} className={`h-4 w-4 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-muted"}`} />
                      ))}
                    </div>
                  </div>

                  <h4 className="font-semibold text-sm mb-1">{review.title}</h4>
                  <p className="text-sm text-muted-foreground leading-relaxed">{review.comment}</p>

                  {review.status === "pending" && (
                    <div className="flex gap-2 mt-4 pt-3 border-t border-border">
                      <Button
                        size="sm"
                        className="gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white"
                        onClick={() => handleApproveReview(review.id)}
                        loading={isProcessing === review.id}
                        disabled={!!isProcessing}
                      >
                        <Check className="h-3.5 w-3.5" /> Approuver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="gap-1.5 text-destructive"
                        onClick={() => handleRejectReview(review.id)}
                        disabled={!!isProcessing}
                      >
                        <X className="h-3.5 w-3.5" /> Rejeter
                      </Button>
                    </div>
                  )}
                </div>
              )
            })}
          </>
        )}
      </div>

      {!loading && filtered.length === 0 && (
        <AdminEmptyState
          title="Aucun avis trouvé"
          description="Les avis clients apparaîtront ici."
          icon={MessageSquare}
        />
      )}

      {/* Pagination : barre visible sous la liste */}
      {!loading && filtered.length > 0 && (
        <div className="border border-border rounded-lg bg-muted/20 px-4 py-3 sm:px-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={goToPage}
            itemLabel="avis"
            className="w-full"
          />
        </div>
      )}
    </div>
  )
}
