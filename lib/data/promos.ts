import type { PromoCode } from "./types"

export const promoCodes: PromoCode[] = [
  { id: "promo-1", code: "BIENVENUE10", type: "percentage", value: 10, maxUses: 100, usedCount: 34, startDate: "2026-01-01", endDate: "2026-06-30", active: true },
  { id: "promo-2", code: "SOLDES20", type: "percentage", value: 20, minAmount: 150, maxUses: 50, usedCount: 22, startDate: "2026-01-15", endDate: "2026-02-28", active: true },
  { id: "promo-3", code: "LIVRAISON", type: "fixed", value: 5.99, maxUses: 200, usedCount: 89, startDate: "2026-01-01", endDate: "2026-12-31", active: true },
  { id: "promo-4", code: "VIP30", type: "percentage", value: 30, minAmount: 200, maxUses: 20, usedCount: 8, startDate: "2026-02-01", endDate: "2026-03-31", active: true, categories: ["cat-1"] },
  { id: "promo-5", code: "NOEL15", type: "percentage", value: 15, maxUses: 100, usedCount: 100, startDate: "2025-12-01", endDate: "2025-12-31", active: false },
]
