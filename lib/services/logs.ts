/**
 * Service pour les logs
 */

import { logRepository } from "@/lib/repositories"
import type { Log } from "@prisma/client"

/**
 * Récupère tous les logs
 */
export async function getLogs(options?: {
  skip?: number
  take?: number
  action?: string
  entityType?: string
}): Promise<Log[]> {
  const where: any = {}
  if (options?.action) {
    where.action = options.action
  }
  if (options?.entityType) {
    where.entityType = options.entityType
  }

  return logRepository.findAll({
    where,
    orderBy: { createdAt: "desc" },
    skip: options?.skip,
    take: options?.take,
  })
}

/**
 * Récupère les logs récents
 */
export async function getRecentLogs(limit: number = 50): Promise<Log[]> {
  return logRepository.findRecent(limit)
}

/**
 * Crée un nouveau log
 */
export async function createLog(data: {
  action: string
  entityType: string
  entityId?: string
  description: string
  userId?: string
  metadata?: Record<string, any>
}): Promise<Log> {
  return logRepository.create({
    action: data.action,
    entityType: data.entityType,
    entityId: data.entityId,
    description: data.description,
    userId: data.userId,
    metadata: data.metadata ? JSON.stringify(data.metadata) : null,
  })
}
