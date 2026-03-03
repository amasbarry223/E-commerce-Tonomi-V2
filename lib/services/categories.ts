/**
 * Service catégories
 */

import { categoryRepository } from "@/lib/repositories"
import type { Category } from "@/lib/types"

export type CategoryWithRelations = Awaited<ReturnType<typeof categoryRepository.findAll>>[0]

function transformCategory(prismaCategory: CategoryWithRelations): Category {
  return {
    id: prismaCategory.id,
    name: prismaCategory.name,
    slug: prismaCategory.slug,
    description: prismaCategory.description,
    image: prismaCategory.image || "",
    parentId: prismaCategory.parentId || undefined,
    productCount: prismaCategory._count?.products ?? 0,
    metaTitle: prismaCategory.metaTitle || undefined,
    metaDescription: prismaCategory.metaDescription || undefined,
  }
}

/**
 * Récupère toutes les catégories
 */
export async function getCategories(): Promise<Category[]> {
  const categories = await categoryRepository.findAll()
  return categories.map(transformCategory)
}

/**
 * Récupère une catégorie par ID
 */
export async function getCategoryById(id: string): Promise<Category | undefined> {
  const category = await categoryRepository.findById(id)
  return category ? transformCategory(category) : undefined
}

/**
 * Récupère une catégorie par slug
 */
export async function getCategoryBySlug(slug: string): Promise<Category | undefined> {
  const category = await categoryRepository.findBySlug(slug)
  return category ? transformCategory(category) : undefined
}

/**
 * Récupère les catégories racines (sans parent)
 */
export async function getRootCategories(): Promise<Category[]> {
  const categories = await categoryRepository.findRootCategories()
  return categories.map(transformCategory)
}

/**
 * Crée une nouvelle catégorie
 */
export async function createCategory(data: {
  name: string
  slug: string
  description?: string
  image?: string
  parentId?: string
  metaTitle?: string
  metaDescription?: string
}): Promise<Category> {
  const category = await categoryRepository.create({
    name: data.name,
    slug: data.slug,
    description: data.description || "",
    image: data.image && data.image.trim() !== "" ? data.image : null,
    parentId: data.parentId && data.parentId.trim() !== "" ? data.parentId : null,
    metaTitle: data.metaTitle && data.metaTitle.trim() !== "" ? data.metaTitle : null,
    metaDescription: data.metaDescription && data.metaDescription.trim() !== "" ? data.metaDescription : null,
  })
  const fullCategory = await categoryRepository.findById(category.id)
  if (!fullCategory) throw new Error("Failed to create category")
  
  // Logger l'action
  const { logActions } = await import("@/lib/utils/logger-service")
  await logActions.categoryCreated(category.id, data.name)
  
  return transformCategory(fullCategory)
}

/**
 * Met à jour une catégorie
 */
export async function updateCategory(
  id: string,
  data: {
    name?: string
    slug?: string
    description?: string
    image?: string
    parentId?: string
    metaTitle?: string
    metaDescription?: string
  }
): Promise<Category> {
  await categoryRepository.update(id, {
    name: data.name,
    slug: data.slug,
    description: data.description,
    image: data.image !== undefined ? data.image : undefined,
    parentId: data.parentId !== undefined ? (data.parentId || null) : undefined,
    metaTitle: data.metaTitle !== undefined ? (data.metaTitle || null) : undefined,
    metaDescription: data.metaDescription !== undefined ? (data.metaDescription || null) : undefined,
  })
  const updatedCategory = await categoryRepository.findById(id)
  if (!updatedCategory) throw new Error("Category not found")
  
  // Logger l'action
  const { logActions } = await import("@/lib/utils/logger-service")
  await logActions.categoryUpdated(id, updatedCategory.name)
  
  return transformCategory(updatedCategory)
}

/**
 * Supprime une catégorie
 */
export async function deleteCategory(id: string): Promise<void> {
  // Récupérer la catégorie avant suppression pour le log
  const category = await categoryRepository.findById(id)
  const categoryName = category?.name || "Catégorie inconnue"
  
  await categoryRepository.delete(id)
  
  // Logger l'action
  const { logActions } = await import("@/lib/utils/logger-service")
  await logActions.categoryDeleted(id, categoryName)
}
