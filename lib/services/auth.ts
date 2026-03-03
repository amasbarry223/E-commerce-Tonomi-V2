/**
 * Service d'authentification Supabase pour les clients (côté client)
 * Utilise les API routes pour éviter d'importer Prisma côté client
 */

import { supabase } from "@/lib/supabase/client"
import type { Customer } from "@/lib/types"

export interface AuthUser {
  id: string
  email: string
  firstName?: string
  lastName?: string
}

/**
 * Inscription d'un nouveau client avec Supabase Auth
 */
export async function signUp(
  email: string,
  password: string,
  firstName: string,
  lastName: string
): Promise<{ user: AuthUser; customer: Customer }> {
  // Validation basique côté client
  if (!email || !email.includes("@")) {
    throw new Error("Email invalide")
  }
  if (!password || password.length < 6) {
    throw new Error("Le mot de passe doit contenir au moins 6 caractères")
  }

  // 1. Créer l'utilisateur dans Supabase Auth (côté client)
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: email.trim().toLowerCase(),
    password,
    options: {
      data: {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      },
    },
  })

  if (authError) {
    // Améliorer les messages d'erreur selon le type d'erreur Supabase
    let errorMessage = authError.message || "Erreur lors de l'inscription"
    
    // Vérifier le rate limit EN PREMIER (priorité absolue)
    // Le message peut être "email rate limit exceeded", donc on vérifie d'abord le status et les mots-clés spécifiques
    const errorMsgLower = authError.message?.toLowerCase() || ""
    const isRateLimit = authError.status === 429 || 
                       errorMsgLower.includes("rate limit") || 
                       errorMsgLower.includes("too many requests") ||
                       errorMsgLower.includes("rate limit exceeded")
    
    if (isRateLimit) {
      errorMessage = "Trop de tentatives d'inscription. Veuillez patienter 5 à 10 minutes avant de réessayer."
    } else if (authError.message?.includes("already registered") || authError.message?.includes("already exists")) {
      errorMessage = "Cet email est déjà utilisé. Essayez de vous connecter ou utilisez un autre email."
    } else if (authError.message?.includes("password")) {
      errorMessage = "Le mot de passe ne respecte pas les exigences de sécurité."
    } else if (authError.status === 422) {
      errorMessage = `Données invalides: ${authError.message}. Vérifiez que votre email est valide et que votre mot de passe contient au moins 6 caractères.`
    } else if (authError.message?.includes("email") && authError.status !== 429 && !isRateLimit) {
      // Ne pas vérifier "email" si c'est un rate limit (status 429 ou message contient "rate limit")
      errorMessage = "Format d'email invalide."
    }
    
    console.error("Supabase signup error:", {
      message: authError.message,
      status: authError.status,
      isRateLimit,
      finalErrorMessage: errorMessage,
      details: authError,
    })
    
    throw new Error(errorMessage)
  }

  if (!authData.user) {
    throw new Error("Impossible de créer l'utilisateur. Veuillez réessayer.")
  }

  // Vérifier si l'email nécessite une confirmation
  // Si Supabase est configuré pour exiger une confirmation d'email,
  // authData.user.email sera null jusqu'à ce que l'email soit confirmé
  if (!authData.user.email && authData.user.identities?.length === 0) {
    // Note: Si l'email confirmation est activée, l'utilisateur devra confirmer avant de pouvoir se connecter
    // Mais pour l'instant, on continue car Supabase peut retourner l'utilisateur même si l'email n'est pas confirmé
    // selon la configuration
  }

  // 2. Appeler l'API pour créer/récupérer le customer
  const response = await fetch("/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      email: email.trim().toLowerCase(), 
      userId: authData.user.id, 
      firstName: firstName.trim(), 
      lastName: lastName.trim() 
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Erreur inconnue" }))
    throw new Error(errorData.error || "Erreur lors de la création du customer")
  }

  const data = await response.json()
  return data
}

/**
 * Connexion d'un client existant
 */
export async function signIn(email: string, password: string): Promise<{ user: AuthUser; customer: Customer }> {
  // Validation basique côté client
  if (!email || !email.includes("@")) {
    throw new Error("Email invalide")
  }
  if (!password || password.length === 0) {
    throw new Error("Le mot de passe est requis")
  }

  // 1. Connexion Supabase Auth (côté client)
  const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
    email: email.trim().toLowerCase(),
    password,
  })

  if (authError) {
    // Améliorer les messages d'erreur selon le type d'erreur Supabase
    let errorMessage = authError.message || "Email ou mot de passe incorrect"
    
    // Messages d'erreur plus explicites
    if (authError.message?.includes("Invalid login credentials") || authError.message?.includes("invalid")) {
      errorMessage = "Email ou mot de passe incorrect."
    } else if (authError.message?.includes("Email not confirmed") || authError.message?.includes("not confirmed")) {
      errorMessage = "Votre email n'a pas été confirmé. Veuillez vérifier votre boîte mail et cliquer sur le lien de confirmation."
    } else if (authError.message?.includes("too many requests") || authError.message?.includes("rate limit")) {
      errorMessage = "Trop de tentatives de connexion. Veuillez patienter quelques minutes avant de réessayer."
    } else if (authError.status === 400) {
      errorMessage = `Erreur de connexion: ${authError.message}. Vérifiez que votre email et mot de passe sont corrects.`
    }
    
    console.error("Supabase signin error:", {
      message: authError.message,
      status: authError.status,
      details: authError,
    })
    
    throw new Error(errorMessage)
  }

  if (!authData.user) {
    throw new Error("Impossible de se connecter. Veuillez réessayer.")
  }

  // 2. Appeler l'API pour récupérer/créer le customer
  const userMetadata = authData.user.user_metadata
  const response = await fetch("/api/auth/signin", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ 
      email: email.trim().toLowerCase(), 
      userId: authData.user.id,
      firstName: userMetadata?.firstName || "",
      lastName: userMetadata?.lastName || "",
    }),
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({ error: "Erreur inconnue" }))
    throw new Error(errorData.error || "Erreur lors de la récupération du customer")
  }

  const data = await response.json()
  return data
}

/**
 * Déconnexion
 */
export async function signOut(): Promise<void> {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw new Error(error.message || "Erreur lors de la déconnexion")
  }
}

/**
 * Récupère l'utilisateur actuellement connecté
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  const { data: { user } } = await supabase.auth.getUser()
  
  if (!user) {
    return null
  }

  return {
    id: user.id,
    email: user.email!,
    firstName: user.user_metadata?.firstName,
    lastName: user.user_metadata?.lastName,
  }
}

/**
 * Récupère le customer associé à l'utilisateur connecté
 */
export async function getCurrentCustomer(): Promise<Customer | null> {
  try {
    const response = await fetch("/api/auth/current-user")
    if (!response.ok) {
      return null
    }
    const data = await response.json()
    return data.customer || null
  } catch (error) {
    console.error("Error getting current customer:", error)
    return null
  }
}

/**
 * Réinitialisation du mot de passe
 */
export async function resetPassword(email: string): Promise<void> {
  const redirectTo = typeof window !== "undefined" 
    ? `${window.location.origin}/account?reset=true`
    : `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/account?reset=true`
  
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo,
  })

  if (error) {
    throw new Error(error.message || "Erreur lors de l'envoi de l'email de réinitialisation")
  }
}
