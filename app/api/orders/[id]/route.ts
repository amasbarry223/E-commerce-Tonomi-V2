/**
 * API Route pour mettre à jour une commande (statut, tracking)
 */

import { NextResponse } from "next/server"
import { orderRepository } from "@/lib/repositories"
import { logActions } from "@/lib/utils/logger-service"

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()
    const { status, trackingNumber } = body

    if (!status && trackingNumber === undefined) {
      return NextResponse.json(
        { error: "Status ou trackingNumber requis" },
        { status: 400 }
      )
    }

    // Mettre à jour la commande
    const updatedOrder = await orderRepository.updateStatus(
      id,
      status || undefined,
      trackingNumber !== undefined ? trackingNumber : undefined
    )

    // Logger l'action
    if (status) {
      await logActions.orderUpdated(
        updatedOrder.id,
        updatedOrder.orderNumber,
        status
      )
    }

    return NextResponse.json(updatedOrder)
  } catch (error) {
    console.error("Error updating order:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de la mise à jour de la commande" },
      { status: 500 }
    )
  }
}
