# Script pour créer les tables dans Supabase

Write-Host "📋 Création des tables dans Supabase..." -ForegroundColor Cyan
Write-Host ""

# Charger les variables d'environnement depuis .env.local
$envPath = Join-Path $PSScriptRoot ".." ".env.local"
if (Test-Path $envPath) {
    $envFile = Get-Content $envPath
    foreach ($line in $envFile) {
        if ($line -match '^([^#][^=]+)=(.*)$') {
            $key = $matches[1].Trim()
            $value = $matches[2].Trim() -replace '^"?(.*?)"?$', '$1'
            [Environment]::SetEnvironmentVariable($key, $value, 'Process')
            Write-Host "✅ Variable chargée: $key" -ForegroundColor Green
        }
    }
} else {
    Write-Host "❌ Fichier .env.local non trouvé à: $envPath" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "🔄 Création des tables avec Prisma..." -ForegroundColor Yellow
Write-Host ""

# Créer les tables
npx prisma@5.9.1 db push

Write-Host ""
Write-Host "✅ Tables créées avec succès !" -ForegroundColor Green
Write-Host ""
Write-Host "Pour visualiser les tables: npx prisma studio" -ForegroundColor Cyan
