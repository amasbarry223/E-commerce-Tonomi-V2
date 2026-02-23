# LUXE - E-commerce Maroquinerie

Application e-commerce moderne construite avec Next.js 16, React 19, TypeScript et Tailwind CSS.

## 🚀 Structure du projet

Le code applicatif est à la **racine** du repo (pas de dossier `src/`). Alias d’import : `@/` → racine.

```
app/                        # Next.js App Router
  page.tsx                  # Point d’entrée SPA (store + admin via ?view=admin & page=...)
  layout.tsx                # Layout racine
  login/, register/, forgot-password/, reset-password/
  dashboard/, account/, cart/, checkout/
  admin/[[...slug]]/         # Catch-all admin (redirige vers SPA)
  [...slug]/                # Catch-all store

components/
  ui/                       # Design system (Button, Card, Dialog, etc.)
  store/                    # Storefront (pages + composants partagés)
  admin/                    # Back-office
  providers/                # ErrorBoundaryProvider, etc.

lib/
  data/                     # Données brutes (products, orders, …) — pas de formatters
  types/                    # Types métier — @/lib/types
  formatters.ts             # Formatage (prix, dates, statuts) — importer depuis @/lib/formatters
  stores/                   # Stores Zustand (auth, users, hero-slides, logs, reviews)
  services/                 # Couche d’accès aux données (products, orders) — à terme API
  guards/                   # protected-route, guest-only-route
  auth/                     # getLoginUrl, helpers auth
  routes/                   # ROUTES, PAGES, clés de page
  utils/                    # validation, error-handling, logger
  store-context.tsx         # Contexte storefront (panier, navigation, UI)

hooks/                      # Hooks partagés (réexport central dans hooks/index.ts)
```

## 🛠️ Technologies

- **Next.js 16** - Framework React
- **React 19** - Bibliothèque UI
- **TypeScript** - Typage statique
- **Zustand** - Gestion d'état
- **Tailwind CSS** - Styling
- **Radix UI** - Composants accessibles
- **Recharts** - Graphiques
- **Zod** - Validation

## 📦 Installation

```bash
npm install
# ou pnpm install
```

## 🏃 Développement

```bash
npm run dev
```

### Dépannage

- **Warning npm `devdir`** : Si vous voyez `npm warn Unknown env config "devdir"` lors de `npm run lint` ou d’autres commandes npm, ce warning vient d’une configuration npm globale dépréciée. Pour le supprimer, exécutez `npm config delete devdir` (configuration utilisateur). Vous pouvez aussi l’ignorer : il disparaîtra dans une future majeure de npm.

## 🏗️ Build

```bash
npm run build
npm start
```

## 🧪 Tests

- **Unitaires (Vitest)** : `npm run test` (watch) ou `npm run test:run`
- **E2E (Playwright)** : `npm run test:e2e` (lance le serveur dev puis les specs). Première fois : `npx playwright install chromium`

## ✨ Fonctionnalités

### Store
- Catalogue de produits avec filtres
- Panier avec persistence
- Wishlist
- Checkout
- Compte utilisateur

### Admin
- Dashboard avec analytics
- Gestion produits
- Gestion commandes
- Gestion clients
- Codes promo
- Avis clients

## 🎯 Bonnes pratiques

- **TypeScript strict** : 100% typé, 0 `any`
- **Performance** : Lazy loading, memoization, code splitting
- **Sécurité** : Validation Zod, sanitization
- **Maintenabilité** : Code DRY, composants réutilisables
- **Accessibilité** : ARIA labels, navigation clavier

## 📝 Notes

- Les données sont statiques dans `lib/data/` (types, produits, commandes, etc.)
- L'authentification est gérée côté client (Zustand) avec identifiants configurables (`.env.example`)
- Les API routes sont à créer pour une future persistance
- **Monitoring** : Sentry est intégré (`@sentry/nextjs`). Définir `NEXT_PUBLIC_SENTRY_DSN` (et optionnellement `SENTRY_ORG`, `SENTRY_PROJECT`, `SENTRY_AUTH_TOKEN`) pour activer le reporting d’erreurs en production.

