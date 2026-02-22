// ==========================================
// DONNÉES SIMULÉES - E-COMMERCE LUXE BAGS
// ==========================================

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

// ==========================================
// CATÉGORIES
// ==========================================

export const categories: Category[] = [
  { id: "cat-1", name: "Sacs à main", slug: "sacs-a-main", description: "Collection de sacs à main élégants", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=300&fit=crop", productCount: 8, metaTitle: "Sacs à main de luxe", metaDescription: "Découvrez notre collection de sacs à main" },
  { id: "cat-2", name: "Sacs à dos", slug: "sacs-a-dos", description: "Sacs à dos tendance et fonctionnels", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=400&h=300&fit=crop", productCount: 5, metaTitle: "Sacs à dos stylés", metaDescription: "Notre sélection de sacs à dos" },
  { id: "cat-3", name: "Portefeuilles", slug: "portefeuilles", description: "Portefeuilles en cuir de qualité", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=400&h=300&fit=crop", productCount: 5, metaTitle: "Portefeuilles cuir", metaDescription: "Portefeuilles élégants en cuir" },
  { id: "cat-4", name: "Accessoires", slug: "accessoires", description: "Accessoires de mode tendance", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=400&h=300&fit=crop", productCount: 6, metaTitle: "Accessoires mode", metaDescription: "Complétez votre look" },
  { id: "cat-5", name: "Nouveautés", slug: "nouveautes", description: "Les dernières nouveautés de la saison", image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=400&h=300&fit=crop", productCount: 4, metaTitle: "Nouveautés", metaDescription: "Découvrez nos nouveautés" },
  { id: "cat-6", name: "Promotions", slug: "promotions", description: "Profitez de nos offres exclusives", image: "https://images.unsplash.com/photo-1512201078372-9c6b2a0d528a?w=400&h=300&fit=crop", productCount: 6, metaTitle: "Promotions", metaDescription: "Nos meilleures promotions" },
]

// ==========================================
// PRODUITS
// ==========================================

export const products: Product[] = [
  {
    id: "prod-1", name: "Sac Élégance Parisienne", slug: "sac-elegance-parisienne",
    description: "Un sac à main en cuir véritable d'une élégance rare. Fabriqué avec les meilleurs cuirs italiens, ce sac incarne le raffinement parisien. Doublure en soie, fermeture magnétique dorée et bandoulière ajustable.",
    shortDescription: "Sac en cuir véritable, finitions dorées",
    price: 189.99, originalPrice: 249.99,
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop", "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop", "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop"],
    category: "cat-1", brand: "Maison Élégance",
    colors: [{ name: "Noir", hex: "#1a1a1a" }, { name: "Camel", hex: "#C19A6B" }, { name: "Bordeaux", hex: "#722F37" }],
    sizes: ["Petit", "Moyen", "Grand"], material: "Cuir véritable", stock: 24, sku: "SAC-ELE-001",
    tags: ["cuir", "luxe", "parisien"], badge: "promo", rating: 4.8, reviewCount: 42,
    status: "published", createdAt: "2025-11-15", featured: true
  },
  {
    id: "prod-2", name: "Sac Bohème Chic", slug: "sac-boheme-chic",
    description: "Ce sac bohème chic allie style décontracté et élégance. Tissu canvas de haute qualité avec finitions en cuir. Franges décoratives et fermoir vintage.",
    shortDescription: "Style bohème avec finitions cuir",
    price: 129.99,
    images: ["https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop"],
    category: "cat-1", brand: "Bohème Paris",
    colors: [{ name: "Beige", hex: "#F5F5DC" }, { name: "Cognac", hex: "#9A463D" }],
    sizes: ["Unique"], material: "Canvas & Cuir", stock: 18, sku: "SAC-BOH-002",
    tags: ["bohème", "chic", "franges"], badge: "new", rating: 4.5, reviewCount: 28,
    status: "published", createdAt: "2026-01-10", featured: true
  },
  {
    id: "prod-3", name: "Pochette Soirée Cristal", slug: "pochette-soiree-cristal",
    description: "Pochette de soirée ornée de cristaux Swarovski. Chaîne dorée amovible. Intérieur satiné avec poche miroir. Parfaite pour les occasions spéciales.",
    shortDescription: "Pochette ornée de cristaux",
    price: 89.99,
    images: ["https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop"],
    category: "cat-1", brand: "Cristal de Paris",
    colors: [{ name: "Or", hex: "#FFD700" }, { name: "Argent", hex: "#C0C0C0" }, { name: "Noir", hex: "#1a1a1a" }],
    sizes: ["Unique"], material: "Satin & Cristaux", stock: 12, sku: "POC-CRI-003",
    tags: ["soirée", "cristal", "luxe"], badge: "coup-de-coeur", rating: 4.9, reviewCount: 56,
    status: "published", createdAt: "2025-12-01", featured: true
  },
  {
    id: "prod-4", name: "Sac à Dos Urban Explorer", slug: "sac-a-dos-urban-explorer",
    description: "Sac à dos moderne pour l'aventurier urbain. Compartiment laptop 15 pouces, poches anti-vol, tissu imperméable. Design minimaliste et fonctionnel.",
    shortDescription: "Sac à dos urbain et fonctionnel",
    price: 149.99,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop", "https://images.unsplash.com/photo-1581605405669-fcdf81165571?w=600&h=600&fit=crop"],
    category: "cat-2", brand: "Urban Mode",
    colors: [{ name: "Noir", hex: "#1a1a1a" }, { name: "Gris", hex: "#808080" }, { name: "Bleu Marine", hex: "#1B3A5C" }],
    sizes: ["Standard", "Large"], material: "Nylon imperméable", stock: 30, sku: "DOS-URB-004",
    tags: ["urbain", "laptop", "imperméable"], badge: "new", rating: 4.6, reviewCount: 35,
    status: "published", createdAt: "2026-01-05", featured: true
  },
  {
    id: "prod-5", name: "Sac Bandoulière Vintage", slug: "sac-bandouliere-vintage",
    description: "Sac bandoulière au charme vintage intemporel. Cuir vieilli à la main, boucles en laiton antique. Compartiment principal spacieux avec organiser intérieur.",
    shortDescription: "Style vintage, cuir vieilli",
    price: 159.99, originalPrice: 199.99,
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop", "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=600&h=600&fit=crop"],
    category: "cat-1", brand: "Maison Élégance",
    colors: [{ name: "Brun", hex: "#8B4513" }, { name: "Noir Vieilli", hex: "#2C2C2C" }],
    sizes: ["Moyen", "Grand"], material: "Cuir vieilli", stock: 8, sku: "BAN-VIN-005",
    tags: ["vintage", "cuir", "bandoulière"], badge: "stock-limite", rating: 4.7, reviewCount: 19,
    status: "published", createdAt: "2025-10-20", featured: false
  },
  {
    id: "prod-6", name: "Portefeuille Continental", slug: "portefeuille-continental",
    description: "Portefeuille continental en cuir grainé. 12 emplacements cartes, 2 compartiments billets, poche zippée pour la monnaie. Finitions dorées élégantes.",
    shortDescription: "Portefeuille cuir grainé, 12 cartes",
    price: 69.99,
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop"],
    category: "cat-3", brand: "Maison Élégance",
    colors: [{ name: "Noir", hex: "#1a1a1a" }, { name: "Rose Poudré", hex: "#E8B4B8" }, { name: "Taupe", hex: "#8B8589" }],
    sizes: ["Unique"], material: "Cuir grainé", stock: 45, sku: "POR-CON-006",
    tags: ["portefeuille", "cuir", "cartes"], rating: 4.4, reviewCount: 31,
    status: "published", createdAt: "2025-09-15", featured: false
  },
  {
    id: "prod-7", name: "Sac Cabas Riviera", slug: "sac-cabas-riviera",
    description: "Grand sac cabas inspiré de la Côte d'Azur. Toile résistante avec anses en cuir tressé. Idéal pour le shopping ou la plage. Poche intérieure zippée.",
    shortDescription: "Cabas chic, anses cuir tressé",
    price: 109.99,
    images: ["https://images.unsplash.com/photo-1512201078372-9c6b2a0d528a?w=600&h=600&fit=crop", "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop"],
    category: "cat-1", brand: "Riviera Mode",
    colors: [{ name: "Écru", hex: "#F2E8CF" }, { name: "Bleu Ciel", hex: "#87CEEB" }, { name: "Rose", hex: "#FFB6C1" }],
    sizes: ["Grand"], material: "Toile & Cuir", stock: 22, sku: "CAB-RIV-007",
    tags: ["cabas", "plage", "été"], badge: "promo", rating: 4.3, reviewCount: 24,
    status: "published", createdAt: "2025-12-10", featured: true
  },
  {
    id: "prod-8", name: "Mini Sac Chaîne Dorée", slug: "mini-sac-chaine-doree",
    description: "Mini sac matelassé avec chaîne dorée. Cuir d'agneau ultra doux. Fermoir logo en métal doré. Le must-have de la saison.",
    shortDescription: "Mini sac matelassé, chaîne dorée",
    price: 219.99,
    images: ["https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=600&h=600&fit=crop", "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop"],
    category: "cat-1", brand: "Cristal de Paris",
    colors: [{ name: "Noir", hex: "#1a1a1a" }, { name: "Blanc", hex: "#FFFFFF" }, { name: "Rouge", hex: "#C41E3A" }],
    sizes: ["Unique"], material: "Cuir d'agneau", stock: 15, sku: "MIN-CHA-008",
    tags: ["mini", "matelassé", "chaîne"], badge: "coup-de-coeur", rating: 4.9, reviewCount: 67,
    status: "published", createdAt: "2025-11-25", featured: true
  },
  {
    id: "prod-9", name: "Sac à Dos Cuir Premium", slug: "sac-a-dos-cuir-premium",
    description: "Sac à dos en cuir pleine fleur. Design épuré et professionnel. Bretelles rembourrées ajustables. Compartiment ordinateur et poche avant aimantée.",
    shortDescription: "Sac à dos cuir pleine fleur",
    price: 199.99,
    images: ["https://images.unsplash.com/photo-1581605405669-fcdf81165571?w=600&h=600&fit=crop", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"],
    category: "cat-2", brand: "Urban Mode",
    colors: [{ name: "Cognac", hex: "#9A463D" }, { name: "Noir", hex: "#1a1a1a" }],
    sizes: ["Standard"], material: "Cuir pleine fleur", stock: 10, sku: "DOS-CUI-009",
    tags: ["cuir", "professionnel", "laptop"], rating: 4.7, reviewCount: 22,
    status: "published", createdAt: "2025-10-05", featured: false
  },
  {
    id: "prod-10", name: "Porte-Cartes Minimaliste", slug: "porte-cartes-minimaliste",
    description: "Porte-cartes ultra fin en cuir lisse. 6 emplacements cartes et poche centrale pour les billets. Design minimaliste et moderne.",
    shortDescription: "Porte-cartes cuir ultra fin",
    price: 39.99,
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop"],
    category: "cat-3", brand: "Maison Élégance",
    colors: [{ name: "Noir", hex: "#1a1a1a" }, { name: "Bleu Nuit", hex: "#191970" }, { name: "Vert Sapin", hex: "#2E8B57" }],
    sizes: ["Unique"], material: "Cuir lisse", stock: 60, sku: "PCA-MIN-010",
    tags: ["porte-cartes", "minimaliste", "cuir"], rating: 4.2, reviewCount: 18,
    status: "published", createdAt: "2025-08-20", featured: false
  },
  {
    id: "prod-11", name: "Ceinture Cuir Artisanale", slug: "ceinture-cuir-artisanale",
    description: "Ceinture en cuir artisanale avec boucle en laiton massif. Fabriquée à la main en France. Largeur 3cm.",
    shortDescription: "Ceinture artisanale, boucle laiton",
    price: 79.99, originalPrice: 99.99,
    images: ["https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=600&fit=crop"],
    category: "cat-4", brand: "Artisan Paris",
    colors: [{ name: "Brun", hex: "#8B4513" }, { name: "Noir", hex: "#1a1a1a" }],
    sizes: ["80cm", "85cm", "90cm", "95cm", "100cm"], material: "Cuir pleine fleur", stock: 35, sku: "CEI-ART-011",
    tags: ["ceinture", "artisanal", "cuir"], badge: "promo", rating: 4.6, reviewCount: 14,
    status: "published", createdAt: "2025-11-01", featured: false
  },
  {
    id: "prod-12", name: "Écharpe Cachemire & Soie", slug: "echarpe-cachemire-soie",
    description: "Écharpe luxueuse en mélange cachemire et soie. Texture ultra douce. Dimensions 180x70cm. Un accessoire indispensable.",
    shortDescription: "Écharpe cachemire et soie",
    price: 119.99,
    images: ["https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=600&h=600&fit=crop"],
    category: "cat-4", brand: "Maison Élégance",
    colors: [{ name: "Gris Perle", hex: "#C0C0C0" }, { name: "Beige", hex: "#F5F5DC" }, { name: "Rose Poudré", hex: "#E8B4B8" }],
    sizes: ["Unique"], material: "Cachemire & Soie", stock: 20, sku: "ECH-CAS-012",
    tags: ["écharpe", "cachemire", "luxe"], badge: "new", rating: 4.8, reviewCount: 33,
    status: "published", createdAt: "2026-01-20", featured: true
  },
  {
    id: "prod-13", name: "Lunettes de Soleil Aviateur", slug: "lunettes-soleil-aviateur",
    description: "Lunettes de soleil aviateur avec monture dorée et verres polarisés. Protection UV400. Étui cuir inclus.",
    shortDescription: "Aviateur dorée, verres polarisés",
    price: 149.99,
    images: ["https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&h=600&fit=crop"],
    category: "cat-4", brand: "Urban Mode",
    colors: [{ name: "Or", hex: "#FFD700" }, { name: "Argent", hex: "#C0C0C0" }],
    sizes: ["Unique"], material: "Métal & Verre", stock: 25, sku: "LUN-AVI-013",
    tags: ["lunettes", "aviateur", "soleil"], rating: 4.5, reviewCount: 27,
    status: "published", createdAt: "2025-10-15", featured: false
  },
  {
    id: "prod-14", name: "Sac Weekend Voyage", slug: "sac-weekend-voyage",
    description: "Sac de voyage weekend en toile canvas et cuir. Capacité 40L. Bandoulière amovible et poignées cuir renforcées. Parfait pour les escapades.",
    shortDescription: "Sac voyage 40L, canvas et cuir",
    price: 179.99, originalPrice: 229.99,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"],
    category: "cat-2", brand: "Riviera Mode",
    colors: [{ name: "Kaki", hex: "#556B2F" }, { name: "Marine", hex: "#1B3A5C" }],
    sizes: ["40L"], material: "Canvas & Cuir", stock: 14, sku: "VOY-WEK-014",
    tags: ["voyage", "weekend", "canvas"], badge: "promo", rating: 4.4, reviewCount: 21,
    status: "published", createdAt: "2025-12-05", featured: false
  },
  {
    id: "prod-15", name: "Trousse Maquillage Luxe", slug: "trousse-maquillage-luxe",
    description: "Trousse de maquillage en cuir saffiano avec zip doré. Intérieur imperméable facile à nettoyer. 3 compartiments.",
    shortDescription: "Trousse cuir saffiano, zip doré",
    price: 49.99,
    images: ["https://images.unsplash.com/photo-1512201078372-9c6b2a0d528a?w=600&h=600&fit=crop"],
    category: "cat-4", brand: "Cristal de Paris",
    colors: [{ name: "Rose", hex: "#FFB6C1" }, { name: "Noir", hex: "#1a1a1a" }, { name: "Nude", hex: "#E3BC9A" }],
    sizes: ["Unique"], material: "Cuir saffiano", stock: 40, sku: "TRO-MAQ-015",
    tags: ["trousse", "maquillage", "cuir"], rating: 4.3, reviewCount: 15,
    status: "published", createdAt: "2025-09-10", featured: false
  },
  {
    id: "prod-16", name: "Sac Seau Moderne", slug: "sac-seau-moderne",
    description: "Sac seau tendance en cuir souple. Fermeture par lien coulissant. Intérieur spacieux avec pochette amovible. Le compagnon idéal du quotidien.",
    shortDescription: "Sac seau cuir souple, pochette incluse",
    price: 139.99,
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop"],
    category: "cat-1", brand: "Bohème Paris",
    colors: [{ name: "Caramel", hex: "#C19A6B" }, { name: "Noir", hex: "#1a1a1a" }, { name: "Olive", hex: "#808000" }],
    sizes: ["Moyen"], material: "Cuir souple", stock: 19, sku: "SEA-MOD-016",
    tags: ["seau", "tendance", "cuir"], badge: "new", rating: 4.6, reviewCount: 9,
    status: "published", createdAt: "2026-02-01", featured: true
  },
  {
    id: "prod-17", name: "Portefeuille Compact", slug: "portefeuille-compact",
    description: "Petit portefeuille compact à rabat. Cuir lisse avec logo embossé. 8 emplacements cartes, porte-monnaie zip. Format idéal pour les petits sacs.",
    shortDescription: "Portefeuille compact, cuir lisse",
    price: 54.99,
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop"],
    category: "cat-3", brand: "Bohème Paris",
    colors: [{ name: "Corail", hex: "#FF6F61" }, { name: "Noir", hex: "#1a1a1a" }, { name: "Crème", hex: "#FFFDD0" }],
    sizes: ["Unique"], material: "Cuir lisse", stock: 38, sku: "POR-COM-017",
    tags: ["portefeuille", "compact", "cuir"], rating: 4.1, reviewCount: 12,
    status: "published", createdAt: "2025-08-01", featured: false
  },
  {
    id: "prod-18", name: "Sac à Dos Mini Chic", slug: "sac-a-dos-mini-chic",
    description: "Mini sac à dos en similicuir texturé. Bretelles fines ajustables avec détails dorés. Poche avant zippée. Idéal pour les sorties.",
    shortDescription: "Mini sac à dos, détails dorés",
    price: 89.99,
    images: ["https://images.unsplash.com/photo-1581605405669-fcdf81165571?w=600&h=600&fit=crop"],
    category: "cat-2", brand: "Urban Mode",
    colors: [{ name: "Blanc", hex: "#FFFFFF" }, { name: "Noir", hex: "#1a1a1a" }, { name: "Rose Blush", hex: "#E8B4B8" }],
    sizes: ["Unique"], material: "Similicuir", stock: 28, sku: "DOS-MIN-018",
    tags: ["mini", "chic", "doré"], rating: 4.4, reviewCount: 20,
    status: "published", createdAt: "2025-11-10", featured: false
  },
  {
    id: "prod-19", name: "Bracelet Cuir Tressé", slug: "bracelet-cuir-tresse",
    description: "Bracelet en cuir tressé à la main avec fermoir magnétique en acier inoxydable. Unisexe. Longueur ajustable.",
    shortDescription: "Bracelet cuir tressé, fermoir magnétique",
    price: 34.99,
    images: ["https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=600&fit=crop"],
    category: "cat-4", brand: "Artisan Paris",
    colors: [{ name: "Brun", hex: "#8B4513" }, { name: "Noir", hex: "#1a1a1a" }],
    sizes: ["S", "M", "L"], material: "Cuir tressé", stock: 50, sku: "BRA-TRE-019",
    tags: ["bracelet", "cuir", "tressé"], rating: 4.0, reviewCount: 8,
    status: "published", createdAt: "2025-07-15", featured: false
  },
  {
    id: "prod-20", name: "Sac Messager Professionnel", slug: "sac-messager-professionnel",
    description: "Sac messager en cuir grainé pour professionnels. Compartiment laptop 14 pouces, poches organiseur, bandoulière large rembourrée.",
    shortDescription: "Messager cuir, compartiment laptop",
    price: 169.99,
    images: ["https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=600&h=600&fit=crop"],
    category: "cat-1", brand: "Urban Mode",
    colors: [{ name: "Brun Foncé", hex: "#3B2F2F" }, { name: "Noir", hex: "#1a1a1a" }],
    sizes: ["Standard"], material: "Cuir grainé", stock: 16, sku: "MES-PRO-020",
    tags: ["messager", "professionnel", "laptop"], rating: 4.5, reviewCount: 17,
    status: "published", createdAt: "2025-09-25", featured: false
  },
  {
    id: "prod-21", name: "Pochette Enveloppe", slug: "pochette-enveloppe",
    description: "Pochette format enveloppe en cuir laqué. Fermoir doré magnétique. Peut se porter en main ou avec chaîne amovible.",
    shortDescription: "Pochette enveloppe, cuir laqué",
    price: 74.99,
    images: ["https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=600&h=600&fit=crop"],
    category: "cat-1", brand: "Cristal de Paris",
    colors: [{ name: "Rouge", hex: "#C41E3A" }, { name: "Noir", hex: "#1a1a1a" }, { name: "Nude", hex: "#E3BC9A" }],
    sizes: ["Unique"], material: "Cuir laqué", stock: 32, sku: "POC-ENV-021",
    tags: ["pochette", "enveloppe", "soirée"], rating: 4.3, reviewCount: 11,
    status: "published", createdAt: "2025-10-30", featured: false
  },
  {
    id: "prod-22", name: "Sac Banane Sporty", slug: "sac-banane-sporty",
    description: "Sac banane moderne en nylon ripstop. Multiples compartiments zippés. Sangle réglable. Parfait pour le quotidien actif.",
    shortDescription: "Sac banane nylon, multi-poches",
    price: 59.99,
    images: ["https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&h=600&fit=crop"],
    category: "cat-2", brand: "Urban Mode",
    colors: [{ name: "Noir", hex: "#1a1a1a" }, { name: "Kaki", hex: "#556B2F" }, { name: "Orange", hex: "#FF6B35" }],
    sizes: ["Unique"], material: "Nylon ripstop", stock: 42, sku: "BAN-SPO-022",
    tags: ["banane", "sporty", "nylon"], rating: 4.2, reviewCount: 16,
    status: "published", createdAt: "2025-11-20", featured: false
  },
  {
    id: "prod-23", name: "Portefeuille Long Zippé", slug: "portefeuille-long-zippe",
    description: "Grand portefeuille zippé en cuir saffiano. 16 emplacements cartes, 3 compartiments billets, porte-monnaie intégré. Finitions premium.",
    shortDescription: "Portefeuille zippé, cuir saffiano",
    price: 84.99,
    images: ["https://images.unsplash.com/photo-1627123424574-724758594e93?w=600&h=600&fit=crop"],
    category: "cat-3", brand: "Maison Élégance",
    colors: [{ name: "Bordeaux", hex: "#722F37" }, { name: "Noir", hex: "#1a1a1a" }, { name: "Bleu Nuit", hex: "#191970" }],
    sizes: ["Unique"], material: "Cuir saffiano", stock: 27, sku: "POR-ZIP-023",
    tags: ["portefeuille", "zippé", "saffiano"], rating: 4.6, reviewCount: 25,
    status: "published", createdAt: "2025-10-10", featured: false
  },
  {
    id: "prod-24", name: "Chapeau Fedora Feutre", slug: "chapeau-fedora-feutre",
    description: "Chapeau fedora en feutre de laine. Ruban cuir avec boucle décorative. Fabriqué en Italie.",
    shortDescription: "Fedora feutre, ruban cuir",
    price: 94.99,
    images: ["https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=600&h=600&fit=crop"],
    category: "cat-4", brand: "Artisan Paris",
    colors: [{ name: "Noir", hex: "#1a1a1a" }, { name: "Camel", hex: "#C19A6B" }, { name: "Gris", hex: "#808080" }],
    sizes: ["S", "M", "L"], material: "Feutre de laine", stock: 18, sku: "CHA-FED-024",
    tags: ["chapeau", "fedora", "feutre"], badge: "new", rating: 4.5, reviewCount: 7,
    status: "published", createdAt: "2026-02-05", featured: false
  },
  {
    id: "prod-25", name: "Sac Tote Minimaliste", slug: "sac-tote-minimaliste",
    description: "Sac tote en cuir lisse avec design minimaliste. Anses longues pour le porter à l'épaule. Grand compartiment ouvert. Pochette intérieure zippée.",
    shortDescription: "Tote minimaliste en cuir lisse",
    price: 134.99, originalPrice: 169.99,
    images: ["https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&h=600&fit=crop"],
    category: "cat-1", brand: "Bohème Paris",
    colors: [{ name: "Sand", hex: "#C2B280" }, { name: "Noir", hex: "#1a1a1a" }],
    sizes: ["Grand"], material: "Cuir lisse", stock: 21, sku: "TOT-MIN-025",
    tags: ["tote", "minimaliste", "cuir"], badge: "promo", rating: 4.4, reviewCount: 13,
    status: "published", createdAt: "2025-12-15", featured: false
  },
]

// ==========================================
// CLIENTS
// ==========================================

export const customers: Customer[] = [
  {
    id: "cust-1", firstName: "Marie", lastName: "Dupont", email: "marie.dupont@email.com", phone: "+33 6 12 34 56 78",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    segment: "vip", totalSpent: 1589.96, orderCount: 8, createdAt: "2024-03-15",
    addresses: [{ id: "addr-1", label: "Domicile", street: "12 Rue de Rivoli", city: "Paris", zipCode: "75001", country: "France", isDefault: true }]
  },
  {
    id: "cust-2", firstName: "Sophie", lastName: "Martin", email: "sophie.martin@email.com", phone: "+33 6 23 45 67 89",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    segment: "regular", totalSpent: 459.97, orderCount: 3, createdAt: "2025-01-20",
    addresses: [{ id: "addr-2", label: "Domicile", street: "45 Avenue Victor Hugo", city: "Lyon", zipCode: "69002", country: "France", isDefault: true }]
  },
  {
    id: "cust-3", firstName: "Camille", lastName: "Bernard", email: "camille.bernard@email.com", phone: "+33 6 34 56 78 90",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    segment: "vip", totalSpent: 2340.50, orderCount: 12, createdAt: "2024-06-10",
    addresses: [{ id: "addr-3", label: "Bureau", street: "8 Boulevard Haussmann", city: "Paris", zipCode: "75009", country: "France", isDefault: true }]
  },
  {
    id: "cust-4", firstName: "Léa", lastName: "Moreau", email: "lea.moreau@email.com", phone: "+33 6 45 67 89 01",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    segment: "new", totalSpent: 129.99, orderCount: 1, createdAt: "2026-01-28",
    addresses: [{ id: "addr-4", label: "Domicile", street: "23 Rue de la Paix", city: "Marseille", zipCode: "13001", country: "France", isDefault: true }]
  },
  {
    id: "cust-5", firstName: "Julie", lastName: "Petit", email: "julie.petit@email.com", phone: "+33 6 56 78 90 12",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
    segment: "regular", totalSpent: 679.95, orderCount: 5, createdAt: "2024-11-05",
    addresses: [{ id: "addr-5", label: "Domicile", street: "67 Rue du Commerce", city: "Bordeaux", zipCode: "33000", country: "France", isDefault: true }]
  },
  {
    id: "cust-6", firstName: "Emma", lastName: "Robert", email: "emma.robert@email.com", phone: "+33 6 67 89 01 23",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop",
    segment: "inactive", totalSpent: 89.99, orderCount: 1, createdAt: "2024-08-12",
    addresses: [{ id: "addr-6", label: "Domicile", street: "15 Allée des Roses", city: "Toulouse", zipCode: "31000", country: "France", isDefault: true }]
  },
  {
    id: "cust-7", firstName: "Chloé", lastName: "Richard", email: "chloe.richard@email.com", phone: "+33 6 78 90 12 34",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop",
    segment: "vip", totalSpent: 1890.45, orderCount: 10, createdAt: "2024-05-22",
    addresses: [{ id: "addr-7", label: "Domicile", street: "3 Place Bellecour", city: "Lyon", zipCode: "69002", country: "France", isDefault: true }]
  },
  {
    id: "cust-8", firstName: "Manon", lastName: "Durand", email: "manon.durand@email.com", phone: "+33 6 89 01 23 45",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
    segment: "new", totalSpent: 219.99, orderCount: 1, createdAt: "2026-02-10",
    addresses: [{ id: "addr-8", label: "Domicile", street: "91 Rue de Lille", city: "Lille", zipCode: "59000", country: "France", isDefault: true }]
  },
]

// ==========================================
// COMMANDES
// ==========================================

const defaultAddr: Address = { id: "addr-def", label: "Domicile", street: "12 Rue de Rivoli", city: "Paris", zipCode: "75001", country: "France", isDefault: true }

export const orders: Order[] = [
  {
    id: "ord-1", orderNumber: "CMD-2026-001", customerId: "cust-1",
    items: [
      { productId: "prod-1", name: "Sac Élégance Parisienne", price: 189.99, quantity: 1, color: "Noir", size: "Moyen", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop" },
      { productId: "prod-6", name: "Portefeuille Continental", price: 69.99, quantity: 1, color: "Rose Poudré", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop" }
    ],
    subtotal: 259.98, shipping: 0, discount: 26.00, tax: 46.80, total: 280.78,
    status: "delivered", paymentMethod: "Carte Visa", shippingAddress: defaultAddr, billingAddress: defaultAddr,
    trackingNumber: "FR123456789", createdAt: "2026-01-15T10:30:00", updatedAt: "2026-01-20T14:00:00"
  },
  {
    id: "ord-2", orderNumber: "CMD-2026-002", customerId: "cust-3",
    items: [
      { productId: "prod-8", name: "Mini Sac Chaîne Dorée", price: 219.99, quantity: 1, color: "Noir", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=100&h=100&fit=crop" }
    ],
    subtotal: 219.99, shipping: 5.99, discount: 0, tax: 39.60, total: 265.58,
    status: "shipped", paymentMethod: "PayPal", shippingAddress: { ...defaultAddr, street: "8 Boulevard Haussmann", zipCode: "75009" }, billingAddress: { ...defaultAddr, street: "8 Boulevard Haussmann", zipCode: "75009" },
    trackingNumber: "FR987654321", createdAt: "2026-02-01T09:15:00", updatedAt: "2026-02-03T11:00:00"
  },
  {
    id: "ord-3", orderNumber: "CMD-2026-003", customerId: "cust-2",
    items: [
      { productId: "prod-4", name: "Sac à Dos Urban Explorer", price: 149.99, quantity: 1, color: "Noir", size: "Standard", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop" },
      { productId: "prod-10", name: "Porte-Cartes Minimaliste", price: 39.99, quantity: 2, color: "Bleu Nuit", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop" }
    ],
    subtotal: 229.97, shipping: 0, discount: 0, tax: 41.39, total: 271.36,
    status: "confirmed", paymentMethod: "Carte Mastercard", shippingAddress: { ...defaultAddr, street: "45 Avenue Victor Hugo", city: "Lyon", zipCode: "69002" }, billingAddress: { ...defaultAddr, street: "45 Avenue Victor Hugo", city: "Lyon", zipCode: "69002" },
    createdAt: "2026-02-10T16:45:00", updatedAt: "2026-02-10T16:45:00"
  },
  {
    id: "ord-4", orderNumber: "CMD-2026-004", customerId: "cust-5",
    items: [
      { productId: "prod-3", name: "Pochette Soirée Cristal", price: 89.99, quantity: 1, color: "Or", image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=100&h=100&fit=crop" }
    ],
    subtotal: 89.99, shipping: 5.99, discount: 0, tax: 16.20, total: 112.18,
    status: "pending", paymentMethod: "Carte Visa", shippingAddress: { ...defaultAddr, street: "67 Rue du Commerce", city: "Bordeaux", zipCode: "33000" }, billingAddress: { ...defaultAddr, street: "67 Rue du Commerce", city: "Bordeaux", zipCode: "33000" },
    createdAt: "2026-02-14T08:20:00", updatedAt: "2026-02-14T08:20:00"
  },
  {
    id: "ord-5", orderNumber: "CMD-2026-005", customerId: "cust-7",
    items: [
      { productId: "prod-12", name: "Écharpe Cachemire & Soie", price: 119.99, quantity: 1, color: "Gris Perle", image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=100&h=100&fit=crop" },
      { productId: "prod-15", name: "Trousse Maquillage Luxe", price: 49.99, quantity: 1, color: "Rose", image: "https://images.unsplash.com/photo-1512201078372-9c6b2a0d528a?w=100&h=100&fit=crop" }
    ],
    subtotal: 169.98, shipping: 0, discount: 17.00, tax: 27.54, total: 180.52,
    status: "delivered", paymentMethod: "Apple Pay", shippingAddress: { ...defaultAddr, street: "3 Place Bellecour", city: "Lyon", zipCode: "69002" }, billingAddress: { ...defaultAddr, street: "3 Place Bellecour", city: "Lyon", zipCode: "69002" },
    trackingNumber: "FR111222333", createdAt: "2026-01-25T12:00:00", updatedAt: "2026-01-30T09:30:00"
  },
  {
    id: "ord-6", orderNumber: "CMD-2026-006", customerId: "cust-4",
    items: [
      { productId: "prod-2", name: "Sac Bohème Chic", price: 129.99, quantity: 1, color: "Beige", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=100&h=100&fit=crop" }
    ],
    subtotal: 129.99, shipping: 5.99, discount: 0, tax: 23.40, total: 159.38,
    status: "shipped", paymentMethod: "Carte Visa", shippingAddress: { ...defaultAddr, street: "23 Rue de la Paix", city: "Marseille", zipCode: "13001" }, billingAddress: { ...defaultAddr, street: "23 Rue de la Paix", city: "Marseille", zipCode: "13001" },
    trackingNumber: "FR444555666", createdAt: "2026-02-08T14:30:00", updatedAt: "2026-02-11T10:00:00"
  },
  {
    id: "ord-7", orderNumber: "CMD-2026-007", customerId: "cust-1",
    items: [
      { productId: "prod-16", name: "Sac Seau Moderne", price: 139.99, quantity: 1, color: "Caramel", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop" },
      { productId: "prod-11", name: "Ceinture Cuir Artisanale", price: 79.99, quantity: 1, color: "Brun", size: "85cm", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=100&h=100&fit=crop" }
    ],
    subtotal: 219.98, shipping: 0, discount: 22.00, tax: 35.64, total: 233.62,
    status: "pending", paymentMethod: "Carte Visa", shippingAddress: defaultAddr, billingAddress: defaultAddr,
    createdAt: "2026-02-15T11:00:00", updatedAt: "2026-02-15T11:00:00"
  },
  {
    id: "ord-8", orderNumber: "CMD-2025-098", customerId: "cust-6",
    items: [
      { productId: "prod-22", name: "Sac Banane Sporty", price: 59.99, quantity: 1, color: "Noir", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop" }
    ],
    subtotal: 59.99, shipping: 5.99, discount: 0, tax: 10.80, total: 76.78,
    status: "cancelled", paymentMethod: "PayPal", shippingAddress: { ...defaultAddr, street: "15 Allée des Roses", city: "Toulouse", zipCode: "31000" }, billingAddress: { ...defaultAddr, street: "15 Allée des Roses", city: "Toulouse", zipCode: "31000" },
    createdAt: "2025-12-20T09:00:00", updatedAt: "2025-12-22T15:00:00"
  },
]

// ==========================================
// AVIS
// ==========================================

export const reviews: Review[] = [
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

// ==========================================
// CODES PROMO
// ==========================================

export const promoCodes: PromoCode[] = [
  { id: "promo-1", code: "BIENVENUE10", type: "percentage", value: 10, maxUses: 100, usedCount: 34, startDate: "2026-01-01", endDate: "2026-06-30", active: true },
  { id: "promo-2", code: "SOLDES20", type: "percentage", value: 20, minAmount: 150, maxUses: 50, usedCount: 22, startDate: "2026-01-15", endDate: "2026-02-28", active: true },
  { id: "promo-3", code: "LIVRAISON", type: "fixed", value: 5.99, maxUses: 200, usedCount: 89, startDate: "2026-01-01", endDate: "2026-12-31", active: true },
  { id: "promo-4", code: "VIP30", type: "percentage", value: 30, minAmount: 200, maxUses: 20, usedCount: 8, startDate: "2026-02-01", endDate: "2026-03-31", active: true, categories: ["cat-1"] },
  { id: "promo-5", code: "NOEL15", type: "percentage", value: 15, maxUses: 100, usedCount: 100, startDate: "2025-12-01", endDate: "2025-12-31", active: false },
]

// ==========================================
// HELPERS
// ==========================================

/**
 * Formate un prix en format monétaire français (EUR)
 * 
 * @param price - Le prix à formater
 * @returns Le prix formaté (ex: "125,99 €")
 * 
 * @example
 * ```ts
 * formatPrice(125.99) // "125,99 €"
 * formatPrice(1000) // "1 000,00 €"
 * ```
 */
export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' }).format(price)
}

/**
 * Formate une date en format français long
 * 
 * @param dateStr - La date au format string (ISO ou autre format valide)
 * @returns La date formatée (ex: "15 janvier 2026")
 * 
 * @example
 * ```ts
 * formatDate("2026-01-15") // "15 janvier 2026"
 * ```
 */
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' }).format(new Date(dateStr))
}

/**
 * Formate une date en format français court
 * 
 * @param dateStr - La date au format string (ISO ou autre format valide)
 * @returns La date formatée (ex: "15/01/2026")
 * 
 * @example
 * ```ts
 * formatDateShort("2026-01-15") // "15/01/2026"
 * ```
 */
export function formatDateShort(dateStr: string): string {
  return new Intl.DateTimeFormat('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' }).format(new Date(dateStr))
}

import { PRODUCT_STATUS, ORDER_STATUS, REVIEW_STATUS, PRODUCT_BADGE, CUSTOMER_SEGMENT } from "./status-types"

/**
 * Obtient la classe CSS de couleur pour un statut donné
 * 
 * @param status - Le statut (produit, commande, avis, etc.)
 * @returns Les classes CSS Tailwind pour le badge de statut
 * 
 * @example
 * ```ts
 * getStatusColor("pending") // "bg-amber-100 text-amber-800..."
 * getStatusColor("delivered") // "bg-emerald-100 text-emerald-800..."
 * ```
 */
export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    [ORDER_STATUS.PENDING]: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    [ORDER_STATUS.CONFIRMED]: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    [ORDER_STATUS.SHIPPED]: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-400",
    [ORDER_STATUS.DELIVERED]: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    [ORDER_STATUS.CANCELLED]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    [ORDER_STATUS.REFUNDED]: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    [PRODUCT_STATUS.PUBLISHED]: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    [PRODUCT_STATUS.DRAFT]: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    [PRODUCT_STATUS.ARCHIVED]: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
    [PRODUCT_STATUS.OUT_OF_STOCK]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
    [REVIEW_STATUS.APPROVED]: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    [REVIEW_STATUS.REJECTED]: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-400",
  }
  return colors[status] || "bg-gray-100 text-gray-800"
}

/**
 * Obtient le label en français pour un statut donné
 * 
 * @param status - Le statut (produit, commande, avis, badge, etc.)
 * @returns Le label en français du statut, ou le statut original si non trouvé
 * 
 * @example
 * ```ts
 * getStatusLabel("pending") // "En attente"
 * getStatusLabel("delivered") // "Livrée"
 * getStatusLabel("new") // "Nouveau"
 * ```
 */
export function getStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    [ORDER_STATUS.PENDING]: "En attente",
    [ORDER_STATUS.CONFIRMED]: "Confirmée",
    [ORDER_STATUS.SHIPPED]: "Expédiée",
    [ORDER_STATUS.DELIVERED]: "Livrée",
    [ORDER_STATUS.CANCELLED]: "Annulée",
    [ORDER_STATUS.REFUNDED]: "Remboursée",
    [PRODUCT_STATUS.PUBLISHED]: "Publié",
    [PRODUCT_STATUS.DRAFT]: "Brouillon",
    [PRODUCT_STATUS.ARCHIVED]: "Archivé",
    [PRODUCT_STATUS.OUT_OF_STOCK]: "Rupture",
    [REVIEW_STATUS.APPROVED]: "Approuvé",
    [REVIEW_STATUS.REJECTED]: "Rejeté",
    [PRODUCT_BADGE.NEW]: "Nouveau",
    [PRODUCT_BADGE.PROMO]: "Promo",
    [PRODUCT_BADGE.COUP_DE_COEUR]: "Coup de coeur",
    [PRODUCT_BADGE.STOCK_LIMITE]: "Stock limité",
  }
  return labels[status] || status
}

/**
 * Obtient la classe CSS de couleur pour un badge de produit
 * 
 * @param badge - Le type de badge (new, promo, coup-de-coeur, stock-limite)
 * @returns Les classes CSS Tailwind pour le badge
 * 
 * @example
 * ```ts
 * getBadgeColor("new") // "bg-emerald-500 text-white"
 * getBadgeColor("promo") // "bg-red-500 text-white"
 * ```
 */
export function getBadgeColor(badge: string): string {
  const colors: Record<string, string> = {
    [PRODUCT_BADGE.NEW]: "bg-emerald-500 text-white",
    [PRODUCT_BADGE.PROMO]: "bg-red-500 text-white",
    [PRODUCT_BADGE.COUP_DE_COEUR]: "bg-pink-500 text-white",
    [PRODUCT_BADGE.STOCK_LIMITE]: "bg-amber-500 text-white",
  }
  return colors[badge] || "bg-gray-500 text-white"
}

/**
 * Obtient le label en français pour un segment client
 */
export function getSegmentLabel(segment: string): string {
  const labels: Record<string, string> = {
    [CUSTOMER_SEGMENT.VIP]: "VIP",
    [CUSTOMER_SEGMENT.NEW]: "Nouveau",
    [CUSTOMER_SEGMENT.REGULAR]: "Régulier",
    [CUSTOMER_SEGMENT.INACTIVE]: "Inactif",
  }
  return labels[segment] || segment
}

/**
 * Obtient la classe CSS de couleur pour un segment client
 */
export function getSegmentColor(segment: string): string {
  const colors: Record<string, string> = {
    [CUSTOMER_SEGMENT.VIP]: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-400",
    [CUSTOMER_SEGMENT.NEW]: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400",
    [CUSTOMER_SEGMENT.REGULAR]: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400",
    [CUSTOMER_SEGMENT.INACTIVE]: "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400",
  }
  return colors[segment] || "bg-gray-100 text-gray-800"
}
