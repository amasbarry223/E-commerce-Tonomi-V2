/**
 * Repository pour les produits
 * Gère toutes les opérations CRUD sur les produits
 */

import { prisma } from "@/lib/db/prisma"
import { BaseRepository } from "./base-repository"
import type { Product, Prisma } from "@prisma/client"

type ProductWithRelations = Prisma.ProductGetPayload<{
  include: {
    images: true
    colors: true
    sizes: true
    category: true
  }
}>

export class ProductRepository extends BaseRepository<
  ProductWithRelations,
  Prisma.ProductCreateInput,
  Prisma.ProductUpdateInput
> {
  protected model = prisma.product

  /**
   * Récupère tous les produits avec leurs relations
   */
  async findAll(options?: {
    where?: Prisma.ProductWhereInput
    skip?: number
    take?: number
    orderBy?: Prisma.ProductOrderByWithRelationInput
  }): Promise<ProductWithRelations[]> {
    return prisma.product.findMany({
      include: {
        images: { orderBy: { order: "asc" } },
        colors: { orderBy: { order: "asc" } },
        sizes: { orderBy: { order: "asc" } },
        category: true,
      },
      ...options,
    })
  }

  /**
   * Récupère un produit par ID avec ses relations
   */
  async findById(id: string): Promise<ProductWithRelations | null> {
    return prisma.product.findUnique({
      where: { id },
      include: {
        images: { orderBy: { order: "asc" } },
        colors: { orderBy: { order: "asc" } },
        sizes: { orderBy: { order: "asc" } },
        category: true,
      },
    })
  }

  /**
   * Récupère un produit par slug
   */
  async findBySlug(slug: string): Promise<ProductWithRelations | null> {
    return prisma.product.findUnique({
      where: { slug },
      include: {
        images: { orderBy: { order: "asc" } },
        colors: { orderBy: { order: "asc" } },
        sizes: { orderBy: { order: "asc" } },
        category: true,
      },
    })
  }

  /**
   * Récupère les produits par catégorie
   */
  async findByCategory(categoryId: string, options?: { skip?: number; take?: number }): Promise<ProductWithRelations[]> {
    return this.findAll({
      where: { categoryId, status: "published" },
      orderBy: { createdAt: "desc" },
      ...options,
    })
  }

  /**
   * Récupère les produits en vedette
   */
  async findFeatured(limit: number = 10): Promise<ProductWithRelations[]> {
    return this.findAll({
      where: { featured: true, status: "published" },
      take: limit,
      orderBy: { createdAt: "desc" },
    })
  }

  /**
   * Recherche de produits
   */
  async search(query: string, options?: { skip?: number; take?: number }): Promise<ProductWithRelations[]> {
    return this.findAll({
      where: {
        status: "published",
        OR: [
          { name: { contains: query, mode: "insensitive" } },
          { description: { contains: query, mode: "insensitive" } },
          { brand: { contains: query, mode: "insensitive" } },
          { tags: { has: query } },
        ],
      },
      ...options,
    })
  }

  /**
   * Crée un produit avec ses images, couleurs et tailles
   */
  async createWithRelations(data: {
    product: Prisma.ProductCreateInput
    images: Array<{ url: string; alt?: string; order?: number }>
    colors: Array<{ name: string; hex: string; order?: number }>
    sizes: Array<{ name: string; order?: number }>
  }): Promise<ProductWithRelations> {
    return prisma.product.create({
      data: {
        ...data.product,
        images: {
          create: data.images,
        },
        colors: {
          create: data.colors,
        },
        sizes: {
          create: data.sizes,
        },
      },
      include: {
        images: true,
        colors: true,
        sizes: true,
        category: true,
      },
    })
  }

  /**
   * Met à jour le stock d'un produit
   */
  async updateStock(id: string, quantity: number): Promise<Product> {
    return prisma.product.update({
      where: { id },
      data: { stock: quantity },
    })
  }

  /**
   * Décrémente le stock (lors d'une commande)
   */
  async decrementStock(id: string, quantity: number): Promise<Product> {
    const product = await prisma.product.findUnique({ where: { id } })
    if (!product) {
      throw new Error(`Product ${id} not found`)
    }
    if (product.stock < quantity) {
      throw new Error(`Insufficient stock for product ${id}`)
    }
    return prisma.product.update({
      where: { id },
      data: { stock: { decrement: quantity } },
    })
  }
}

export const productRepository = new ProductRepository()
