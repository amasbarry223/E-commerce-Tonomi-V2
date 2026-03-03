/**
 * API Route pour les clients
 */

import { NextResponse } from "next/server"
import { getCustomers } from "@/lib/services/customers"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const skip = searchParams.get("skip")
    const take = searchParams.get("take")

    const customers = await getCustomers({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    })
    return NextResponse.json(customers)
  } catch (error) {
    console.error("Error fetching customers:", error)
    return NextResponse.json(
      { error: "Failed to fetch customers" },
      { status: 500 }
    )
  }
}
