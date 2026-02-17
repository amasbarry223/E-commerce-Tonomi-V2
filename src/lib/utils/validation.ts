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

