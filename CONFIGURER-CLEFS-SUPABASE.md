# 🔑 Comment récupérer et configurer les clés Supabase

## ⚠️ Problème actuel

Tu as une erreur `401 Unauthorized` car les clés Supabase dans `.env.local` sont encore des placeholders :
- `NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here` ❌
- `SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here` ❌

## ✅ Solution : Récupérer les vraies clés

### Étape 1 : Aller sur le Dashboard Supabase

1. Ouvre https://supabase.com/dashboard
2. Connecte-toi avec ton compte
3. Sélectionne ton projet : **`gpkofgikanxyywqagwsv`**

### Étape 2 : Récupérer les clés

1. Dans le menu de gauche, clique sur **Settings** (⚙️)
2. Clique sur **API** dans le sous-menu
3. Tu verras plusieurs sections :

#### 📋 Section "Project API keys"

Tu verras deux clés importantes :

1. **`anon` `public`** (Clé anonyme - publique)
   - C'est celle qui commence par `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **Copie cette clé complète** (elle est très longue, environ 200+ caractères)
   - C'est pour `NEXT_PUBLIC_SUPABASE_ANON_KEY`

2. **`service_role` `secret`** (Clé service - privée)
   - C'est celle qui commence aussi par `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`
   - **⚠️ ATTENTION** : Cette clé est SECRÈTE, ne la partage JAMAIS publiquement
   - **Copie cette clé complète**
   - C'est pour `SUPABASE_SERVICE_ROLE_KEY`

#### 📋 Section "Project URL"

- Tu verras l'URL de ton projet : `https://gpkofgikanxyywqagwsv.supabase.co`
- C'est déjà configuré dans ton `.env.local` ✅

### Étape 3 : Mettre à jour `.env.local`

1. Ouvre le fichier `.env.local` à la racine du projet
2. Remplace les valeurs :

```env
# AVANT (❌ Ne fonctionne pas)
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# APRÈS (✅ Fonctionne)
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwa29mZ2lrYW54eXl3YWFnd3N2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MT... (ta vraie clé complète)
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imdwa29mZ2lrYW54eXl3YWFnd3N2Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTcx... (ta vraie clé complète)
```

**⚠️ Important** :
- Les clés sont très longues (200+ caractères)
- Copie-les **en entier**, sans espaces avant/après
- Ne mets **pas de guillemets** autour des valeurs dans `.env.local`

### Étape 4 : Redémarrer le serveur

Après avoir modifié `.env.local` :

1. **Arrête** le serveur de développement (Ctrl+C)
2. **Redémarre** le serveur :
   ```powershell
   pnpm dev
   ```

### Étape 5 : Vérifier

1. Va sur http://localhost:3000
2. Essaie de créer un compte
3. L'erreur `401 Unauthorized` devrait disparaître

## 🔍 Vérification rapide

Pour vérifier que les clés sont bien chargées, tu peux temporairement ajouter dans un composant :

```typescript
console.log("ANON KEY:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + "...")
```

Si tu vois `eyJhbGciOiJIUzI1NiIs...`, c'est bon ✅
Si tu vois `your_supabase_anon...`, les clés ne sont pas encore remplacées ❌

## ❓ En cas de problème

1. **Vérifie que tu as bien copié toute la clé** (elles sont très longues)
2. **Vérifie qu'il n'y a pas d'espaces** avant/après les valeurs
3. **Redémarre le serveur** après modification de `.env.local`
4. **Vérifie que tu es sur le bon projet** Supabase (`gpkofgikanxyywqagwsv`)

## 🔒 Sécurité

- ✅ La clé `anon` peut être publique (elle est dans le code client)
- ❌ La clé `service_role` doit rester SECRÈTE
- ❌ Ne commite JAMAIS `.env.local` dans Git
- ✅ `.env.local` est déjà dans `.gitignore`
