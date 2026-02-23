/**
 * Module partagé pour ajouter des logs sans créer d'imports circulaires.
 * Les callers (auth-store, users-store, etc.) passent les infos explicites.
 */
import type { LogAction } from "./logs-store"
import { useLogsStore } from "./logs-store"

export interface AddLogPayload {
  action: LogAction
  userId: string
  userEmail: string
  description: string
  details?: Record<string, unknown>
}

export function addLog(payload: AddLogPayload): void {
  try {
    useLogsStore.getState().addLog(payload)
  } catch {
    // Ignorer si le store n'est pas disponible
  }
}
