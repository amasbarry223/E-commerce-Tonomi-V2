"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { toast } from "sonner"

/**
 * Schéma de validation Zod pour le formulaire de checkout
 * Conforme aux standards français (code postal, téléphone)
 */
const checkoutSchema = z.object({
  firstName: z
    .string()
    .min(2, "Le prénom doit contenir au moins 2 caractères")
    .max(50, "Le prénom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le prénom ne peut contenir que des lettres"),
  
  lastName: z
    .string()
    .min(2, "Le nom doit contenir au moins 2 caractères")
    .max(50, "Le nom ne peut pas dépasser 50 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "Le nom ne peut contenir que des lettres"),
  
  email: z
    .string()
    .min(1, "L'email est requis")
    .email("Format d'email invalide"),
  
  phone: z
    .string()
    .min(1, "Le numéro de téléphone est requis")
    .regex(
      /^(?:(?:\+|00)33|0)\s*[1-9](?:[\s.-]*\d{2}){4}$/,
      "Format de téléphone invalide (ex: +33 6 12 34 56 78 ou 06 12 34 56 78)"
    ),
  
  address: z
    .string()
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(200, "L'adresse ne peut pas dépasser 200 caractères"),
  
  city: z
    .string()
    .min(2, "La ville doit contenir au moins 2 caractères")
    .max(100, "La ville ne peut pas dépasser 100 caractères")
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, "La ville ne peut contenir que des lettres"),
  
  zip: z
    .string()
    .min(5, "Le code postal doit contenir 5 chiffres")
    .max(5, "Le code postal doit contenir 5 chiffres")
    .regex(/^\d{5}$/, "Le code postal doit contenir exactement 5 chiffres"),
  
  country: z
    .string()
    .min(2, "Le pays est requis")
    .default("France"),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>

interface UseCheckoutFormOptions {
  onSubmit?: (data: CheckoutFormData) => Promise<void> | void
  onError?: (error: Error) => void
}

/**
 * Hook personnalisé pour gérer le formulaire de checkout avec validation
 * Utilise React Hook Form + Zod pour une validation robuste
 */
export function useCheckoutForm(options: UseCheckoutFormOptions = {}) {
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm<CheckoutFormData>({
    resolver: zodResolver(checkoutSchema),
    mode: "onBlur", // Validation au blur pour meilleure UX
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      zip: "",
      country: "France",
    },
    criteriaMode: "all", // Afficher toutes les erreurs, pas seulement la première
  })

  const handleSubmit = async (data: CheckoutFormData) => {
    setIsSubmitting(true)
    
    try {
      if (options.onSubmit) {
        await options.onSubmit(data)
      } else {
        // Comportement par défaut : simuler un délai
        await new Promise((resolve) => setTimeout(resolve, 1000))
        toast.success("Formulaire validé avec succès !")
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Une erreur s'est produite"
      toast.error("Erreur lors de la validation", {
        description: errorMessage,
        duration: 5000,
      })
      
      // Appeler le callback d'erreur si fourni
      if (options.onError) {
        options.onError(error instanceof Error ? error : new Error(errorMessage))
      }
      
      // Ne pas re-throw l'erreur pour éviter de bloquer l'UI
      console.error("Erreur lors de la soumission du formulaire:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return {
    form,
    handleSubmit: form.handleSubmit(handleSubmit),
    isSubmitting,
    errors: form.formState.errors,
    isValid: form.formState.isValid,
    isDirty: form.formState.isDirty,
    reset: form.reset,
    trigger: form.trigger, // Exposer trigger pour validation manuelle
  }
}

