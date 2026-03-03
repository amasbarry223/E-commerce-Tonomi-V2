/**
 * Service Supabase Storage pour la gestion des images
 * Toutes les images sont stockées dans Supabase Storage
 */

import { supabase } from "./client"

const BUCKET_NAME = "tonomi-images"

/**
 * Upload une image vers Supabase Storage
 */
export async function uploadImage(file: File, path: string): Promise<string> {
  const { data, error } = await supabase.storage.from(BUCKET_NAME).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  })

  if (error) {
    throw new Error(`Failed to upload image: ${error.message}`)
  }

  return getPublicUrl(data.path)
}

/**
 * Récupère l'URL publique d'une image
 */
export function getPublicUrl(path: string): string {
  const { data } = supabase.storage.from(BUCKET_NAME).getPublicUrl(path)
  return data.publicUrl
}

/**
 * Supprime une image de Supabase Storage
 */
export async function deleteImage(path: string): Promise<void> {
  const { error } = await supabase.storage.from(BUCKET_NAME).remove([path])

  if (error) {
    throw new Error(`Failed to delete image: ${error.message}`)
  }
}

/**
 * Génère un chemin unique pour une image
 */
export function generateImagePath(folder: string, filename: string): string {
  const timestamp = Date.now()
  const sanitizedFilename = filename.replace(/[^a-zA-Z0-9.-]/g, "_")
  return `${folder}/${timestamp}-${sanitizedFilename}`
}

/**
 * Chemins standards pour les différents types d'images
 */
export const IMAGE_PATHS = {
  products: "products",
  categories: "categories",
  hero: "hero",
  customers: "customers",
  logos: "logos",
} as const
