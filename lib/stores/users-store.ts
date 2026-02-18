/**
 * Store Zustand pour la gestion des utilisateurs administrateurs
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface AdminUser {
  id: string
  email: string
  password: string // En production, devrait être hashé
  role: 'admin' | 'super-admin'
  name: string
  createdAt: string
  lastLogin?: string
  active: boolean
}

interface UsersStore {
  users: AdminUser[]
  addUser: (user: Omit<AdminUser, 'id' | 'createdAt'>) => void
  updateUser: (id: string, updates: Partial<AdminUser>) => void
  deleteUser: (id: string) => void
  getUser: (id: string) => AdminUser | undefined
  getUserByEmail: (email: string) => AdminUser | undefined
}

export const useUsersStore = create<UsersStore>()(
  persist(
    (set, get) => ({
      users: [
        {
          id: '1',
          email: 'admin@tonomi.com',
          password: 'admin123',
          role: 'super-admin',
          name: 'Administrateur Principal',
          createdAt: new Date().toISOString(),
          active: true,
        },
      ],

      addUser: (userData) => {
        const newUser: AdminUser = {
          ...userData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          users: [...state.users, newUser],
        }))
        
        // Ajouter un log
        try {
          const { useLogsStore } = require('./logs-store')
          const { useAuthStore } = require('./auth-store')
          const logsStore = useLogsStore.getState()
          const authStore = useAuthStore.getState()
          logsStore.addLog({
            action: 'create_user',
            userId: authStore.user?.id || 'system',
            userEmail: authStore.user?.email || 'system',
            description: `Création de l'utilisateur ${userData.name} (${userData.email})`,
          })
        } catch (e) {
          // Ignorer si les stores ne sont pas disponibles
        }
      },

      updateUser: (id, updates) => {
        set((state) => ({
          users: state.users.map((user) =>
            user.id === id ? { ...user, ...updates } : user
          ),
        }))
      },

      deleteUser: (id) => {
        set((state) => ({
          users: state.users.filter((user) => user.id !== id),
        }))
      },

      getUser: (id) => {
        return get().users.find((user) => user.id === id)
      },

      getUserByEmail: (email) => {
        return get().users.find((user) => user.email.toLowerCase() === email.toLowerCase())
      },
    }),
    {
      name: 'users-storage',
    }
  )
)
