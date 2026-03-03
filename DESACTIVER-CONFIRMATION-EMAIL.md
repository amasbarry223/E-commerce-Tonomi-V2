# Désactiver la confirmation d'email dans Supabase

## Problème

Lors de la connexion, tu reçois l'erreur : **"Email not confirmed"**. Cela signifie que Supabase exige que tu confirmes ton email avant de pouvoir te connecter.

## Solution : Désactiver la confirmation d'email (pour les tests)

### Étapes

1. **Va dans Supabase Dashboard**
   - URL : https://supabase.com/dashboard
   - Sélectionne ton projet (`gpkofgikanxyywqagwsv`)

2. **Va dans Authentication → Settings**
   - Dans le menu de gauche, clique sur **Authentication**
   - Puis sur **Settings**

3. **Désactive "Enable email confirmations"**
   - Trouve la section **"Email Auth"**
   - Décoche la case **"Enable email confirmations"**
   - Clique sur **"Save"** en bas de la page

4. **Teste à nouveau**
   - Tu peux maintenant te connecter sans avoir besoin de confirmer ton email

## Alternative : Confirmer l'email

Si tu préfères garder la confirmation d'email activée :

1. **Vérifie ta boîte mail** après l'inscription
2. **Clique sur le lien de confirmation** dans l'email reçu de Supabase
3. **Connecte-toi** après avoir confirmé

## Note importante

- Pour la **production**, il est recommandé de garder la confirmation d'email activée pour la sécurité
- Pour le **développement/test**, tu peux la désactiver temporairement
