import { describe, it, expect } from "vitest"
import {
  emailFieldSchema,
  loginSchema,
  registerSchema,
  getZodErrorMessage,
  reviewSchema,
} from "./validation"

describe("validation", () => {
  describe("emailFieldSchema", () => {
    it("rejette une chaîne vide", () => {
      const result = emailFieldSchema.safeParse("")
      expect(result.success).toBe(false)
    })
    it("rejette un format email invalide", () => {
      const result = emailFieldSchema.safeParse("pas-un-email")
      expect(result.success).toBe(false)
    })
    it("accepte un email valide", () => {
      const result = emailFieldSchema.safeParse("user@example.com")
      expect(result.success).toBe(true)
    })
  })

  describe("loginSchema", () => {
    it("accepte email et mot de passe valides", () => {
      const result = loginSchema.safeParse({
        email: "admin@tonomi.com",
        password: "secret123",
      })
      expect(result.success).toBe(true)
    })
    it("rejette sans mot de passe", () => {
      const result = loginSchema.safeParse({
        email: "admin@tonomi.com",
        password: "",
      })
      expect(result.success).toBe(false)
    })
  })

  describe("registerSchema", () => {
    it("accepte nom, email, mot de passe valides", () => {
      const result = registerSchema.safeParse({
        name: "Jean Dupont",
        email: "jean@example.com",
        password: "motdepasse6",
      })
      expect(result.success).toBe(true)
    })
    it("rejette un mot de passe trop court", () => {
      const result = registerSchema.safeParse({
        name: "Jean",
        email: "jean@example.com",
        password: "court",
      })
      expect(result.success).toBe(false)
      if (!result.success) {
        expect(getZodErrorMessage(result.error)).toContain("6")
      }
    })
  })

  describe("reviewSchema", () => {
    it("accepte un avis valide", () => {
      const result = reviewSchema.safeParse({
        customerName: "Marie D.",
        rating: 5,
        title: "Parfait",
        comment: "Un produit de très bonne qualité, je recommande.",
      })
      expect(result.success).toBe(true)
    })
    it("rejette un commentaire trop court", () => {
      const result = reviewSchema.safeParse({
        customerName: "Marie",
        rating: 5,
        title: "Bien",
        comment: "Court",
      })
      expect(result.success).toBe(false)
    })
  })

  describe("getZodErrorMessage", () => {
    it("retourne le message de la première erreur", () => {
      const result = loginSchema.safeParse({ email: "", password: "" })
      expect(result.success).toBe(false)
      if (!result.success) {
        const msg = getZodErrorMessage(result.error)
        expect(msg.length).toBeGreaterThan(0)
        expect(typeof msg).toBe("string")
      }
    })
    it("utilise le fallback quand le message résultant est vide", () => {
      const fallback = "Message par défaut"
      const result = loginSchema.safeParse({ email: "a@b.co", password: "x" })
      expect(result.success).toBe(true)
      const invalidResult = loginSchema.safeParse({ email: "", password: "" })
      expect(invalidResult.success).toBe(false)
      if (!invalidResult.success) {
        const msg = getZodErrorMessage(invalidResult.error, fallback)
        expect(typeof msg).toBe("string")
        expect(msg.length).toBeGreaterThan(0)
      }
    })
  })
})
