import { describe, it, expect } from "vitest"
import {
  formatPrice,
  formatDate,
  formatDateShort,
  getStatusColor,
  getStatusLabel,
  getBadgeColor,
  getSegmentLabel,
  getSegmentColor,
} from "./formatters"

describe("formatPrice", () => {
  it("formate un prix en EUR style fr-FR", () => {
    expect(formatPrice(125.99)).toMatch(/125[,.]99\s*€/)
    expect(formatPrice(0)).toMatch(/0[,.]00\s*€/)
    expect(formatPrice(1000)).toMatch(/1\s?000[,.]00\s*€/)
  })
})

describe("formatDate", () => {
  it("formate une date ISO en format long français", () => {
    expect(formatDate("2026-01-15")).toMatch(/15\s+janvier\s+2026/)
  })
})

describe("formatDateShort", () => {
  it("formate une date ISO en format court", () => {
    const out = formatDateShort("2026-01-15")
    expect(out).toMatch(/15[/.]01[/.]2026/)
  })
})

describe("getStatusColor", () => {
  it("retourne des classes Tailwind pour les statuts commande", () => {
    expect(getStatusColor("pending")).toContain("amber")
    expect(getStatusColor("delivered")).toContain("emerald")
    expect(getStatusColor("cancelled")).toContain("red")
  })
  it("retourne un fallback pour statut inconnu", () => {
    expect(getStatusColor("unknown")).toContain("gray")
  })
})

describe("getStatusLabel", () => {
  it("retourne le label français pour les statuts connus", () => {
    expect(getStatusLabel("pending")).toBe("En attente")
    expect(getStatusLabel("delivered")).toBe("Livrée")
    expect(getStatusLabel("new")).toBe("Nouveau")
  })
  it("retourne le statut tel quel pour inconnu", () => {
    expect(getStatusLabel("inconnu")).toBe("inconnu")
  })
})

describe("getBadgeColor", () => {
  it("retourne des classes Tailwind pour les badges", () => {
    expect(getBadgeColor("new")).toContain("emerald")
    expect(getBadgeColor("promo")).toContain("red")
  })
  it("retourne un fallback pour badge inconnu", () => {
    expect(getBadgeColor("unknown")).toContain("gray")
  })
})

describe("getSegmentLabel", () => {
  it("retourne le label pour les segments connus", () => {
    expect(getSegmentLabel("vip")).toBe("VIP")
    expect(getSegmentLabel("new")).toBe("Nouveau")
    expect(getSegmentLabel("regular")).toBe("Régulier")
  })
  it("retourne le segment tel quel pour inconnu", () => {
    expect(getSegmentLabel("inconnu")).toBe("inconnu")
  })
})

describe("getSegmentColor", () => {
  it("retourne des classes Tailwind pour les segments", () => {
    expect(getSegmentColor("vip")).toContain("amber")
    expect(getSegmentColor("new")).toContain("emerald")
  })
  it("retourne un fallback pour segment inconnu", () => {
    expect(getSegmentColor("unknown")).toContain("gray")
  })
})
