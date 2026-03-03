/**
 * Service produits - Couche d'abstraction entre les composants et les repositories
 * Utilise les repositories pour accéder aux données Supabase
 */

import { productRepository } from "@/lib/repositories"
import type { Product } from "@/lib/types"

// Types basés sur Prisma avec relations
export type ProductWithRelations = Awaited<ReturnType<typeof productRepository.findAll>>[0]

/**
 * Transforme un produit Prisma en type Product de l'application
 */
function transformProduct(prismaProduct: ProductWithRelations): Product {
  return {
    id: prismaProduct.id,
    name: prismaProduct.name,
    slug: prismaProduct.slug,
    description: prismaProduct.description,
    shortDescription: prismaProduct.shortDescription,
    price: Number(prismaProduct.price),
    originalPrice: prismaProduct.originalPrice ? Number(prismaProduct.originalPrice) : undefined,
    images: prismaProduct.images.map((img) => img.url),
    category: prismaProduct.categoryId,
    subcategory: prismaProduct.subcategory || undefined,
    brand: prismaProduct.brand,
    colors: prismaProduct.colors.map((c) => ({ name: c.name, hex: c.hex })),
    sizes: prismaProduct.sizes.map((s) => s.name),
    material: prismaProduct.material,
    stock: prismaProduct.stock,
    sku: prismaProduct.sku,
    tags: prismaProduct.tags,
    badge: (prismaProduct.badge as Product["badge"]) || undefined,
    rating: Number(prismaProduct.rating),
    reviewCount: prismaProduct.reviewCount,
    status: prismaProduct.status as Product["status"],
    createdAt: prismaProduct.createdAt.toISOString(),
    featured: prismaProduct.featured,
  }
}

/**
 * Récupère tous les produits publiés
 */
export async function getProducts(): Promise<Product[]> {
  const products = await productRepository.findAll({
    where: { status: "published" },
    orderBy: { createdAt: "desc" },
  })
  return products.map(transformProduct)
}

/**
 * Récupère un produit par ID
 */
export async function getProductById(id: string): Promise<Product | undefined> {
  const product = await productRepository.findById(id)
  return product ? transformProduct(product) : undefined
}

/**
 * Récupère un produit par slug
 */
export async function getProductBySlug(slug: string): Promise<Product | undefined> {
  const product = await productRepository.findBySlug(slug)
  return product ? transformProduct(product) : undefined
}

/**
 * Récupère les produits par catégorie
 */
export async function getProductsByCategory(categoryId: string): Promise<Product[]> {
  const products = await productRepository.findByCategory(categoryId)
  return products.map(transformProduct)
}

/**
 * Récupère les produits en vedette
 */
export async function getFeaturedProducts(limit: number = 10): Promise<Product[]> {
  const products = await productRepository.findFeatured(limit)
  return products.map(transformProduct)
}

/**
 * Recherche de produits
 */
export async function searchProducts(query: string, limit: number = 20): Promise<Product[]> {
  const products = await productRepository.search(query, { take: limit })
  return products.map(transformProduct)
}

/**
 * Récupère les produits avec filtres (pour le catalogue)
 */
export async function getProductsWithFilters(filters: {
  categoryId?: string
  minPrice?: number
  maxPrice?: number
  colors?: string[]
  sizes?: string[]
  search?: string
  featured?: boolean
  skip?: number
  take?: number
}): Promise<Product[]> {
  const where: any = { status: "published" }

  if (filters.categoryId) {
    where.categoryId = filters.categoryId
  }

  if (filters.minPrice !== undefined || filters.maxPrice !== undefined) {
    where.price = {}
    if (filters.minPrice !== undefined) where.price.gte = filters.minPrice
    if (filters.maxPrice !== undefined) where.price.lte = filters.maxPrice
  }

  if (filters.colors && filters.colors.length > 0) {
    where.colors = { some: { name: { in: filters.colors } } }
  }

  if (filters.sizes && filters.sizes.length > 0) {
    where.sizes = { some: { name: { in: filters.sizes } } }
  }

  if (filters.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
      { description: { contains: filters.search, mode: "insensitive" } },
      { brand: { contains: filters.search, mode: "insensitive" } },
      { tags: { has: filters.search } },
    ]
  }

  if (filters.featured !== undefined) {
    where.featured = filters.featured
  }

  const products = await productRepository.findAll({
    where,
    skip: filters.skip,
    take: filters.take,
    orderBy: { createdAt: "desc" },
  })

  return products.map(transformProduct)
}

/**
 * Crée un nouveau produit
 */
export async function createProduct(data: {
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  originalPrice?: number
  categoryId: string
  subcategory?: string
  brand: string
  material: string
  stock: number
  sku: string
  tags?: string[]
  badge?: string
  status?: string
  featured?: boolean
  images?: string[]
  colors?: { name: string; hex: string }[]
  sizes?: string[]
}): Promise<Product> {
  const product = await productRepository.create({
    name: data.name,
    slug: data.slug,
    description: data.description,
    shortDescription: data.shortDescription,
    price: data.price,
    originalPrice: data.originalPrice || null,
    categoryId: data.categoryId,
    subcategory: data.subcategory || null,
    brand: data.brand,
    material: data.material,
    stock: data.stock,
    sku: data.sku,
    tags: data.tags || [],
    badge: data.badge || null,
    status: (data.status as any) || "draft",
    featured: data.featured || false,
    images: {
      create: (data.images || []).map((url, index) => ({
        url,
        order: index,
      })),
    },
    colors: {
      create: (data.colors || []).map((color, index) => ({
        name: color.name,
        hex: color.hex,
        order: index,
      })),
    },
    sizes: {
      create: (data.sizes || []).map((size, index) => ({
        name: size,
        order: index,
      })),
    },
  })
  const fullProduct = await productRepository.findById(product.id)
  if (!fullProduct) throw new Error("Failed to create product")
  
  // Logger l'action
  const { logActions } = await import("@/lib/utils/logger-service")
  await logActions.productCreated(product.id, data.name)

  return transformProduct(fullProduct)
}

/**
 * Met à jour un produit
 */
export async function updateProduct(
  id: string,
  data: {
    name?: string
    slug?: string
    description?: string
    shortDescription?: string
    price?: number
    originalPrice?: number
    categoryId?: string
    subcategory?: string
    brand?: string
    material?: string
    stock?: number
    sku?: string
    tags?: string[]
    badge?: string
    status?: string
    featured?: boolean
    images?: string[]
    colors?: { name: string; hex: string }[]
    sizes?: string[]
  }
): Promise<Product> {
  const updateData: any = {}
  if (data.name !== undefined) updateData.name = data.name
  if (data.slug !== undefined) updateData.slug = data.slug
  if (data.description !== undefined) updateData.description = data.description
  if (data.shortDescription !== undefined) updateData.shortDescription = data.shortDescription
  if (data.price !== undefined) updateData.price = data.price
  if (data.originalPrice !== undefined) updateData.originalPrice = data.originalPrice || null
  if (data.categoryId !== undefined) updateData.categoryId = data.categoryId
  if (data.subcategory !== undefined) updateData.subcategory = data.subcategory || null
  if (data.brand !== undefined) updateData.brand = data.brand
  if (data.material !== undefined) updateData.material = data.material
  if (data.stock !== undefined) updateData.stock = data.stock
  if (data.sku !== undefined) updateData.sku = data.sku
  if (data.tags !== undefined) updateData.tags = data.tags
  if (data.badge !== undefined) updateData.badge = data.badge || null
  if (data.status !== undefined) updateData.status = data.status
  if (data.featured !== undefined) updateData.featured = data.featured

  // Gérer les images, couleurs et tailles si fournies
  if (data.images !== undefined) {
    // Supprimer les anciennes images et créer les nouvelles
    updateData.images = {
      deleteMany: {},
      create: data.images.map((url, index) => ({
        url,
        order: index,
      })),
    }
  }
  if (data.colors !== undefined) {
    updateData.colors = {
      deleteMany: {},
      create: data.colors.map((color, index) => ({
        name: color.name,
        hex: color.hex,
        order: index,
      })),
    }
  }
  if (data.sizes !== undefined) {
    updateData.sizes = {
      deleteMany: {},
      create: data.sizes.map((size, index) => ({
        name: size,
        order: index,
      })),
    }
  }

  await productRepository.update(id, updateData)
  const updatedProduct = await productRepository.findById(id)
  if (!updatedProduct) throw new Error("Product not found")
  
  // Logger l'action
  const { logActions } = await import("@/lib/utils/logger-service")
  await logActions.productUpdated(id, updatedProduct.name)

  return transformProduct(updatedProduct)
}

/**
 * Supprime un produit
 */
export async function deleteProduct(id: string): Promise<void> {
  // Récupérer le produit avant suppression pour le log
  const product = await productRepository.findById(id)
  const productName = product?.name || "Produit inconnu"
  
  await productRepository.delete(id)
  
  // Logger l'action
  const { logActions } = await import("@/lib/utils/logger-service")
  await logActions.productDeleted(id, productName)
}
