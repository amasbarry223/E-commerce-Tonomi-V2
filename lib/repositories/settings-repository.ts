/**
 * Repository pour les paramètres (Settings)
 */

import { prisma } from "@/lib/db/prisma"
import { BaseRepository } from "./base-repository"
import type { Settings, Prisma } from "@prisma/client"

export class SettingsRepository extends BaseRepository<
  Settings,
  Prisma.SettingsCreateInput,
  Prisma.SettingsUpdateInput
> {
  protected model = prisma.settings

  /**
   * Récupère un paramètre par clé
   */
  async findByKey(key: string): Promise<Settings | null> {
    return prisma.settings.findUnique({
      where: { key },
    })
  }

  /**
   * Récupère plusieurs paramètres par clés
   */
  async findByKeys(keys: string[]): Promise<Settings[]> {
    return prisma.settings.findMany({
      where: { key: { in: keys } },
    })
  }

  /**
   * Crée ou met à jour un paramètre (upsert)
   */
  async upsert(key: string, value: string, type: string = "string", description?: string): Promise<Settings> {
    return prisma.settings.upsert({
      where: { key },
      update: { value, type, description },
      create: { key, value, type, description },
    })
  }

  /**
   * Récupère tous les paramètres
   */
  async findAll(): Promise<Settings[]> {
    return prisma.settings.findMany({
      orderBy: { key: "asc" },
    })
  }
}

export const settingsRepository = new SettingsRepository()
