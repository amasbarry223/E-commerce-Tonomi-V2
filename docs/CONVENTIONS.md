# Conventions de code — E-commerce Tonomi V2

Règles de nommage, structure du code, gestion d’erreurs et bonnes pratiques à respecter dans le projet.

---

## 1. Nommage

### 1.1 Fichiers

| Type | Règle | Exemples |
|------|--------|----------|
| Composants React | **kebab-case** | `product-card.tsx`, `admin-dashboard.tsx`, `checkout-page.tsx` |
| Hooks | **kebab-case** avec préfixe `use-` | `use-checkout-form.tsx`, `use-simulated-loading.ts` |
| Lib / utils | **kebab-case** | `store-context.tsx`, `auth-store.ts`, `protected-route.tsx`, `error-handling.ts` |
| Types / données | **kebab-case** | `types.ts`, `products.ts`, `hero-slides.ts` |

### 1.2 Code

| Élément | Règle | Exemples |
|--------|--------|----------|
| Composants | **PascalCase** | `ProductCard`, `AdminDashboard`, `GuestOnlyRoute` |
| Fonctions / hooks | **camelCase** | `formatPrice`, `useCartStore`, `getLoginUrl` |
| Constantes (globales / config) | **SCREAMING_SNAKE** | `PAGES`, `ROUTES`, `AUTH_DELAYS_MS`, `SHIPPING_LABELS` |
| Variables / états | **camelCase** | `currentPage`, `filteredProducts`, `isLoading` |
| Types / interfaces | **PascalCase** | `Product`, `StorePageKey`, `CheckoutFormData` |

### 1.3 Handlers

- Préférer des noms explicites : `handleSubmitOrder`, `handleApplyPromo`, `handleClose`.
- Éviter les noms trop génériques (`handleClick`) sauf pour des callbacks très simples.

---

## 2. Structure du code

### 2.1 Longueur des fonctions

- Viser **20–30 lignes** par fonction. Au-delà, extraire des sous-fonctions ou des hooks.
- Cibler en priorité : `lib/store-context.tsx` (ex. `applyPromoCode`), handlers dans admin-settings, checkout (submit, calculs).

### 2.2 Paramètres

- Éviter les paramètres booléens seuls (`fn(true)`). Préférer un objet d’options ou des noms de fonctions distincts.

### 2.3 Commentaires

- Supprimer les commentaires qui répètent le code.
- Garder le “pourquoi” (ex. délai rehydration auth, contournement conflit motion).
- **JSDoc** sur les fonctions partagées et hooks publics : `lib/utils/validation.ts`, `lib/utils/error-handling.ts`, `useCheckoutForm`, `useErrorHandler`, et sur les composants réutilisables (SafeImage, Empty, ConfirmDeleteDialog).

### 2.4 Lisibilité

- Décomposer les conditions complexes en variables nommées (`const isPromoApplicable = ...`).
- Privilégier l’early return dans les handlers plutôt que des ternaires imbriqués.
- Style async : utiliser `async/await` ; éviter les `.then()` résiduels.

---

## 3. État et stores

### 3.1 Storefront (contexte)

- Utiliser **uniquement** `useCartStore()`, `useNavigationStore()`, `useUIStore()`.
- Ne pas utiliser (ni réintroduire) un hook générique `useStore()` qui exposerait tout le contexte.

### 3.2 Admin (Zustand)

- Auth, users, hero-slides, logs : stores Zustand dans `lib/stores/`.
- **Pas de `require()`** entre stores pour éviter les dépendances circulaires. Pour les logs liés à l’auth, utiliser un bus d’événements (ex. `emitAuthEvent` + listener dans un provider).

---

## 4. Gestion des erreurs

- **Centraliser** : `lib/utils/error-handling.ts` et `hooks/use-error-handler.ts`.
- **Zod** : utiliser `.issues` (Zod 3), pas `.errors`. Utiliser un helper type `getZodErrorMessage()` pour les messages utilisateur.
- **Error boundaries** : les utiliser de façon granulaire sur les zones critiques (cart, checkout, admin) ; garder une erreur globale (`global-error.tsx`).
- Ne pas laisser de paramètres d’erreur inutilisés (ex. `showToast` non implémenté) sans les documenter ou les retirer.

---

## 5. Constantes et configuration

- **Magic numbers / strings** : les centraliser dans `lib/constants.ts` (ANIMATION_DELAYS, AUTH_DELAYS_MS, LAYOUT_CONSTANTS, TOAST_MESSAGES, SHIPPING_LABELS, etc.).
- **Secrets** : ne jamais commiter `ADMIN_EMAIL` / `ADMIN_PASSWORD` en dur. Utiliser des variables d’environnement et documenter dans `.env.example`.

---

## 6. Typage (TypeScript)

- Éviter `any`. Pour les props qui étendent un composant (ex. Radix + Framer Motion), utiliser `Omit<..., 'onDrag' | 'onDragStart' | 'onDragEnd'>` plutôt qu’un cast `as any`.
- Rôles auth : typer avec un type union (`AuthRole = 'admin' | 'super-admin'`) au lieu de `string`.
- Types métier et API : centraliser dans `lib/data/types.ts` et `lib/types/` ; à étendre quand un backend sera en place.

---

## 7. Routing et pages

- **Clés de page** : utiliser `PAGES` et les types `StorePageKey` / `AdminPageKey` depuis `lib/routes`.
- **Maps de composants** : `STORE_PAGE_MAP` et `ADMIN_PAGE_MAP` dans `app/page.tsx` ; éviter les gros `switch` sur les clés de page.
- **URLs** : utiliser les constantes `ROUTES` et helpers comme `getLoginUrl()` pour les redirections et liens.

---

## 8. Tests

- Vitest pour les hooks, utils, formatters ; Playwright pour les parcours E2E.
- Cibler en priorité : `lib/utils/validation.ts`, `lib/formatters.ts`, hooks (useCheckoutForm, usePagination), composants critiques (ProductCard, flux checkout).
- Garder les tests à jour après refactors importants.

---

*Ces conventions sont le reflet des choix actuels du projet et des recommandations de l’audit. À faire évoluer avec le projet et à croiser avec TECHNICAL_DEBT.md et ARCHITECTURE.md.*
