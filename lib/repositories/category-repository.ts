/**
 * Repository pour les catégories
 */

import { prisma } from "@/lib/db/prisma"
import { BaseRepository } from "./base-repository"
import type { Category, Prisma } from "@prisma/client"

type CategoryWithRelations = Prisma.CategoryGetPayload<{
  include: {
    parent: true
    children: true
    _count: { select: { products: true } }
  }
}>

export class CategoryRepository extends BaseRepository<
  CategoryWithRelations,
  Prisma.CategoryCreateInput,
  Prisma.CategoryUpdateInput
> {
  protected model = prisma.category

  /**
   * Récupère toutes les catégories avec leurs relations
   */
  async findAll(): Promise<CategoryWithRelations[]> {
    return prisma.category.findMany({
      include: {
        parent: true,
        children: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    })
  }

  /**
   * Récupère une catégorie par slug
   */
  async findBySlug(slug: string): Promise<CategoryWithRelations | null> {
    return prisma.category.findUnique({
      where: { slug },
      include: {
        parent: true,
        children: true,
        _count: { select: { products: true } },
      },
    })
  }

  /**
   * Récupère les catégories parentes (sans parent)
   */
  async findRootCategories(): Promise<CategoryWithRelations[]> {
    return prisma.category.findMany({
      where: { parentId: null },
      include: {
        children: true,
        _count: { select: { products: true } },
      },
      orderBy: { name: "asc" },
    })
  }

  /**
   * Surcharge findById pour inclure les relations nécessaires
   */
  async findById(id: string): Promise<CategoryWithRelations | null> {
    return prisma.category.findUnique({
      where: { id },
      include: {
        parent: true,
        children: true,
        _count: { select: { products: true } },
      },
    })
  }

  /**
   * Met à jour le compteur de produits pour une catégorie
   */
  async updateProductCount(categoryId: string): Promise<void> {
    const count = await prisma.product.count({
      where: { categoryId, status: "published" },
    })
    await prisma.category.update({
      where: { id: categoryId },
      data: { productCount: count },
    })
  }
}

export const categoryRepository = new CategoryRepository()
