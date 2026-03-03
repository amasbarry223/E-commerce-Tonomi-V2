/**
 * API Route pour vérifier le statut d'un paiement Flutterwave
 * 
 * Utilisé après la redirection depuis Flutterwave pour vérifier si le paiement a réussi
 */

import { NextResponse } from "next/server"
import Flutterwave from "flutterwave-node-v3"

export async function GET(request: Request) {
  try {
    const flutterwave = new Flutterwave(
      process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
      process.env.FLUTTERWAVE_SECRET_KEY!
    )

    const { searchParams } = new URL(request.url)
    const txRef = searchParams.get("tx_ref")
    const transactionId = searchParams.get("transaction_id")

    if (!txRef) {
      return NextResponse.json(
        { error: "tx_ref is required" },
        { status: 400 }
      )
    }

    // Vérifier le paiement
    const response = await flutterwave.Transaction.verify({ tx_ref: txRef })

    if (response.status === "success" && response.data.status === "successful") {
      return NextResponse.json({
        status: "success",
        data: {
          txRef: response.data.tx_ref,
          transactionId: response.data.id,
          amount: response.data.amount,
          currency: response.data.currency,
          customer: response.data.customer,
          orderId: response.data.meta?.orderId,
        },
      })
    } else {
      return NextResponse.json(
        { 
          status: "failed",
          error: "Payment verification failed",
          details: response.message 
        },
        { status: 400 }
      )
    }
  } catch (error) {
    console.error("Error verifying Flutterwave payment:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to verify payment" },
      { status: 500 }
    )
  }
}
