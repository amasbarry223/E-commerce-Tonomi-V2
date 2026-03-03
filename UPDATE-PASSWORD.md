# 🔑 Mise à jour du mot de passe dans .env.local

## ⚠️ IMPORTANT

Le fichier `.env.local` a été mis à jour avec le nouveau Project ID Supabase : **gpkofgikanxyywqagwsv**

Mais vous devez remplacer `[YOUR-PASSWORD]` par votre **vrai mot de passe** de la base de données.

## 📋 Étapes

### 1. Ouvrir le fichier .env.local

Ouvrez le fichier `.env.local` à la racine du projet.

### 2. Remplacer [YOUR-PASSWORD]

Trouvez ces deux lignes :

```env
DATABASE_URL="postgresql://postgres.gpkofgikanxyywqagwsv:[YOUR-PASSWORD]@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://postgres:[YOUR-PASSWORD]@db.gpkofgikanxyywqagwsv.supabase.co:5432/postgres"
```

Remplacez `[YOUR-PASSWORD]` par votre mot de passe.

### 3. Encoder le mot de passe si nécessaire

Si votre mot de passe contient des caractères spéciaux, encodez-les :
- `@` devient `%40`
- `#` devient `%23`
- `$` devient `%24`
- etc.

**Exemple :**
- Mot de passe : `tonomi@2026`
- Encodé : `tonomi%402026`

### 4. Si vous ne connaissez pas le mot de passe

1. Allez sur https://supabase.com/dashboard
2. Sélectionnez votre projet
3. Allez dans **Settings → Database**
4. Cliquez sur **Reset database password**
5. Choisissez un nouveau mot de passe
6. Utilisez ce nouveau mot de passe dans `.env.local`

### 5. Vérifier la connexion

Après avoir mis à jour le mot de passe, testez la connexion :

```powershell
npx prisma@5.9.1 db push
```

## ✅ Format final

Votre `.env.local` devrait ressembler à ceci (avec votre vrai mot de passe) :

```env
DATABASE_URL="postgresql://postgres.gpkofgikanxyywqagwsv:tonomi%402026@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://postgres:tonomi%402026@db.gpkofgikanxyywqagwsv.supabase.co:5432/postgres"
```

## 🔒 Sécurité

- ⚠️ Ne commitez JAMAIS le fichier `.env.local` dans Git
- ⚠️ Ne partagez JAMAIS votre mot de passe
- ✅ Le fichier `.env.local` est déjà dans `.gitignore`
