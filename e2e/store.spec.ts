import { test, expect } from "@playwright/test"

const ADMIN_EMAIL = process.env.PLAYWRIGHT_ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_DEFAULT_EMAIL || "admin@tonomi.com"
const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_DEFAULT_PASSWORD || "admin123"

test.describe("Boutique (authentifié)", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto("/login")
    await page.getByLabel(/email/i).fill(ADMIN_EMAIL)
    await page.getByLabel(/mot de passe/i).fill(ADMIN_PASSWORD)
    await page.getByRole("button", { name: /se connecter/i }).click()
    await expect(page).not.toHaveURL(/\/login/, { timeout: 15_000 })
  })

  test("affiche la page d’accueil après connexion", async ({ page }) => {
    await page.goto("/")
    await expect(page.getByRole("heading", { level: 1 }).or(page.getByRole("main"))).toBeVisible({ timeout: 10_000 })
  })

  test("panier accessible via URL", async ({ page }) => {
    await page.goto("/?page=cart")
    await expect(page.getByRole("heading", { name: /panier/i }).or(page.getByText(/panier/i))).toBeVisible({ timeout: 10_000 })
  })

  test("catalogue affiche la liste des articles", async ({ page }) => {
    await page.goto("/?page=catalog")
    await expect(page.getByText(/catalogue|tous nos articles/i)).toBeVisible({ timeout: 10_000 })
    await expect(page.getByText(/\d+ article/)).toBeVisible({ timeout: 5_000 })
  })

  test("fiche produit affiche le détail et le bouton ajouter au panier", async ({ page }) => {
    await page.goto("/?page=product&id=prod-1")
    await expect(page.getByText(/Sac Élégance Parisienne/i)).toBeVisible({ timeout: 10_000 })
    await expect(page.getByRole("button", { name: /ajouter au panier/i })).toBeVisible({ timeout: 5_000 })
  })
})
