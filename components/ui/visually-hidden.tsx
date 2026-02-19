"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

/**
 * Composant pour masquer visuellement du contenu tout en le gardant accessible aux lecteurs d'écran
 * Conforme aux standards d'accessibilité WCAG
 */
export function VisuallyHidden({
  className,
  ...props
}: React.ComponentProps<"span">) {
  return (
    <span
      className={cn(
        "sr-only",
        className
      )}
      {...props}
    />
  )
}

