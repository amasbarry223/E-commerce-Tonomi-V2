# Scripts d'initialisation de la base de données

## Étapes pour initialiser Supabase

### 1. Installer les dépendances

```bash
pnpm install
# ou
npm install
```

### 2. Configurer les variables d'environnement

Créez un fichier `.env.local` avec les valeurs suivantes :

```env
NEXT_PUBLIC_SUPABASE_URL=https://hwkypsbaraadizoqvujq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_ici

DATABASE_URL="postgresql://postgres.hwkypsbaraadizoqvujq:tonomi%402026@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://postgres.hwkypsbaraadizoqvujq:tonomi%402026@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true&pool_timeout=0"

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3. Générer le client Prisma

```bash
npx prisma generate
```

### 4. Créer les tables dans Supabase

```bash
# Option 1 : Push direct (développement)
npx prisma db push

# Option 2 : Migrations (production)
npx prisma migrate dev --name init
```

### 5. Créer le bucket Supabase Storage

1. Allez dans le dashboard Supabase → Storage
2. Créez un bucket nommé `tonomi-images`
3. Configurez les politiques :
   - **Public Access** : Activé pour les images publiques
   - **File size limit** : 10MB (ou selon vos besoins)

### 6. Vérifier la connexion

```bash
npx prisma studio
```

Cela ouvrira Prisma Studio pour visualiser vos données.

## Commandes utiles

```bash
# Générer le client Prisma après modification du schema
npx prisma generate

# Créer une migration
npx prisma migrate dev --name nom_migration

# Appliquer les migrations en production
npx prisma migrate deploy

# Visualiser les données
npx prisma studio

# Réinitialiser la base (⚠️ supprime toutes les données)
npx prisma migrate reset
```
