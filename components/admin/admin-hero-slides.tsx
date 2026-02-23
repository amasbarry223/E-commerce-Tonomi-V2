"use client"

import { useState, useMemo } from "react"
import { useHeroSlidesStore } from "@/lib/stores/hero-slides-store"
import type { HeroSlide } from "@/lib/types"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Switch } from "@/components/ui/switch"
import {
  Plus,
  Edit,
  Trash2,
  ChevronUp,
  ChevronDown,
  LayoutPanelTop,
  Upload,
  X,
} from "lucide-react"
import { toast } from "sonner"
import { TOAST_MESSAGES, AUTH_DELAYS_MS } from "@/lib/constants"
import { heroSlideSchema, getZodErrorMessage } from "@/lib/utils/validation"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog"
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { SafeImage } from "@/components/ui/safe-image"
import { useSimulatedLoading } from "@/hooks/use-simulated-loading"

export function AdminHeroSlides() {
  const slides = useHeroSlidesStore((s) => s.slides)
  const addSlide = useHeroSlidesStore((s) => s.addSlide)
  const updateSlide = useHeroSlidesStore((s) => s.updateSlide)
  const removeSlide = useHeroSlidesStore((s) => s.removeSlide)
  const reorderSlides = useHeroSlidesStore((s) => s.reorderSlides)

  const sortedSlides = useMemo(
    () => [...slides].sort((a, b) => a.order - b.order),
    [slides]
  )

  const [showDialog, setShowDialog] = useState(false)
  const [editingSlide, setEditingSlide] = useState<HeroSlide | null>(null)
  const [image, setImage] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [title, setTitle] = useState("")
  const [subtitle, setSubtitle] = useState("")
  const [ctaText, setCtaText] = useState("")
  const [ctaLink, setCtaLink] = useState("")
  const [order, setOrder] = useState(0)
  const [active, setActive] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [slideToDelete, setSlideToDelete] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [loading, _setLoading] = useSimulatedLoading(AUTH_DELAYS_MS.ADMIN_LOADING)
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})

  const resetForm = () => {
    setEditingSlide(null)
    setImage("")
    setImagePreview(null)
    setTitle("")
    setSubtitle("")
    setCtaText("")
    setCtaLink("")
    setOrder(sortedSlides.length)
    setActive(true)
    setFieldErrors({})
  }

  const openAdd = () => {
    resetForm()
    setFieldErrors({})
    setShowDialog(true)
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith("image/")) {
      toast.error("Veuillez sélectionner un fichier image")
      return
    }
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5 Mo")
      return
    }
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setImagePreview(result)
      setImage(result)
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setImage("")
  }

  const openEdit = (slide: HeroSlide) => {
    setFieldErrors({})
    setEditingSlide(slide)
    setImage(slide.image)
    setImagePreview(slide.image)
    setTitle(slide.title)
    setSubtitle(slide.subtitle)
    setCtaText(slide.ctaText)
    setCtaLink(slide.ctaLink ?? "")
    setOrder(slide.order)
    setActive(slide.active)
    setShowDialog(true)
  }

  const handleSave = () => {
    const ctaLinkVal = ctaLink.trim() || undefined
    const result = heroSlideSchema.safeParse({
      image,
      title,
      subtitle,
      ctaText,
      ctaLink: ctaLinkVal,
      order,
      active,
    })
    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        const path = (err.path[0] as string) ?? "form"
        if (!errors[path]) errors[path] = err.message ?? "Erreur"
      })
      setFieldErrors(errors)
      toast.error(getZodErrorMessage(result.error, TOAST_MESSAGES.VALIDATION_CORRECT_FIELDS))
      return
    }
    setFieldErrors({})
    setIsSubmitting(true)
    if (editingSlide) {
      updateSlide(editingSlide.id, {
        image: result.data.image,
        title: result.data.title,
        subtitle: result.data.subtitle,
        ctaText: result.data.ctaText,
        ctaLink: result.data.ctaLink,
        order: result.data.order,
        active: result.data.active,
      })
      toast.success(TOAST_MESSAGES.SAVED_SUCCESS)
    } else {
      addSlide({
        image: result.data.image,
        title: result.data.title,
        subtitle: result.data.subtitle,
        ctaText: result.data.ctaText,
        ctaLink: result.data.ctaLink,
        order: result.data.order,
        active: result.data.active,
      })
      toast.success(TOAST_MESSAGES.CREATED_SUCCESS)
    }
    setShowDialog(false)
    resetForm()
    setIsSubmitting(false)
  }

  const handleDeleteClick = (id: string) => {
    setSlideToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (!slideToDelete) return
    setIsDeleting(true)
    removeSlide(slideToDelete)
    toast.success(TOAST_MESSAGES.DELETED_SUCCESS)
    setSlideToDelete(null)
    setIsDeleting(false)
  }

  const moveUp = (index: number) => {
    if (index <= 0) return
    reorderSlides(sortedSlides[index].id, sortedSlides[index - 1].id)
  }

  const moveDown = (index: number) => {
    if (index >= sortedSlides.length - 1) return
    reorderSlides(sortedSlides[index].id, sortedSlides[index + 1].id)
  }

  if (loading) {
    return (
      <div className="flex flex-col gap-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Bannières hero</h2>
        </div>
        <TableSkeleton rowCount={5} columnCount={6} />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Bannières hero</h2>
          <p className="text-sm text-muted-foreground">
            {sortedSlides.length} bannière{sortedSlides.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Dialog open={showDialog} onOpenChange={setShowDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5" onClick={openAdd}>
              <Plus className="h-3.5 w-3.5" /> Nouvelle bannière
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <LayoutPanelTop className="h-5 w-5" />
                {editingSlide ? "Modifier la bannière" : "Nouvelle bannière"}
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 mt-4">
              <div>
                <Label className="text-sm font-medium">Image de la bannière *</Label>
                {fieldErrors.image && (
                  <p id="hero-image-error" className="text-xs text-destructive mt-0.5" role="alert">
                    {fieldErrors.image}
                  </p>
                )}
                {!imagePreview ? (
                  <label
                    htmlFor="hero-image-upload"
                    className="mt-1.5 flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex flex-col items-center justify-center py-6">
                      <Upload className="w-10 h-10 mb-2 text-muted-foreground" />
                      <p className="mb-1 text-sm text-muted-foreground">
                        <span className="font-semibold">Cliquez pour téléverser</span> ou glissez-déposez
                      </p>
                      <p className="text-xs text-muted-foreground">PNG, JPG, WEBP jusqu&apos;à 5 Mo</p>
                    </div>
                    <input
                      id="hero-image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </label>
                ) : (
                  <div className="mt-1.5 space-y-3">
                    <div className="relative aspect-[16/6] w-full max-w-full rounded-lg overflow-hidden border border-border bg-muted">
                      <SafeImage src={imagePreview ?? ""} alt="Aperçu bannière" className="w-full h-full object-cover rounded" />
                      <Button
                        type="button"
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8"
                        onClick={handleRemoveImage}
                        aria-label="Supprimer l'image"
                      >
                        <X className="h-4 w-4" aria-hidden />
                      </Button>
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => document.getElementById("hero-image-upload")?.click()}
                      className="gap-2"
                    >
                      <Upload className="h-4 w-4" />
                      Remplacer l&apos;image
                    </Button>
                    <input
                      id="hero-image-upload"
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageUpload}
                    />
                  </div>
                )}
              </div>
              <div>
                <Label htmlFor="hero-title">Titre *</Label>
                <Input
                  id="hero-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Ex: Collection Automne-Hiver"
                  className="mt-1.5"
                  maxLength={80}
                  aria-invalid={!!fieldErrors.title}
                  aria-describedby={fieldErrors.title ? "hero-title-error" : undefined}
                />
                {fieldErrors.title && (
                  <p id="hero-title-error" className="text-xs text-destructive mt-0.5" role="alert">
                    {fieldErrors.title}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="hero-subtitle">Sous-titre *</Label>
                <Input
                  id="hero-subtitle"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  placeholder="Ex: Découvrez nos nouveaux modèles"
                  className="mt-1.5"
                  maxLength={160}
                  aria-invalid={!!fieldErrors.subtitle}
                  aria-describedby={fieldErrors.subtitle ? "hero-subtitle-error" : undefined}
                />
                {fieldErrors.subtitle && (
                  <p id="hero-subtitle-error" className="text-xs text-destructive mt-0.5" role="alert">
                    {fieldErrors.subtitle}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="hero-cta">Libellé du bouton *</Label>
                <Input
                  id="hero-cta"
                  value={ctaText}
                  onChange={(e) => setCtaText(e.target.value)}
                  placeholder="Ex: Voir la collection"
                  className="mt-1.5"
                  maxLength={40}
                  aria-invalid={!!fieldErrors.ctaText}
                  aria-describedby={fieldErrors.ctaText ? "hero-cta-error" : undefined}
                />
                {fieldErrors.ctaText && (
                  <p id="hero-cta-error" className="text-xs text-destructive mt-0.5" role="alert">
                    {fieldErrors.ctaText}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="hero-cta-link">Lien du bouton (optionnel)</Label>
                <Input
                  id="hero-cta-link"
                  value={ctaLink}
                  onChange={(e) => setCtaLink(e.target.value)}
                  placeholder="https://... ou laisser vide pour catalogue"
                  className="mt-1.5"
                  aria-invalid={!!fieldErrors.ctaLink}
                  aria-describedby={fieldErrors.ctaLink ? "hero-cta-link-error" : undefined}
                />
                {fieldErrors.ctaLink && (
                  <p id="hero-cta-link-error" className="text-xs text-destructive mt-0.5" role="alert">
                    {fieldErrors.ctaLink}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="hero-order">Ordre d&apos;affichage</Label>
                <Input
                  id="hero-order"
                  type="number"
                  min={0}
                  value={order}
                  onChange={(e) => setOrder(Number(e.target.value) || 0)}
                  className="mt-1.5 w-24"
                  aria-invalid={!!fieldErrors.order}
                  aria-describedby={fieldErrors.order ? "hero-order-error" : undefined}
                />
                {fieldErrors.order && (
                  <p id="hero-order-error" className="text-xs text-destructive mt-0.5" role="alert">
                    {fieldErrors.order}
                  </p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Switch
                  id="hero-active"
                  checked={active}
                  onCheckedChange={setActive}
                />
                <Label htmlFor="hero-active">Bannière active (visible sur l&apos;accueil)</Label>
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setShowDialog(false)} size="sm">
                Annuler
              </Button>
              <Button size="sm" onClick={handleSave} disabled={isSubmitting} loading={isSubmitting}>
                {editingSlide ? "Enregistrer" : "Ajouter"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {sortedSlides.length === 0 ? (
        <AdminEmptyState
          title="Aucune bannière"
          description="Ajoutez des bannières pour le slider de la page d'accueil."
          icon={LayoutPanelTop}
        >
          <Button onClick={openAdd} className="gap-2">
            <Plus className="h-4 w-4" /> Nouvelle bannière
          </Button>
        </AdminEmptyState>
      ) : (
        <div className="rounded-lg border border-border overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Aperçu</TableHead>
                <TableHead>Titre</TableHead>
                <TableHead className="hidden md:table-cell">Sous-titre</TableHead>
                <TableHead>CTA</TableHead>
                <TableHead className="w-16">Ordre</TableHead>
                <TableHead className="w-20">Actif</TableHead>
                <TableHead className="w-[140px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedSlides.map((slide, index) => (
                <TableRow key={slide.id}>
                  <TableCell>
                    <div className="w-20 h-12 rounded overflow-hidden bg-muted">
                      <SafeImage src={slide.image} alt={slide.title} className="w-full h-full object-cover rounded" />
                    </div>
                  </TableCell>
                  <TableCell className="font-medium">{slide.title}</TableCell>
                  <TableCell className="hidden md:table-cell text-muted-foreground max-w-[200px] truncate">
                    {slide.subtitle}
                  </TableCell>
                  <TableCell>{slide.ctaText}</TableCell>
                  <TableCell>{slide.order}</TableCell>
                  <TableCell>
                    {slide.active ? (
                      <Badge variant="default" className="bg-emerald-600">Oui</Badge>
                    ) : (
                      <Badge variant="secondary">Non</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <TooltipProvider delayDuration={300}>
                      <div className="flex items-center justify-end gap-0.5">
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => moveUp(index)}
                              disabled={index === 0}
                              aria-label="Monter la bannière"
                            >
                              <ChevronUp className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">Monter</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => moveDown(index)}
                              disabled={index === sortedSlides.length - 1}
                              aria-label="Descendre la bannière"
                            >
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">Descendre</TooltipContent>
                        </Tooltip>
                        <span className="w-px h-5 bg-border mx-1" aria-hidden />
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-foreground"
                              onClick={() => openEdit(slide)}
                              aria-label="Modifier la bannière"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">Modifier</TooltipContent>
                        </Tooltip>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-muted-foreground hover:text-destructive focus-visible:text-destructive"
                              onClick={() => handleDeleteClick(slide.id)}
                              aria-label="Supprimer la bannière"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TooltipTrigger>
                          <TooltipContent side="left">Supprimer</TooltipContent>
                        </Tooltip>
                      </div>
                    </TooltipProvider>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Supprimer ?"
        description="La bannière sera retirée du hero. Irréversible."
        onConfirm={confirmDelete}
        loading={isDeleting}
      />
    </div>
  )
}
