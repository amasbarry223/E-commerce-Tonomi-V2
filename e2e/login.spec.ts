import { test, expect } from "@playwright/test"

test.describe("Page de connexion", () => {
  test("affiche le formulaire de connexion sur /login", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible()
    await expect(page.getByRole("button", { name: /se connecter/i })).toBeVisible()
  })

  test("la boutique / est accessible sans connexion", async ({ page }) => {
    // La SPA boutique sur / est publique
    await page.goto("/")
    await expect(page).not.toHaveURL(/\/login/)
  })

  test("redirige vers /login quand on accède à /dashboard sans être connecté", async ({ page }) => {
    await page.goto("/dashboard")
    await expect(page).toHaveURL(/\/login/)
  })

  test("redirige vers /login quand on accède à /admin sans être connecté", async ({ page }) => {
    await page.goto("/admin")
    await expect(page).toHaveURL(/\/login/)
  })
})
