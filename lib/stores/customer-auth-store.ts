/**
 * Store Zustand pour l'authentification client (boutique).
 * Utilise Supabase Auth pour l'authentification réelle.
 */
import { create } from "zustand"
import { persist } from "zustand/middleware"
import { signUp, signIn, signOut, getCurrentUser, getCurrentCustomer } from "@/lib/services/auth"
import type { Customer } from "@/lib/types"
import { supabase } from "@/lib/supabase/client"

interface CustomerAuthState {
    currentCustomerId: string | null
    currentCustomer: Customer | null
    isLoading: boolean
    /**
     * Connexion d'un client existant via Supabase Auth.
     * @returns true si la connexion réussit, false sinon.
     */
    login: (email: string, password: string) => Promise<boolean>
    /**
     * Inscription d'un nouveau client via Supabase Auth.
     */
    register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>
    /** Déconnexion du client courant. */
    logout: () => Promise<void>
    /** Récupère le client actuellement connecté. */
    getCustomerById: (id: string) => Customer | undefined
    /** Initialise l'état depuis Supabase Auth (à appeler au montage du composant). */
    initialize: () => Promise<void>
}

const STORAGE_KEY = "tonomi_customer_auth"

export const useCustomerAuthStore = create<CustomerAuthState>()(
    persist(
        (set, get) => ({
            currentCustomerId: null,
            currentCustomer: null,
            isLoading: false,

            login: async (email, password) => {
                set({ isLoading: true, error: null })
                try {
                    console.log("🔄 Store: Appel de signIn()...", { email: email.substring(0, 5) + "***" })
                    const { user, customer } = await signIn(email, password)
                    console.log("✅ Store: signIn réussi", { userId: user.id, customerId: customer.id })
                    set({
                        currentCustomerId: user.id,
                        currentCustomer: customer,
                        isLoading: false,
                        error: null,
                    })
                    return true
                } catch (error) {
                    console.error("❌ Store: Erreur signIn", error)
                    const errorMessage = error instanceof Error ? error.message : "Erreur lors de la connexion"
                    set({ isLoading: false, error: errorMessage })
                    throw error
                }
            },

            register: async (firstName, lastName, email, password) => {
                set({ isLoading: true, error: null })
                try {
                    console.log("🔄 Store: Appel de signUp()...", { email: email.substring(0, 5) + "***" })
                    // signUp prend les paramètres dans l'ordre: email, password, firstName, lastName
                    const { user, customer } = await signUp(email, password, firstName, lastName)
                    console.log("✅ Store: signUp réussi", { userId: user.id, customerId: customer.id })
                    set({
                        currentCustomerId: user.id,
                        currentCustomer: customer,
                        isLoading: false,
                        error: null,
                    })
                    return true
                } catch (error) {
                    console.error("❌ Store: Erreur signUp", error)
                    const errorMessage = error instanceof Error ? error.message : "Erreur lors de l'inscription"
                    set({ isLoading: false, error: errorMessage })
                    throw error
                }
            },

            logout: async () => {
                set({ isLoading: true })
                try {
                    await signOut()
                    set({
                        currentCustomerId: null,
                        currentCustomer: null,
                        isLoading: false,
                    })
                } catch (error) {
                    set({ isLoading: false })
                    throw error
                }
            },

            getCustomerById: (id) => {
                const { currentCustomer } = get()
                if (currentCustomer && currentCustomer.id === id) {
                    return currentCustomer
                }
                return undefined
            },

            initialize: async () => {
                set({ isLoading: true })
                try {
                    const user = await getCurrentUser()
                    if (user) {
                        const customer = await getCurrentCustomer()
                        if (customer) {
                            set({
                                currentCustomerId: user.id,
                                currentCustomer: customer,
                                isLoading: false,
                            })
                        } else {
                            set({
                                currentCustomerId: null,
                                currentCustomer: null,
                                isLoading: false,
                            })
                        }
                    } else {
                        set({
                            currentCustomerId: null,
                            currentCustomer: null,
                            isLoading: false,
                        })
                    }
                } catch (error) {
                    console.error("Error initializing auth:", error)
                    set({
                        currentCustomerId: null,
                        currentCustomer: null,
                        isLoading: false,
                    })
                }
            },
        }),
        {
            name: STORAGE_KEY,
            partialize: (state) => ({
                currentCustomerId: state.currentCustomerId,
                currentCustomer: state.currentCustomer,
            }),
        }
    )
)

// Écouter les changements de session Supabase
if (typeof window !== "undefined") {
    supabase.auth.onAuthStateChange(async (event, session) => {
        const store = useCustomerAuthStore.getState()
        if (event === "SIGNED_IN" || event === "TOKEN_REFRESHED") {
            await store.initialize()
        } else if (event === "SIGNED_OUT") {
            store.logout()
        }
    })
}
