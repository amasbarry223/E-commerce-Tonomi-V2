/**
 * Store Zustand pour l'authentification client (boutique).
 * Indépendant de l'auth admin (auth-store). Session et comptes inscrits persistés pour la démo.
 */
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Customer } from "@/lib/types"
import { getCustomerById as getStaticCustomerById } from "@/lib/services/customers"

const CUSTOMER_SESSION_STORAGE_KEY = "tonomi-customer-session"

export interface RegisteredClientCredentials {
  customerId: string
  email: string
  password: string
}

function createCustomerId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return `cust-reg-${crypto.randomUUID()}`
  }
  return `cust-reg-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`
}

const DEFAULT_AVATAR = "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop"

function createCustomerProfile(payload: {
  firstName: string
  lastName: string
  email: string
}): Customer {
  const id = createCustomerId()
  const now = new Date().toISOString().slice(0, 10)
  return {
    id,
    firstName: payload.firstName.trim(),
    lastName: payload.lastName.trim(),
    email: payload.email.trim().toLowerCase(),
    phone: "",
    avatar: DEFAULT_AVATAR,
    segment: "new",
    totalSpent: 0,
    orderCount: 0,
    createdAt: now,
    addresses: [],
  }
}

interface CustomerAuthState {
  currentCustomerId: string | null
  registeredClients: RegisteredClientCredentials[]
  registeredCustomerProfiles: Customer[]
  register: (firstName: string, lastName: string, email: string, password: string) => Customer
  login: (email: string, password: string) => boolean
  logout: () => void
  getCustomerById: (id: string) => Customer | undefined
}

export const useCustomerAuthStore = create<CustomerAuthState>()(
  persist(
    (set, get) => ({
      currentCustomerId: null,
      registeredClients: [],
      registeredCustomerProfiles: [],

      register: (firstName, lastName, email, password) => {
        const normalizedEmail = email.trim().toLowerCase()
        const normalizedPassword = password.trim()
        const existing = get().registeredClients.find((c) => c.email === normalizedEmail)
        if (existing) {
          throw new Error("Un compte existe déjà avec cette adresse email.")
        }
        const customer = createCustomerProfile({
          firstName,
          lastName,
          email: normalizedEmail,
        })
        set((state) => ({
          registeredCustomerProfiles: [...state.registeredCustomerProfiles, customer],
          registeredClients: [
            ...state.registeredClients,
            {
              customerId: customer.id,
              email: normalizedEmail,
              password: normalizedPassword,
            },
          ],
          currentCustomerId: customer.id,
        }))
        return customer
      },

      login: (email, password) => {
        const normalizedEmail = email.trim().toLowerCase()
        const normalizedPassword = password.trim()
        const client = get().registeredClients.find((c) => c.email === normalizedEmail)
        if (!client || client.password !== normalizedPassword) {
          return false
        }
        set({ currentCustomerId: client.customerId })
        return true
      },

      logout: () => {
        set({ currentCustomerId: null })
      },

      getCustomerById: (id) => {
        const registered = get().registeredCustomerProfiles.find((c) => c.id === id)
        if (registered) return registered
        return getStaticCustomerById(id)
      },
    }),
    {
      name: CUSTOMER_SESSION_STORAGE_KEY,
      partialize: (state) => ({
        currentCustomerId: state.currentCustomerId,
        registeredClients: state.registeredClients,
        registeredCustomerProfiles: state.registeredCustomerProfiles,
      }),
    }
  )
)
