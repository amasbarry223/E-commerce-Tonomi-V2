# Script pour vérifier si les tables existent dans Supabase

Write-Host "Vérification de l'existence des tables dans Supabase..." -ForegroundColor Cyan
Write-Host ""

# Charger les variables d'environnement depuis .env
$envFile = Get-Content .env -Raw
$dbUrl = ""
if ($envFile -match 'DATABASE_URL="([^"]+)"') {
    $dbUrl = $matches[1]
} elseif ($envFile -match 'DATABASE_URL=([^\s]+)') {
    $dbUrl = $matches[1]
}

if (-not $dbUrl) {
    Write-Host "❌ DATABASE_URL non trouvé dans .env" -ForegroundColor Red
    exit 1
}

Write-Host "✅ DATABASE_URL trouvé" -ForegroundColor Green
Write-Host ""

# Liste des tables attendues selon le schéma Prisma
$expectedTables = @(
    "customers",
    "addresses",
    "orders",
    "order_items",
    "products",
    "product_images",
    "product_colors",
    "product_sizes",
    "categories",
    "reviews",
    "promo_codes",
    "promo_code_categories",
    "promo_code_products",
    "hero_slides",
    "settings",
    "logs"
)

Write-Host "Tables attendues selon le schéma Prisma :" -ForegroundColor Yellow
foreach ($table in $expectedTables) {
    Write-Host "  - $table" -ForegroundColor White
}

Write-Host ""
Write-Host "Pour vérifier si les tables existent :" -ForegroundColor Cyan
Write-Host "1. Va dans Supabase Dashboard → Table Editor" -ForegroundColor White
Write-Host "2. Ou utilise Prisma Studio : npx prisma studio" -ForegroundColor White
Write-Host "3. Ou exécute : npx prisma db push (pour créer les tables si elles n'existent pas)" -ForegroundColor White
Write-Host ""

Write-Host "⚠️  Si les tables n'existent pas, exécute :" -ForegroundColor Yellow
Write-Host "   npx prisma@5.9.1 db push" -ForegroundColor Green
