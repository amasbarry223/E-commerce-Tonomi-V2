import { create } from "zustand"
import { persist } from "zustand/middleware"

interface AdminAuthState {
    isAuthenticated: boolean
    login: (email: string, password: string) => boolean
    logout: () => void
}

const STORAGE_KEY = "tonomi_admin_auth"

// Mock credentials based on the plan
const ADMIN_EMAIL = "admin@tonomi.com"
const ADMIN_PASSWORD = "admin"

export const useAdminAuthStore = create<AdminAuthState>()(
    persist(
        (set) => ({
            isAuthenticated: false,

            login: (email, password) => {
                if (email.toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
                    set({ isAuthenticated: true })
                    return true
                }
                return false
            },

            logout: () => {
                set({ isAuthenticated: false })
            },
        }),
        {
            name: STORAGE_KEY,
        }
    )
)
