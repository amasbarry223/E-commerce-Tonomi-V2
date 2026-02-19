"use client"

import { useState, useMemo } from "react"
import { products, categories, formatPrice, getStatusColor, getStatusLabel } from "@/lib/data"
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
import {
  Search, Plus, Edit, Trash2, Eye, Copy, Download, Upload,
  MoreHorizontal, Package,
} from "lucide-react"
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { toast } from "sonner"
import { usePagination } from "@/hooks/use-pagination"

export function AdminProducts() {
  const [search, setSearch] = useState("")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")
  const [editingProduct, setEditingProduct] = useState<string | null>(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [productToDelete, setProductToDelete] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)

  const filtered = useMemo(() => {
    let result = [...products]
    if (search) {
      const q = search.toLowerCase()
      result = result.filter(p => p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q))
    }
    if (categoryFilter !== "all") result = result.filter(p => p.category === categoryFilter)
    if (statusFilter !== "all") result = result.filter(p => p.status === statusFilter)
    return result
  }, [search, categoryFilter, statusFilter])

  const {
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage,
  } = usePagination(filtered, { itemsPerPage: 10 })

  const handleViewProduct = (productId: string) => {
    const product = products.find(p => p.id === productId)
    if (product) {
      toast.info(`Affichage du produit: ${product.name}`)
      // Ici vous pouvez naviguer vers la page produit ou ouvrir un modal
    }
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
    if (productToDelete) {
      const product = products.find(p => p.id === productToDelete)
      if (product) {
        toast.success(`Produit "${product.name}" supprimé avec succès`)
      }
      setProductToDelete(null)
      setDeleteDialogOpen(false)
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

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Gestion des produits</h2>
          <p className="text-sm text-muted-foreground">{products.length} produits au total</p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-1.5">
            <Upload className="h-3.5 w-3.5" /> Importer CSV
          </Button>
          <Button variant="outline" size="sm" className="gap-1.5">
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
              <ProductForm onClose={() => setShowAddDialog(false)} />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Rechercher un produit ou SKU..."
            className="pl-10"
          />
        </div>
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Categorie" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes les categories</SelectItem>
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
            <SelectItem value="published">Publie</SelectItem>
            <SelectItem value="draft">Brouillon</SelectItem>
            <SelectItem value="archived">Archive</SelectItem>
            <SelectItem value="out-of-stock">Rupture</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Table */}
      <div className="bg-card border border-border rounded-lg overflow-hidden">
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
                        <img src={product.images[0]} alt={product.name} className="h-10 w-10 rounded object-cover shrink-0" crossOrigin="anonymous" />
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
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
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
        {filtered.length === 0 && (
          <div className="py-12 text-center">
            <Package className="h-10 w-10 text-muted-foreground mx-auto mb-2" />
            <p className="text-muted-foreground">Aucun produit trouve</p>
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

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Supprimer le produit</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground">
              Êtes-vous sûr de vouloir supprimer ce produit ? Cette action est irréversible.
            </p>
          </div>
          <div className="flex justify-end gap-2">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)} size="sm">
              Annuler
            </Button>
            <Button variant="destructive" onClick={confirmDeleteProduct} size="sm">
              Supprimer
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      {editingProduct && (
        <Dialog open={!!editingProduct} onOpenChange={() => setEditingProduct(null)}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Modifier le produit</DialogTitle>
            </DialogHeader>
            <ProductForm 
              productId={editingProduct} 
              onClose={() => {
                setEditingProduct(null)
                if (editingProduct) {
                  toast.success("Produit modifié avec succès")
                }
              }}
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
  const product = productId ? products.find(p => p.id === productId) : null
  const isNew = !productId

  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm">Nom du produit</Label>
          <Input defaultValue={product?.name || ""} className="mt-1" placeholder="Nom du produit" />
        </div>
        <div>
          <Label className="text-sm">Marque</Label>
          <Input defaultValue={product?.brand || ""} className="mt-1" placeholder="Marque" />
        </div>
      </div>

      <div>
        <Label className="text-sm">Description courte</Label>
        <Input defaultValue={product?.shortDescription || ""} className="mt-1" placeholder="Description courte" />
      </div>

      <div>
        <Label className="text-sm">Description complete</Label>
        <Textarea defaultValue={product?.description || ""} className="mt-1 min-h-[100px]" placeholder="Description detaillee" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <Label className="text-sm">Prix</Label>
          <Input type="number" defaultValue={product?.price || ""} className="mt-1" placeholder="0.00" />
        </div>
        <div>
          <Label className="text-sm">Prix barre</Label>
          <Input type="number" defaultValue={product?.originalPrice || ""} className="mt-1" placeholder="0.00" />
        </div>
        <div>
          <Label className="text-sm">Stock</Label>
          <Input type="number" defaultValue={product?.stock || ""} className="mt-1" placeholder="0" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label className="text-sm">Categorie</Label>
          <Select defaultValue={product?.category || undefined}>
            <SelectTrigger className="mt-1"><SelectValue placeholder="Choisir" /></SelectTrigger>
            <SelectContent>
              {categories.map(c => (
                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="text-sm">Statut</Label>
          <Select defaultValue={product?.status || "draft"}>
            <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="published">Publie</SelectItem>
              <SelectItem value="draft">Brouillon</SelectItem>
              <SelectItem value="archived">Archive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label className="text-sm">Matiere</Label>
        <Input defaultValue={product?.material || ""} className="mt-1" placeholder="Cuir veritable, etc." />
      </div>

      <div>
        <Label className="text-sm">SKU</Label>
        <Input defaultValue={product?.sku || ""} className="mt-1" placeholder="SKU-001" />
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
              <img key={i} src={img} alt={`Image ${i + 1}`} className="h-16 w-16 rounded object-cover border border-border" crossOrigin="anonymous" />
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3 pt-4 border-t border-border">
        <Button variant="outline" onClick={onClose}>Annuler</Button>
        <Button onClick={() => {
          if (onSave) {
            onSave(isNew)
          } else {
            onClose()
          }
        }}>
          {product ? "Enregistrer" : "Creer le produit"}
        </Button>
      </div>
    </div>
  )
}
