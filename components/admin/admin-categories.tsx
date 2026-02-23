"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { getCategories } from "@/lib/services"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Search as SearchIcon, Plus, Edit, Trash2, FolderOpen, Image as ImageIcon, Eye, MoreHorizontal, Upload, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { VALIDATION_LIMITS, TOAST_MESSAGES, AUTH_DELAYS_MS } from "@/lib/constants"
import { categorySchema, getZodErrorMessage } from "@/lib/utils/validation"
import { PaginationSimple as Pagination } from "@/components/ui/pagination"
import { usePagination } from "@/hooks/use-pagination"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { AdminTableToolbar } from "@/components/admin/admin-table-toolbar"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog"
import { SafeImage } from "@/components/ui/safe-image"
import { useSimulatedLoading } from "@/hooks/use-simulated-loading"

// Define the structure for a Category (must match lib/data.ts interface)
interface Category {
  id: string
  name: string
  slug: string
  description: string
  image: string
  parentId?: string
  productCount: number
  metaTitle?: string
  metaDescription?: string
}

export function AdminCategories() {
  const initialCategories = getCategories()
  const [allCategories, setAllCategories] = useState<Category[]>(initialCategories)
  const [showAddEditDialog, setShowAddEditDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [categoryName, setCategoryName] = useState("")
  const [categorySlug, setCategorySlug] = useState("")
  const [categoryDescription, setCategoryDescription] = useState("")
  const [categoryImage, setCategoryImage] = useState("")
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [categoryMetaTitle, setCategoryMetaTitle] = useState("")
  const [categoryMetaDescription, setCategoryMetaDescription] = useState("")
  const [categoryParentId, setCategoryParentId] = useState<string>("")
  const [searchQuery, setSearchQuery] = useState("")
  const [categoryToDelete, setCategoryToDelete] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [loading, _setLoading] = useSimulatedLoading(AUTH_DELAYS_MS.ADMIN_LOADING)
  const [categoryFieldErrors, setCategoryFieldErrors] = useState<Record<string, string>>({})

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return allCategories
    const query = searchQuery.toLowerCase()
    return allCategories.filter(cat =>
      cat.name.toLowerCase().includes(query) ||
      cat.slug.toLowerCase().includes(query) ||
      cat.description.toLowerCase().includes(query)
    )
  }, [allCategories, searchQuery])

  const {
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage,
  } = usePagination(filteredCategories, { itemsPerPage: 10 })

  const resetForm = () => {
    setEditingCategory(null)
    setCategoryName("")
    setCategorySlug("")
    setCategoryDescription("")
    setCategoryImage("")
    setImagePreview(null)
    setCategoryMetaTitle("")
    setCategoryMetaDescription("")
    setCategoryParentId("")
    setCategoryFieldErrors({})
  }

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      toast.error("Veuillez sélectionner un fichier image")
      return
    }

    // Vérifier la taille (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("L'image ne doit pas dépasser 5MB")
      return
    }

    // Créer un aperçu local
    const reader = new FileReader()
    reader.onloadend = () => {
      const result = reader.result as string
      setImagePreview(result)
      setCategoryImage(result) // Stocker l'URL de données pour l'instant
    }
    reader.readAsDataURL(file)
  }

  const handleRemoveImage = () => {
    setImagePreview(null)
    setCategoryImage("")
  }

  const handleAddEditClick = (category?: Category) => {
    setCategoryFieldErrors({})
    if (category) {
      setEditingCategory(category)
      setCategoryName(category.name)
      setCategorySlug(category.slug)
      setCategoryDescription(category.description || "")
      setCategoryImage(category.image)
      setImagePreview(category.image)
      setCategoryMetaTitle(category.metaTitle || "")
      setCategoryMetaDescription(category.metaDescription || "")
      setCategoryParentId(category.parentId || "")
    } else {
      resetForm()
    }
    setShowAddEditDialog(true)
  }

  const handleSaveCategory = () => {
    const validationResult = categorySchema.safeParse({
      name: categoryName,
      slug: categorySlug,
      description: categoryDescription,
      image: categoryImage,
      metaTitle: categoryMetaTitle || undefined,
      metaDescription: categoryMetaDescription || undefined,
      parentId: categoryParentId || undefined,
    })

    if (!validationResult.success) {
      const errors: Record<string, string> = {}
      validationResult.error.issues.forEach((err) => {
        const path = (err.path[0] as string) ?? "form"
        if (!errors[path]) errors[path] = err.message ?? "Erreur"
      })
      setCategoryFieldErrors(errors)
      toast.error(getZodErrorMessage(validationResult.error, TOAST_MESSAGES.VALIDATION_CORRECT_FIELDS))
      return
    }
    setCategoryFieldErrors({})
    setIsSubmitting(true)
    if (editingCategory) {
      // Edit existing category
      setAllCategories(prev =>
        prev.map(cat =>
          cat.id === editingCategory.id
            ? {
                ...cat,
                name: categoryName,
                slug: categorySlug,
                description: categoryDescription,
                image: categoryImage,
                metaTitle: categoryMetaTitle || undefined,
                metaDescription: categoryMetaDescription || undefined,
                parentId: categoryParentId || undefined,
              }
            : cat
        )
      )
      toast.success("Catégorie modifiée avec succès.")
    } else {
      // Add new category - Generate unique ID by finding max existing ID
      const existingIds = allCategories.map(cat => {
        const match = cat.id.match(/^cat-(\d+)$/)
        return match ? parseInt(match[1], 10) : 0
      })
      const maxId = existingIds.length > 0 ? Math.max(...existingIds) : 0
      const newId = `cat-${maxId + 1}`
      const newCategory: Category = {
        id: newId,
        name: categoryName,
        slug: categorySlug,
        description: categoryDescription,
        image: categoryImage,
        productCount: 0,
        metaTitle: categoryMetaTitle || undefined,
        metaDescription: categoryMetaDescription || undefined,
        parentId: categoryParentId || undefined,
      }
      setAllCategories(prev => [...prev, newCategory])
      toast.success("Catégorie ajoutée avec succès.")
    }
    setShowAddEditDialog(false)
    resetForm()
    setIsSubmitting(false)
  }

  // Générer le slug automatiquement depuis le nom
  const handleNameChange = (value: string) => {
    setCategoryName(value)
    if (!editingCategory && !categorySlug) {
      // Auto-generate slug from name
      const slug = value
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "")
      setCategorySlug(slug)
    }
  }

  const handleDeleteCategory = (id: string) => {
    setCategoryToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteCategory = () => {
    if (!categoryToDelete) return
    setIsDeleting(true)
    setAllCategories(prev => prev.filter(cat => cat.id !== categoryToDelete))
    toast.success("Catégorie supprimée avec succès.")
    setCategoryToDelete(null)
    setIsDeleting(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminSectionHeader
        title="Gestion des Catégories"
        description={`${allCategories.length} catégories`}
      >
        <Dialog open={showAddEditDialog} onOpenChange={setShowAddEditDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5" onClick={() => handleAddEditClick()}>
              <Plus className="h-3.5 w-3.5" /> Nouvelle catégorie
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <FolderOpen className="h-5 w-5" />
                {editingCategory ? "Modifier la catégorie" : "Nouvelle catégorie"}
              </DialogTitle>
            </DialogHeader>

            <Tabs defaultValue="basic" className="mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic" className="gap-1.5 text-xs">
                  <FolderOpen className="h-3.5 w-3.5" />
                  Informations
                </TabsTrigger>
                <TabsTrigger value="image" className="gap-1.5 text-xs">
                  <ImageIcon className="h-3.5 w-3.5" />
                  Image
                </TabsTrigger>
                <TabsTrigger value="seo" className="gap-1.5 text-xs">
                  <SearchIcon className="h-3.5 w-3.5" />
                  SEO
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-1.5 text-xs">
                  <Eye className="h-3.5 w-3.5" />
                  Aperçu
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="category-name" className="text-sm font-medium">
                    Nom de la catégorie <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="category-name"
                    value={categoryName}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="mt-1.5"
                    placeholder="Ex: Sacs à main"
                    required
                    aria-invalid={!!categoryFieldErrors.name}
                    aria-describedby={categoryFieldErrors.name ? "category-name-error" : undefined}
                  />
                  {categoryFieldErrors.name && (
                    <p id="category-name-error" className="text-xs text-destructive mt-0.5" role="alert">
                      {categoryFieldErrors.name}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category-slug" className="text-sm font-medium">
                    Slug <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id="category-slug"
                    value={categorySlug}
                    onChange={(e) => setCategorySlug(e.target.value)}
                    className="mt-1.5 font-mono"
                    placeholder="sacs-a-main"
                    required
                    aria-invalid={!!categoryFieldErrors.slug}
                    aria-describedby={categoryFieldErrors.slug ? "category-slug-error" : undefined}
                  />
                  {categoryFieldErrors.slug && (
                    <p id="category-slug-error" className="text-xs text-destructive mt-0.5" role="alert">
                      {categoryFieldErrors.slug}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    URL-friendly version du nom (généré automatiquement)
                  </p>
                </div>

                <div>
                  <Label htmlFor="category-description" className="text-sm font-medium">
                    Description
                  </Label>
                  <Textarea
                    id="category-description"
                    value={categoryDescription}
                    onChange={(e) => setCategoryDescription(e.target.value)}
                    className="mt-1.5 min-h-[100px]"
                    placeholder="Description de la catégorie..."
                    aria-invalid={!!categoryFieldErrors.description}
                    aria-describedby={categoryFieldErrors.description ? "category-description-error" : undefined}
                  />
                  {categoryFieldErrors.description && (
                    <p id="category-description-error" className="text-xs text-destructive mt-0.5" role="alert">
                      {categoryFieldErrors.description}
                    </p>
                  )}
                </div>

                <div>
                  <Label htmlFor="category-parent" className="text-sm font-medium">
                    Catégorie parente
                  </Label>
                  <Select value={categoryParentId || "none"} onValueChange={(value) => setCategoryParentId(value === "none" ? "" : value)}>
                    <SelectTrigger id="category-parent" className="mt-1.5">
                      <SelectValue placeholder="Aucune (catégorie principale)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">Aucune (catégorie principale)</SelectItem>
                      {allCategories
                        .filter((cat) => cat.id !== editingCategory?.id)
                        .map((cat) => (
                          <SelectItem key={cat.id} value={cat.id}>
                            {cat.name}
                          </SelectItem>
                        ))}
                    </SelectContent>
                  </Select>
                </div>
              </TabsContent>

              <TabsContent value="image" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="category-image" className="text-sm font-medium">
                    Image de la catégorie <span className="text-destructive">*</span>
                  </Label>
                  {(categoryFieldErrors.image && !imagePreview) && (
                    <p id="category-image-error" className="text-xs text-destructive mt-0.5" role="alert">
                      {categoryFieldErrors.image}
                    </p>
                  )}
                  {!imagePreview ? (
                    <div className="mt-1.5">
                      <label
                        htmlFor="category-image-upload"
                        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-lg cursor-pointer hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                          <Upload className="w-10 h-10 mb-3 text-muted-foreground" />
                          <p className="mb-2 text-sm text-muted-foreground">
                            <span className="font-semibold">Cliquez pour télécharger</span> ou glissez-déposez
                          </p>
                          <p className="text-xs text-muted-foreground">PNG, JPG, WEBP jusqu&apos;à 5MB</p>
                        </div>
                        <input
                          id="category-image-upload"
                          type="file"
                          className="hidden"
                          accept="image/*"
                          onChange={handleImageUpload}
                        />
                      </label>
                    </div>
                  ) : (
                    <div className="mt-1.5 space-y-3">
                      <div className="relative aspect-[4/3] w-full max-w-xs rounded-lg overflow-hidden border border-border bg-muted">
                        <SafeImage src={imagePreview ?? ""} alt={"Aperçu de l'image"} className="w-full h-full object-cover" />
                        <Button
                          type="button"
                          variant="destructive"
                          size="icon"
                          className="absolute top-2 right-2 h-11 w-11 sm:h-8 sm:w-8"
                          onClick={handleRemoveImage}
                          aria-label={"Supprimer l'image"}
                        >
                          <X className="h-4 w-4" aria-hidden />
                        </Button>
                      </div>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById("category-image-upload")?.click()}
                        className="gap-2"
                      >
                        <Upload className="h-4 w-4" />
                        Remplacer l&apos;image
                      </Button>
                      <input
                        id="category-image-upload"
                        type="file"
                        className="hidden"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </div>
                  )}
                  {imagePreview && categoryFieldErrors.image && (
                    <p id="category-image-error" className="text-xs text-destructive mt-0.5" role="alert">
                      {categoryFieldErrors.image}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-2">
                    Téléchargez une image pour votre catégorie (recommandé: 800x600px)
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="seo" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="category-meta-title" className="text-sm font-medium">
                    Meta Title
                  </Label>
                  <Input
                    id="category-meta-title"
                    value={categoryMetaTitle}
                    onChange={(e) => setCategoryMetaTitle(e.target.value)}
                    className="mt-1.5"
                    placeholder={categoryName || "Titre SEO"}
                    maxLength={VALIDATION_LIMITS.META_TITLE_MAX_LENGTH}
                    aria-invalid={!!categoryFieldErrors.metaTitle}
                    aria-describedby={categoryFieldErrors.metaTitle ? "category-meta-title-error" : undefined}
                  />
                  {categoryFieldErrors.metaTitle && (
                    <p id="category-meta-title-error" className="text-xs text-destructive mt-0.5" role="alert">
                      {categoryFieldErrors.metaTitle}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {categoryMetaTitle.length}/{VALIDATION_LIMITS.META_TITLE_MAX_LENGTH} caractères
                  </p>
                </div>

                <div>
                  <Label htmlFor="category-meta-description" className="text-sm font-medium">
                    Meta Description
                  </Label>
                  <Textarea
                    id="category-meta-description"
                    value={categoryMetaDescription}
                    onChange={(e) => setCategoryMetaDescription(e.target.value)}
                    className="mt-1.5 min-h-[80px]"
                    placeholder="Description pour les moteurs de recherche..."
                    maxLength={VALIDATION_LIMITS.META_DESCRIPTION_MAX_LENGTH}
                    aria-invalid={!!categoryFieldErrors.metaDescription}
                    aria-describedby={categoryFieldErrors.metaDescription ? "category-meta-description-error" : undefined}
                  />
                  {categoryFieldErrors.metaDescription && (
                    <p id="category-meta-description-error" className="text-xs text-destructive mt-0.5" role="alert">
                      {categoryFieldErrors.metaDescription}
                    </p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {categoryMetaDescription.length}/{VALIDATION_LIMITS.META_DESCRIPTION_MAX_LENGTH} caractères
                  </p>
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-start gap-4 mb-3">
                    {(imagePreview || categoryImage) && (
                      <div className="relative aspect-[4/3] w-24 h-24 rounded-lg overflow-hidden border border-border flex-shrink-0 bg-muted">
                        <SafeImage src={imagePreview || categoryImage} alt={categoryName || "Catégorie"} className="w-full h-full object-cover" />
                      </div>
                    )}
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-bold text-lg">
                          {categoryName || "Nom de la catégorie"}
                        </h3>
                        <Badge variant="secondary" className="text-xs">
                          {editingCategory?.productCount || 0} produit{(editingCategory?.productCount || 0) > 1 ? "s" : ""}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {categoryDescription || "Aucune description"}
                      </p>
                      <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                        <span>Slug : <code className="bg-muted px-1 rounded">{categorySlug || "slug"}</code></span>
                        {categoryParentId && (
                          <span>
                            Parente : {allCategories.find((c) => c.id === categoryParentId)?.name || "N/A"}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Aperçu de la catégorie tel qu&apos;elle apparaîtra dans la liste
                </p>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 mt-4 border-t">
              <Button variant="outline" onClick={() => setShowAddEditDialog(false)} size="sm">
                Annuler
              </Button>
              <Button onClick={handleSaveCategory} size="sm" className="gap-1.5" loading={isSubmitting}>
                <Plus className="h-3.5 w-3.5" />
                {editingCategory ? "Enregistrer" : "Créer"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </AdminSectionHeader>

      <AdminTableToolbar
        searchPlaceholder="Rechercher une catégorie..."
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
      />

      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-4">
            <TableSkeleton rowCount={10} columnCount={5} />
          </div>
        ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Image</TableHead>
              <TableHead>Nom</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead className="text-right">Produits</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-0 border-0">
                  <AdminEmptyState
                    title="Aucune catégorie trouvée"
                    description="Ajoutez une catégorie pour commencer."
                    icon={FolderOpen}
                  />
                </TableCell>
              </TableRow>
            ) : (
              paginatedData.map((category, index) => (
                <TableRow key={category.id} index={index}>
                  <TableCell>
                    <Image src={category.image} alt={category.name} width={40} height={40} className="h-10 w-10 rounded object-cover" />
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell className="text-right">{category.productCount}</TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-11 w-11 sm:h-8 sm:w-8" aria-label={`Actions pour ${category.name}`}>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2" onClick={() => handleAddEditClick(category)}>
                          <Edit className="h-3.5 w-3.5" />
                          Modifier
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          className="gap-2 text-destructive"
                          onClick={() => handleDeleteCategory(category.id)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                          Supprimer
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
        )}
        {/* Pagination dans la carte : toujours visible sous le tableau */}
        {!loading && filteredCategories.length > 0 && (
          <div className="border-t border-border bg-muted/20 px-4 py-3 sm:px-6">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onPageChange={goToPage}
              itemLabel="catégories"
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Delete confirmation dialog */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Supprimer la catégorie"
        description="Êtes-vous sûr de vouloir supprimer cette catégorie ? Cette action est irréversible."
        onConfirm={confirmDeleteCategory}
        loading={isDeleting}
      />
    </div>
  )
}
