# Script PowerShell pour nettoyer et relancer le serveur de développement Next.js

Write-Host "🧹 Nettoyage des fichiers de lock Next.js..." -ForegroundColor Cyan

# Arrêter les processus Node.js
$nodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue
if ($nodeProcesses) {
    Write-Host "⏹️  Arrêt des processus Node.js..." -ForegroundColor Yellow
    $nodeProcesses | Stop-Process -Force -ErrorAction SilentlyContinue
    Start-Sleep -Seconds 1
}

# Supprimer le lock file
$lockPath = ".next\dev\lock"
if (Test-Path $lockPath) {
    Remove-Item -Path $lockPath -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Lock file supprimé" -ForegroundColor Green
} else {
    Write-Host "ℹ️  Pas de lock file trouvé" -ForegroundColor Gray
}

# Nettoyer le dossier .next/dev (optionnel - décommentez si nécessaire)
# if (Test-Path ".next\dev") {
#     Remove-Item -Path ".next\dev" -Recurse -Force -ErrorAction SilentlyContinue
#     Write-Host "✅ Dossier .next/dev nettoyé" -ForegroundColor Green
# }

Write-Host "✅ Nettoyage terminé" -ForegroundColor Green
Write-Host "🚀 Vous pouvez maintenant relancer: pnpm dev" -ForegroundColor Cyan

