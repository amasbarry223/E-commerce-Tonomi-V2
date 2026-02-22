"use client"

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const LEGAL_CONTENT: Record<string, { title: string; content: string }> = {
  "À propos": {
    title: "À propos de Tonomi",
    content: "Tonomi Accessoires est une marque de maroquinerie et d'accessoires de mode haut de gamme. Nous sélectionnons avec soin des produits pour leur qualité et leur élégance. Notre engagement : vous proposer des pièces durables et tendance.",
  },
  "Livraison": {
    title: "Livraison",
    content: "Livraison standard en 3 à 5 jours ouvrés (France métropolitaine). Livraison express en 1 à 2 jours ouvrés. Les commandes passées avant 14h sont expédiées le jour même. Livraison gratuite dès 100€ d'achat. Vous recevrez un email de confirmation avec le suivi de votre colis.",
  },
  "Retours & Échanges": {
    title: "Retours et échanges",
    content: "Vous disposez de 30 jours à réception pour retourner un article non porté et non personnalisé. Les retours sont gratuits. Contactez-nous pour obtenir une étiquette de retour. Le remboursement est effectué sous 14 jours après réception du colis. Les échanges sont possibles sous réserve de disponibilité.",
  },
  "Conditions Générales": {
    title: "Conditions générales de vente",
    content: "Les présentes conditions régissent les ventes de Tonomi Accessoires. En passant commande, vous acceptez ces conditions. Prix en euros TTC. Droit de rétractation : 14 jours. Responsabilité limitée aux montants des commandes. Droit applicable : droit français.",
  },
  "Politique de Confidentialité": {
    title: "Politique de confidentialité",
    content: "Vos données personnelles sont utilisées pour traiter vos commandes, vous contacter et améliorer nos services. Nous ne les vendons pas à des tiers. Vous disposez d'un droit d'accès, de rectification et de suppression. Pour toute question : contact@tonomi.com.",
  },
  FAQ: {
    title: "FAQ",
    content: "Comment suivre ma commande ? Vous recevrez un email avec un lien de suivi. Puis-je modifier ma commande ? Contactez-nous au plus vite. Quels moyens de paiement ? Carte bancaire, paiement sécurisé. Livraison à l'étranger ? Nous livrons en France métropolitaine ; d'autres zones sur demande.",
  },
}

interface LegalInfoDialogProps {
  open: boolean
  page: string | null
  onOpenChange: (open: boolean) => void
}

export function LegalInfoDialog({ open, page, onOpenChange }: LegalInfoDialogProps) {
  const config = page ? LEGAL_CONTENT[page] : null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{config?.title ?? "Informations"}</DialogTitle>
        </DialogHeader>
        {config && (
          <div className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {config.content}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
