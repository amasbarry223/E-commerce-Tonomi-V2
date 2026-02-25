# Architecture — E-commerce Tonomi V2

Description de la structure du projet, des flux de données et des choix techniques (contexte vs Zustand, guards, routing SPA vs routes Next.js).

---

## 1. Structure des dossiers

```
app/                        # Next.js App Router
  page.tsx                  # Point d’entrée SPA (store + admin via ?view=admin & page=...)
  layout.tsx                # Layout racine, StoreProvider
  login/, register/, forgot-password/, reset-password/
  dashboard/                # Redirection auth → /?view=admin
  account/, cart/, checkout/
  403.tsx, not-found.tsx, global-error.tsx
  admin/[[...slug]]/        # Catch-all admin (redirige vers SPA)
  [...slug]/                # Catch-all store (produit, catégorie, etc.)

components/
  store/                    # Storefront (pages/ + shared/ + composants)
  admin/                    # Back-office
  ui/                       # Design system (shadcn, SafeImage, Empty, etc.)
  providers/                # ErrorBoundaryProvider, etc.

lib/
  storefront/               # Implémentation contexte storefront (cart, navigation, ui) — détail d’implémentation
  store-context.tsx        # Point d’entrée public : réexport StoreProvider, hooks, contextes (importer depuis @/lib/store-context uniquement)
  stores/                  # Stores Zustand : admin-auth-store, customer-auth-store, hero-slides-store, logs-store, logs-actions, reviews-store, settings-store
  data/                     # Données brutes uniquement (products, orders, …)
  data.ts                  # Réexport depuis data/index (rétrocompatibilité @/lib/data)
  types/                    # Point d'entrée types métier (@/lib/types)
  formatters.ts             # Formatage — @/lib/formatters
  services/                 # Couche d'accès données (getProducts, …) — à terme API
  auth/, routes/, utils/    # Auth, constantes de routes, validation, logger, erreurs, etc.
  constants.ts, layout.ts, animations.ts, responsive.ts, status-types.ts, admin-page-map.tsx

hooks/                      # Point d’entrée : hooks/index.ts (useCheckoutForm, useErrorHandler, useToast, …)
```

- Pas de dossier `src/` : racine du code sous `app/`, `components/`, `lib/`, `hooks/`.
- Alias `@/` pointe vers la racine du projet (tsconfig paths `@/*`).

**Responsabilités** : `lib/data` = données brutes (via `lib/data/` + réexport `lib/data.ts`). `lib/formatters` = formatage (prix, dates, statuts). `lib/types` = types métier. `lib/services` = couche d'accès aux données (préparation API). Importer le storefront depuis **`@/lib/store-context`** uniquement ; ne pas importer depuis `@/lib/storefront` depuis l’application.

---

## 2. Flux de données et état global

### 2.1 Storefront (boutique)

| Besoin | Solution | Fichier |
|--------|----------|---------|
| Panier, wishlist, promo, recherche, currentPage, currentView, sélection produit/catégorie | React Context (contexte **storefront**) avec sous-contextes mémoïsés | `lib/storefront/` (cart-context, navigation-context, ui-context, store-provider) ; `lib/store-context.tsx` réexporte |
| Hooks exposés | `useCartStore()`, `useNavigationStore()`, `useUIStore()` | idem |

**Nommage** : « **store** » (store-context / storefront) = boutique / storefront (React Context). « **stores** » (lib/stores/) = modules Zustand (admin-auth-store, customer-auth-store, settings-store, hero-slides-store, reviews-store, logs-store). Ne pas confondre les deux.

| Persistance | localStorage pour le panier (et wishlist si activé) | idem |

Le contexte est découpé en “slices” (cart, navigation, UI) pour limiter les re-renders : un composant qui n’utilise que `useCartStore` ne se met à jour que quand le panier change.

### 2.2 Admin et auth

| Besoin | Solution | Fichier |
|--------|----------|---------|
| Authentification admin | Zustand + persist (cookie côté client) | `lib/stores/admin-auth-store.ts` |
| Authentification client (optionnelle) | Zustand + persist | `lib/stores/customer-auth-store.ts` |
| Paramètres boutique (bannière promo, etc.) | Zustand | `lib/stores/settings-store.ts` |
| Bannières hero | Zustand | `lib/stores/hero-slides-store.ts` |
| Logs d’actions admin | Zustand | `lib/stores/logs-store.ts`, `lib/stores/logs-actions.ts` |
| Avis produits + modération | Zustand | `lib/stores/reviews-store.ts` |

Règle : pas de `require()` entre stores (éviter dépendances circulaires). À terme : bus d’événements (ex. `emitAuthEvent`) pour les logs sans importer logs-store depuis auth-store.

### 2.3 Données métier (lecture)

- **Données brutes** (produits, commandes, catégories, clients, promos, reviews, hero slides) : `lib/data/`. Importer depuis `@/lib/data`. Données uniquement (pas de formatters).
- **Types métier** (Product, Order, CartItem, etc.) : `lib/types/`. Importer depuis `@/lib/types`.
- **Formatage** (prix, dates, statuts, segments, pluralize) : `lib/formatters.ts`. Importer depuis `@/lib/formatters`.
- **Couche d'accès** (optionnel, préparation API) : `lib/services/` (getProducts, getOrders, getCategories, etc.). Importer depuis `@/lib/services` pour centraliser l'accès aux données.
- Constantes métier et UI : `lib/constants.ts`.

---

## 3. Routing : SPA vs routes Next.js

### 3.1 Routes “physiques” Next.js

- `/` : page unique SPA (store ou admin selon `view` et `page`).
- `/login`, `/register`, `/forgot-password`, `/reset-password` : pages dédiées.
- `/dashboard` : redirection après auth vers `/?view=admin`.
- `/account`, `/cart`, `/checkout` : URLs pour le store ; le contenu réel est géré par la SPA via `page` et `view`.
- `/admin/[[...slug]]` : catch-all admin ; redirige vers la SPA admin.
- `/403` : accès interdit.

Les liens du header / sidebar utilisent `ROUTES` et la navigation SPA via `navigate(page)` (store) ou `view=admin` + `page=...` (admin).

### 3.2 Clés de page SPA

- **Store** : `PAGES.store` (home, catalog, product, cart, checkout, account, wishlist, category, promotions). Types : `StorePageKey`.
- **Admin** : `PAGES.admin` (dashboard, products, categories, heroSlides, orders, customers, analytics, promos, reviews, settings). Types : `AdminPageKey`.

Dans `app/page.tsx`, deux maps associent ces clés aux composants : `STORE_PAGE_MAP` et `ADMIN_PAGE_MAP`. Les pages cart et checkout sont enveloppées dans un `ErrorBoundary`.

---

## 4. Protection des routes (admin)

L’admin est protégé côté client dans `components/admin/admin-layout.tsx` : si l’utilisateur n’est pas authentifié (`useAdminAuthStore`), redirection vers `/admin/login`. Il n’existe pas de dossier `lib/guards/` avec des composants `ProtectedRoute` ou `GuestOnlyRoute` séparés ; la vérification est faite dans le layout admin et sur la page login. Délais éventuels avant vérification auth : documentés dans `lib/constants.ts` si besoin (éviter les flashs avant rehydration).

---

## 5. Performance et chargement

- **Recharts** : graphiques admin chargés en lazy via `dynamic()` (AdminDashboardCharts, AdminAnalyticsCharts) avec `AdminChartsSkeleton` pendant le chargement.
- **Catalogue** : `useMemo` sur `filteredProducts` et `paginatedProducts` ; `useCallback` sur les toggles de filtres.
- **Mémo** : ProductCardSkeleton, HeroSlider, CategoriesGrid déjà mémoïsés où pertinent.
- **Images** : SafeImage pour fallback ; Next/Image où possible.

---

## 6. Gestion des erreurs

- **Centralisée** : `lib/utils/error-handling.ts` ; `hooks/use-error-handler.ts` pour combiner handleError + toast.
- **Error boundaries** : `components/ui/error-boundary.tsx` ; usage granulaire sur cart, checkout et zone admin ; `app/global-error.tsx` pour l’erreur globale.

---

## 7. Évolutions prévues (résumé)

- **API** : centraliser les appels dans `lib/services/` avec un client HTTP unique.
- **Auth** : cookie signé côté serveur ; plus de secrets en dur.
- **i18n** : structure de traduction et hook `useTranslation` lorsque nécessaire.
- **Features** (optionnel) : découpage par domaine (auth, cart, catalog, admin) sous `features/` sans big-bang.

---

*Document de référence — à aligner avec TECHNICAL_DEBT.md et CONVENTIONS.md.*
