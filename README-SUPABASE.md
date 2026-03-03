# Configuration Supabase - Tonomi E-commerce

Ce document explique comment configurer et utiliser Supabase avec ce projet.

## 🚀 Configuration initiale

### 1. Variables d'environnement

Copiez `.env.example` vers `.env.local` et remplissez les valeurs :

```bash
cp .env.example .env.local
```

**Variables requises :**

- `NEXT_PUBLIC_SUPABASE_URL` : URL de votre projet Supabase
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` : Clé anonyme (publique)
- `SUPABASE_SERVICE_ROLE_KEY` : Clé service (privée, backend uniquement)
- `DATABASE_URL` : URL de connexion PostgreSQL (pooler)
- `DIRECT_URL` : URL de connexion directe (pour migrations)

### 2. Récupérer les clés Supabase

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet (`hwkypsbaraadizoqvujq`)
3. **Settings → API** :
   - `NEXT_PUBLIC_SUPABASE_URL` : Project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY` : anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` : service_role key (⚠️ gardez-la secrète)

### 3. Installation des dépendances

```bash
pnpm install
# ou
npm install
```

### 4. Configuration Prisma

```bash
# Générer le client Prisma
npx prisma generate

# Pousser le schéma vers Supabase (crée les tables)
npx prisma db push

# Ou utiliser les migrations
npx prisma migrate dev --name init
```

## 📦 Supabase Storage

### Configuration du bucket

1. Allez dans **Storage** dans le dashboard Supabase
2. Créez un bucket nommé `tonomi-images`
3. Configurez les politiques :
   - **Public** : pour les images publiques (produits, catégories, hero)
   - **Authenticated** : pour les avatars clients

### Structure des dossiers

```
tonomi-images/
  ├── products/          # Images produits
  ├── categories/        # Images catégories
  ├── hero/             # Slides hero
  ├── customers/         # Avatars clients
  └── logos/            # Logos et assets
```

## 🗄️ Base de données

### Schéma Prisma

Le schéma est défini dans `prisma/schema.prisma`. Il inclut :

- **Products** : Produits avec images, couleurs, tailles
- **Categories** : Catégories avec hiérarchie
- **Orders** : Commandes avec items
- **Customers** : Clients avec adresses
- **Reviews** : Avis produits
- **PromoCodes** : Codes promo
- **HeroSlides** : Slides hero
- **Settings** : Paramètres boutique

### Migrations

```bash
# Créer une nouvelle migration
npx prisma migrate dev --name nom_de_la_migration

# Appliquer les migrations en production
npx prisma migrate deploy
```

## 🔧 Architecture

### Pattern Repository

Le projet utilise le pattern Repository pour séparer la logique d'accès aux données :

```
lib/
  ├── repositories/        # Couche d'accès aux données (Prisma)
  │   ├── product-repository.ts
  │   ├── category-repository.ts
  │   └── ...
  ├── services/            # Couche de services (abstraction)
  │   ├── products.ts
  │   ├── categories.ts
  │   └── ...
  └── supabase/           # Client Supabase
      ├── client.ts
      └── storage.ts
```

### Utilisation

**Dans les composants React (Server Components) :**

```typescript
import { getProducts } from "@/lib/services"

export default async function ProductsPage() {
  const products = await getProducts()
  return <div>{/* ... */}</div>
}
```

**Dans les API Routes :**

```typescript
import { productRepository } from "@/lib/repositories"

export async function POST(request: Request) {
  const product = await productRepository.create(data)
  return Response.json(product)
}
```

**Pour les images (client-side) :**

```typescript
import { uploadImage, getPublicUrl } from "@/lib/supabase/storage"

// Upload
const url = await uploadImage(file, "products/product-1.jpg")

// Récupérer l'URL publique
const publicUrl = getPublicUrl("products/product-1.jpg")
```

## 🔐 Sécurité

### RLS (Row Level Security)

Configurez les politiques RLS dans Supabase pour :

- **Products** : Lecture publique, écriture admin uniquement
- **Orders** : Clients voient uniquement leurs commandes
- **Reviews** : Clients peuvent créer leurs avis
- **Customers** : Accès limité aux données personnelles

### Variables d'environnement

⚠️ **Ne jamais commiter** :
- `.env.local`
- `SUPABASE_SERVICE_ROLE_KEY`
- Toute clé secrète

## 📝 Notes

- Les images sont stockées dans Supabase Storage
- Les URLs des images sont générées dynamiquement
- Le client Prisma est un singleton pour éviter les connexions multiples
- Les repositories utilisent Prisma pour les opérations serveur
- Le client Supabase est utilisé pour Storage et Auth (si activé)

## 🐛 Dépannage

### Erreur de connexion à la base

Vérifiez que :
- `DATABASE_URL` est correcte (avec `%40` pour `@`)
- Le pooler est accessible depuis votre IP
- Les credentials sont corrects

### Erreur Prisma

```bash
# Régénérer le client
npx prisma generate

# Vérifier la connexion
npx prisma db pull
```

### Images non affichées

1. Vérifiez que le bucket `tonomi-images` existe
2. Vérifiez les politiques de sécurité du bucket
3. Vérifiez que les URLs sont correctes
