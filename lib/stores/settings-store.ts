import { create } from "zustand"
import { persist } from "zustand/middleware"
import { LAYOUT_CONSTANTS } from "@/lib/constants"

interface SettingsState {
    promoBannerText: string
    shopName: string
    shopDescription: string
    contactEmail: string
    contactPhone: string
    address: string
    currency: string
    language: string
    updateSettings: (settings: Partial<Omit<SettingsState, "updateSettings">>) => void
}

const STORAGE_KEY = "tonomi_settings"

export const useSettingsStore = create<SettingsState>()(
    persist(
        (set) => ({
            promoBannerText: LAYOUT_CONSTANTS.FREE_SHIPPING_HEADER + " | Code BIENVENUE10 = -10%",
            shopName: "TONOMI ACCESSOIRES",
            shopDescription: "Boutique en ligne de maroquinerie de luxe. Découvrez nos collections de sacs, portefeuilles et accessoires en cuir véritable.",
            contactEmail: "contact@tonomi.com",
            contactPhone: "+33 1 23 45 67 89",
            address: "12 Rue du Faubourg Saint-Honoré, 75008 Paris",
            currency: "EUR",
            language: "fr",

            updateSettings: (newSettings) => set((state) => ({ ...state, ...newSettings })),
        }),
        {
            name: STORAGE_KEY,
        }
    )
)
