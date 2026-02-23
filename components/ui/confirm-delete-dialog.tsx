"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

export interface ConfirmDeleteDialogProps {
  /** Contrôle l'ouverture du dialog */
  open: boolean
  /** Callback lors du changement d'état open/fermé */
  onOpenChange: (open: boolean) => void
  /** Titre du dialog (ex: "Supprimer le produit") */
  title: string
  /** Description / avertissement affiché sous le titre */
  description: string
  /** Callback appelé au clic sur le bouton de confirmation (peut être async) */
  onConfirm: () => void | Promise<void>
  /** Affiche un état de chargement sur les boutons */
  loading?: boolean
  /** Libellé du bouton de confirmation (défaut: "Supprimer") */
  confirmLabel?: string
  /** Libellé du bouton d'annulation (défaut: "Annuler") */
  cancelLabel?: string
}

/**
 * Dialog de confirmation de suppression (réutilisable admin et store).
 * Affiche un titre, une description et deux boutons (annuler / confirmer).
 */
export function ConfirmDeleteDialog({
  open,
  onOpenChange,
  title,
  description,
  onConfirm,
  loading = false,
  confirmLabel = "Supprimer",
  cancelLabel = "Annuler",
}: ConfirmDeleteDialogProps) {
  const handleConfirm = async () => {
    await Promise.resolve(onConfirm())
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-sm p-4 sm:p-5">
        <DialogHeader className="space-y-1.5 pb-2">
          <DialogTitle className="text-base">{title}</DialogTitle>
          <p className="text-xs text-muted-foreground leading-snug">{description}</p>
        </DialogHeader>
        <div className="flex justify-end gap-2 pt-1">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            size="sm"
            disabled={loading}
          >
            {cancelLabel}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            size="sm"
            loading={loading}
          >
            {confirmLabel}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
