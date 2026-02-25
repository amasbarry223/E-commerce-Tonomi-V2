/**
 * Contenu structuré des pages « Informations » du footer (À propos, Livraison, etc.).
 * Source unique pour les pages SPA et éventuel dialog.
 */

export interface InfoPageSection {
  title: string
  content: string
}

export interface InfoPageWithSections {
  title: string
  metaDescription: string
  sections: InfoPageSection[]
}

export interface FaqItem {
  question: string
  answer: string
}

export interface InfoPageFaq {
  title: string
  metaDescription: string
  items: FaqItem[]
}

export type InfoPageKey = "about" | "delivery" | "returns" | "terms" | "privacy" | "faq"

export type InfoPageContent = InfoPageWithSections | InfoPageFaq

export function isFaqPage(content: InfoPageContent): content is InfoPageFaq {
  return "items" in content && Array.isArray((content as InfoPageFaq).items)
}

const FREE_SHIPPING_THRESHOLD = 100

export const INFO_PAGES: Record<InfoPageKey, InfoPageContent> = {
  about: {
    title: "À propos de Tonomi",
    metaDescription:
      "Tonomi Accessoires, maroquinerie et accessoires de mode haut de gamme. Qualité et élégance pour des pièces durables.",
    sections: [
      {
        title: "Notre marque",
        content:
          "Tonomi Accessoires est une marque de maroquinerie et d'accessoires de mode haut de gamme. Nous sélectionnons avec soin des produits pour leur qualité et leur élégance, afin de vous proposer des pièces qui traversent les tendances.",
      },
      {
        title: "Notre engagement",
        content:
          "Notre engagement : vous proposer des pièces durables et tendance. Chaque article est choisi pour allier savoir-faire et design, dans le respect d'une fabrication soignée.",
      },
    ],
  },
  delivery: {
    title: "Livraison",
    metaDescription:
      "Livraison standard 3 à 5 jours, express 1 à 2 jours. Gratuite dès 100€. Suivi de colis par email.",
    sections: [
      {
        title: "Délais et modes",
        content:
          "Livraison standard en 3 à 5 jours ouvrés (France métropolitaine). Livraison express en 1 à 2 jours ouvrés. Les commandes passées avant 14h sont expédiées le jour même.",
      },
      {
        title: "Livraison gratuite",
        content: `Livraison gratuite dès ${FREE_SHIPPING_THRESHOLD}€ d'achat. Les frais de livraison vous sont indiqués avant validation du panier.`,
      },
      {
        title: "Suivi de commande",
        content:
          "Vous recevrez un email de confirmation avec le suivi de votre colis dès l'expédition. Vous pouvez suivre l'acheminement jusqu'à la livraison.",
      },
    ],
  },
  returns: {
    title: "Retours et échanges",
    metaDescription:
      "Retours gratuits sous 30 jours. Remboursement sous 14 jours. Échanges possibles sous réserve de disponibilité.",
    sections: [
      {
        title: "Délai et conditions",
        content:
          "Vous disposez de 30 jours à réception pour retourner un article non porté et non personnalisé. Les retours sont gratuits.",
      },
      {
        title: "Démarche",
        content:
          "Contactez-nous pour obtenir une étiquette de retour. Emballez soigneusement l'article dans son état d'origine et renvoyez-le avec l'étiquette fournie.",
      },
      {
        title: "Remboursement et échanges",
        content:
          "Le remboursement est effectué sous 14 jours après réception du colis. Les échanges sont possibles sous réserve de disponibilité du modèle ou de la taille souhaitée.",
      },
    ],
  },
  terms: {
    title: "Conditions générales de vente",
    metaDescription:
      "Conditions générales de vente Tonomi Accessoires. Prix TTC, rétractation 14 jours, droit français.",
    sections: [
      {
        title: "Champ d'application",
        content:
          "Les présentes conditions régissent les ventes de Tonomi Accessoires. En passant commande, vous acceptez ces conditions sans réserve.",
      },
      {
        title: "Prix et paiement",
        content:
          "Les prix sont indiqués en euros TTC. Le paiement est dû à la commande. Les moyens de paiement acceptés sont indiqués sur la page de validation.",
      },
      {
        title: "Droit de rétractation",
        content:
          "Conformément à la réglementation, vous disposez d'un délai de 14 jours à réception pour exercer votre droit de rétractation, sous réserve que l'article soit dans son état d'origine.",
      },
      {
        title: "Responsabilité",
        content:
          "La responsabilité de Tonomi Accessoires est limitée au montant de la commande concernée, sauf en cas de faute lourde ou de dommage direct.",
      },
      {
        title: "Droit applicable",
        content:
          "Le droit français est applicable. En cas de litige, les tribunaux français sont compétents.",
      },
    ],
  },
  privacy: {
    title: "Politique de confidentialité",
    metaDescription:
      "Vos données personnelles : finalités, durée, droits (accès, rectification, suppression). Contact : contact@tonomi.com.",
    sections: [
      {
        title: "Données collectées",
        content:
          "Nous collectons les données nécessaires à la gestion de votre compte et de vos commandes : identité, coordonnées, historique d'achats et préférences de communication.",
      },
      {
        title: "Finalités",
        content:
          "Vos données sont utilisées pour traiter vos commandes, vous contacter en cas de besoin, améliorer nos services et, avec votre accord, vous envoyer nos offres et actualités.",
      },
      {
        title: "Protection et partage",
        content:
          "Nous ne vendons pas vos données à des tiers. Elles sont protégées par des mesures techniques et organisationnelles adaptées.",
      },
      {
        title: "Vos droits",
        content:
          "Vous disposez d'un droit d'accès, de rectification, de suppression et, le cas échéant, de portabilité de vos données. Pour toute question ou exercice de vos droits : contact@tonomi.com.",
      },
    ],
  },
  faq: {
    title: "FAQ",
    metaDescription:
      "Questions fréquentes : suivi de commande, modification, paiement, livraison à l'étranger.",
    items: [
      {
        question: "Comment suivre ma commande ?",
        answer:
          "Vous recevrez un email de confirmation avec un lien de suivi dès l'expédition de votre colis. Vous pouvez suivre l'acheminement en temps réel jusqu'à la livraison.",
      },
      {
        question: "Puis-je modifier ou annuler ma commande ?",
        answer:
          "Contactez-nous au plus vite par email ou téléphone. Si la commande n'a pas encore été expédiée, nous pourrons la modifier ou l'annuler.",
      },
      {
        question: "Quels moyens de paiement sont acceptés ?",
        answer:
          "Nous acceptons les cartes bancaires (paiement sécurisé) et le paiement en plusieurs fois sans frais pour les commandes éligibles.",
      },
      {
        question: "Livrez-vous à l'étranger ?",
        answer:
          "Nous livrons en France métropolitaine. Pour les autres zones (DOM-TOM, international), contactez-nous ; nous pourrons étudier votre demande.",
      },
      {
        question: "Comment effectuer un retour ?",
        answer:
          "Sous 30 jours après réception, contactez-nous pour obtenir une étiquette de retour gratuite. Le remboursement est effectué sous 14 jours après réception du colis.",
      },
      {
        question: "Les prix incluent-ils la TVA ?",
        answer:
          "Oui, tous les prix affichés sur le site sont en euros TTC (toutes taxes comprises).",
      },
    ],
  },
}
