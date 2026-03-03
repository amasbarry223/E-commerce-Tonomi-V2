# 🚀 Guide Complet : Créer et Configurer Stripe au Mali

Ce guide vous accompagne étape par étape pour créer votre compte Stripe et l'intégrer à votre site e-commerce.

## 📋 Prérequis

- Une adresse email valide
- Un numéro de téléphone
- Un compte bancaire au Mali (pour recevoir les paiements)
- Une pièce d'identité (passeport ou carte d'identité)
- Un justificatif d'adresse (facture d'électricité, eau, etc.)

---

## Étape 1 : Créer votre compte Stripe

### 1.1 Inscription

1. **Allez sur le site Stripe** : [https://dashboard.stripe.com/register](https://dashboard.stripe.com/register)

2. **Remplissez le formulaire d'inscription** :
   - Email
   - Mot de passe (minimum 8 caractères)
   - Nom complet
   - Pays : **Mali**

3. **Vérifiez votre email** : Cliquez sur le lien de confirmation dans votre boîte mail

### 1.2 Connexion

1. **Connectez-vous** : [https://dashboard.stripe.com/login](https://dashboard.stripe.com/login)

2. **Activez votre compte** : Stripe vous demandera de compléter votre profil

---

## Étape 2 : Activer votre compte Stripe (Mode Test)

### 2.1 Accéder au mode Test

1. Dans le dashboard Stripe, vous verrez un **basculeur en haut à droite** : "Test mode" / "Live mode"
2. **Laissez-le sur "Test mode"** pour commencer (c'est gratuit et sans risque)

### 2.2 Compléter votre profil (Mode Test)

1. **Cliquez sur "Activate account"** ou "Complete your account"
2. **Remplissez les informations** :
   - Type de compte : **Entreprise** ou **Individu** (selon votre cas)
   - Nom de l'entreprise
   - Adresse complète au Mali
   - Numéro de téléphone
   - Site web (optionnel)

3. **Informations bancaires** (pour recevoir les paiements) :
   - Nom de la banque
   - Numéro de compte
   - Code SWIFT/BIC
   - IBAN (si disponible)

4. **Documents requis** :
   - **Pièce d'identité** : Photo recto/verso de votre passeport ou carte d'identité
   - **Justificatif d'adresse** : Facture d'électricité, eau, ou relevé bancaire (moins de 3 mois)
   - **Document d'entreprise** (si compte entreprise) : Statuts, extrait K-bis, etc.

### 2.3 Vérification

- Stripe examinera vos documents (généralement 1-2 jours ouvrables)
- Vous recevrez un email de confirmation une fois approuvé

---

## Étape 3 : Obtenir vos clés API

### 3.1 Clés de Test (pour le développement)

1. **Dans le dashboard Stripe**, allez dans **"Developers"** → **"API keys"**

2. **Vous verrez deux clés** :
   - **Publishable key** (commence par `pk_test_...`) : Clé publique, peut être exposée côté client
   - **Secret key** (commence par `sk_test_...`) : Clé secrète, **NE JAMAIS EXPOSER** côté client

3. **Cliquez sur "Reveal test key"** pour voir votre Secret key

4. **Copiez ces deux clés** et gardez-les précieusement

### 3.2 Clés Live (pour la production)

⚠️ **Important** : Les clés Live ne sont disponibles qu'après activation complète de votre compte.

1. **Basculez en "Live mode"** (en haut à droite)
2. **Allez dans "Developers"** → **"API keys"**
3. **Créez vos clés Live** (elles commencent par `pk_live_...` et `sk_live_...`)

---

## Étape 4 : Configurer les Webhooks

### 4.1 Créer un endpoint webhook (Mode Test)

1. **Dans le dashboard Stripe**, allez dans **"Developers"** → **"Webhooks"**

2. **Cliquez sur "Add endpoint"**

3. **Remplissez le formulaire** :
   - **Endpoint URL** : 
     - Pour le développement local : `http://localhost:3000/api/stripe/webhook`
     - Pour la production (Vercel) : `https://votre-domaine.vercel.app/api/stripe/webhook`
   - **Description** : "Webhook pour les paiements e-commerce"

4. **Sélectionnez les événements à écouter** :
   - ✅ `checkout.session.completed` (paiement réussi)
   - ✅ `payment_intent.succeeded` (paiement confirmé)
   - ✅ `payment_intent.payment_failed` (paiement échoué)
   - ✅ `charge.refunded` (remboursement)

5. **Cliquez sur "Add endpoint"**

6. **Copiez le "Signing secret"** (commence par `whsec_...`) - vous en aurez besoin pour votre `.env`

### 4.2 Tester le webhook localement (avec Stripe CLI)

Pour tester les webhooks en local, vous pouvez utiliser Stripe CLI :

1. **Installez Stripe CLI** : [https://stripe.com/docs/stripe-cli](https://stripe.com/docs/stripe-cli)

2. **Connectez-vous** :
   ```bash
   stripe login
   ```

3. **Écoutez les événements** :
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   ```

4. **Copiez le webhook secret** affiché (commence par `whsec_...`)

---

## Étape 5 : Installer Stripe dans votre projet

### 5.1 Installer les dépendances

Dans le terminal, à la racine de votre projet :

```bash
cd "C:\Users\DELL\Desktop\Affiche\TonomiOrigi\E-commerce-Tonomi-V2"
pnpm add stripe @stripe/stripe-js
```

### 5.2 Vérifier l'installation

Vérifiez que les packages sont bien installés dans `package.json` :

```json
{
  "dependencies": {
    "stripe": "^14.0.0",
    "@stripe/stripe-js": "^2.0.0"
  }
}
```

---

## Étape 6 : Configurer les variables d'environnement

### 6.1 Fichier `.env` (ou `.env.local`)

Ouvrez votre fichier `.env` à la racine du projet et ajoutez :

```env
# Stripe - Mode Test (pour le développement)
STRIPE_SECRET_KEY=sk_test_VOTRE_CLE_SECRETE_ICI
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_VOTRE_CLE_PUBLIQUE_ICI
STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET_ICI

# Stripe - Mode Live (pour la production)
# Décommentez ces lignes quand vous passerez en production
# STRIPE_SECRET_KEY=sk_live_VOTRE_CLE_SECRETE_LIVE
# NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_VOTRE_CLE_PUBLIQUE_LIVE
# STRIPE_WEBHOOK_SECRET=whsec_VOTRE_WEBHOOK_SECRET_LIVE
```

### 6.2 Remplacer les valeurs

Remplacez :
- `sk_test_...` par votre **Secret key** (Test)
- `pk_test_...` par votre **Publishable key** (Test)
- `whsec_...` par votre **Webhook secret** (Test)

### 6.3 Sécurité

⚠️ **IMPORTANT** :
- **NE COMMITTEZ JAMAIS** votre fichier `.env` sur GitHub
- Vérifiez que `.env` est dans `.gitignore`
- Pour Vercel, ajoutez ces variables dans **Settings** → **Environment Variables**

---

## Étape 7 : Configurer Vercel (pour la production)

### 7.1 Ajouter les variables d'environnement sur Vercel

1. **Allez sur** [https://vercel.com/dashboard](https://vercel.com/dashboard)

2. **Sélectionnez votre projet**

3. **Allez dans "Settings"** → **"Environment Variables"**

4. **Ajoutez les variables** :
   - `STRIPE_SECRET_KEY` = `sk_live_...` (votre clé Live)
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_...` (votre clé Live)
   - `STRIPE_WEBHOOK_SECRET` = `whsec_...` (votre webhook secret Live)

5. **Sélectionnez les environnements** : Production, Preview, Development

6. **Cliquez sur "Save"**

### 7.2 Configurer le webhook sur Vercel

1. **Dans Stripe Dashboard**, allez dans **"Developers"** → **"Webhooks"**

2. **Ajoutez un nouvel endpoint** :
   - **URL** : `https://votre-domaine.vercel.app/api/stripe/webhook`
   - **Événements** : Les mêmes que pour le mode test

3. **Copiez le webhook secret** et ajoutez-le dans Vercel

---

## Étape 8 : Tester l'intégration

### 8.1 Cartes de test Stripe

Stripe fournit des cartes de test pour tester les paiements :

**Carte de test réussie** :
- Numéro : `4242 4242 4242 4242`
- Date d'expiration : N'importe quelle date future (ex: `12/25`)
- CVC : N'importe quel 3 chiffres (ex: `123`)
- Code postal : N'importe quel code postal (ex: `12345`)

**Carte de test échec** :
- Numéro : `4000 0000 0000 0002`
- (Même format pour les autres champs)

### 8.2 Tester sur votre site

1. **Lancez votre serveur de développement** :
   ```bash
   pnpm dev
   ```

2. **Allez sur votre page de checkout**

3. **Remplissez le formulaire** avec une carte de test

4. **Vérifiez dans Stripe Dashboard** → **"Payments"** que le paiement apparaît

---

## Étape 9 : Activer le compte Live (quand vous êtes prêt)

### 9.1 Conditions pour activer le mode Live

- ✅ Votre compte est vérifié
- ✅ Vos documents sont approuvés
- ✅ Votre compte bancaire est configuré
- ✅ Vous avez testé en mode Test

### 9.2 Activer le mode Live

1. **Dans Stripe Dashboard**, basculez en **"Live mode"**

2. **Complétez les informations manquantes** si nécessaire

3. **Utilisez vos clés Live** dans votre `.env` de production

4. **Testez avec une vraie carte** (petit montant)

---

## 📞 Support Stripe

Si vous avez des questions ou des problèmes :

- **Documentation** : [https://stripe.com/docs](https://stripe.com/docs)
- **Support** : [https://support.stripe.com](https://support.stripe.com)
- **Forum** : [https://stackoverflow.com/questions/tagged/stripe-payments](https://stackoverflow.com/questions/tagged/stripe-payments)

---

## ✅ Checklist finale

- [ ] Compte Stripe créé
- [ ] Profil complété et vérifié
- [ ] Clés API (Test) obtenues
- [ ] Webhook configuré
- [ ] Dépendances Stripe installées
- [ ] Variables d'environnement configurées
- [ ] Test avec une carte de test réussi
- [ ] Variables d'environnement ajoutées sur Vercel
- [ ] Webhook Live configuré (quand prêt)
- [ ] Compte Live activé (quand prêt)

---

## 🎉 Félicitations !

Votre intégration Stripe est maintenant configurée ! Vous pouvez accepter les paiements en ligne sur votre site e-commerce.

**Prochaine étape** : Tester le flux de paiement complet sur votre site.
