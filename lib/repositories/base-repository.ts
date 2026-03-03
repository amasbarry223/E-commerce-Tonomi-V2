/**
 * Repository de base avec méthodes communes
 * Pattern Repository pour séparer la logique d'accès aux données
 */

import { prisma } from "@/lib/db/prisma"
import type { Prisma } from "@prisma/client"

export abstract class BaseRepository<T, CreateInput, UpdateInput> {
  protected abstract model: any

  /**
   * Trouve un élément par ID
   */
  async findById(id: string): Promise<T | null> {
    return this.model.findUnique({ where: { id } })
  }

  /**
   * Trouve plusieurs éléments avec filtres
   */
  async findMany(where?: any, options?: { skip?: number; take?: number; orderBy?: any }): Promise<T[]> {
    return this.model.findMany({
      where,
      ...options,
    })
  }

  /**
   * Crée un nouvel élément
   */
  async create(data: CreateInput): Promise<T> {
    return this.model.create({ data })
  }

  /**
   * Met à jour un élément
   */
  async update(id: string, data: UpdateInput): Promise<T> {
    return this.model.update({
      where: { id },
      data,
    })
  }

  /**
   * Supprime un élément
   */
  async delete(id: string): Promise<T> {
    return this.model.delete({ where: { id } })
  }

  /**
   * Compte les éléments
   */
  async count(where?: any): Promise<number> {
    return this.model.count({ where })
  }
}
