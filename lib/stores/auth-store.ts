/**
 * Store Zustand pour l'authentification admin
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  isAuthenticated: boolean
  user: { email: string; role: 'admin' | 'super-admin'; id: string } | null
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
}

// Credentials par défaut (à changer en production)
const ADMIN_EMAIL = 'admin@tonomi.com'
const ADMIN_PASSWORD = 'admin123'

export const useAuthStore = create<AuthStore>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,

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
            
            // Mettre à jour la dernière connexion
            usersStore.updateUser(user.id, { lastLogin: new Date().toISOString() })
            
            // Ajouter un log (fait depuis le composant pour éviter les imports circulaires)
            if (typeof window !== 'undefined') {
              setTimeout(() => {
                try {
                  const logsModule = require('./logs-store')
                  const logsStore = logsModule.useLogsStore.getState()
                  logsStore.addLog({
                    action: 'login',
                    userId: user.id,
                    userEmail: user.email,
                    description: `Connexion de ${user.name} (${user.email})`,
                  })
                } catch {
                  // Ignorer si le store n'est pas disponible
                }
              }, 0)
            }
            
            return true
          }
        } catch {
          // Fallback vers l'authentification par défaut
        }
        
        // Authentification par défaut (pour compatibilité)
        const emailMatch = normalizedEmail === ADMIN_EMAIL.toLowerCase()
        const passwordMatch = normalizedPassword === ADMIN_PASSWORD
        
        if (emailMatch && passwordMatch) {
          set({
            isAuthenticated: true,
            user: { email: normalizedEmail, role: 'admin', id: '1' },
          })
          return true
        }
        return false
      },

      logout: () => {
        const currentUser = get().user
        if (currentUser && typeof window !== 'undefined') {
          // Ajouter un log de déconnexion si possible
          setTimeout(() => {
            try {
              const logsModule = require('./logs-store')
              const logsStore = logsModule.useLogsStore.getState()
              logsStore.addLog({
                action: 'logout',
                userId: currentUser.id,
                userEmail: currentUser.email,
                description: `Déconnexion de ${currentUser.email}`,
              })
            } catch {
              // Ignorer si le store n'est pas disponible
            }
          }, 0)
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
    }
  )
)
