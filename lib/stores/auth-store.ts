/**
 * Store Zustand pour l'authentification admin
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { AUTH_COOKIE_NAME } from '@/lib/routes'
import { addLog } from './logs-actions'

const AUTH_COOKIE_MAX_AGE_DAYS = 7
export const REDIRECT_STORAGE_KEY = "tonomi-auth-redirect"

function setAuthCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${AUTH_COOKIE_NAME}=1; path=/; max-age=${AUTH_COOKIE_MAX_AGE_DAYS * 86400}; SameSite=Lax`
}

function clearAuthCookie() {
  if (typeof document === 'undefined') return
  document.cookie = `${AUTH_COOKIE_NAME}=; path=/; max-age=0`
}

/** Vérifie côté client si le cookie d'auth est présent (évite état persisté sans session réelle). */
export function hasAuthCookie(): boolean {
  if (typeof document === 'undefined') return false
  return document.cookie.includes(`${AUTH_COOKIE_NAME}=`)
}

export type AuthRole = 'admin' | 'super-admin'

interface AuthStore {
  isAuthenticated: boolean
  user: { email: string; role: AuthRole; id: string } | null
  /** True une fois le state rehydraté depuis le storage (ne pas persister) */
  _hasHydrated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

// Credentials par défaut : depuis les variables d'env pour ne pas les committer (fallback dev)
const getDefaultAdminCredentials = () => ({
  email: (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ADMIN_DEFAULT_EMAIL) || 'admin@tonomi.com',
  password: (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ADMIN_DEFAULT_PASSWORD) || 'admin123',
})

function isValidRehydratedUser(u: unknown): u is { id: string; email: string; role: AuthRole } {
  if (!u || typeof u !== 'object') return false
  const o = u as Record<string, unknown>
  return (
    typeof o.id === 'string' &&
    typeof o.email === 'string' &&
    (o.role === 'admin' || o.role === 'super-admin')
  )
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      _hasHydrated: false,

      login: async (email: string, password: string) => {
        const normalizedEmail = email.trim().toLowerCase()
        const normalizedPassword = password.trim()
        
        // Essayer d'utiliser le store des utilisateurs
        try {
          // Import dynamique pour éviter les imports circulaires
          const usersModule = await import('./users-store')
          const usersStore = usersModule.useUsersStore.getState()
          
          const user = usersStore.getUserByEmail(normalizedEmail)
          
          if (user && user.password === normalizedPassword && user.active) {
            set({
              isAuthenticated: true,
              user: { 
                email: user.email, 
                role: user.role,
                id: user.id,
              },
            })
            setAuthCookie()
            
            // Mettre à jour la dernière connexion
            usersStore.updateUser(user.id, { lastLogin: new Date().toISOString() })
            
            if (typeof window !== 'undefined') {
              addLog({
                action: 'login',
                userId: user.id,
                userEmail: user.email,
                description: `Connexion de ${user.name} (${user.email})`,
              })
            }
            
            return true
          }
        } catch {
          // Fallback vers l'authentification par défaut
        }
        
        // Authentification par défaut (pour compatibilité)
        const { email: defaultEmail, password: defaultPassword } = getDefaultAdminCredentials()
        const emailMatch = normalizedEmail === defaultEmail.toLowerCase()
        const passwordMatch = normalizedPassword === defaultPassword
        
        if (emailMatch && passwordMatch) {
          set({
            isAuthenticated: true,
            user: { email: normalizedEmail, role: 'admin', id: '1' },
          })
          setAuthCookie()
          return true
        }
        return false
      },

      logout: () => {
        clearAuthCookie()
        if (typeof window !== 'undefined') {
          try { sessionStorage.removeItem(REDIRECT_STORAGE_KEY) } catch { /* ignore */ }
        }
        const currentUser = get().user
        if (currentUser && typeof window !== 'undefined') {
          addLog({
            action: 'logout',
            userId: currentUser.id,
            userEmail: currentUser.email,
            description: `Déconnexion de ${currentUser.email}`,
          })
        }
        set({
          isAuthenticated: false,
          user: null,
        })
      },
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        user: state.user,
      }),
      onRehydrateStorage: () => (persistedState, _err) => {
        if (typeof document === 'undefined') {
          useAuthStore.setState({ _hasHydrated: true })
          return
        }
        if (persistedState?.user && !isValidRehydratedUser(persistedState.user)) {
          useAuthStore.setState({ isAuthenticated: false, user: null })
          clearAuthCookie()
        } else if (persistedState?.isAuthenticated) {
          if (!hasAuthCookie()) {
            useAuthStore.setState({ isAuthenticated: false, user: null })
            clearAuthCookie()
          } else {
            setAuthCookie()
          }
        }
        useAuthStore.setState({ _hasHydrated: true })
      },
    }
  )
)
