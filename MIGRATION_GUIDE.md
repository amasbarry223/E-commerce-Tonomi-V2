# Guide de migration vers la nouvelle architecture

## ✅ Ce qui est prêt

### Infrastructure
- ✅ Nouvelle structure `src/` avec organisation modulaire
- ✅ Route groups `(store)` et `(admin)` pour code splitting
- ✅ Stores Zustand (cart, wishlist, ui, promo)
- ✅ Hooks personnalisés (useCart, useProducts, usePagination, useDebounce)
- ✅ Utilitaires centralisés (format, validation, sort, export, pagination)
- ✅ Composants génériques (DataTable, FilterBar, PageHeader, Pagination)
- ✅ Provider de compatibilité pour transition progressive

### Composants migrés
- ✅ `HomePage` → `src/components/store/HomePage.tsx`
- ✅ `Header` → `src/components/shared/layout/Header.tsx`
- ✅ `Footer` → `src/components/shared/layout/Footer.tsx`
- ✅ `ProductCard` → `src/components/store/product/ProductCard.tsx` (optimisé)

### Configuration
- ✅ `siteConfig` centralisé
- ✅ Types TypeScript centralisés
- ✅ Middleware de sécurité
- ✅ Next.config optimisé

## 🔄 Comment migrer un composant

### Étape 1 : Remplacer les imports

**Avant :**
```tsx
import { useStore } from "@/lib/store-context"
```

**Après :**
```tsx
import { useCartStore } from '@/lib/stores/cart-store'
import { useWishlistStore } from '@/lib/stores/wishlist-store'
import { useUIStore } from '@/lib/stores/ui-store'
// OU utiliser le provider de compatibilité :
import { useStore } from '@/lib/store-provider'
```

### Étape 2 : Utiliser les hooks personnalisés

**Avant :**
```tsx
const { cart, cartTotal, addToCart } = useStore()
```

**Après :**
```tsx
import { useCart } from '@/lib/hooks/use-cart'
const { items, total, addItem } = useCart()
```

### Étape 3 : Utiliser les utilitaires

**Avant :**
```tsx
import { formatPrice, getStatusColor } from "@/lib/data"
```

**Après :**
```tsx
import { formatPrice, getStatusColor } from '@/lib/utils'
```

### Étape 4 : Utiliser les composants génériques

**Avant :**
```tsx
// Code dupliqué pour chaque table
<table>...</table>
```

**Après :**
```tsx
import { DataTable } from '@/components/shared'
<DataTable
  data={orders}
  columns={columns}
  keyExtractor={(o) => o.id}
/>
```

## 📋 Checklist de migration

Pour chaque composant à migrer :

- [ ] Remplacer `useStore()` par les stores spécifiques ou le provider
- [ ] Utiliser les hooks personnalisés (`useCart`, `useProducts`, etc.)
- [ ] Remplacer les imports d'utilitaires par `@/lib/utils`
- [ ] Utiliser les composants génériques si applicable
- [ ] Ajouter `React.memo` si le composant est souvent re-rendu
- [ ] Utiliser `useMemo` pour les calculs coûteux
- [ ] Utiliser `useCallback` pour les handlers
- [ ] Tester le composant

## 🎯 Exemple complet

### Avant
```tsx
"use client"
import { useStore } from "@/lib/store-context"
import { formatPrice } from "@/lib/data"

export function CartPage() {
  const { cart, cartTotal, removeFromCart } = useStore()
  
  return (
    <div>
      {cart.map(item => (
        <div key={item.productId}>
          <p>{item.name}</p>
          <p>{formatPrice(item.price)}</p>
          <button onClick={() => removeFromCart(item.productId)}>Remove</button>
        </div>
      ))}
      <p>Total: {formatPrice(cartTotal)}</p>
    </div>
  )
}
```

### Après
```tsx
"use client"
import { useCart } from '@/lib/hooks/use-cart'
import { formatPrice } from '@/lib/utils'
import { Button } from '@/components/ui/button'

export function CartPage() {
  const { items, total, removeItem } = useCart()
  
  return (
    <div>
      {items.map(item => (
        <div key={`${item.productId}-${item.color}-${item.size}`}>
          <p>{item.name}</p>
          <p>{formatPrice(item.price)}</p>
          <Button onClick={() => removeItem(item.productId, item.color, item.size)}>
            Remove
          </Button>
        </div>
      ))}
      <p>Total: {formatPrice(total)}</p>
    </div>
  )
}
```

## 🚀 Prochaines étapes

1. Migrer les pages restantes (`CatalogPage`, `ProductPage`, `CartPage`, etc.)
2. Migrer les composants admin vers les composants génériques
3. Ajouter les tests unitaires
4. Implémenter l'authentification
5. Créer les API routes

