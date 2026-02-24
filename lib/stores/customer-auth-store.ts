/**
 * Store Zustand pour l'authentification client (boutique).
 * Inscription et connexion optionnelles pour les acheteurs.
 * Séparé du store auth admin (lib/stores/auth-store).
 */
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { customers as staticCustomers } from "@/lib/data"
import type { Customer } from "@/lib/types"

interface RegisteredCustomer extends Customer {
    passwordHash: string
}

interface CustomerAuthState {
    currentCustomerId: string | null
    registeredCustomers: RegisteredCustomer[]
    /**
     * Connexion d'un client existant (statique ou inscrit).
     * @returns true si les identifiants sont valides, false sinon.
     */
    login: (email: string, password: string) => boolean
    /**
     * Inscription d'un nouveau client boutique.
     * Crée un compte local persisté dans le store.
     */
    register: (firstName: string, lastName: string, email: string, password: string) => void
    /** Déconnexion du client courant. */
    logout: () => void
    /** Récupère un client par son id (statique ou inscrit). */
    getCustomerById: (id: string) => Customer | undefined
}

const STORAGE_KEY = "tonomi_customer_auth"

export const useCustomerAuthStore = create<CustomerAuthState>()(
    persist(
        (set, get) => ({
            currentCustomerId: null,
            registeredCustomers: [],

            login: (email, password) => {
                const { registeredCustomers } = get()
                // Chercher parmi les clients inscrits en boutique
                const registered = registeredCustomers.find(
                    (c) => c.email.toLowerCase() === email.toLowerCase() && c.passwordHash === password
                )
                if (registered) {
                    set({ currentCustomerId: registered.id })
                    return true
                }
                // Chercher dans les données statiques (démo : tout mot de passe accepté)
                const staticCustomer = staticCustomers.find(
                    (c) => c.email.toLowerCase() === email.toLowerCase()
                )
                if (staticCustomer) {
                    set({ currentCustomerId: staticCustomer.id })
                    return true
                }
                return false
            },

            register: (firstName, lastName, email, password) => {
                const { registeredCustomers } = get()
                const alreadyExists =
                    registeredCustomers.some((c) => c.email.toLowerCase() === email.toLowerCase()) ||
                    staticCustomers.some((c) => c.email.toLowerCase() === email.toLowerCase())

                if (alreadyExists) {
                    throw new Error("Un compte existe déjà avec cet email.")
                }

                const newCustomer: RegisteredCustomer = {
                    id: `cust-reg-${Date.now()}`,
                    firstName,
                    lastName,
                    email,
                    phone: "",
                    avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + "+" + lastName)}&background=random`,
                    segment: "new",
                    totalSpent: 0,
                    orderCount: 0,
                    createdAt: new Date().toISOString().split("T")[0],
                    addresses: [],
                    passwordHash: password,
                }

                set((state) => ({
                    registeredCustomers: [...state.registeredCustomers, newCustomer],
                    currentCustomerId: newCustomer.id,
                }))
            },

            logout: () => {
                set({ currentCustomerId: null })
            },

            getCustomerById: (id) => {
                const { registeredCustomers } = get()
                const registered = registeredCustomers.find((c) => c.id === id)
                if (registered) {
                    // Retourner sans le passwordHash
                    const { passwordHash: _, ...customer } = registered
                    return customer
                }
                return staticCustomers.find((c) => c.id === id)
            },
        }),
        {
            name: STORAGE_KEY,
            partialize: (state) => ({
                currentCustomerId: state.currentCustomerId,
                registeredCustomers: state.registeredCustomers,
            }),
        }
    )
)
