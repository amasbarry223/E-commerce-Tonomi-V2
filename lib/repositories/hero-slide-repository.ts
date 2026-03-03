/**
 * Repository pour les slides hero
 */

import { prisma } from "@/lib/db/prisma"
import { BaseRepository } from "./base-repository"
import type { HeroSlide, Prisma } from "@prisma/client"

export class HeroSlideRepository extends BaseRepository<
  HeroSlide,
  Prisma.HeroSlideCreateInput,
  Prisma.HeroSlideUpdateInput
> {
  protected model = prisma.heroSlide

  /**
   * Récupère tous les slides actifs, triés par ordre
   */
  async findActive(): Promise<HeroSlide[]> {
    return prisma.heroSlide.findMany({
      where: { active: true },
      orderBy: { order: "asc" },
    })
  }

  /**
   * Met à jour l'ordre des slides
   */
  async updateOrder(id: string, order: number): Promise<HeroSlide> {
    return prisma.heroSlide.update({
      where: { id },
      data: { order },
    })
  }

  /**
   * Réorganise tous les slides
   */
  async reorder(ids: string[]): Promise<void> {
    await Promise.all(
      ids.map((id, index) =>
        prisma.heroSlide.update({
          where: { id },
          data: { order: index },
        })
      )
    )
  }
}

export const heroSlideRepository = new HeroSlideRepository()
