# Configuration Supabase Auth - Résolution erreur 422

## Problème : Erreur 422 lors de l'inscription

L'erreur `422 Unprocessable Content` peut être causée par plusieurs raisons :

### 1. Vérifier les paramètres Supabase Auth

Allez dans **Supabase Dashboard → Authentication → Settings** :

#### A. Email Confirmation
- Si **"Enable email confirmations"** est activé, les utilisateurs doivent confirmer leur email avant de pouvoir se connecter
- **Solution** : Désactivez temporairement pour les tests, ou informez les utilisateurs qu'ils doivent confirmer leur email

#### B. Password Requirements
- Vérifiez les exigences de mot de passe :
  - Longueur minimale (par défaut : 6 caractères)
  - Complexité requise (majuscules, minuscules, chiffres, symboles)
- **Solution** : Assurez-vous que votre formulaire valide ces exigences

#### C. Email Restrictions
- Vérifiez s'il y a des restrictions sur les domaines d'email autorisés
- **Solution** : Désactivez les restrictions pour les tests

#### D. Rate Limiting
- Vérifiez s'il y a des limites de taux (trop de tentatives d'inscription)
- **Solution** : Attendez quelques minutes ou augmentez la limite

### 2. Messages d'erreur améliorés

Le code a été mis à jour pour afficher des messages d'erreur plus détaillés :
- Email déjà utilisé
- Mot de passe invalide
- Format d'email invalide
- Autres erreurs avec détails

### 3. Test de diagnostic

Pour tester l'inscription, utilisez :
- **Email** : Un email valide et unique (ex: `test@example.com`)
- **Mot de passe** : Au moins 6 caractères (recommandé : 8+ avec majuscules, minuscules, chiffres)

### 4. Vérifier la console du navigateur

Ouvrez la console du navigateur (F12) pour voir les détails complets de l'erreur Supabase.

### 5. Vérifier les logs Supabase

Allez dans **Supabase Dashboard → Logs → Auth Logs** pour voir les erreurs détaillées côté serveur.

## Solution rapide pour les tests

1. Allez dans **Supabase Dashboard → Authentication → Settings**
2. Désactivez temporairement **"Enable email confirmations"**
3. Vérifiez que **"Password requirements"** accepte au moins 6 caractères
4. Réessayez l'inscription

## Messages d'erreur courants

- **"User already registered"** : L'email est déjà utilisé
- **"Password should be at least 6 characters"** : Mot de passe trop court
- **"Invalid email format"** : Format d'email invalide
- **"Email rate limit exceeded"** : Trop de tentatives, attendez quelques minutes
