/**
 * Repository pour les logs
 */

import { prisma } from "@/lib/db/prisma"
import { BaseRepository } from "./base-repository"
import type { Log, Prisma } from "@prisma/client"

export class LogRepository extends BaseRepository<
  Log,
  Prisma.LogCreateInput,
  Prisma.LogUpdateInput
> {
  protected model = prisma.log

  /**
   * Récupère tous les logs avec options de filtrage
   */
  async findAll(options?: {
    where?: Prisma.LogWhereInput
    skip?: number
    take?: number
    orderBy?: Prisma.LogOrderByWithRelationInput
  }): Promise<Log[]> {
    return prisma.log.findMany({
      ...options,
    })
  }

  /**
   * Récupère les logs récents
   */
  async findRecent(limit: number = 50): Promise<Log[]> {
    return prisma.log.findMany({
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  }

  /**
   * Récupère les logs par type d'action
   */
  async findByAction(action: string, limit?: number): Promise<Log[]> {
    return prisma.log.findMany({
      where: { action },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  }

  /**
   * Récupère les logs par type d'entité
   */
  async findByEntityType(entityType: string, limit?: number): Promise<Log[]> {
    return prisma.log.findMany({
      where: { entityType },
      orderBy: { createdAt: "desc" },
      take: limit,
    })
  }
}

export const logRepository = new LogRepository()
