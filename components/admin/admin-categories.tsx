"use client"

import { useState, useMemo } from "react"
import { categories as initialCategories } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Search, Plus, Edit, Trash2 } from "lucide-react"
import { toast } from "sonner"

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
  const [allCategories, setAllCategories] = useState<Category[]>(initialCategories)
  const [showAddEditDialog, setShowAddEditDialog] = useState(false)
  const [editingCategory, setEditingCategory] = useState<Category | null>(null)
  const [newCategoryName, setNewCategoryName] = useState("")
  const [newCategorySlug, setNewCategorySlug] = useState("")
  const [newCategoryImage, setNewCategoryImage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredCategories = useMemo(() => {
    if (!searchQuery) return allCategories
    const query = searchQuery.toLowerCase()
    return allCategories.filter(cat =>
      cat.name.toLowerCase().includes(query) ||
      cat.slug.toLowerCase().includes(query) ||
      cat.description.toLowerCase().includes(query)
    )
  }, [allCategories, searchQuery])

  const resetForm = () => {
    setEditingCategory(null)
    setNewCategoryName("")
    setNewCategorySlug("")
    setNewCategoryImage("")
  }

  const handleAddEditClick = (category?: Category) => {
    if (category) {
      setEditingCategory(category)
      setNewCategoryName(category.name)
      setNewCategorySlug(category.slug)
      setNewCategoryImage(category.image)
    } else {
      resetForm()
    }
    setShowAddEditDialog(true)
  }

  const handleSaveCategory = () => {
    if (!newCategoryName || !newCategorySlug || !newCategoryImage) {
      toast.error("Veuillez remplir tous les champs requis.")
      return
    }

    if (editingCategory) {
      // Edit existing category
      setAllCategories(prev =>
        prev.map(cat =>
          cat.id === editingCategory.id
            ? { ...cat, name: newCategoryName, slug: newCategorySlug, image: newCategoryImage }
            : cat
        )
      )
      toast.success("Catégorie modifiée avec succès.")
    } else {
      // Add new category
      const newId = `cat-${allCategories.length + 1}`
      const newCategory: Category = {
        id: newId,
        name: newCategoryName,
        slug: newCategorySlug,
        description: "", // Default empty description
        image: newCategoryImage,
        productCount: 0, // New categories start with 0 products
      }
      setAllCategories(prev => [...prev, newCategory])
      toast.success("Catégorie ajoutée avec succès.")
    }
    setShowAddEditDialog(false)
    resetForm()
  }

  const handleDeleteCategory = (id: string) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")) {
      setAllCategories(prev => prev.filter(cat => cat.id !== id))
      toast.success("Catégorie supprimée avec succès.")
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-bold">Gestion des Catégories</h2>
          <p className="text-sm text-muted-foreground">{allCategories.length} catégories</p>
        </div>
        <Dialog open={showAddEditDialog} onOpenChange={setShowAddEditDialog}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5" onClick={() => handleAddEditClick()}>
              <Plus className="h-3.5 w-3.5" /> Nouvelle catégorie
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCategory ? "Modifier la catégorie" : "Ajouter une nouvelle catégorie"}</DialogTitle>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4">
              <div>
                <Label htmlFor="categoryName" className="text-sm">Nom de la catégorie</Label>
                <Input
                  id="categoryName"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  className="mt-1"
                  placeholder="Ex: Sacs à main"
                />
              </div>
              <div>
                <Label htmlFor="categorySlug" className="text-sm">Slug</Label>
                <Input
                  id="categorySlug"
                  value={newCategorySlug}
                  onChange={(e) => setNewCategorySlug(e.target.value)}
                  className="mt-1"
                  placeholder="Ex: sacs-a-main"
                />
              </div>
              <div>
                <Label htmlFor="categoryImage" className="text-sm">URL Image</Label>
                <Input
                  id="categoryImage"
                  value={newCategoryImage}
                  onChange={(e) => setNewCategoryImage(e.target.value)}
                  className="mt-1"
                  placeholder="Ex: https://images.unsplash.com/..."
                />
              </div>
            </div>
            <div className="flex justify-end gap-2">
              <Button variant="outline" onClick={() => setShowAddEditDialog(false)}>Annuler</Button>
              <Button onClick={handleSaveCategory}>Enregistrer</Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Rechercher une catégorie..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10"
        />
      </div>

      <div className="bg-card border border-border rounded-lg overflow-hidden">
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
                <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                  Aucune catégorie trouvée.
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map(category => (
                <TableRow key={category.id}>
                  <TableCell>
                    <img src={category.image} alt={category.name} className="h-10 w-10 rounded object-cover" crossOrigin="anonymous" />
                  </TableCell>
                  <TableCell className="font-medium">{category.name}</TableCell>
                  <TableCell className="text-muted-foreground">{category.slug}</TableCell>
                  <TableCell className="text-right">{category.productCount}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="icon" onClick={() => handleAddEditClick(category)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="icon" onClick={() => handleDeleteCategory(category.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
