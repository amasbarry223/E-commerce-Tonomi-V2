"use client"

import { getPromoCodes } from "@/lib/services"
import { formatPrice, formatDate } from "@/lib/formatters"
import { LAYOUT_CONSTANTS } from "@/lib/constants"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Tag, Copy, Trash2, MoreHorizontal, Percent, Calendar, Settings, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState, useMemo } from "react"
import { toast } from "sonner"
import { PaginationSimple as Pagination } from "@/components/ui/pagination"
import { usePagination } from "@/hooks/use-pagination"
import { useSubmitState } from "@/hooks/use-submit-state"
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog"
import { promoCodeSchema, getZodErrorMessage } from "@/lib/utils/validation"
import { TOAST_MESSAGES } from "@/lib/constants"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"

export function AdminPromos() {
  const promoCodes = getPromoCodes()
  const [showAdd, setShowAdd] = useState(false)
  const [promoToDelete, setPromoToDelete] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const { isSubmitting, submit } = useSubmitState()
  const [isDeleting, setIsDeleting] = useState(false)
  const [promoFieldErrors, setPromoFieldErrors] = useState<Record<string, string>>({})

  const filtered = useMemo(() => promoCodes, [promoCodes])
  const activeCount = filtered.filter(p => p.active && new Date(p.endDate) > new Date()).length

  const {
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage,
  } = usePagination(filtered, { itemsPerPage: 10 })

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code)
    toast.success(`Code "${code}" copié dans le presse-papiers`)
  }

  const handleDeleteClick = (promoId: string) => {
    setPromoToDelete(promoId)
    setDeleteDialogOpen(true)
  }

  const confirmDeletePromo = () => {
    if (!promoToDelete) return
    setIsDeleting(true)
    const promo = promoCodes.find(p => p.id === promoToDelete)
    if (promo) {
      toast.success(`Code promo "${promo.code}" supprimé avec succès`)
    }
    setPromoToDelete(null)
    setIsDeleting(false)
  }

  const handleCreatePromo = (formValues: {
    code: string
    type: "percentage" | "fixed"
    value: number
    minAmount?: number
    maxUses: number
    startDate: string
    endDate: string
  }) => {
    if (formValues.endDate < formValues.startDate) {
      setPromoFieldErrors({ endDate: "La date de fin doit être postérieure ou égale à la date de début." })
      toast.error("La date de fin doit être postérieure ou égale à la date de début.")
      return
    }
    const result = promoCodeSchema.safeParse(formValues)
    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        const path = (err.path[0] as string) ?? "form"
        if (!errors[path]) errors[path] = err.message ?? "Erreur"
      })
      setPromoFieldErrors(errors)
      toast.error(getZodErrorMessage(result.error, TOAST_MESSAGES.VALIDATION_CORRECT_FIELDS))
      return
    }
    setPromoFieldErrors({})
    submit(async () => {
      toast.success("Code promo créé avec succès")
      setShowAdd(false)
    })
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminSectionHeader
        title="Codes promo"
        description={`${filtered.length} codes | ${activeCount} actifs`}
      >
        <Dialog open={showAdd} onOpenChange={(open) => { setShowAdd(open); if (!open) setPromoFieldErrors({}) }}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Nouveau code</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Nouveau code promo
              </DialogTitle>
            </DialogHeader>
            <PromoForm
              onSubmit={handleCreatePromo}
              onCancel={() => setShowAdd(false)}
              isSubmitting={isSubmitting}
              fieldErrors={promoFieldErrors}
            />
          </DialogContent>
        </Dialog>
      </AdminSectionHeader>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {paginatedData.map(promo => {
          const isExpired = new Date(promo.endDate) < new Date()
          const isActive = promo.active && !isExpired

          return (
            <Card key={promo.id} className={`${!isActive ? "opacity-60" : ""}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono font-bold text-lg">{promo.code}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className={isActive
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                    }>
                      {isExpired ? "Expiré" : isActive ? "Actif" : "Inactif"}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-11 w-11 sm:h-8 sm:w-8" aria-label={`Actions pour le code ${promo.code}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" onClick={() => handleCopyCode(promo.code)}>
                          <Copy className="h-3.5 w-3.5" /> Copier le code
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDeleteClick(promo.id)}>
                          <Trash2 className="h-3.5 w-3.5" /> Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <p className="text-2xl font-bold mb-1">
                  {promo.type === "percentage" ? `-${promo.value}%` : promo.type === "fixed" ? `-${formatPrice(promo.value)}` : LAYOUT_CONSTANTS.FREE_SHIPPING_LABEL_LONG}
                </p>
                {promo.minAmount && promo.minAmount > 0 && (
                  <p className="text-xs text-muted-foreground">Min. commande : {formatPrice(promo.minAmount)}</p>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
                  <span>{promo.usedCount}/{promo.maxUses} utilise{promo.usedCount > 1 ? "s" : ""}</span>
                  <span>Expire le {formatDate(promo.endDate)}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Pagination : barre visible sous la grille */}
      {filtered.length > 0 && (
        <div className="border border-border rounded-lg bg-muted/20 px-4 py-3 sm:px-6">
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onPageChange={goToPage}
            itemLabel="codes promo"
            className="w-full"
          />
        </div>
      )}

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Supprimer le code promo"
        description={
          promoToDelete
            ? (() => {
                const promo = promoCodes.find((p) => p.id === promoToDelete)
                return promo
                  ? `Êtes-vous sûr de vouloir supprimer le code promo "${promo.code}" ? Cette action est irréversible.`
                  : "Êtes-vous sûr de vouloir supprimer ce code promo ? Cette action est irréversible."
              })()
            : "Êtes-vous sûr de vouloir supprimer ce code promo ? Cette action est irréversible."
        }
        onConfirm={confirmDeletePromo}
        loading={isDeleting}
      />
    </div>
  )
}

function PromoForm({
  onSubmit,
  onCancel,
  isSubmitting,
  fieldErrors = {},
}: {
  onSubmit: (values: { code: string; type: "percentage" | "fixed"; value: number; minAmount?: number; maxUses: number; startDate: string; endDate: string }) => void
  onCancel: () => void
  isSubmitting: boolean
  fieldErrors?: Record<string, string>
}) {
  const today = new Date().toISOString().split("T")[0]
  const [code, setCode] = useState("")
  const [type, setType] = useState<"percentage" | "fixed">("percentage")
  const [value, setValue] = useState("")
  const [minAmount, setMinAmount] = useState("")
  const [maxUses, setMaxUses] = useState("100")
  const [startDate, setStartDate] = useState(today)
  const [endDate, setEndDate] = useState(today)

  const handleSubmit = () => {
    const valueNum = value.trim() === "" ? NaN : parseFloat(value.replace(",", "."))
    const minAmountNum = minAmount.trim() === "" ? undefined : parseFloat(minAmount.replace(",", "."))
    const maxUsesNum = maxUses.trim() === "" ? NaN : parseInt(maxUses, 10)
    const payload = {
      code: code.trim().toUpperCase(),
      type,
      value: valueNum,
      minAmount: minAmountNum,
      maxUses: maxUsesNum,
      startDate,
      endDate,
    }
    onSubmit(payload)
  }

  const displayCode = (code.trim().toUpperCase() || "SUMMER2026").slice(0, 20)
  const displayValue = value.trim() ? (type === "percentage" ? `-${value}%` : `-${value}€`) : "-10%"
  const displayMin = minAmount.trim() ? `${minAmount}€` : "0€"
  const displayMax = maxUses.trim() || "100"
  const displayPeriod = startDate && endDate ? `${startDate} - ${endDate}` : "—"

  return (
    <>
      <Tabs defaultValue="basic" className="mt-4">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="basic" className="gap-1.5 text-xs">
            <Tag className="h-3.5 w-3.5" />
            Code
          </TabsTrigger>
          <TabsTrigger value="conditions" className="gap-1.5 text-xs">
            <Settings className="h-3.5 w-3.5" />
            Conditions
          </TabsTrigger>
          <TabsTrigger value="dates" className="gap-1.5 text-xs">
            <Calendar className="h-3.5 w-3.5" />
            Dates
          </TabsTrigger>
          <TabsTrigger value="preview" className="gap-1.5 text-xs">
            <Eye className="h-3.5 w-3.5" />
            Aperçu
          </TabsTrigger>
        </TabsList>

        <TabsContent value="basic" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="promo-code" className="text-sm font-medium">Code promo</Label>
            <Input
              id="promo-code"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              className="mt-1.5 font-mono uppercase font-bold"
              placeholder="SUMMER2026"
              maxLength={20}
              aria-invalid={!!fieldErrors.code}
              aria-describedby={fieldErrors.code ? "promo-code-error" : undefined}
            />
            {fieldErrors.code && (
              <p id="promo-code-error" className="text-xs text-destructive mt-0.5" role="alert">
                {fieldErrors.code}
              </p>
            )}
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="promo-type" className="text-sm font-medium">Type</Label>
              <Select value={type} onValueChange={(v) => setType(v as "percentage" | "fixed")}>
                <SelectTrigger id="promo-type" className="mt-1.5">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">
                    <div className="flex items-center gap-2">
                      <Percent className="h-3.5 w-3.5" />
                      Pourcentage
                    </div>
                  </SelectItem>
                  <SelectItem value="fixed">Montant fixe</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="promo-value" className="text-sm font-medium">{type === "fixed" ? "Valeur (€)" : "Valeur"}</Label>
              <Input
                id="promo-value"
                type="number"
                value={value}
                onChange={(e) => setValue(e.target.value)}
                className="mt-1.5"
                placeholder={type === "fixed" ? "5.00" : "10"}
                min="0"
                step="0.01"
                aria-invalid={!!fieldErrors.value}
                aria-describedby={fieldErrors.value ? "promo-value-error" : undefined}
              />
              {fieldErrors.value && (
                <p id="promo-value-error" className="text-xs text-destructive mt-0.5" role="alert">
                  {fieldErrors.value}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
            <input type="checkbox" id="promo-active" defaultChecked className="h-4 w-4 rounded border-border" />
            <Label htmlFor="promo-active" className="text-sm cursor-pointer">
              Actif immédiatement
            </Label>
          </div>
        </TabsContent>

        <TabsContent value="conditions" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="promo-min-amount" className="text-sm font-medium">Montant minimum (€)</Label>
            <Input
              id="promo-min-amount"
              type="number"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              className="mt-1.5"
              placeholder="0"
              min="0"
              step="0.01"
              aria-invalid={!!fieldErrors.minAmount}
              aria-describedby={fieldErrors.minAmount ? "promo-min-amount-error" : undefined}
            />
            {fieldErrors.minAmount && (
              <p id="promo-min-amount-error" className="text-xs text-destructive mt-0.5" role="alert">
                {fieldErrors.minAmount}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="promo-max-uses" className="text-sm font-medium">Limite d&apos;utilisations</Label>
            <Input
              id="promo-max-uses"
              type="number"
              value={maxUses}
              onChange={(e) => setMaxUses(e.target.value)}
              className="mt-1.5"
              placeholder="100"
              min="1"
              aria-invalid={!!fieldErrors.maxUses}
              aria-describedby={fieldErrors.maxUses ? "promo-max-uses-error" : undefined}
            />
            {fieldErrors.maxUses && (
              <p id="promo-max-uses-error" className="text-xs text-destructive mt-0.5" role="alert">
                {fieldErrors.maxUses}
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="dates" className="space-y-4 mt-4">
          <div>
            <Label htmlFor="promo-start-date" className="text-sm font-medium">Date de début</Label>
            <Input
              id="promo-start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="mt-1.5"
              min={today}
              aria-invalid={!!fieldErrors.startDate}
              aria-describedby={fieldErrors.startDate ? "promo-start-date-error" : undefined}
            />
            {fieldErrors.startDate && (
              <p id="promo-start-date-error" className="text-xs text-destructive mt-0.5" role="alert">
                {fieldErrors.startDate}
              </p>
            )}
          </div>
          <div>
            <Label htmlFor="promo-end-date" className="text-sm font-medium">Date de fin</Label>
            <Input
              id="promo-end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="mt-1.5"
              min={today}
              aria-invalid={!!fieldErrors.endDate}
              aria-describedby={fieldErrors.endDate ? "promo-end-date-error" : undefined}
            />
            {fieldErrors.endDate && (
              <p id="promo-end-date-error" className="text-xs text-destructive mt-0.5" role="alert">
                {fieldErrors.endDate}
              </p>
            )}
          </div>
        </TabsContent>

        <TabsContent value="preview" className="mt-4">
          <div className="p-4 bg-muted/30 rounded-lg border border-border">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-muted-foreground" />
                <span className="font-mono font-bold text-lg">{displayCode}</span>
              </div>
              <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">
                Actif
              </Badge>
            </div>
            <div className="space-y-2">
              <p className="text-2xl font-bold">{displayValue}</p>
              <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                <span>Min. commande : {displayMin}</span>
                <span>Limite : {displayMax} utilisations</span>
                <span>Période : {displayPeriod}</span>
              </div>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-3 text-center">
            Aperçu du code promo tel qu&apos;il apparaîtra dans la liste
          </p>
        </TabsContent>
      </Tabs>

      <div className="flex justify-end gap-2 pt-4 mt-4 border-t">
        <Button variant="outline" onClick={onCancel} size="sm">
          Annuler
        </Button>
        <Button onClick={handleSubmit} size="sm" className="gap-1.5" loading={isSubmitting}>
          <Plus className="h-3.5 w-3.5" />
          Créer
        </Button>
      </div>
    </>
  )
}
