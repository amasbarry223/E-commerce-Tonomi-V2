# Intégration Stripe

## Installation

Ajoutez Stripe à votre projet :

```bash
pnpm add stripe @stripe/stripe-js
```

## Variables d'environnement

Ajoutez ces variables dans `.env.local` :

```env
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
```

## Routes API créées

- `/api/stripe/create-checkout-session` - Crée une session de checkout Stripe
- `/api/stripe/webhook` - Webhook pour recevoir les événements Stripe

## Utilisation

1. Installez les dépendances : `pnpm add stripe @stripe/stripe-js`
2. Configurez vos clés Stripe dans `.env.local`
3. Utilisez le composant `StripeCheckoutButton` dans votre page de checkout

## Notes

- Les routes API sont prêtes mais nécessitent l'installation de Stripe
- Le webhook doit être configuré dans le dashboard Stripe
- Utilisez les clés de test pour le développement
