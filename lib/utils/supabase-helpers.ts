/**
 * Helpers pour Supabase
 * Fonctions utilitaires pour travailler avec Supabase
 */

import { supabase } from "@/lib/supabase/client"

/**
 * Vérifie si une URL est une URL Supabase Storage
 */
export function isSupabaseUrl(url: string): boolean {
  return url.includes("supabase.co") || url.startsWith("/storage/")
}

/**
 * Récupère l'URL complète d'une image Supabase
 * Si l'URL est déjà complète, la retourne telle quelle
 */
export function getImageUrl(imagePath: string | null | undefined): string {
  if (!imagePath) {
    return "/placeholder.svg"
  }

  // Si c'est déjà une URL complète, la retourner
  if (imagePath.startsWith("http://") || imagePath.startsWith("https://")) {
    return imagePath
  }

  // Si c'est un chemin Supabase Storage, construire l'URL
  if (imagePath.startsWith("/storage/")) {
    const { data } = supabase.storage.from("tonomi-images").getPublicUrl(imagePath.replace("/storage/", ""))
    return data.publicUrl
  }

  // Sinon, traiter comme un chemin relatif
  return imagePath
}

/**
 * Récupère les URLs de plusieurs images
 */
export function getImageUrls(imagePaths: (string | null | undefined)[]): string[] {
  return imagePaths.map(getImageUrl).filter((url) => url !== "/placeholder.svg")
}

/**
 * Extrait le chemin du bucket depuis une URL Supabase Storage
 */
export function extractStoragePath(url: string): string | null {
  try {
    const urlObj = new URL(url)
    // Format: https://xxx.supabase.co/storage/v1/object/public/tonomi-images/path/to/image.jpg
    const match = urlObj.pathname.match(/\/storage\/v1\/object\/public\/tonomi-images\/(.+)/)
    return match ? match[1] : null
  } catch {
    return null
  }
}
