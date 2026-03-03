#!/bin/bash

# ============================================
# Script pour configurer Vercel après réinitialisation
# ============================================

echo "🚀 Configuration Vercel pour Tonomi E-commerce"
echo ""

# Vérifier si Vercel CLI est installé
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI n'est pas installé"
    echo "Installez-le avec: npm i -g vercel"
    exit 1
fi

echo "📋 Étapes à suivre :"
echo ""
echo "1. Connectez-vous à Vercel :"
echo "   vercel login"
echo ""
echo "2. Liez le projet (ou créez-en un nouveau) :"
echo "   vercel link"
echo ""
echo "3. Configurez les variables d'environnement :"
echo "   - Allez sur https://vercel.com/dashboard"
echo "   - Sélectionnez votre projet"
echo "   - Settings → Environment Variables"
echo "   - Ajoutez toutes les variables de .env.local"
echo ""
echo "4. Déployez :"
echo "   vercel --prod"
echo ""
echo "✅ Configuration terminée !"
