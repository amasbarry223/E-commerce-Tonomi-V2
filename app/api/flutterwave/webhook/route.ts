/**
 * API Route pour recevoir les webhooks Flutterwave
 * 
 * NOTE: Cette route nécessite la configuration de FLUTTERWAVE_WEBHOOK_SECRET dans .env
 * 
 * Configurez cette URL dans le dashboard Flutterwave:
 * https://votre-domaine.com/api/flutterwave/webhook
 */

import { NextResponse } from "next/server"
import { headers } from "next/headers"
import crypto from "crypto"

export async function POST(request: Request) {
  try {
    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("verif-hash")

    // Vérifier la signature du webhook
    const secretHash = process.env.FLUTTERWAVE_WEBHOOK_SECRET

    if (secretHash && signature !== secretHash) {
      console.error("Invalid webhook signature")
      return NextResponse.json(
        { error: "Invalid signature" },
        { status: 401 }
      )
    }

    const event = JSON.parse(body)

    // Traiter les événements Flutterwave
    switch (event.event) {
      case "charge.completed":
        // Paiement réussi
        const charge = event.data
        console.log("Payment successful:", {
          txRef: charge.tx_ref,
          transactionId: charge.id,
          amount: charge.amount,
          currency: charge.currency,
          customer: charge.customer,
        })

        // TODO: Mettre à jour le statut de la commande dans la base de données
        // const orderId = charge.tx_ref.split("-")[0] // Extraire l'ID de commande
        // await updateOrderStatus(orderId, "paid")
        // await createLog({
        //   action: "payment_succeeded",
        //   description: `Paiement réussi pour la commande ${orderId}`,
        //   entityType: "Order",
        //   entityId: orderId,
        //   metadata: {
        //     transactionId: charge.id,
        //     amount: charge.amount,
        //     currency: charge.currency,
        //   },
        // })

        break

      case "charge.failed":
        // Paiement échoué
        const failedCharge = event.data
        console.log("Payment failed:", {
          txRef: failedCharge.tx_ref,
          transactionId: failedCharge.id,
          reason: failedCharge.processor_response,
        })

        // TODO: Mettre à jour le statut de la commande
        // await updateOrderStatus(orderId, "payment_failed")

        break

      case "transfer.completed":
        // Transfert réussi (remboursement)
        const transfer = event.data
        console.log("Transfer completed:", {
          txRef: transfer.reference,
          amount: transfer.amount,
        })
        break

      default:
        console.log("Unhandled event type:", event.event)
    }

    return NextResponse.json({ received: true }, { status: 200 })
  } catch (error) {
    console.error("Error processing Flutterwave webhook:", error)
    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    )
  }
}
