# 🚀 Démarrage rapide - Configuration Prisma

## ⚠️ Problème actuel

Vous avez une erreur car les variables d'environnement ne sont pas définies.

## ✅ Solution rapide

### 1. Créer le fichier `.env.local`

Créez un fichier `.env.local` à la racine du projet avec ce contenu :

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================

NEXT_PUBLIC_SUPABASE_URL=https://hwkypsbaraadizoqvujq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_ici

# ============================================
# DATABASE (Prisma)
# ============================================

DATABASE_URL="postgresql://postgres.hwkypsbaraadizoqvujq:tonomi%402026@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://postgres.hwkypsbaraadizoqvujq:tonomi%402026@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true&pool_timeout=0"

# ============================================
# APPLICATION
# ============================================

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Récupérer les clés Supabase

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet (`hwkypsbaraadizoqvujq`)
3. Allez dans **Settings → API**
4. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **GARDEZ-LA SECRÈTE**

### 3. Exécuter les commandes Prisma

Une fois le fichier `.env.local` créé avec les bonnes valeurs :

```powershell
# Générer le client Prisma
npx prisma generate

# Réinitialiser la base (supprime toutes les tables)
npx prisma migrate reset

# Créer les tables
npx prisma db push
```

### 4. Vérifier

```powershell
# Ouvrir Prisma Studio pour visualiser
npx prisma studio
```

## 📝 Notes importantes

- Le fichier `.env.local` ne doit **PAS** être commité dans Git (il est dans `.gitignore`)
- Les variables `DATABASE_URL` et `DIRECT_URL` utilisent `%40` pour représenter `@` dans le mot de passe
- Si vous avez créé un nouveau projet Supabase, remplacez `hwkypsbaraadizoqvujq` par votre nouveau Project Reference ID

## 🆘 Si ça ne fonctionne toujours pas

1. Vérifiez que le fichier `.env.local` est bien à la racine du projet
2. Vérifiez qu'il n'y a pas d'espaces avant/après les valeurs
3. Vérifiez que les guillemets sont corrects dans `DATABASE_URL` et `DIRECT_URL`
4. Redémarrez votre terminal après avoir créé `.env.local`
