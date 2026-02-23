/**
 * Point d'entrée central pour les types métier de l'application.
 * Réexporte les types données (lib/data/types) et les types store (panier, wishlist).
 */

export type {
  Product,
  Category,
  Customer,
  Address,
  Order,
  OrderItem,
  Review,
  PromoCode,
  HeroSlide,
} from "@/lib/data/types"

/** Élément du panier (store) */
export interface CartItem {
  productId: string
  name: string
  price: number
  image: string
  color?: string
  size?: string
  quantity: number
}

/** Élément de la liste de souhaits (store) */
export interface WishlistItem {
  productId: string
}
