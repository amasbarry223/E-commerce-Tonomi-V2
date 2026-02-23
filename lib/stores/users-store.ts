/**
 * Store Zustand pour la gestion des utilisateurs administrateurs
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useAuthStore } from './auth-store'
import { addLog } from './logs-actions'

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

function getDefaultAdminUser(): AdminUser {
  const email = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ADMIN_DEFAULT_EMAIL) || 'admin@tonomi.com'
  const password = (typeof process !== 'undefined' && process.env.NEXT_PUBLIC_ADMIN_DEFAULT_PASSWORD) || 'admin123'
  return {
    id: '1',
    email,
    password,
    role: 'super-admin',
    name: 'Administrateur Principal',
    createdAt: new Date().toISOString(),
    active: true,
  }
}

export const useUsersStore = create<UsersStore>()(
  persist(
    (set, get) => ({
      users: [getDefaultAdminUser()],

      addUser: (userData) => {
        const newUser: AdminUser = {
          ...userData,
          id: Date.now().toString(),
          createdAt: new Date().toISOString(),
        }
        set((state) => ({
          users: [...state.users, newUser],
        }))
        
        const authUser = useAuthStore.getState().user
        addLog({
          action: 'create_user',
          userId: authUser?.id ?? 'system',
          userEmail: authUser?.email ?? 'system',
          description: `Création de l'utilisateur ${userData.name} (${userData.email})`,
        })
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
