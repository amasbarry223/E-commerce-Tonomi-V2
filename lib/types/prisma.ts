/**
 * Types TypeScript générés à partir de Prisma
 * Ces types sont utilisés pour typer les données retournées par les repositories
 */

import type {
  Product,
  Category,
  Order,
  Customer,
  Review,
  PromoCode,
  HeroSlide,
  ProductImage,
  ProductColor,
  ProductSize,
  Address,
  OrderItem,
} from "@prisma/client"

// Types avec relations
export type ProductWithRelations = Product & {
  images: ProductImage[]
  colors: ProductColor[]
  sizes: ProductSize[]
  category: Category
}

export type CategoryWithRelations = Category & {
  parent?: Category | null
  children: Category[]
  _count: { products: number }
}

export type OrderWithRelations = Order & {
  customer: Customer
  items: (OrderItem & { product: Product })[]
  shippingAddress: Address
  billingAddress: Address
  promoCode?: PromoCode | null
}

export type CustomerWithRelations = Customer & {
  addresses: Address[]
  _count: { orders: number; reviews: number }
}

export type ReviewWithRelations = Review & {
  customer: Customer
  product: Pick<Product, "id" | "name" | "slug"> & {
    images: ProductImage[]
  }
}

export type PromoCodeWithRelations = PromoCode & {
  categories: Array<{ categoryId: string }>
  products: Array<{ productId: string; product: Product }>
}
