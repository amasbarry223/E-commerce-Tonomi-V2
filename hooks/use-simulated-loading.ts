import { useState, useEffect } from "react"

/**
 * Hook pour simuler un délai de chargement (pattern répété dans les pages admin).
 * Initialise loading à true, puis le passe à false après le délai.
 *
 * @param delayMs - Délai en millisecondes avant de mettre loading à false
 * @returns [loading, setLoading] pour permettre de forcer l'état si besoin
 *
 * @example
 * const [loading, setLoading] = useSimulatedLoading(AUTH_DELAYS_MS.ADMIN_LOADING)
 * const [loading, setLoading] = useSimulatedLoading(400)
 */
export function useSimulatedLoading(delayMs: number): [boolean, (value: boolean) => void] {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const t = setTimeout(() => setLoading(false), delayMs)
    return () => clearTimeout(t)
  }, [delayMs])

  return [loading, setLoading]
}
