# Changelog - Refonte complète

## [2.0.0] - 2026-02-16

### 🎉 Refonte majeure

#### Architecture
- Nouvelle structure modulaire avec `src/`
- Route groups `(store)` et `(admin)` pour code splitting
- Séparation claire des responsabilités

#### State Management
- Migration de Context API vers Zustand
- Stores séparés : cart, wishlist, ui, promo
- Persistence automatique avec localStorage
- Provider de compatibilité pour transition progressive

#### Hooks personnalisés
- `useCart` - Gestion optimisée du panier
- `useProducts` - Filtrage et recherche produits
- `useDebounce` - Debounce pour recherche
- `usePagination` - Pagination réutilisable

#### Utilitaires
- `format.ts` - Formatage prix/dates centralisé
- `constants.ts` - Constantes et helpers
- `validation.ts` - Schémas Zod
- `sort.ts` - Tri déterministe
- `export.ts` - Export CSV
- `pagination.ts` - Utilitaires pagination
- `error-handling.ts` - Gestion d'erreurs
- `performance.ts` - Debounce/throttle

#### Composants génériques
- `DataTable` - Tableau réutilisable
- `FilterBar` - Barre de filtres
- `PageHeader` - En-tête standardisé
- `Pagination` - Pagination UI

#### Optimisations
- Lazy loading des composants admin
- Code splitting avec route groups
- React.memo pour ProductCard
- useMemo/useCallback partout
- Next/Image activé et optimisé
- Tree shaking optimisé

#### Sécurité
- Middleware de sécurité créé
- Headers de sécurité configurés
- Validation Zod partout

#### Configuration
- `siteConfig` centralisé
- Types TypeScript centralisés
- Client API centralisé
- Next.config optimisé

### 📝 Documentation
- README.md mis à jour
- ARCHITECTURE.md créé
- MIGRATION_GUIDE.md créé
- REFACTORING.md créé

### 🔄 Migration
- Provider de compatibilité créé
- Anciens composants continuent de fonctionner
- Migration progressive possible

