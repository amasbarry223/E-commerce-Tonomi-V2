/**
 * Schémas de validation Zod
 */
import { z } from 'zod'

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

