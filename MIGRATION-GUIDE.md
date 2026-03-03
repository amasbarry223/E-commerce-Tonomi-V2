# Guide de migration vers Supabase

Ce guide explique comment migrer le projet de données statiques vers Supabase.

## 📋 Checklist de migration

### 1. Configuration initiale

- [ ] Installer les dépendances : `pnpm install`
- [ ] Créer `.env.local` avec les variables Supabase
- [ ] Générer le client Prisma : `npx prisma generate`
- [ ] Créer les tables : `npx prisma db push`
- [ ] Créer le bucket Storage `tonomi-images` dans Supabase

### 2. Migration des données

#### Produits
- [ ] Exporter les données depuis `lib/data/products.ts`
- [ ] Créer un script de migration pour importer dans Supabase
- [ ] Uploader les images vers Supabase Storage
- [ ] Mettre à jour les URLs d'images

#### Catégories
- [ ] Exporter les catégories depuis `lib/data/categories.ts`
- [ ] Importer dans Supabase
- [ ] Uploader les images de catégories

#### Autres données
- [ ] Commandes (si nécessaire)
- [ ] Clients (si nécessaire)
- [ ] Codes promo
- [ ] Hero slides
- [ ] Avis

### 3. Mise à jour du code

#### Services
- [x] ✅ Créer les repositories (Prisma)
- [x] ✅ Mettre à jour les services pour utiliser les repositories
- [ ] Tester chaque service individuellement

#### Composants
- [ ] Remplacer `getProducts()` synchrone par `useProducts()` hook
- [ ] Remplacer `getCategories()` synchrone par `useCategories()` hook
- [ ] Mettre à jour les composants pour gérer le loading/error
- [ ] Tester chaque page

#### Images
- [ ] Remplacer les URLs statiques par `getImageUrl()` helper
- [ ] Vérifier que toutes les images s'affichent correctement
- [ ] Tester l'upload d'images (admin)

### 4. Tests

- [ ] Tester le chargement des produits
- [ ] Tester la recherche
- [ ] Tester les filtres
- [ ] Tester le panier
- [ ] Tester le checkout
- [ ] Tester l'admin (CRUD produits)
- [ ] Tester l'upload d'images

## 🔄 Changements principaux

### Avant (données statiques)

```typescript
// Synchronous
const products = getProducts()
const categories = getCategories()
```

### Après (Supabase)

```typescript
// Client-side avec hooks
const { products, isLoading, error } = useProducts()
const { categories, isLoading } = useCategories()

// Server-side (Server Components)
const products = await getProducts()
const categories = await getCategories()
```

## 📝 Script de migration des données

Créez un script `scripts/migrate-data.ts` pour importer les données existantes :

```typescript
import { prisma } from "@/lib/db/prisma"
import { products } from "@/lib/data/products"
import { categories } from "@/lib/data/categories"

async function migrate() {
  // Migrer les catégories
  for (const category of categories) {
    await prisma.category.create({
      data: {
        id: category.id,
        name: category.name,
        slug: category.slug,
        description: category.description,
        image: category.image,
        productCount: category.productCount,
      },
    })
  }

  // Migrer les produits
  for (const product of products) {
    await prisma.product.create({
      data: {
        id: product.id,
        name: product.name,
        slug: product.slug,
        // ... autres champs
        images: {
          create: product.images.map((url, index) => ({
            url,
            order: index,
          })),
        },
        colors: {
          create: product.colors.map((color, index) => ({
            name: color.name,
            hex: color.hex,
            order: index,
          })),
        },
        // ...
      },
    })
  }
}

migrate()
```

## ⚠️ Points d'attention

1. **Images** : Toutes les images doivent être uploadées vers Supabase Storage
2. **URLs** : Les URLs d'images doivent être mises à jour
3. **Performance** : Utiliser le cache et la pagination pour les grandes listes
4. **Erreurs** : Gérer les erreurs de connexion et les timeouts
5. **Loading states** : Afficher des skeletons pendant le chargement

## 🚀 Déploiement

1. Configurer les variables d'environnement sur Vercel
2. Exécuter les migrations : `npx prisma migrate deploy`
3. Vérifier que le bucket Storage est accessible publiquement
4. Tester l'application en production
