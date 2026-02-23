import { test, expect } from "@playwright/test"

const ADMIN_EMAIL = process.env.PLAYWRIGHT_ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_DEFAULT_EMAIL || "admin@tonomi.com"
const ADMIN_PASSWORD = process.env.PLAYWRIGHT_ADMIN_PASSWORD || process.env.NEXT_PUBLIC_ADMIN_DEFAULT_PASSWORD || "admin123"

test.describe("Admin (tableau de bord)", () => {
  test("affiche le tableau de bord après connexion", async ({ page }) => {
    await page.goto("/login")
    await page.getByLabel(/email/i).fill(ADMIN_EMAIL)
    await page.getByLabel(/mot de passe/i).fill(ADMIN_PASSWORD)
    await page.getByRole("button", { name: /se connecter/i }).click()
    // Redirection /dashboard puis /?view=admin
    await expect(page.getByText(/tableau de bord/i)).toBeVisible({ timeout: 15_000 })
  })
})
