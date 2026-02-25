/**
 * Composants partagés du storefront (header, footer, cart, product-card, etc.).
 * Réexport depuis le niveau parent pour compatibilité ; à terme déplacer les fichiers ici.
 */

export { StoreHeader } from "../header"
export { StoreFooter } from "../footer"
export { StoreDocumentHead } from "../store-document-head"
export { ProductCard } from "../product-card"
export { MiniCart } from "../mini-cart"
export { OrderSummary } from "../order-summary"
export { SearchAutocomplete } from "../search-autocomplete"
export { HeroSlider } from "../home-hero-slider"
export { CategoriesGrid } from "../home-categories-grid"
export { PromoBanner } from "../home-promo-banner"
export { ProductQuickView } from "../product-quick-view"
export { ProductPurchaseBlock } from "../product-purchase-block"
export { ProductCarousel } from "../product-carousel"
export { ProductCardSkeleton, ProductCardSkeletonGrid } from "../product-card-skeleton"
export { CarouselNavigationButton } from "../carousel-navigation-button"
export { CarouselDots } from "../carousel-dots"
export { ImageZoom } from "../image-zoom"
export { ImageLightbox } from "../image-lightbox"
export { CartAnimation, useCartAnimation } from "../cart-animation"
