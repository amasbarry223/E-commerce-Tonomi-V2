/**
 * Utilitaires de formatage
 */

export const format = {
  /**
   * Formate un prix en euros
   */
  price: (amount: number): string => {
    return new Intl.NumberFormat('fr-FR', { 
      style: 'currency', 
      currency: 'EUR' 
    }).format(amount)
  },

  /**
   * Formate une date en format long
   */
  date: (dateStr: string): string => {
    return new Intl.DateTimeFormat('fr-FR', { 
      day: 'numeric', 
      month: 'long', 
      year: 'numeric' 
    }).format(new Date(dateStr))
  },

  /**
   * Formate une date en format court
   */
  dateShort: (dateStr: string): string => {
    return new Intl.DateTimeFormat('fr-FR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }).format(new Date(dateStr))
  },
}

// Exports nommés pour compatibilité
export const formatPrice = format.price
export const formatDate = format.date
export const formatDateShort = format.dateShort

