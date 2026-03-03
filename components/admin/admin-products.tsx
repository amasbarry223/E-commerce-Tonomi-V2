"use client"

import { useState, useMemo, useEffect } from "react"
import Image from "next/image"
import { useProducts, useCategories } from "@/hooks"
import { IMAGE_PATHS } from "@/lib/supabase/storage"
import { formatPrice, getStatusColor, getStatusLabel } from "@/lib/formatters"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { PaginationSimple as Pagination } from "@/components/ui/pagination"
import { Plus, Edit, Trash2, Eye, Copy, Download, Upload, MoreHorizontal, Package } from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { usePagination } from "@/hooks/use-pagination"
import { TableSkeleton } from "@/components/ui/table-skeleton"
import { AdminSectionHeader } from "@/components/admin/admin-section-header"
import { AdminTableToolbar } from "@/components/admin/admin-table-toolbar"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog"
import { productSchema, getZodErrorMessage } from "@/lib/utils/validation"
import { TOAST_MESSAGES, AUTH_DELAYS_MS } from "@/lib/constants"
import { useSimulatedLoading } from "@/hooks/use-simulated-loading"
import { useNavigationStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"

export function AdminProducts() {
  const { products, isLoading: isLoadingProducts } = useProducts()
  const { categories, isLoading: isLoadingCategories } = useCategories()
  const { navigate, selectProduct, setCurrentView } = useNavigationStore()
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [loading] = useSimulatedLoading(AUTH_DELAYS_MS.ADMIN_LOADING)
  const isInitialLoading = isLoadingProducts || isLoadingCategories

  const filtered = useMemo(() => {
    let result = [...products]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
    }
    if (categoryFilter !== "all") result = result.filter(p => p.category === categoryFilter)
    if (statusFilter !== "all") result = result.filter(p => p.status === statusFilter)
    return result
  }, [search, categoryFilter, statusFilter, products])

  const {
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage,
  } = usePagination(filtered, { itemsPerPage: 10 })

  const handleViewProduct = (productId: string) => {
    selectProduct(productId)
    setCurrentView("store")
    navigate(PAGES.store.product)
  }

  const handleEditProduct = (productId: string) => {
    setEditingProduct(productId)
    toast.info("Ouverture de l'éditeur de produit")
  }

  const handleDuplicateProduct = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      toast.success(`Produit "${product.name}" dupliqué avec succès`)
    }
  }

  const handleDeleteClick = (productId: string) => {
    setProductToDelete(productId)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteProduct = async () => {
    if (!productToDelete) return
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/products?id=${productToDelete}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        const error = await response.json()
        throw new Error(error.error || "Failed to delete product")
      }
      toast.success("Produit supprimé avec succès")
      setProductToDelete(null)
      // Recharger les produits en rafraîchissant la page
      window.location.reload()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur s'est produite")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleProductSaved = (isNew: boolean) => {
    if (isNew) {
      toast.success("Produit créé avec succès")
    } else {
      toast.success("Produit modifié avec succès")
    }
    setShowAddDialog(false)
    setEditingProduct(null)
  }

  if (isInitialLoading) {
    return <div>Chargement...</div>
  }

  return (
    <div className="flex flex-col gap-6">
      <AdminSectionHeader
        title="Gestion des produits"
        description={`${products.length} produits au total`}
      >
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info("Fonctionnalité à venir")}>
          <Upload className="h-3.5 w-3.5" /> Importer CSV
        </Button>
        <Button variant="outline" size="sm" className="gap-1.5" onClick={() => toast.info("Fonctionnalité à venir")}>
          <Download className="h-3.5 w-3.5" /> Exporter
        </Button>
        <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5">
              <Plus className="h-3.5 w-3.5" /> Ajouter
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Nouveau produit</DialogTitle>
            </DialogHeader>
            <ProductForm onClose={() => setShowAddDialog(false)} onSave={handleProductSaved} />
          </DialogContent>
        </Dialog>
      </AdminSectionHeader>

      {/* Filters */}
      <AdminTableToolbar
        searchPlaceholder="Rechercher un produit ou SKU..."
        searchValue={search}
        onSearchChange={setSearch}
      >
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Catégorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les catégories</SelectItem>
            {categories.map(c => (
              <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Statut" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tous les statuts</SelectItem>
            <SelectItem value="published">Publié</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="archived">Archivé</SelectItem>
            <SelectItem value="out-of-stock">Rupture</SelectItem>
          </SelectContent>
        </Select>
      </AdminTableToolbar>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-4">
            <TableSkeleton rowCount={10} columnCount={6} />
          </div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Produit</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">SKU</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground">Prix</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden lg:table-cell">Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-muted-foreground hidden md:table-cell">Statut</th>
                    <th className="text-right py-3 px-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedData.map(product => {
                    const category = categories.find(c => c.id === product.category)
                    return (
                      <tr key={product.id} className="border-b border-border last:border-0 hover:bg-muted/30 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <Image src={product.images[0] ?? "/placeholder.svg"} alt={product.name} width={40} height={40} className="h-10 w-10 rounded object-cover shrink-0" />
                            <div className="min-w-0">
                              <p className="font-medium truncate max-w-[200px]">{product.name}</p>
                              <p className="text-xs text-muted-foreground">{category?.name} | {product.brand}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4 font-mono text-xs hidden md:table-cell">{product.sku}</td>
                        <td className="py-3 px-4">
                          <div>
                            <span className="font-medium">{formatPrice(product.price)}</span>
                            {product.originalPrice && (
                              <span className="text-xs text-muted-foreground line-through block">{formatPrice(product.originalPrice)}</span>
                            )}
                          </div>
                        </td>
                        <td className="py-3 px-4 hidden lg:table-cell">
                          <span className={product.stock <= 10 ? "text-amber-600 font-medium" : ""}>
                            {product.stock}
                          </span>
                        </td>
                        <td className="py-3 px-4 hidden md:table-cell">
                          <Badge className={`${getStatusColor(product.status)} text-xs`}>
                            {getStatusLabel(product.status)}
                          </Badge>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-11 w-11 sm:h-8 sm:w-8" aria-label={`Actions pour ${product.name}`}>
                                <MoreHorizontal className="h-4 w-4" aria-hidden />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="gap-2" onClick={() => handleViewProduct(product.id)}>
                                <Eye className="h-3.5 w-3.5" /> Voir
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2" onClick={() => handleEditProduct(product.id)}>
                                <Edit className="h-3.5 w-3.5" /> Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2" onClick={() => handleDuplicateProduct(product.id)}>
                                <Copy className="h-3.5 w-3.5" /> Dupliquer
                              </DropdownMenuItem>
                              <DropdownMenuItem className="gap-2 text-destructive" onClick={() => handleDeleteClick(product.id)}>
                                <Trash2 className="h-3.5 w-3.5" /> Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
            {!loading && filtered.length === 0 && (
              <AdminEmptyState
                title="Aucun produit trouvé"
                description="Ajoutez des produits pour les afficher ici."
                icon={Package}
              />
            )}
          </>
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
              itemLabel="produits"
              className="w-full"
            />
          </div>
        )}
      </div>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Supprimer le produit"
        description="En mode démo, les données sont statiques : le produit restera affiché. Avec un backend, il serait supprimé définitivement."
        onConfirm={confirmDeleteProduct}
        loading={isDeleting}
      />

      {/* Edit Dialog */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le produit</DialogTitle>
            </DialogHeader>
            <ProductForm
              productId={editingProduct}
              onClose={() => setEditingProduct(null)}
              onSave={handleProductSaved}
            />
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}

function ProductForm({
  productId,
  onClose,
  onSave
}: {
  productId?: string
  onClose: () => void
  onSave?: (isNew: boolean) => void
}) {
  const { products, isLoading: isLoadingProducts } = useProducts()
  const { categories, isLoading: isLoadingCategories } = useCategories()
  const product = productId ? products.find(p => p.id === productId) : null
  const isNew = !productId
  const [name, setName] = useState(product?.name ?? "")
  const [brand, setBrand] = useState(product?.brand ?? "")
  const [shortDescription, setShortDescription] = useState(product?.shortDescription ?? "")
  const [description, setDescription] = useState(product?.description ?? "")
  const [price, setPrice] = useState(product?.price != null ? String(product.price) : "")
  const [originalPrice, setOriginalPrice] = useState(product?.originalPrice != null ? String(product.originalPrice) : "")
  const [stock, setStock] = useState(product?.stock != null ? String(product.stock) : "")
  const [category, setCategory] = useState(product?.category ?? "")
  const [status, setStatus] = useState<string>(product?.status ?? "draft")
  const [material, setMaterial] = useState(product?.material ?? "")
  const [sku, setSku] = useState(product?.sku ?? "")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedImages, setSelectedImages] = useState<File[]>([])
  const [existingImageUrls, setExistingImageUrls] = useState<string[]>([])
  const [newImagePreviews, setNewImagePreviews] = useState<string[]>([])
  const [isUploadingImages, setIsUploadingImages] = useState(false)

  // Charger les images existantes quand le produit change
  useEffect(() => {
    if (product?.images) {
      setExistingImageUrls(product.images)
    } else {
      setExistingImageUrls([])
    }
    // Réinitialiser les nouvelles images quand on change de produit
    setSelectedImages([])
    setNewImagePreviews([])
  }, [product?.id])

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    if (files.length === 0) return

    // Vérifier le type et la taille
    const validFiles = files.filter(file => {
      if (!file.type.startsWith("image/")) {
        toast.error(`${file.name} n'est pas une image valide`)
        return false
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name} est trop volumineux (max 5MB)`)
        return false
      }
      return true
    })

    if (validFiles.length === 0) return

    setSelectedImages(prev => [...prev, ...validFiles])

    // Créer des aperçus pour les nouvelles images
    validFiles.forEach(file => {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setNewImagePreviews(prev => [...prev, result])
      }
      reader.readAsDataURL(file)
    })
  }

  const handleRemoveExistingImage = (index: number) => {
    setExistingImageUrls(prev => prev.filter((_, i) => i !== index))
  }

  const handleRemoveNewImage = (index: number) => {
    setNewImagePreviews(prev => prev.filter((_, i) => i !== index))
    setSelectedImages(prev => prev.filter((_, i) => i !== index))
  }

  const handleSubmit = async () => {
    setFieldErrors({})
    const numPrice = price.trim() === "" ? NaN : parseFloat(price.replace(",", "."))
    const numOriginalPrice = originalPrice.trim() === "" ? NaN : parseFloat(originalPrice.replace(",", "."))
    const numStock = stock.trim() === "" ? NaN : parseInt(stock, 10)
    
    // Générer le slug à partir du nom
    const slug = name.trim()
      .toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)/g, "")
    
    const payload = {
      name: name.trim(),
      slug: product?.slug || slug,
      price: numPrice,
      description: description.trim(),
      shortDescription: shortDescription.trim() || description.trim().substring(0, 150),
      stock: Number.isNaN(numStock) ? 0 : numStock,
      categoryId: category.trim(),
      sku: sku.trim(),
      brand: brand.trim() || "Tonomi",
      material: material.trim() || "Non spécifié",
      originalPrice: Number.isNaN(numOriginalPrice) ? undefined : numOriginalPrice,
      status: status,
      images: product?.images || [],
      colors: product?.colors || [],
      sizes: product?.sizes || [],
    }
    const result = productSchema.safeParse({
      name: payload.name,
      price: payload.price,
      description: payload.description,
      stock: payload.stock,
      category: payload.categoryId,
      sku: payload.sku,
    })
    if (!result.success) {
      const errors: Record<string, string> = {}
      result.error.issues.forEach((err) => {
        const path = err.path[0] as string
        if (!errors[path]) errors[path] = err.message
      })
      setFieldErrors(errors)
      toast.error(getZodErrorMessage(result.error, TOAST_MESSAGES.VALIDATION_CORRECT_FIELDS))
      return
    }
    setIsSubmitting(true)
    setIsUploadingImages(true)
    try {
      // Upload des images vers Supabase Storage via l'API
      const uploadedImageUrls: string[] = []
      for (const file of selectedImages) {
        try {
          const formData = new FormData()
          formData.append("file", file)
          formData.append("folder", IMAGE_PATHS.products)

          const response = await fetch("/api/upload", {
            method: "POST",
            body: formData,
          })

          if (!response.ok) {
            const error = await response.json()
            throw new Error(error.error || "Failed to upload image")
          }

          const result = await response.json()
          uploadedImageUrls.push(result.url)
        } catch (error) {
          console.error("Error uploading image:", error)
          toast.error(`Erreur lors de l'upload de ${file.name}: ${error instanceof Error ? error.message : "Erreur inconnue"}`)
        }
      }

      // Combiner les images existantes avec les nouvelles
      const allImages = [...existingImageUrls, ...uploadedImageUrls]

      // Mettre à jour le payload avec les images
      payload.images = allImages

      if (productId) {
        // Update existing product
        const response = await fetch(`/api/products?id=${productId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to update product")
        }
        toast.success("Produit modifié avec succès")
      } else {
        // Create new product
        const response = await fetch("/api/products", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        })
        if (!response.ok) {
          const error = await response.json()
          throw new Error(error.error || "Failed to create product")
        }
        toast.success("Produit créé avec succès")
      }
      if (onSave) onSave(isNew)
      else onClose()
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Une erreur s'est produite")
    } finally {
      setIsSubmitting(false)
      setIsUploadingImages(false)
    }
  }

  if (isLoadingProducts || isLoadingCategories) {
    return <div>Chargement...</div>
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm" htmlFor="product-name">Nom du produit <span className="text-destructive" aria-hidden="true">*</span></Label>
          <Input id="product-name" value={name} onChange={(e) => setName(e.target.value)} className="mt-1" placeholder="Nom du produit" aria-invalid={!!fieldErrors.name} aria-describedby={fieldErrors.name ? "name-error" : undefined} />
          {fieldErrors.name && <p id="name-error" className="text-xs text-destructive mt-0.5">{fieldErrors.name}</p>}
        </div>
        <div>
          <Label className="text-sm" htmlFor="product-brand">Marque</Label>
          <Input id="product-brand" value={brand} onChange={(e) => setBrand(e.target.value)} className="mt-1" placeholder="Marque" />
        </div>
      </div>

      <div>
        <Label className="text-sm" htmlFor="product-short-desc">Description courte</Label>
        <Input id="product-short-desc" value={shortDescription} onChange={(e) => setShortDescription(e.target.value)} className="mt-1" placeholder="Description courte" />
      </div>

      <div>
        <Label className="text-sm" htmlFor="product-desc">Description complète <span className="text-destructive" aria-hidden="true">*</span></Label>
        <Textarea id="product-desc" value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1 min-h-[100px]" placeholder="Description détaillée" aria-invalid={!!fieldErrors.description} aria-describedby={fieldErrors.description ? "desc-error" : undefined} />
        {fieldErrors.description && <p id="desc-error" className="text-xs text-destructive mt-0.5">{fieldErrors.description}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-sm" htmlFor="product-price">Prix <span className="text-destructive" aria-hidden="true">*</span></Label>
          <Input id="product-price" type="number" value={price} onChange={(e) => setPrice(e.target.value)} className="mt-1" placeholder="0.00" min="0" step="0.01" aria-invalid={!!fieldErrors.price} aria-describedby={fieldErrors.price ? "price-error" : undefined} />
          {fieldErrors.price && <p id="price-error" className="text-xs text-destructive mt-0.5">{fieldErrors.price}</p>}
        </div>
        <div>
          <Label className="text-sm" htmlFor="product-original-price">Prix barré</Label>
          <Input id="product-original-price" type="number" value={originalPrice} onChange={(e) => setOriginalPrice(e.target.value)} className="mt-1" placeholder="0.00" min="0" step="0.01" />
        </div>
        <div>
          <Label className="text-sm" htmlFor="product-stock">Stock <span className="text-destructive" aria-hidden="true">*</span></Label>
          <Input id="product-stock" type="number" value={stock} onChange={(e) => setStock(e.target.value)} className="mt-1" placeholder="0" min="0" aria-invalid={!!fieldErrors.stock} aria-describedby={fieldErrors.stock ? "stock-error" : undefined} />
          {fieldErrors.stock && <p id="stock-error" className="text-xs text-destructive mt-0.5">{fieldErrors.stock}</p>}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm">Catégorie</Label>
          <Select value={category || undefined} onValueChange={setCategory}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Choisir" /></SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
          {fieldErrors.category && <p className="text-xs text-destructive mt-0.5">{fieldErrors.category}</p>}
        </div>
        <div>
          <Label className="text-sm">Statut</Label>
          <Select value={status} onValueChange={setStatus}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Publié</SelectItem>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="archived">Archivé</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-sm" htmlFor="product-material">Matiere</Label>
        <Input id="product-material" value={material} onChange={(e) => setMaterial(e.target.value)} className="mt-1" placeholder="Cuir veritable, etc." />
      </div>

      <div>
        <Label className="text-sm" htmlFor="product-sku">SKU <span className="text-destructive" aria-hidden="true">*</span></Label>
        <Input id="product-sku" value={sku} onChange={(e) => setSku(e.target.value)} className="mt-1" placeholder="SKU-001" aria-invalid={!!fieldErrors.sku} aria-describedby={fieldErrors.sku ? "sku-error" : undefined} />
        {fieldErrors.sku && <p id="sku-error" className="text-xs text-destructive mt-0.5">{fieldErrors.sku}</p>}
      </div>

      {/* Image upload area */}
      <div>
        <Label className="text-sm">Images</Label>
        <label
          htmlFor="product-images-upload"
          className="mt-1 flex flex-col items-center justify-center w-full border-2 border-dashed border-border rounded-lg p-8 cursor-pointer hover:bg-muted/50 transition-colors"
        >
          <Upload className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-sm text-muted-foreground">Cliquez pour sélectionner des images</p>
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG jusqu{"'"}à 5MB</p>
          <input
            id="product-images-upload"
            type="file"
            multiple
            accept="image/*"
            className="hidden"
            onChange={handleImageSelect}
            disabled={isUploadingImages}
          />
        </label>
        {(existingImageUrls.length > 0 || newImagePreviews.length > 0) && (
          <div className="flex flex-wrap gap-2 mt-3">
            {/* Images existantes */}
            {existingImageUrls.map((img, i) => (
              <div key={`existing-${i}`} className="relative">
                <Image
                  src={img}
                  alt={`Image existante ${i + 1}`}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded object-cover border border-border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(i)}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs hover:bg-destructive/90"
                  aria-label="Supprimer l'image"
                >
                  ×
                </button>
              </div>
            ))}
            {/* Nouvelles images (aperçus) */}
            {newImagePreviews.map((img, i) => (
              <div key={`new-${i}`} className="relative">
                <Image
                  src={img}
                  alt={`Nouvelle image ${i + 1}`}
                  width={64}
                  height={64}
                  className="h-16 w-16 rounded object-cover border border-border"
                />
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(i)}
                  className="absolute -top-1 -right-1 h-5 w-5 rounded-full bg-destructive text-destructive-foreground flex items-center justify-center text-xs hover:bg-destructive/90"
                  aria-label="Supprimer l'image"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={onClose} disabled={isSubmitting}>Annuler</Button>
        <Button onClick={handleSubmit} disabled={isSubmitting}>
          {isSubmitting ? "Enregistrement..." : product ? "Enregistrer" : "Créer le produit"}
        </Button>
      </div>
    </div>
  )
}
