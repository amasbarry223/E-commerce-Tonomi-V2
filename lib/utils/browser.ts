/**
 * Utilitaires pour abstraire les APIs du navigateur
 * Permet une meilleure testabilité en évitant les dépendances directes à window/document
 */

/**
 * Vérifie si on est dans un environnement navigateur
 * 
 * @returns true si window est disponible
 */
export function isBrowser(): boolean {
  return typeof window !== "undefined"
}

/**
 * Obtient une propriété de window de manière sécurisée
 * 
 * @param key - Clé de la propriété
 * @returns La valeur ou undefined si non disponible
 * 
 * @example
 * ```ts
 * const width = getWindowProperty("innerWidth") ?? 0
 * ```
 */
export function getWindowProperty<K extends keyof Window>(
  key: K
): Window[K] | undefined {
  if (!isBrowser()) return undefined
  return window[key]
}

/**
 * Obtient un élément par son ID de manière sécurisée
 * 
 * @param id - ID de l'élément
 * @returns L'élément ou null
 * 
 * @example
 * ```ts
 * const element = getElementById("my-id")
 * ```
 */
export function getElementById(id: string): HTMLElement | null {
  if (!isBrowser()) return null
  return document.getElementById(id)
}

/**
 * Obtient un élément via querySelector de manière sécurisée
 * 
 * @param selector - Sélecteur CSS
 * @returns L'élément ou null
 * 
 * @example
 * ```ts
 * const element = querySelector("[data-product-image]")
 * ```
 */
export function querySelector(selector: string): HTMLElement | null {
  if (!isBrowser()) return null
  return document.querySelector(selector) as HTMLElement | null
}

/**
 * Obtient tous les éléments correspondant à un sélecteur de manière sécurisée
 * 
 * @param selector - Sélecteur CSS
 * @returns NodeList des éléments
 * 
 * @example
 * ```ts
 * const elements = querySelectorAll(".product-card")
 * ```
 */
export function querySelectorAll(selector: string): NodeListOf<HTMLElement> {
  if (!isBrowser()) return document.createDocumentFragment().querySelectorAll(selector) as NodeListOf<HTMLElement>
  return document.querySelectorAll(selector) as NodeListOf<HTMLElement>
}

/**
 * Navigue vers une URL de manière sécurisée
 * 
 * @param url - URL vers laquelle naviguer
 * 
 * @example
 * ```ts
 * navigateTo("/home")
 * ```
 */
export function navigateTo(url: string): void {
  if (!isBrowser()) return
  window.location.href = url
}

/**
 * Recharge la page de manière sécurisée
 * 
 * @example
 * ```ts
 * reloadPage()
 * ```
 */
export function reloadPage(): void {
  if (!isBrowser()) return
  window.location.reload()
}

