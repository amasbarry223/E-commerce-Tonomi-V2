# Architecture du projet

## Structure des dossiers

```
app/
├── (store)/              # Route group pour le store (code splitting)
│   ├── layout.tsx        # Layout avec Header/Footer
│   ├── page.tsx          # Home
│   ├── catalog/          # Catalogue
│   ├── product/          # Pages produits
│   ├── cart/             # Panier
│   └── checkout/         # Checkout
├── (admin)/              # Route group pour l'admin (code splitting)
│   ├── layout.tsx        # Layout admin
│   ├── dashboard/        # Dashboard
│   ├── products/         # Gestion produits
│   └── ...
├── api/                  # API Routes Next.js
└── layout.tsx            # Root layout

src/
├── components/
│   ├── ui/               # Composants UI de base (shadcn/ui)
│   ├── store/            # Composants spécifiques store
│   ├── admin/            # Composants spécifiques admin
│   └── shared/           # Composants partagés
│       ├── layout/       # Header, Footer
│       ├── DataTable.tsx # Tableau générique
│       ├── FilterBar.tsx # Barre de filtres
│       ├── PageHeader.tsx
│       └── Pagination.tsx
├── lib/
│   ├── stores/           # Stores Zustand
│   │   ├── cart-store.ts
│   │   ├── wishlist-store.ts
│   │   ├── ui-store.ts
│   │   └── promo-store.ts
│   ├── hooks/            # Hooks personnalisés
│   │   ├── use-cart.ts
│   │   ├── use-products.ts
│   │   ├── use-debounce.ts
│   │   └── use-pagination.ts
│   ├── utils/            # Utilitaires
│   │   ├── format.ts
│   │   ├── constants.ts
│   │   ├── validation.ts
│   │   ├── sort.ts
│   │   ├── export.ts
│   │   └── pagination.ts
│   ├── types/            # Types TypeScript
│   ├── api/              # Clients API
│   └── store-provider.tsx # Provider de compatibilité
└── config/               # Configuration
    └── site.ts
```

## Patterns utilisés

### 1. State Management (Zustand)
- Stores séparés par domaine
- Persistence automatique
- Sélecteurs optimisés

### 2. Hooks personnalisés
- Logique métier réutilisable
- Memoization intégrée
- API simple et claire

### 3. Composants génériques
- DRY (Don't Repeat Yourself)
- Props typées
- Accessibilité intégrée

### 4. Utilitaires
- Fonctions pures
- Typage strict
- Tests faciles

## Flux de données

```
User Action
  ↓
Component
  ↓
Hook / Store
  ↓
Utils / API
  ↓
Data / State
```

## Optimisations

1. **Code Splitting** : Route groups pour séparer store/admin
2. **Lazy Loading** : Composants lourds chargés à la demande
3. **Memoization** : useMemo, useCallback, React.memo
4. **Images** : Next/Image avec optimisation
5. **Bundle** : Tree shaking, package imports optimisés

