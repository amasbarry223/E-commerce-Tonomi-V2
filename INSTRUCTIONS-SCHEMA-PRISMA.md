# Instructions pour mettre à jour le schema Prisma

## 🎯 Objectif

Après avoir modifié le fichier `prisma/schema.prisma` (ajout de la table `Log`), tu dois synchroniser ces changements avec ta base de données Supabase.

## 📋 Étapes à suivre

### 1. Naviguer vers le dossier du projet

Ouvre PowerShell ou Terminal et navigue vers le dossier du projet :

```powershell
cd "C:\Users\DELL\Desktop\Affiche\TonomiOrigi\E-commerce-Tonomi-V2"
```

### 2. Vérifier que les variables d'environnement sont chargées

Assure-toi que ton fichier `.env.local` contient bien les variables suivantes :

```env
DATABASE_URL="postgresql://postgres.gpkofgikanxyywqagwsv:tonomi%402026@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"
DIRECT_URL="postgresql://postgres.gpkofgikanxyywqagwsv:tonomi%402026@aws-1-eu-central-1.pooler.supabase.com:5432/postgres"
```

### 3. Pousser le schema vers la base de données

Exécute la commande suivante pour créer la table `logs` dans Supabase :

```powershell
npx prisma@5.9.1 db push
```

**⚠️ Important** : Utilise `npx prisma@5.9.1` pour éviter les problèmes de version.

### 4. Vérifier que la table a été créée

Après l'exécution, tu devrais voir un message de succès. Tu peux vérifier dans Supabase :

1. Va sur https://supabase.com/dashboard
2. Sélectionne ton projet (`gpkofgikanxyywqagwsv`)
3. Va dans **Table Editor**
4. Tu devrais voir la table `logs` avec les colonnes :
   - `id` (uuid)
   - `action` (text)
   - `entityType` (text)
   - `entityId` (text, nullable)
   - `description` (text)
   - `userId` (text, nullable)
   - `metadata` (text, nullable)
   - `createdAt` (timestamp)

### 5. Générer le client Prisma (si nécessaire)

Si tu as des erreurs TypeScript, régénère le client Prisma :

```powershell
npx prisma@5.9.1 generate
```

## ✅ Résultat attendu

Une fois ces étapes terminées :
- ✅ La table `logs` est créée dans Supabase
- ✅ Le client Prisma est à jour
- ✅ Les logs seront automatiquement enregistrés lors des actions importantes
- ✅ Tu pourras voir les logs dans **Admin > Paramètres > Logs**

## 🔍 Vérification

Pour tester que tout fonctionne :

1. Crée un produit dans **Admin > Produits**
2. Va dans **Admin > Paramètres > Logs**
3. Tu devrais voir un log avec l'action `product_created`

## ❓ En cas d'erreur

Si tu rencontres une erreur :

1. **Erreur de connexion** : Vérifie que `.env.local` contient les bonnes URLs
2. **Erreur de version** : Utilise `npx prisma@5.9.1` au lieu de `npx prisma`
3. **Table existe déjà** : C'est normal si tu as déjà exécuté la commande, elle sera mise à jour

## 📝 Note

La commande `db push` synchronise le schema Prisma avec la base de données sans créer de migration. C'est parfait pour le développement. En production, tu utiliserais `prisma migrate` pour créer des migrations versionnées.
