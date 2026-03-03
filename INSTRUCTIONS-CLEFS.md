# 🔑 Instructions pour récupérer les clés Supabase

## ⚠️ IMPORTANT

Le fichier `.env.local` a été créé, mais vous devez remplacer ces deux valeurs :

1. `your_supabase_anon_key_here` → Votre clé anon/public
2. `your_supabase_service_role_key_here` → Votre clé service_role

## 📋 Étapes pour récupérer les clés

### 1. Accéder au Dashboard Supabase

1. Allez sur https://supabase.com/dashboard
2. Connectez-vous à votre compte
3. Sélectionnez votre projet : **hwkypsbaraadizoqvujq**

### 2. Récupérer les clés API

1. Dans le menu de gauche, cliquez sur **Settings** (⚙️)
2. Cliquez sur **API** dans le sous-menu
3. Vous verrez plusieurs sections :

#### Section "Project URL"
- Copiez l'URL complète (déjà dans `.env.local`)

#### Section "Project API keys"
- **anon public** : C'est la clé publique, safe pour le frontend
  - Cliquez sur l'icône 👁️ pour révéler la clé
  - Copiez cette clé
  - Remplacez `your_supabase_anon_key_here` dans `.env.local`

- **service_role** : ⚠️ **CLÉ SECRÈTE** - Ne l'exposez JAMAIS côté client
  - Cliquez sur l'icône 👁️ pour révéler la clé
  - Copiez cette clé
  - Remplacez `your_supabase_service_role_key_here` dans `.env.local`
  - **NE COMMITEZ JAMAIS CETTE CLÉ DANS GIT**

### 3. Vérifier la connexion à la base de données

Les URLs `DATABASE_URL` et `DIRECT_URL` sont déjà configurées avec :
- Project Reference ID : `hwkypsbaraadizoqvujq`
- Mot de passe : `tonomi@2026` (encodé en `tonomi%402026`)

Si vous avez changé le mot de passe de la base de données, vous devez mettre à jour ces URLs.

## ✅ Après avoir rempli les clés

Une fois que vous avez remplacé les deux clés dans `.env.local`, vous pouvez exécuter :

```powershell
# Générer le client Prisma
npx prisma generate

# Réinitialiser la base (si nécessaire)
npx prisma migrate reset

# Créer les tables
npx prisma db push
```

## 🔒 Sécurité

- ✅ Le fichier `.env.local` est dans `.gitignore` (ne sera pas commité)
- ⚠️ Ne partagez JAMAIS votre clé `service_role`
- ⚠️ Ne commitez JAMAIS le fichier `.env.local`
- ✅ La clé `anon` peut être utilisée côté client (elle est publique)

## 📝 Format des clés

Les clés Supabase ressemblent à ceci :
- **anon key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3a3lwc2JhcmFhZGl6b3F2dWpxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTY...`
- **service_role key** : `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imh3a3lwc2JhcmFhZGl6b3F2dWpxIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcxNj...`

Elles sont très longues (plusieurs centaines de caractères).
