# Configuration Supabase Storage

## Problème : "Invalid Compact JWS"

Cette erreur se produit généralement lorsque :
1. Le bucket n'existe pas
2. Les permissions ne sont pas correctes
3. La clé API n'est pas valide

## Solution : Créer le bucket et configurer les permissions

### 1. Créer le bucket dans Supabase

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet (`gpkofgikanxyywqagwsv`)
3. Allez dans **Storage** dans le menu de gauche
4. Cliquez sur **New bucket**
5. Configurez :
   - **Name** : `tonomi-images`
   - **Public bucket** : ✅ **Activé** (important pour les images publiques)
   - **File size limit** : `5242880` (5MB) ou plus selon vos besoins
   - **Allowed MIME types** : Laissez vide pour autoriser tous les types d'images
6. Cliquez sur **Create bucket**

### 2. Configurer les politiques (Policies)

#### Pour l'upload (INSERT) - Option 1 : Authenticated users

1. Allez dans **Storage → Policies**
2. Sélectionnez le bucket `tonomi-images`
3. Cliquez sur **New Policy**
4. Configurez :
   - **Policy name** : `Allow authenticated uploads`
   - **Allowed operation** : `INSERT`
   - **Policy definition** : 
     ```sql
     (bucket_id = 'tonomi-images'::text) AND (auth.role() = 'authenticated'::text)
     ```
   - Cliquez sur **Save**

#### Pour l'upload (INSERT) - Option 2 : Service Role (recommandé pour admin)

Comme nous utilisons la route API avec SERVICE_ROLE, cette option n'est pas nécessaire. La route API utilise la clé SERVICE_ROLE qui a tous les droits.

#### Pour la lecture (SELECT) - Public access

1. Cliquez sur **New Policy**
2. Configurez :
   - **Policy name** : `Public read access`
   - **Allowed operation** : `SELECT`
   - **Policy definition** : 
     ```sql
     true
     ```
   - Cliquez sur **Save**

### 3. Vérifier les variables d'environnement

Assurez-vous que `.env.local` contient :

```env
NEXT_PUBLIC_SUPABASE_URL=https://gpkofgikanxyywqagwsv.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=votre_cle_anon_ici
SUPABASE_SERVICE_ROLE_KEY=votre_cle_service_ici
```

### 4. Récupérer les clés Supabase

1. Allez dans **Settings → API**
2. Copiez :
   - **Project URL** → `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** → `SUPABASE_SERVICE_ROLE_KEY` (⚠️ gardez-la secrète)

### 5. Tester l'upload

Après avoir créé le bucket et configuré les politiques, essayez à nouveau d'uploader une image depuis l'admin.

## Structure des dossiers dans le bucket

Le bucket `tonomi-images` contiendra :

```
tonomi-images/
  ├── products/          # Images produits
  ├── categories/        # Images catégories
  ├── hero/             # Slides hero
  ├── customers/         # Avatars clients
  └── logos/            # Logos et assets
```

## Notes importantes

- Le bucket doit être **public** pour que les images soient accessibles publiquement
- La route API `/api/upload` utilise la clé SERVICE_ROLE qui a tous les droits
- Les images sont automatiquement organisées par dossier selon leur type
- Les noms de fichiers sont sanitizés et un timestamp est ajouté pour éviter les collisions
