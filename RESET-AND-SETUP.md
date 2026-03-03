# 🔄 Guide de réinitialisation - Supabase et Vercel

Ce guide vous explique comment réinitialiser complètement votre projet pour repartir avec la nouvelle architecture.

## ⚠️ ATTENTION

**Avant de commencer, assurez-vous d'avoir :**
- ✅ Sauvegardé toutes les données importantes (si nécessaire)
- ✅ Noté vos identifiants Supabase et Vercel
- ✅ Le projet local à jour avec tous les fichiers de dynamisation

---

## 📋 ÉTAPE 1 : Réinitialiser Supabase

### Option A : Réinitialiser la base de données (recommandé)

Cette option garde votre projet Supabase mais supprime toutes les tables.

#### 1.1 Via Prisma (méthode recommandée)

```bash
# Dans le terminal, à la racine du projet
npx prisma migrate reset
```

Cette commande va :
- Supprimer toutes les tables existantes
- Recréer la base de données vide
- Appliquer le nouveau schéma Prisma

**⚠️ Confirmation requise** : Tapez `y` quand demandé.

#### 1.2 Via Supabase Dashboard (alternative)

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet (`hwkypsbaraadizoqvujq`)
3. Allez dans **SQL Editor**
4. Exécutez cette requête pour supprimer toutes les tables :

```sql
-- ⚠️ ATTENTION : Ceci supprime TOUTES les tables
DO $$ 
DECLARE 
    r RECORD;
BEGIN
    FOR r IN (SELECT tablename FROM pg_tables WHERE schemaname = 'public') 
    LOOP
        EXECUTE 'DROP TABLE IF EXISTS ' || quote_ident(r.tablename) || ' CASCADE';
    END LOOP;
END $$;
```

5. Vérifiez que toutes les tables sont supprimées dans **Table Editor**

### Option B : Supprimer complètement le projet Supabase

**⚠️ Cette option supprime TOUT le projet Supabase (base de données, storage, etc.)**

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Settings → General**
4. Scroll jusqu'à **Danger Zone**
5. Cliquez sur **Delete Project**
6. Confirmez la suppression

**Ensuite, créez un nouveau projet :**
- Nom : `tonomi-accessoires` (ou autre)
- Région : `eu-west-1` ou `eu-west-3`
- Mot de passe : `tonomi@2026`
- Notez le nouveau **Project Reference ID**

---

## 📋 ÉTAPE 2 : Réinitialiser Vercel

### Option A : Supprimer le déploiement (garder le projet)

1. Allez sur https://vercel.com/dashboard
2. Trouvez votre projet
3. Allez dans **Settings**
4. Scroll jusqu'à **Danger Zone**
5. Cliquez sur **Delete Project**
6. Confirmez la suppression

### Option B : Supprimer uniquement les variables d'environnement

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Settings → Environment Variables**
4. Supprimez toutes les variables d'environnement
5. (Optionnel) Gardez le projet pour redéployer plus tard

### Option C : Détacher le repository Git

1. Allez dans **Settings → Git**
2. Cliquez sur **Disconnect** pour détacher le repository
3. Le projet reste mais n'est plus lié au repo

---

## 📋 ÉTAPE 3 : Configuration locale

### 3.1 Nettoyer les fichiers locaux (optionnel)

```bash
# Supprimer le dossier .next (cache Next.js)
rm -rf .next

# Supprimer node_modules (optionnel, si vous voulez réinstaller)
rm -rf node_modules

# Supprimer le cache Prisma
rm -rf node_modules/.prisma
```

### 3.2 Vérifier les dépendances

```bash
# Installer les nouvelles dépendances
pnpm install
# ou
npm install
```

### 3.3 Configurer les variables d'environnement

Créez un fichier `.env.local` à la racine du projet :

```env
# ============================================
# SUPABASE CONFIGURATION
# ============================================

# URL du projet Supabase
NEXT_PUBLIC_SUPABASE_URL=https://hwkypsbaraadizoqvujq.supabase.co

# Clé anonyme Supabase (publique)
# À récupérer dans Supabase Dashboard > Settings > API > anon/public key
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici

# Clé service Supabase (privée, backend uniquement)
# À récupérer dans Supabase Dashboard > Settings > API > service_role key
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_ici

# ============================================
# DATABASE (Prisma)
# ============================================

# URL de connexion PostgreSQL (pooler recommandé)
# Si vous avez gardé le même projet Supabase :
DATABASE_URL="postgresql://postgres.hwkypsbaraadizoqvujq:tonomi%402026@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"

# URL de connexion directe (pour migrations Prisma)
DIRECT_URL="postgresql://postgres.hwkypsbaraadizoqvujq:tonomi%402026@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true&pool_timeout=0"

# Si vous avez créé un NOUVEAU projet Supabase, remplacez :
# - hwkypsbaraadizoqvujq par votre nouveau Project Reference ID
# - tonomi%402026 par votre mot de passe encodé (remplacer @ par %40)

# ============================================
# APPLICATION
# ============================================

NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 3.4 Récupérer les clés Supabase

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Settings → API**
4. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → `SUPABASE_SERVICE_ROLE_KEY` ⚠️ **GARDEZ-LA SECRÈTE**

---

## 📋 ÉTAPE 4 : Initialiser la nouvelle base de données

### 4.1 Générer le client Prisma

```bash
npx prisma generate
```

### 4.2 Créer les tables dans Supabase

```bash
# Option 1 : Push direct (développement - plus rapide)
npx prisma db push

# Option 2 : Migrations (production - recommandé)
npx prisma migrate dev --name init
```

### 4.3 Vérifier la création des tables

```bash
# Ouvrir Prisma Studio pour visualiser
npx prisma studio
```

Ou vérifiez dans Supabase Dashboard → **Table Editor**

### 4.4 Créer le bucket Storage

1. Allez dans Supabase Dashboard → **Storage**
2. Cliquez sur **New bucket**
3. Nom : `tonomi-images`
4. **Public bucket** : ✅ Activé
5. **File size limit** : 10 MB (ou selon vos besoins)
6. Cliquez sur **Create bucket**

### 4.5 Configurer les politiques Storage (optionnel)

Pour permettre l'accès public aux images :

1. Allez dans **Storage → Policies**
2. Sélectionnez le bucket `tonomi-images`
3. Créez une politique :
   - **Policy name** : `Public read access`
   - **Allowed operation** : `SELECT`
   - **Policy definition** : `true` (pour tout le monde)
   - Cliquez sur **Save**

---

## 📋 ÉTAPE 5 : Tester localement

### 5.1 Lancer le serveur de développement

```bash
pnpm dev
# ou
npm run dev
```

### 5.2 Vérifier les erreurs

- Ouvrez http://localhost:3000
- Vérifiez la console du navigateur
- Vérifiez les logs du terminal

### 5.3 Tester la connexion à Supabase

Créez un fichier de test `test-supabase.ts` :

```typescript
import { prisma } from "@/lib/db/prisma"

async function test() {
  try {
    const count = await prisma.product.count()
    console.log("✅ Connexion Supabase OK - Products count:", count)
  } catch (error) {
    console.error("❌ Erreur connexion:", error)
  }
}

test()
```

Exécutez : `npx tsx test-supabase.ts`

---

## 📋 ÉTAPE 6 : Redéployer sur Vercel

### 6.1 Lier le projet à Vercel

```bash
# Si vous avez supprimé le projet Vercel
vercel

# Si vous voulez lier à un projet existant
vercel link
```

### 6.2 Configurer les variables d'environnement sur Vercel

1. Allez sur https://vercel.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Settings → Environment Variables**
4. Ajoutez toutes les variables de `.env.local` :
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
   - `DATABASE_URL`
   - `DIRECT_URL`
   - `NEXT_PUBLIC_APP_URL`

5. Sélectionnez les environnements : **Production**, **Preview**, **Development**
6. Cliquez sur **Save**

### 6.3 Déployer

```bash
# Déployer en production
vercel --prod

# Ou poussez sur votre branche main/master
git push origin main
```

### 6.4 Exécuter les migrations en production

Après le déploiement, connectez-vous au projet Vercel et exécutez :

```bash
# Via Vercel CLI (recommandé)
vercel env pull .env.production
npx prisma migrate deploy

# Ou via Vercel Dashboard → Settings → Environment Variables
# Puis dans un terminal local avec les variables de production
```

---

## ✅ Checklist finale

- [ ] Base de données Supabase réinitialisée
- [ ] Projet Vercel supprimé/réinitialisé (si nécessaire)
- [ ] Variables d'environnement configurées localement (`.env.local`)
- [ ] Client Prisma généré (`npx prisma generate`)
- [ ] Tables créées dans Supabase (`npx prisma db push`)
- [ ] Bucket Storage `tonomi-images` créé
- [ ] Test local réussi (`pnpm dev`)
- [ ] Variables d'environnement configurées sur Vercel
- [ ] Déploiement Vercel réussi
- [ ] Migrations exécutées en production

---

## 🆘 Dépannage

### Erreur : "Can't reach database server"

- Vérifiez que `DATABASE_URL` est correcte
- Vérifiez que le mot de passe est encodé (`%40` pour `@`)
- Vérifiez que votre IP n'est pas bloquée (Settings → Database → Connection Pooling)

### Erreur : "Table already exists"

- Exécutez `npx prisma migrate reset` pour tout supprimer
- Ou supprimez manuellement les tables via SQL Editor

### Erreur : "Invalid API key"

- Vérifiez que vous avez copié la bonne clé (anon vs service_role)
- Vérifiez qu'il n'y a pas d'espaces avant/après

### Images ne s'affichent pas

- Vérifiez que le bucket `tonomi-images` existe
- Vérifiez que le bucket est public
- Vérifiez les politiques de sécurité

---

## 📚 Ressources

- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation Supabase](https://supabase.com/docs)
- [Documentation Vercel](https://vercel.com/docs)

---

**Une fois ces étapes terminées, votre projet sera complètement réinitialisé et prêt pour la nouvelle architecture !** 🎉
