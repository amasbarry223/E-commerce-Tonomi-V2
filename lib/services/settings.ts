/**
 * Service pour les paramètres (Settings)
 */

import { settingsRepository } from "@/lib/repositories"

export interface SettingsMap {
  [key: string]: string | number | boolean | object
}

/**
 * Récupère un paramètre par clé
 */
export async function getSetting(key: string): Promise<string | number | boolean | object | null> {
  const setting = await settingsRepository.findByKey(key)
  if (!setting) return null
  return parseSettingValue(setting.value, setting.type)
}

/**
 * Récupère plusieurs paramètres par clés
 */
export async function getSettings(keys: string[]): Promise<SettingsMap> {
  const settings = await settingsRepository.findByKeys(keys)
  const result: SettingsMap = {}
  settings.forEach(setting => {
    result[setting.key] = parseSettingValue(setting.value, setting.type)
  })
  return result
}

/**
 * Récupère tous les paramètres
 */
export async function getAllSettings(): Promise<SettingsMap> {
  const settings = await settingsRepository.findAll()
  const result: SettingsMap = {}
  settings.forEach(setting => {
    result[setting.key] = parseSettingValue(setting.value, setting.type)
  })
  return result
}

/**
 * Crée ou met à jour un paramètre
 */
export async function setSetting(
  key: string,
  value: string | number | boolean | object,
  description?: string
): Promise<void> {
  const type = getValueType(value)
  const stringValue = stringifySettingValue(value)
  await settingsRepository.upsert(key, stringValue, type, description)
}

/**
 * Crée ou met à jour plusieurs paramètres
 */
export async function setSettings(settings: { key: string; value: string | number | boolean | object; description?: string }[]): Promise<void> {
  await Promise.all(
    settings.map(s => setSetting(s.key, s.value, s.description))
  )
}

/**
 * Parse une valeur selon son type
 */
function parseSettingValue(value: string, type: string): string | number | boolean | object {
  switch (type) {
    case "number":
      return Number(value)
    case "boolean":
      return value === "true"
    case "json":
      try {
        return JSON.parse(value)
      } catch {
        return value
      }
    default:
      return value
  }
}

/**
 * Convertit une valeur en string pour stockage
 */
function stringifySettingValue(value: string | number | boolean | object): string {
  if (typeof value === "object") {
    return JSON.stringify(value)
  }
  return String(value)
}

/**
 * Détermine le type d'une valeur
 */
function getValueType(value: string | number | boolean | object): string {
  if (typeof value === "number") return "number"
  if (typeof value === "boolean") return "boolean"
  if (typeof value === "object") return "json"
  return "string"
}
