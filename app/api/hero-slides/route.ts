/**
 * API Route pour les hero slides
 * Utilisé par les composants client pour accéder aux données
 */

import { NextResponse } from "next/server"
import { getHeroSlides } from "@/lib/services/hero-slides"

export async function GET() {
  try {
    const slides = await getHeroSlides()
    return NextResponse.json(slides)
  } catch (error) {
    console.error("Error fetching hero slides:", error)
    return NextResponse.json(
      { error: "Failed to fetch hero slides" },
      { status: 500 }
    )
  }
}
