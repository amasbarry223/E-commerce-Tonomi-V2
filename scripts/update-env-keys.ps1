# Script pour mettre à jour les clés Supabase dans .env.local
# Usage: .\scripts\update-env-keys.ps1

Write-Host "🔑 Mise à jour des clés Supabase" -ForegroundColor Cyan
Write-Host ""

# Vérifier si .env.local existe
$envLocalPath = Join-Path $PSScriptRoot ".." ".env.local"
$envLocalPath = Resolve-Path $envLocalPath -ErrorAction SilentlyContinue
if (-not $envLocalPath) {
    $envLocalPath = Join-Path (Split-Path $PSScriptRoot -Parent) ".env.local"
}

if (-not (Test-Path $envLocalPath)) {
    Write-Host "❌ Fichier .env.local non trouvé" -ForegroundColor Red
    exit 1
}

Write-Host "📝 Fichier trouvé: $envLocalPath" -ForegroundColor Green
Write-Host ""

# Demander les clés à l'utilisateur
Write-Host "Colle tes clés Supabase (depuis https://supabase.com/dashboard > Settings > API):" -ForegroundColor Yellow
Write-Host ""

$anonKey = Read-Host "1. Clé ANON (anon public) - Colle la clé complète"
$serviceKey = Read-Host "2. Clé SERVICE_ROLE (service_role secret) - Colle la clé complète"

# Vérifier que les clés ne sont pas vides et commencent par eyJ
if (-not $anonKey -or $anonKey -match "your_supabase|placeholder") {
    Write-Host "❌ Clé ANON invalide ou placeholder détecté" -ForegroundColor Red
    exit 1
}

if (-not $serviceKey -or $serviceKey -match "your_supabase|placeholder") {
    Write-Host "❌ Clé SERVICE_ROLE invalide ou placeholder détecté" -ForegroundColor Red
    exit 1
}

if (-not $anonKey.StartsWith("eyJ")) {
    Write-Host "⚠️  La clé ANON devrait commencer par 'eyJ'. Es-tu sûr d'avoir copié la bonne clé ?" -ForegroundColor Yellow
    $confirm = Read-Host "Continuer quand même ? (o/n)"
    if ($confirm -ne "o") {
        exit 1
    }
}

# Lire le contenu actuel
$content = Get-Content $envLocalPath -Raw

# Remplacer les clés
$content = $content -replace "NEXT_PUBLIC_SUPABASE_ANON_KEY=.*", "NEXT_PUBLIC_SUPABASE_ANON_KEY=$anonKey"
$content = $content -replace "SUPABASE_SERVICE_ROLE_KEY=.*", "SUPABASE_SERVICE_ROLE_KEY=$serviceKey"

# Écrire le nouveau contenu
$content | Out-File -FilePath $envLocalPath -Encoding UTF8 -NoNewline

Write-Host ""
Write-Host "✅ Clés mises à jour dans .env.local" -ForegroundColor Green
Write-Host ""
Write-Host "⚠️  IMPORTANT: Redémarre ton serveur de développement pour que les changements prennent effet:" -ForegroundColor Yellow
Write-Host "   1. Arrête le serveur (Ctrl+C)" -ForegroundColor Yellow
Write-Host "   2. Redémarre: pnpm dev" -ForegroundColor Yellow
Write-Host ""
