# Script PowerShell pour créer le fichier .env.local

$envContent = @"
# ============================================
# SUPABASE CONFIGURATION
# ============================================

NEXT_PUBLIC_SUPABASE_URL=https://hwkypsbaraadizoqvujq.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here

# ============================================
# DATABASE (Prisma)
# ============================================

DATABASE_URL="postgresql://postgres.hwkypsbaraadizoqvujq:tonomi%402026@aws-0-eu-west-1.pooler.supabase.com:6543/postgres?pgbouncer=true&sslmode=require"
DIRECT_URL="postgresql://postgres.hwkypsbaraadizoqvujq:tonomi%402026@aws-1-eu-west-3.pooler.supabase.com:6543/postgres?pgbouncer=true&pool_timeout=0"

# ============================================
# APPLICATION
# ============================================

NEXT_PUBLIC_APP_URL=http://localhost:3000
"@

$envPath = Join-Path $PSScriptRoot ".." ".env.local"
$envPath = Resolve-Path $envPath -ErrorAction SilentlyContinue
if (-not $envPath) {
    $envPath = Join-Path (Split-Path $PSScriptRoot -Parent) ".env.local"
}

$envContent | Out-File -FilePath $envPath -Encoding UTF8 -Force

Write-Host "✅ Fichier .env.local créé à : $envPath" -ForegroundColor Green
Write-Host "⚠️ N'oubliez pas de remplacer les clés Supabase !" -ForegroundColor Yellow
Write-Host "   - your_supabase_anon_key_here" -ForegroundColor Yellow
Write-Host "   - your_supabase_service_role_key_here" -ForegroundColor Yellow
