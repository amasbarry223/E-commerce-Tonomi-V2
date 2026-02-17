/**
 * Configuration du site
 */

export const siteConfig = {
  name: 'LUXE',
  description: 'Maroquinerie & Accessoires de Mode',
  currency: 'EUR',
  locale: 'fr-FR',
  
  shipping: {
    freeThreshold: 100,
    standard: 5.99,
    express: 9.99,
  },

  contact: {
    email: 'contact@luxe-paris.fr',
    phone: '+33 1 42 68 53 00',
    address: '12 Rue du Faubourg, 75008 Paris',
  },

  pagination: {
    defaultPageSize: 12,
    pageSizeOptions: [12, 24, 48, 96],
  },
} as const

