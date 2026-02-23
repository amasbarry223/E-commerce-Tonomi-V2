"use client"

import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

export interface FullScreenLoadingProps {
  /** Message optionnel sous le spinner (ex. "Chargement...", "Redirection...") */
  message?: string
  /** Accessible label pour les lecteurs d'écran */
  ariaLabel?: string
  /** Variante visuelle : default (fond neutre), gradient (page login) */
  variant?: "default" | "gradient"
  className?: string
}

const variantClasses = {
  default: "bg-background",
  gradient:
    "bg-gradient-to-br from-[oklch(0.98_0.008_85)] via-[oklch(0.99_0.004_90)] to-[oklch(0.97_0.012_75)]",
}

/**
 * Écran de chargement plein écran centré (spinner + message optionnel).
 * Réutilisable pour redirections, guards auth, pages de transition.
 */
export function FullScreenLoading({
  message,
  ariaLabel = "Chargement",
  variant = "default",
  className,
}: FullScreenLoadingProps) {
  return (
    <div
      className={cn(
        "min-h-screen flex items-center justify-center",
        variantClasses[variant],
        className
      )}
      role="status"
      aria-label={ariaLabel}
    >
      <div className="flex flex-col items-center gap-3 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
        {message && <span className="text-sm">{message}</span>}
      </div>
    </div>
  )
}
