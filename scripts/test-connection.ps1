# Script pour tester la connexion Supabase

Write-Host "🔍 Test de connexion Supabase..." -ForegroundColor Cyan
Write-Host ""

# Charger les variables d'environnement
$envFile = Get-Content ..\.env.local -ErrorAction SilentlyContinue
if (-not $envFile) {
    Write-Host "❌ Fichier .env.local non trouvé" -ForegroundColor Red
    exit 1
}

foreach ($line in $envFile) {
    if ($line -match '^([^#][^=]+)=(.*)$') {
        $key = $matches[1].Trim()
        $value = $matches[2].Trim() -replace '^"?(.*?)"?$', '$1'
        [Environment]::SetEnvironmentVariable($key, $value, 'Process')
    }
}

Write-Host "✅ Variables chargées" -ForegroundColor Green
Write-Host "DATABASE_URL: $($env:DATABASE_URL.Substring(0, [Math]::Min(80, $env:DATABASE_URL.Length)))..." -ForegroundColor Cyan
Write-Host ""

# Tester avec Prisma
Write-Host "🔄 Test avec Prisma..." -ForegroundColor Yellow
npx prisma@5.9.1 db push --skip-generate 2>&1 | Out-String
