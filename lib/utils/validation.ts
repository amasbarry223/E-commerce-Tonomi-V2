/**
 * Schémas de validation Zod
 */
import { z } from 'zod'

/** Schéma réutilisable pour un champ email (newsletter, checkout, login, etc.) */
export const emailFieldSchema = z.string().min(1, "L'email est requis").email("Format d'email invalide")

export const productSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
  price: z.number().positive('Le prix doit être positif'),
  description: z.string().min(10, 'La description doit contenir au moins 10 caractères'),
  stock: z.number().int().min(0, 'Le stock ne peut pas être négatif'),
  category: z.string().min(1, 'La catégorie est requise'),
  sku: z.string().min(1, 'Le SKU est requis'),
})

export const orderSchema = z.object({
  customerId: z.string().min(1, 'Le client est requis'),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().int().positive(),
    price: z.number().positive(),
  })).min(1, 'Au moins un article est requis'),
  shippingAddress: z.object({
    street: z.string().min(1),
    city: z.string().min(1),
    zipCode: z.string().min(1),
    country: z.string().min(1),
  }),
})

export const promoCodeSchema = z.object({
  code: z.string().min(1).max(20).toUpperCase(),
  type: z.enum(['percentage', 'fixed']),
  value: z.number().positive(),
  minAmount: z.number().positive().optional(),
  maxUses: z.number().int().positive(),
  startDate: z.string(),
  endDate: z.string(),
})

/**
 * Schéma de validation pour les catégories
 */
export const categorySchema = z.object({
  name: z
    .string()
    .min(1, 'Le nom est requis')
    .max(100, 'Le nom ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ0-9\s'-]+$/, 'Le nom contient des caractères invalides'),
  
  slug: z
    .string()
    .min(1, 'Le slug est requis')
    .max(100, 'Le slug ne peut pas dépasser 100 caractères')
    .regex(/^[a-z0-9-]+$/, 'Le slug doit contenir uniquement des lettres minuscules, chiffres et tirets'),
  
  description: z
    .string()
    .max(1000, 'La description ne peut pas dépasser 1000 caractères')
    .optional(),
  
  image: z
    .string()
    .url('L\'URL de l\'image doit être valide')
    .min(1, 'L\'URL de l\'image est requise'),
  
  metaTitle: z
    .string()
    .max(60, 'Le meta title ne peut pas dépasser 60 caractères')
    .optional(),
  
  metaDescription: z
    .string()
    .max(160, 'La meta description ne peut pas dépasser 160 caractères')
    .optional(),
  
  parentId: z
    .string()
    .optional(),
})

/**
 * Schéma de validation pour le formulaire de checkout
 */
export const checkoutSchema = z.object({
  firstName: z
    .string()
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .max(50, 'Le prénom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le prénom ne peut contenir que des lettres'),
  lastName: z
    .string()
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .max(50, 'Le nom ne peut pas dépasser 50 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom ne peut contenir que des lettres'),
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  phone: z
    .string()
    .min(1, 'Le numéro de téléphone est requis')
    .regex(
      /^[+]?[\d\s.-]+$/,
      'Format invalide. Utilisez uniquement des chiffres, espaces, tirets ou points (ex: +223 77 77 30 34, 77773034, +33 6 12 34 56 78)'
    )
    .refine(
      (val) => {
        const digits = val.replace(/\D/g, '');
        return digits.length >= 7 && digits.length <= 15;
      },
      'Le numéro doit contenir entre 7 et 15 chiffres'
    ),
  address: z
    .string()
    .min(5, "L'adresse doit contenir au moins 5 caractères")
    .max(200, "L'adresse ne peut pas dépasser 200 caractères"),
  city: z
    .string()
    .min(2, 'La ville doit contenir au moins 2 caractères')
    .max(100, 'La ville ne peut pas dépasser 100 caractères')
    .regex(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'La ville ne peut contenir que des lettres'),
  zip: z
    .string()
    .min(5, 'Le code postal doit contenir 5 chiffres')
    .max(5, 'Le code postal doit contenir 5 chiffres')
    .regex(/^\d{5}$/, 'Le code postal doit contenir exactement 5 chiffres'),
  country: z.string().min(2, 'Le pays est requis').default('France'),
})

export type CheckoutFormData = z.infer<typeof checkoutSchema>

/**
 * Schéma de validation pour l'étape paiement (carte) — frontend uniquement
 */
export const paymentCardSchema = z.object({
  card: z
    .string()
    .min(1, 'Le numéro de carte est requis')
    .regex(/^[\d\s]+$/, 'Uniquement chiffres et espaces')
    .transform((s) => s.replace(/\s/g, ''))
    .refine((s) => s.length >= 13 && s.length <= 19, 'Numéro de carte invalide'),
  exp: z
    .string()
    .min(1, "La date d'expiration est requise")
    .transform((s) => s.trim().replace(/-/g, '/'))
    .refine(
      (s) => /^(0[1-9]|1[0-2])\/\d{2}$/.test(s) || /^(0[1-9]|1[0-2])\d{2}$/.test(s),
      "Format MM/AA attendu (ex: 12/28)"
    )
    .transform((s) => (/^\d{4}$/.test(s) ? `${s.slice(0, 2)}/${s.slice(2)}` : s)),
  cvc: z
    .string()
    .min(1, 'Le CVC est requis')
    .regex(/^\d{3,4}$/, 'CVC : 3 ou 4 chiffres'),
})

export type PaymentCardData = z.infer<typeof paymentCardSchema>

/**
 * Schéma de validation pour le login admin
 */
export const loginSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

/** Schéma pour l'inscription (demande de compte) */
export const registerSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
})

/** Schéma pour l'inscription client (boutique, optionnelle) */
export const clientRegisterSchema = z.object({
  firstName: z.string().min(1, 'Le prénom est requis').max(100, 'Le prénom est trop long'),
  lastName: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
  phone: z.string().max(20).optional(),
})

/** Schéma pour la connexion client (boutique) */
export const clientLoginSchema = z.object({
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  password: z.string().min(1, 'Le mot de passe est requis'),
})

/** Schéma pour la réinitialisation du mot de passe */
export const resetPasswordSchema = z
  .object({
    password: z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'),
    confirmPassword: z.string().min(1, 'Veuillez confirmer le mot de passe'),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Les mots de passe ne correspondent pas',
    path: ['confirmPassword'],
  })

/**
 * Schéma de validation pour les utilisateurs admin (création / édition)
 */
export const userSchema = z.object({
  name: z.string().min(1, 'Le nom est requis').max(100, 'Le nom est trop long'),
  email: z.string().min(1, "L'email est requis").email("Format d'email invalide"),
  password: z.union([z.string().min(6, 'Le mot de passe doit contenir au moins 6 caractères'), z.literal('')]).optional(),
  role: z.enum(['admin', 'super-admin']),
})

/**
 * Schéma pour l'input code promo (côté client, avant lookup)
 */
export const promoCodeInputSchema = z.string().min(1, 'Code requis').max(20, 'Code trop long').transform((s) => s.trim().toUpperCase())

/**
 * Schéma de validation pour les slides hero (bannière accueil)
 */
export const heroSlideSchema = z.object({
  image: z
    .string()
    .min(1, "L'image est requise")
    .refine(
      (s) => s.startsWith("data:image/") || z.string().url().safeParse(s).success,
      "Image invalide (téléversez une image ou fournissez une URL valide)"
    ),
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .max(80, 'Le titre ne peut pas dépasser 80 caractères'),
  subtitle: z
    .string()
    .min(1, 'Le sous-titre est requis')
    .max(160, 'Le sous-titre ne peut pas dépasser 160 caractères'),
  ctaText: z
    .string()
    .min(1, 'Le libellé du bouton est requis')
    .max(40, 'Le libellé ne peut pas dépasser 40 caractères'),
  ctaLink: z
    .union([z.string().url("Le lien CTA doit être une URL valide"), z.literal("")])
    .optional(),
  order: z.number().int().min(0, "L'ordre doit être positif ou nul"),
  active: z.boolean(),
})

/**
 * Schéma de validation pour le formulaire d'avis visiteur (fiche produit)
 */
export const reviewSchema = z.object({
  customerName: z
    .string()
    .min(1, 'Le nom est requis')
    .max(80, 'Le nom ne peut pas dépasser 80 caractères'),
  rating: z
    .number()
    .int('La note doit être un nombre entier')
    .min(1, 'La note doit être entre 1 et 5')
    .max(5, 'La note doit être entre 1 et 5'),
  title: z
    .string()
    .min(1, 'Le titre est requis')
    .max(120, 'Le titre ne peut pas dépasser 120 caractères'),
  comment: z
    .string()
    .min(10, 'Le commentaire doit contenir au moins 10 caractères')
    .max(2000, 'Le commentaire ne peut pas dépasser 2000 caractères'),
})

export type ReviewFormData = z.infer<typeof reviewSchema>

/**
 * Retourne un message utilisateur à partir d'une ZodError (Zod 3 : .issues).
 */
export function getZodErrorMessage(error: z.ZodError, fallback = 'Vérifiez les champs.'): string {
  const msg = error.issues.map((i) => i.message).filter(Boolean).join('. ')
  return msg || fallback
}
