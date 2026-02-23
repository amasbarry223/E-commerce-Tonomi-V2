import type { Review } from "./types"

export const defaultReviews: Review[] = [
  { id: "rev-1", productId: "prod-1", customerId: "cust-1", customerName: "Marie D.", rating: 5, title: "Magnifique !", comment: "Un sac sublime, le cuir est d'une qualité exceptionnelle. Les finitions sont parfaites.", status: "approved", createdAt: "2026-01-22" },
  { id: "rev-2", productId: "prod-1", customerId: "cust-3", customerName: "Camille B.", rating: 5, title: "Coup de coeur", comment: "Je suis tombée amoureuse de ce sac. Élégant et spacieux.", status: "approved", createdAt: "2026-01-18" },
  { id: "rev-3", productId: "prod-8", customerId: "cust-7", customerName: "Chloé R.", rating: 5, title: "Parfait !", comment: "Le mini sac parfait pour sortir. La chaîne dorée est superbe.", status: "approved", createdAt: "2026-02-05" },
  { id: "rev-4", productId: "prod-3", customerId: "cust-5", customerName: "Julie P.", rating: 4, title: "Très beau", comment: "Pochette très élégante pour les soirées. Juste un peu petite pour y mettre tout.", status: "approved", createdAt: "2026-01-30" },
  { id: "rev-5", productId: "prod-4", customerId: "cust-2", customerName: "Sophie M.", rating: 5, title: "Super pratique", comment: "Parfait pour le bureau et les déplacements. Beaucoup de rangements.", status: "approved", createdAt: "2026-02-12" },
  { id: "rev-6", productId: "prod-2", customerId: "cust-4", customerName: "Léa M.", rating: 4, title: "Joli style", comment: "Le style bohème est très réussi. Les finitions cuir sont belles.", status: "approved", createdAt: "2026-02-09" },
  { id: "rev-7", productId: "prod-12", customerId: "cust-7", customerName: "Chloé R.", rating: 5, title: "Douceur incroyable", comment: "L'écharpe la plus douce que j'ai jamais portée. Le mélange cachemire-soie est un vrai bonheur.", status: "approved", createdAt: "2026-01-28" },
  { id: "rev-8", productId: "prod-8", customerId: "cust-1", customerName: "Marie D.", rating: 5, title: "Must have", comment: "Un indispensable dans ma collection. Qualité remarquable.", status: "pending", createdAt: "2026-02-14" },
  { id: "rev-9", productId: "prod-6", customerId: "cust-5", customerName: "Julie P.", rating: 4, title: "Bon portefeuille", comment: "Bonne qualité de cuir et suffisamment de place pour les cartes.", status: "approved", createdAt: "2025-12-15" },
  { id: "rev-10", productId: "prod-16", customerId: "cust-3", customerName: "Camille B.", rating: 5, title: "Adore !", comment: "Le sac seau est tendance et super pratique au quotidien.", status: "pending", createdAt: "2026-02-10" },
]

/** @deprecated Utiliser le store useReviewsStore pour les données mutables ; conservé pour rétrocompatibilité. */
export const reviews = defaultReviews
