import type { HeroSlide } from "./types"

export const defaultHeroSlides: HeroSlide[] = [
  {
    id: "hero-1",
    image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=1400&h=600&fit=crop",
    title: "Collection Automne-Hiver",
    subtitle: "Découvrez nos nouveaux modèles en cuir véritable",
    ctaText: "Voir la collection",
    order: 0,
    active: true,
  },
  {
    id: "hero-2",
    image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=1400&h=600&fit=crop",
    title: "Soldes Exceptionnelles",
    subtitle: "Jusqu'à -30% sur une sélection d'articles",
    ctaText: "En profiter",
    order: 1,
    active: true,
  },
  {
    id: "hero-3",
    image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=1400&h=600&fit=crop",
    title: "Accessoires de Luxe",
    subtitle: "L'élégance au quotidien",
    ctaText: "Découvrir",
    order: 2,
    active: true,
  },
]
