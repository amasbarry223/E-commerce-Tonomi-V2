"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { getProducts, getCategories } from "@/lib/services"
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
  const products = getProducts()
  const categories = getCategories()
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

  const confirmDeleteProduct = () => {
    if (!productToDelete) return
    setIsDeleting(true)
    const product = products.find(p => p.id === productToDelete)
    if (product) {
      toast.info(TOAST_MESSAGES.DEMO_DELETE_PRODUCT)
    }
    setProductToDelete(null)
    setIsDeleting(false)
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
  const products = getProducts()
  const categories = getCategories()
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

  const handleSubmit = async () => {
    setFieldErrors({})
    const numPrice = price.trim() === "" ? NaN : parseFloat(price.replace(",", "."))
    const numStock = stock.trim() === "" ? NaN : parseInt(stock, 10)
    const payload = {
      name: name.trim(),
      price: numPrice,
      description: description.trim(),
      stock: Number.isNaN(numStock) ? 0 : numStock,
      category: category.trim(),
      sku: sku.trim(),
    }
    const result = productSchema.safeParse(payload)
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
    await new Promise(r => setTimeout(r, 500))
    setIsSubmitting(false)
    if (onSave) onSave(isNew)
    else onClose()
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
        <div className="mt-1 border-2 border-dashed border-border rounded-lg p-8 text-center">
          <Upload className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">Glissez vos images ici ou cliquez pour parcourir</p>
          <p className="text-xs text-muted-foreground mt-1">PNG, JPG jusqu{"'"}a 5MB</p>
        </div>
        {product && product.images.length > 0 && (
          <div className="flex gap-2 mt-3">
            {product.images.map((img, i) => (
              <Image key={i} src={img} alt={`Image ${i + 1}`} width={64} height={64} className="h-16 w-16 rounded object-cover border border-border" />
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
