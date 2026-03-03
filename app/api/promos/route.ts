/**
 * API Route pour les codes promo
 */

import { NextResponse } from "next/server"
import { getAllPromoCodes, createPromoCode, deletePromoCode } from "@/lib/services/promos"

export async function GET() {
  try {
    const promos = await getAllPromoCodes()
    return NextResponse.json(promos)
  } catch (error) {
    console.error("Error fetching promo codes:", error)
    return NextResponse.json(
      { error: "Failed to fetch promo codes" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const promo = await createPromoCode(body)
    return NextResponse.json(promo, { status: 201 })
  } catch (error) {
    console.error("Error creating promo code:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create promo code" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Promo ID is required" }, { status: 400 })
    }
    await deletePromoCode(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting promo code:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete promo code" },
      { status: 500 }
    )
  }
}

