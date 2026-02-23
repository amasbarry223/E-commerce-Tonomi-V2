/**
 * Types et interfaces pour les données e-commerce (produits, commandes, etc.)
 */

export interface Product {
  id: string
  name: string
  slug: string
  description: string
  shortDescription: string
  price: number
  originalPrice?: number
  images: string[]
  category: string
  subcategory?: string
  brand: string
  colors: { name: string; hex: string }[]
  sizes: string[]
  material: string
  stock: number
  sku: string
  tags: string[]
  badge?: "new" | "promo" | "coup-de-coeur" | "stock-limite"
  rating: number
  reviewCount: number
  status: "published" | "draft" | "archived" | "out-of-stock"
  createdAt: string
  featured: boolean
}

export interface Category {
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

export interface Customer {
  id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  avatar: string
  segment: "vip" | "new" | "regular" | "inactive"
  totalSpent: number
  orderCount: number
  createdAt: string
  addresses: Address[]
}

export interface Address {
  id: string
  label: string
  street: string
  city: string
  zipCode: string
  country: string
  isDefault: boolean
}

export interface Order {
  id: string
  orderNumber: string
  customerId: string
  items: OrderItem[]
  subtotal: number
  shipping: number
  discount: number
  tax: number
  total: number
  status: "pending" | "confirmed" | "shipped" | "delivered" | "cancelled" | "refunded"
  paymentMethod: string
  shippingAddress: Address
  billingAddress: Address
  trackingNumber?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

export interface OrderItem {
  productId: string
  name: string
  price: number
  quantity: number
  color?: string
  size?: string
  image: string
}

export interface Review {
  id: string
  productId: string
  customerId: string
  customerName: string
  rating: number
  title: string
  comment: string
  status: "pending" | "approved" | "rejected"
  createdAt: string
}

export interface PromoCode {
  id: string
  code: string
  type: "percentage" | "fixed"
  value: number
  minAmount?: number
  maxUses: number
  usedCount: number
  startDate: string
  endDate: string
  active: boolean
  categories?: string[]
}

export interface HeroSlide {
  id: string
  image: string
  title: string
  subtitle: string
  ctaText: string
  ctaLink?: string
  order: number
  active: boolean
}
