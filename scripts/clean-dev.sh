#!/bin/bash
# Script pour nettoyer et relancer le serveur de développement Next.js

echo "🧹 Nettoyage des fichiers de lock Next.js..."

# Supprimer le lock file
rm -f .next/dev/lock 2>/dev/null

# Arrêter les processus Node.js
pkill -f "next dev" 2>/dev/null || true

# Nettoyer le cache .next (optionnel - décommentez si nécessaire)
# rm -rf .next

echo "✅ Nettoyage terminé"
echo "🚀 Vous pouvez maintenant relancer: pnpm dev"

