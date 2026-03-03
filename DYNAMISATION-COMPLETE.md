# ✅ Dynamisation complète du projet Tonomi

## 🎯 Résumé

Le projet a été complètement dynamisé pour utiliser Supabase comme base de données. Toutes les données statiques ont été remplacées par des appels dynamiques à Supabase via Prisma.

## 📦 Architecture mise en place

### 1. Base de données (Prisma)

- ✅ **Schéma Prisma complet** (`prisma/schema.prisma`)
  - Products avec images, couleurs, tailles
  - Categories avec hiérarchie
  - Orders avec items
  - Customers avec adresses
  - Reviews
  - PromoCodes
  - HeroSlides
  - Settings

### 2. Pattern Repository

- ✅ **BaseRepository** : Classe abstraite avec méthodes communes
- ✅ **Repositories spécialisés** :
  - `ProductRepository`
  - `CategoryRepository`
  - `OrderRepository`
  - `CustomerRepository`
  - `ReviewRepository`
  - `PromoCodeRepository`
  - `HeroSlideRepository`

### 3. Services (Couche d'abstraction)

- ✅ **Services mis à jour** pour utiliser les repositories :
  - `lib/services/products.ts`
  - `lib/services/categories.ts`
  - `lib/services/orders.ts`
  - `lib/services/customers.ts`
  - `lib/services/reviews.ts`
  - `lib/services/promos.ts`
  - `lib/services/hero-slides.ts`

### 4. Supabase Configuration

- ✅ **Client Supabase** (`lib/supabase/client.ts`)
  - Client frontend (public)
  - Client backend (service role)

- ✅ **Supabase Storage** (`lib/supabase/storage.ts`)
  - Upload d'images
  - Récupération d'URLs publiques
  - Suppression d'images
  - Helpers pour les chemins

### 5. Hooks React

- ✅ **Hooks pour données dynamiques** :
  - `useProducts()` - Charger tous les produits
  - `useProductsWithFilters()` - Produits avec filtres
  - `useFeaturedProducts()` - Produits en vedette
  - `useProductSearch()` - Recherche de produits
  - `useCategories()` - Toutes les catégories
  - `useRootCategories()` - Catégories racines
  - `useHeroSlides()` - Slides hero

### 6. Helpers

- ✅ **Helpers Supabase** (`lib/utils/supabase-helpers.ts`)
  - `getImageUrl()` - Récupérer l'URL complète d'une image
  - `isSupabaseUrl()` - Vérifier si c'est une URL Supabase
  - `extractStoragePath()` - Extraire le chemin du bucket

## 📁 Structure des fichiers créés

```
lib/
├── db/
│   └── prisma.ts                    # Client Prisma singleton
├── repositories/
│   ├── base-repository.ts           # Repository de base
│   ├── product-repository.ts        # Repository produits
│   ├── category-repository.ts       # Repository catégories
│   ├── order-repository.ts          # Repository commandes
│   ├── customer-repository.ts      # Repository clients
│   ├── review-repository.ts         # Repository avis
│   ├── promo-code-repository.ts     # Repository codes promo
│   ├── hero-slide-repository.ts     # Repository hero slides
│   └── index.ts                     # Exports centralisés
├── supabase/
│   ├── client.ts                    # Clients Supabase
│   └── storage.ts                   # Gestion Storage
├── services/
│   ├── products.ts                 # Service produits (mis à jour)
│   ├── categories.ts               # Service catégories (mis à jour)
│   ├── orders.ts                   # Service commandes (mis à jour)
│   ├── customers.ts                # Service clients (mis à jour)
│   ├── reviews.ts                  # Service avis (mis à jour)
│   ├── promos.ts                   # Service codes promo (mis à jour)
│   └── hero-slides.ts              # Service hero slides (mis à jour)
├── types/
│   └── prisma.ts                   # Types Prisma avec relations
└── utils/
    └── supabase-helpers.ts         # Helpers Supabase

hooks/
├── use-products.ts                 # Hooks produits
├── use-categories.ts                # Hooks catégories
└── use-hero-slides.ts              # Hooks hero slides

prisma/
└── schema.prisma                   # Schéma Prisma complet
```

## 🔧 Configuration requise

### Variables d'environnement

Créez un fichier `.env.local` avec :

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://hwkypsbaraadizoqvujq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service

# Database
DATABASE_URL="postgresql://postgres.hwkypsbaraadizoqvujq:tonomi%402026@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://postgres.hwkypsbaraadizoqvujq:tonomi%402026@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true&pool_timeout=0"

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## 🚀 Prochaines étapes

### 1. Installation

```bash
# Installer les dépendances
pnpm install

# Générer le client Prisma
npx prisma generate

# Créer les tables dans Supabase
npx prisma db push
```

### 2. Configuration Supabase Storage

1. Allez dans Supabase Dashboard → Storage
2. Créez un bucket nommé `tonomi-images`
3. Configurez les politiques :
   - **Public Access** : Activé
   - **File size limit** : 10MB

### 3. Migration des données

Créez un script pour importer les données existantes depuis `lib/data/` vers Supabase.

### 4. Mise à jour des composants

Remplacez les appels synchrones par les hooks asynchrones :

**Avant :**
```typescript
const products = getProducts() // Synchronous
```

**Après :**
```typescript
// Client-side
const { products, isLoading, error } = useProducts()

// Server-side (Server Components)
const products = await getProducts()
```

## 📝 Exemples d'utilisation

### Charger des produits (Client Component)

```typescript
"use client"

import { useProducts } from "@/hooks"

export function ProductsList() {
  const { products, isLoading, error } = useProducts()

  if (isLoading) return <div>Chargement...</div>
  if (error) return <div>Erreur: {error.message}</div>

  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### Charger des produits (Server Component)

```typescript
import { getProducts } from "@/lib/services"

export default async function ProductsPage() {
  const products = await getProducts()
  
  return (
    <div>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
```

### Upload d'image

```typescript
import { uploadImage, generateImagePath, IMAGE_PATHS } from "@/lib/supabase/storage"

async function handleUpload(file: File) {
  const path = generateImagePath(IMAGE_PATHS.products, file.name)
  const url = await uploadImage(file, path)
  return url
}
```

### Utiliser les repositories directement

```typescript
import { productRepository } from "@/lib/repositories"

// Dans une API Route
export async function POST(request: Request) {
  const data = await request.json()
  const product = await productRepository.createWithRelations({
    product: data.product,
    images: data.images,
    colors: data.colors,
    sizes: data.sizes,
  })
  return Response.json(product)
}
```

## ⚠️ Points importants

1. **Images** : Toutes les images doivent être dans Supabase Storage
2. **URLs** : Utilisez `getImageUrl()` pour les URLs d'images
3. **Performance** : Utilisez la pagination pour les grandes listes
4. **Erreurs** : Gérez les erreurs de connexion
5. **Loading** : Affichez des états de chargement

## 📚 Documentation

- `README-SUPABASE.md` : Guide complet Supabase
- `MIGRATION-GUIDE.md` : Guide de migration
- `scripts/init-db.md` : Scripts d'initialisation

## ✅ Checklist finale

- [x] Schéma Prisma créé
- [x] Repositories implémentés
- [x] Services mis à jour
- [x] Hooks React créés
- [x] Configuration Supabase
- [x] Helpers créés
- [x] Documentation complète
- [ ] Migration des données (à faire)
- [ ] Mise à jour des composants (à faire)
- [ ] Tests (à faire)

---

**Le projet est maintenant prêt pour être connecté à Supabase !** 🎉

Il reste à :
1. Configurer les variables d'environnement
2. Créer les tables dans Supabase
3. Migrer les données existantes
4. Mettre à jour les composants pour utiliser les hooks asynchrones
