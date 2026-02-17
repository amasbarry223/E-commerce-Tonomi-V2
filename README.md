# LUXE - E-commerce Maroquinerie

Application e-commerce moderne construite avec Next.js 16, React 19, TypeScript et Tailwind CSS.

## 🚀 Structure du projet

```
app/
├── (store)/          # Routes publiques (store)
├── (admin)/          # Routes admin
└── api/              # API Routes

src/
├── components/       # Composants React
│   ├── ui/           # Composants UI de base
│   ├── store/        # Composants store
│   ├── admin/        # Composants admin
│   └── shared/       # Composants partagés
├── lib/
│   ├── stores/       # Stores Zustand
│   ├── hooks/        # Hooks personnalisés
│   ├── utils/        # Utilitaires
│   ├── types/         # Types TypeScript
│   └── api/          # Clients API
└── config/           # Configuration
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
pnpm install
```

## 🏃 Développement

```bash
pnpm dev
```

## 🏗️ Build

```bash
pnpm build
pnpm start
```

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

- Les données sont actuellement statiques (dans `lib/data.ts`)
- L'authentification n'est pas encore implémentée
- Les API routes sont à créer

