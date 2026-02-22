"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { logger } from "@/lib/utils/logger"
import { checkoutSchema, type CheckoutFormData } from "@/src/lib/utils/validation"

export type { CheckoutFormData }

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
      logger.logError(error instanceof Error ? error : new Error(String(error)), "useCheckoutForm", {
        formData: data,
      })
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

