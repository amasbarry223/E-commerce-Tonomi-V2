/**
 * API Route pour recevoir les webhooks Stripe
 * 
 * NOTE: Cette route nécessite l'installation de Stripe:
 * pnpm add stripe
 * 
 * Et la configuration de STRIPE_WEBHOOK_SECRET dans .env.local
 * 
 * Configurez cette URL dans le dashboard Stripe:
 * https://votre-domaine.com/api/stripe/webhook
 */

import { NextResponse } from "next/server"
import { headers } from "next/headers"

export async function POST(request: Request) {
  try {
    // TODO: Installer Stripe avec: pnpm add stripe
    // import Stripe from "stripe"
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-12-18.acacia" })

    const body = await request.text()
    const headersList = await headers()
    const signature = headersList.get("stripe-signature")

    if (!signature) {
      return NextResponse.json(
        { error: "No signature" },
        { status: 400 }
      )
    }

    // TODO: Vérifier la signature du webhook
    // const event = stripe.webhooks.constructEvent(
    //   body,
    //   signature,
    //   process.env.STRIPE_WEBHOOK_SECRET!
    // )

    // TODO: Traiter les événements
    // switch (event.type) {
    //   case "checkout.session.completed":
    //     const session = event.data.object
    //     // Mettre à jour le statut de la commande dans la base de données
    //     // await updateOrderStatus(session.metadata.orderId, "paid")
    //     break
    //   case "payment_intent.succeeded":
    //     // Traiter le paiement réussi
    //     break
    //   case "payment_intent.payment_failed":
    //     // Traiter l'échec du paiement
    //     break
    // }

    // Placeholder jusqu'à l'installation de Stripe
    return NextResponse.json(
      { 
        error: "Stripe not installed. Run: pnpm add stripe",
        message: "Installez Stripe avec 'pnpm add stripe' et configurez STRIPE_WEBHOOK_SECRET dans .env.local"
      },
      { status: 501 }
    )
  } catch (error) {
    console.error("Error processing Stripe webhook:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to process webhook" },
      { status: 500 }
    )
  }
}
