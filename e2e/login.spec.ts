import { test, expect } from "@playwright/test"

test.describe("Page de connexion", () => {
  test("affiche le formulaire de connexion sur /login", async ({ page }) => {
    await page.goto("/login")
    await expect(page.getByLabel(/email/i)).toBeVisible()
    await expect(page.getByLabel(/mot de passe/i)).toBeVisible()
    await expect(page.getByRole("button", { name: /se connecter/i })).toBeVisible()
  })

  test("redirige vers /login quand on accède à / sans être connecté", async ({ page }) => {
    await page.goto("/")
    await expect(page).toHaveURL(/\/login/)
  })
})
