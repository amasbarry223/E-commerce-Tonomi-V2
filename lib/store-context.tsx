/**
 * Réexport du storefront pour compatibilité des imports existants.
 * L'implémentation est dans lib/storefront/.
 */

export {
  StoreProvider,
  useCartStore,
  useCartState,
  useCartActions,
  useNavigationStore,
  useUIStore,
  StoreContext,
  CartStoreContext,
  CartStateContext,
  CartActionsContext,
  NavigationStoreContext,
  UIStoreContext,
} from "./storefront"
export type {
  StoreContextType,
  CartStoreContextType,
  CartStateContextType,
  CartActionsContextType,
  NavigationStoreContextType,
  UIStoreContextType,
  CartItem,
  WishlistItem,
} from "./storefront"
