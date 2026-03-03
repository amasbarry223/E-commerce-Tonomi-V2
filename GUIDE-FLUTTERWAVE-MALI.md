# 🚀 Guide Complet : Créer et Configurer Flutterwave au Mali

**Flutterwave** est la meilleure alternative à Stripe pour l'Afrique de l'Ouest, notamment le Mali. Cette plateforme supporte les paiements locaux, les cartes bancaires internationales, et les portefeuilles mobiles (Orange Money, Moov Money, etc.).

---

## 📋 Pourquoi Flutterwave plutôt que Stripe ?

✅ **Supporte le Mali** directement  
✅ **Paiements locaux** : Orange Money, Moov Money, virements bancaires  
✅ **Cartes internationales** : Visa, Mastercard, etc.  
✅ **Frais compétitifs** : ~2.9% + frais fixes  
✅ **API similaire à Stripe** : Facile à intégrer  
✅ **Support en français** disponible  

---

## Étape 1 : Créer votre compte Flutterwave

### 1.1 Inscription

1. **Allez sur le site Flutterwave** : [https://dashboard.flutterwave.com/signup](https://dashboard.flutterwave.com/signup)

2. **Remplissez le formulaire d'inscription** :
   - Email
   - Mot de passe (minimum 8 caractères)
   - Nom complet
   - Pays : **Mali** ✅ (disponible !)
   - Numéro de téléphone

3. **Vérifiez votre email** : Cliquez sur le lien de confirmation

### 1.2 Connexion

1. **Connectez-vous** : [https://dashboard.flutterwave.com/login](https://dashboard.flutterwave.com/login)

---

## Étape 2 : Activer votre compte Flutterwave

### 2.1 Compléter votre profil

1. **Cliquez sur "Complete Profile"** ou "Activate Account"

2. **Informations personnelles** :
   - Type de compte : **Entreprise** ou **Individu**
   - Nom de l'entreprise (si applicable)
   - Adresse complète au Mali
   - Numéro de téléphone
   - Site web (optionnel)

3. **Informations bancaires** :
   - Nom de la banque
   - Numéro de compte
   - Code SWIFT/BIC
   - IBAN (si disponible)

4. **Documents requis** :
   - **Pièce d'identité** : Photo recto/verso (passeport ou carte d'identité)
   - **Justificatif d'adresse** : Facture d'électricité, eau, ou relevé bancaire (moins de 3 mois)
   - **Document d'entreprise** (si compte entreprise) : Statuts, extrait RCCM, etc.

### 2.2 Vérification

- Flutterwave examinera vos documents (généralement 1-3 jours ouvrables)
- Vous recevrez un email de confirmation une fois approuvé

---

## Étape 3 : Obtenir vos clés API

### 3.1 Clés de Test (pour le développement)

1. **Dans le dashboard Flutterwave**, allez dans **"Settings"** → **"API Keys"**

2. **Vous verrez deux clés** :
   - **Public Key** (commence par `FLWPUBK_TEST_...`) : Clé publique, peut être exposée côté client
   - **Secret Key** (commence par `FLWSECK_TEST_...`) : Clé secrète, **NE JAMAIS EXPOSER** côté client

3. **Cliquez sur "Reveal"** pour voir votre Secret key

4. **Copiez ces deux clés** et gardez-les précieusement

### 3.2 Clés Live (pour la production)

⚠️ **Important** : Les clés Live ne sont disponibles qu'après activation complète de votre compte.

1. **Basculez en "Live mode"** (en haut à droite)

2. **Allez dans "Settings"** → **"API Keys"**

3. **Créez vos clés Live** (elles commencent par `FLWPUBK_...` et `FLWSECK_...`)

---

## Étape 4 : Configurer les Webhooks

### 4.1 Créer un endpoint webhook (Mode Test)

1. **Dans le dashboard Flutterwave**, allez dans **"Settings"** → **"Webhooks"**

2. **Cliquez sur "Add Webhook"**

3. **Remplissez le formulaire** :
   - **Webhook URL** : 
     - Pour le développement local : `http://localhost:3000/api/flutterwave/webhook`
     - Pour la production (Vercel) : `https://votre-domaine.vercel.app/api/flutterwave/webhook`
   - **Description** : "Webhook pour les paiements e-commerce"

4. **Sélectionnez les événements à écouter** :
   - ✅ `charge.completed` (paiement réussi)
   - ✅ `charge.failed` (paiement échoué)
   - ✅ `transfer.completed` (transfert réussi)
   - ✅ `refund.completed` (remboursement)

5. **Cliquez sur "Save"**

6. **Copiez le "Secret Hash"** - vous en aurez besoin pour votre `.env`

---

## Étape 5 : Installer Flutterwave dans votre projet

### 5.1 Installer les dépendances

Dans le terminal, à la racine de votre projet :

```bash
cd "C:\Users\DELL\Desktop\Affiche\TonomiOrigi\E-commerce-Tonomi-V2"
pnpm add flutterwave-node-v3
```

### 5.2 Vérifier l'installation

Vérifiez que le package est bien installé dans `package.json` :

```json
{
  "dependencies": {
    "flutterwave-node-v3": "^2.0.0"
  }
}
```

---

## Étape 6 : Configurer les variables d'environnement

### 6.1 Fichier `.env` (ou `.env.local`)

Ouvrez votre fichier `.env` à la racine du projet et ajoutez :

```env
# Flutterwave - Mode Test (pour le développement)
FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST_VOTRE_CLE_SECRETE_ICI
NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_TEST_VOTRE_CLE_PUBLIQUE_ICI
FLUTTERWAVE_WEBHOOK_SECRET=VOTRE_WEBHOOK_SECRET_ICI

# Flutterwave - Mode Live (pour la production)
# Décommentez ces lignes quand vous passerez en production
# FLUTTERWAVE_SECRET_KEY=FLWSECK_VOTRE_CLE_SECRETE_LIVE
# NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY=FLWPUBK_VOTRE_CLE_PUBLIQUE_LIVE
# FLUTTERWAVE_WEBHOOK_SECRET=VOTRE_WEBHOOK_SECRET_LIVE
```

### 6.2 Remplacer les valeurs

Remplacez :
- `FLWSECK_TEST_...` par votre **Secret key** (Test)
- `FLWPUBK_TEST_...` par votre **Public key** (Test)
- Le webhook secret par votre **Webhook Secret Hash**

### 6.3 Sécurité

⚠️ **IMPORTANT** :
- **NE COMMITTEZ JAMAIS** votre fichier `.env` sur GitHub
- Vérifiez que `.env` est dans `.gitignore`
- Pour Vercel, ajoutez ces variables dans **Settings** → **Environment Variables**

---

## Étape 7 : Créer les routes API Flutterwave

Je vais créer les routes API nécessaires pour Flutterwave dans votre projet.

---

## Étape 8 : Configurer Vercel (pour la production)

### 8.1 Ajouter les variables d'environnement sur Vercel

1. **Allez sur** [https://vercel.com/dashboard](https://vercel.com/dashboard)

2. **Sélectionnez votre projet**

3. **Allez dans "Settings"** → **"Environment Variables"**

4. **Ajoutez les variables** :
   - `FLUTTERWAVE_SECRET_KEY` = `FLWSECK_...` (votre clé Live)
   - `NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY` = `FLWPUBK_...` (votre clé Live)
   - `FLUTTERWAVE_WEBHOOK_SECRET` = (votre webhook secret Live)

5. **Sélectionnez les environnements** : Production, Preview, Development

6. **Cliquez sur "Save"**

### 8.2 Configurer le webhook sur Vercel

1. **Dans Flutterwave Dashboard**, allez dans **"Settings"** → **"Webhooks"**

2. **Ajoutez un nouvel endpoint** :
   - **URL** : `https://votre-domaine.vercel.app/api/flutterwave/webhook`
   - **Événements** : Les mêmes que pour le mode test

3. **Copiez le webhook secret** et ajoutez-le dans Vercel

---

## Étape 9 : Tester l'intégration

### 9.1 Cartes de test Flutterwave

Flutterwave fournit des cartes de test pour tester les paiements :

**Carte de test réussie** :
- Numéro : `5531886652142950`
- Date d'expiration : `12/25` (ou toute date future)
- CVC : `564`
- Code PIN : `3310`
- OTP : `123456`

**Carte de test échec** :
- Numéro : `5560000000000001`
- (Même format pour les autres champs)

### 9.2 Tester sur votre site

1. **Lancez votre serveur de développement** :
   ```bash
   pnpm dev
   ```

2. **Allez sur votre page de checkout**

3. **Remplissez le formulaire** avec une carte de test

4. **Vérifiez dans Flutterwave Dashboard** → **"Transactions"** que le paiement apparaît

---

## Étape 10 : Activer le compte Live (quand vous êtes prêt)

### 10.1 Conditions pour activer le mode Live

- ✅ Votre compte est vérifié
- ✅ Vos documents sont approuvés
- ✅ Votre compte bancaire est configuré
- ✅ Vous avez testé en mode Test

### 10.2 Activer le mode Live

1. **Dans Flutterwave Dashboard**, basculez en **"Live mode"**

2. **Complétez les informations manquantes** si nécessaire

3. **Utilisez vos clés Live** dans votre `.env` de production

4. **Testez avec une vraie carte** (petit montant)

---

## 💰 Frais Flutterwave

- **Cartes locales** : ~2.9% + frais fixes
- **Cartes internationales** : ~3.8% + frais fixes
- **Mobile Money** : ~1.4% + frais fixes
- **Virements bancaires** : ~1.4% + frais fixes

*Les frais exacts dépendent de votre plan et de votre volume de transactions.*

---

## 📞 Support Flutterwave

Si vous avez des questions ou des problèmes :

- **Documentation** : [https://developer.flutterwave.com/docs](https://developer.flutterwave.com/docs)
- **Support** : [https://support.flutterwave.com](https://support.flutterwave.com)
- **Email** : support@flutterwave.com
- **Téléphone** : +234 1 888 8888 (Nigeria) ou via le chat du dashboard

---

## ✅ Checklist finale

- [ ] Compte Flutterwave créé
- [ ] Profil complété et vérifié
- [ ] Clés API (Test) obtenues
- [ ] Webhook configuré
- [ ] Dépendances Flutterwave installées
- [ ] Variables d'environnement configurées
- [ ] Routes API créées
- [ ] Test avec une carte de test réussi
- [ ] Variables d'environnement ajoutées sur Vercel
- [ ] Webhook Live configuré (quand prêt)
- [ ] Compte Live activé (quand prêt)

---

## 🎉 Félicitations !

Votre intégration Flutterwave est maintenant configurée ! Vous pouvez accepter les paiements en ligne sur votre site e-commerce, y compris les paiements locaux au Mali.

**Prochaine étape** : Je vais créer les routes API Flutterwave pour votre projet.
