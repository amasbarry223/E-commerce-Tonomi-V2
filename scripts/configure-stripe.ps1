# Script PowerShell pour configurer Stripe dans le projet
# Usage: .\scripts\configure-stripe.ps1

Write-Host "`n🚀 Configuration de Stripe pour Tonomi" -ForegroundColor Cyan
Write-Host "=====================================`n" -ForegroundColor Cyan

# Vérifier si le fichier .env existe
$envFile = ".env"
if (-not (Test-Path $envFile)) {
    Write-Host "⚠️  Le fichier .env n'existe pas. Création..." -ForegroundColor Yellow
    New-Item -Path $envFile -ItemType File -Force | Out-Null
}

# Lire le contenu actuel
$envContent = Get-Content $envFile -ErrorAction SilentlyContinue

# Vérifier si les variables Stripe existent déjà
$hasStripeSecret = $envContent | Select-String -Pattern "^STRIPE_SECRET_KEY=" -Quiet
$hasStripePublishable = $envContent | Select-String -Pattern "^NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=" -Quiet
$hasStripeWebhook = $envContent | Select-String -Pattern "^STRIPE_WEBHOOK_SECRET=" -Quiet

Write-Host "📋 Configuration des variables d'environnement Stripe`n" -ForegroundColor White

# Demander les clés Stripe
if (-not $hasStripeSecret) {
    Write-Host "1️⃣  Entrez votre STRIPE_SECRET_KEY (sk_test_... ou sk_live_...)" -ForegroundColor Yellow
    Write-Host "   (Trouvez-la dans Stripe Dashboard > Developers > API keys)" -ForegroundColor Gray
    $stripeSecret = Read-Host "   Clé secrète"
    
    if ($stripeSecret -and $stripeSecret.Trim() -ne "") {
        Add-Content -Path $envFile -Value "`n# Stripe Configuration"
        Add-Content -Path $envFile -Value "STRIPE_SECRET_KEY=$stripeSecret"
        Write-Host "   ✅ STRIPE_SECRET_KEY ajoutée" -ForegroundColor Green
    }
} else {
    Write-Host "   ℹ️  STRIPE_SECRET_KEY existe déjà" -ForegroundColor Blue
}

if (-not $hasStripePublishable) {
    Write-Host "`n2️⃣  Entrez votre NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY (pk_test_... ou pk_live_...)" -ForegroundColor Yellow
    Write-Host "   (Trouvez-la dans Stripe Dashboard > Developers > API keys)" -ForegroundColor Gray
    $stripePublishable = Read-Host "   Clé publique"
    
    if ($stripePublishable -and $stripePublishable.Trim() -ne "") {
        Add-Content -Path $envFile -Value "NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=$stripePublishable"
        Write-Host "   ✅ NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY ajoutée" -ForegroundColor Green
    }
} else {
    Write-Host "   ℹ️  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY existe déjà" -ForegroundColor Blue
}

if (-not $hasStripeWebhook) {
    Write-Host "`n3️⃣  Entrez votre STRIPE_WEBHOOK_SECRET (whsec_...)" -ForegroundColor Yellow
    Write-Host "   (Trouvez-la dans Stripe Dashboard > Developers > Webhooks > [Votre endpoint] > Signing secret)" -ForegroundColor Gray
    Write-Host "   (Optionnel pour le développement local, requis pour la production)" -ForegroundColor Gray
    $stripeWebhook = Read-Host "   Webhook secret (laissez vide si pas encore configuré)"
    
    if ($stripeWebhook -and $stripeWebhook.Trim() -ne "") {
        Add-Content -Path $envFile -Value "STRIPE_WEBHOOK_SECRET=$stripeWebhook"
        Write-Host "   ✅ STRIPE_WEBHOOK_SECRET ajoutée" -ForegroundColor Green
    } else {
        Add-Content -Path $envFile -Value "# STRIPE_WEBHOOK_SECRET=whsec_... (à configurer plus tard)"
        Write-Host "   ⚠️  STRIPE_WEBHOOK_SECRET non configurée (vous pourrez l'ajouter plus tard)" -ForegroundColor Yellow
    }
} else {
    Write-Host "   ℹ️  STRIPE_WEBHOOK_SECRET existe déjà" -ForegroundColor Blue
}

Write-Host "`n✅ Configuration terminée !" -ForegroundColor Green
Write-Host "`n📝 Prochaines étapes :" -ForegroundColor Cyan
Write-Host "   1. Vérifiez que vos clés sont correctes dans le fichier .env" -ForegroundColor White
Write-Host "   2. Redémarrez votre serveur de développement (pnpm dev)" -ForegroundColor White
Write-Host "   3. Testez un paiement avec une carte de test Stripe" -ForegroundColor White
Write-Host "   4. Consultez GUIDE-STRIPE-MALI.md pour plus de détails" -ForegroundColor White
Write-Host "`n"
