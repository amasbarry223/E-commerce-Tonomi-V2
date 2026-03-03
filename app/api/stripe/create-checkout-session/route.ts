/**
 * API Route pour créer une session de checkout Stripe
 * 
 * NOTE: Cette route nécessite l'installation de Stripe:
 * pnpm add stripe
 * 
 * Et la configuration des variables d'environnement:
 * STRIPE_SECRET_KEY=sk_test_...
 */

import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    // TODO: Installer Stripe avec: pnpm add stripe
    // import Stripe from "stripe"
    // const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2024-12-18.acacia" })

    const body = await request.json()
    const { items, customerEmail, successUrl, cancelUrl } = body

    if (!items || !Array.isArray(items) || items.length === 0) {
      return NextResponse.json(
        { error: "Items are required" },
        { status: 400 }
      )
    }

    // TODO: Créer la session Stripe
    // const session = await stripe.checkout.sessions.create({
    //   payment_method_types: ["card"],
    //   line_items: items.map(item => ({
    //     price_data: {
    //       currency: "eur",
    //       product_data: {
    //         name: item.name,
    //         images: item.images || [],
    //       },
    //       unit_amount: Math.round(item.price * 100), // Convertir en centimes
    //     },
    //     quantity: item.quantity,
    //   })),
    //   mode: "payment",
    //   customer_email: customerEmail,
    //   success_url: successUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
    //   cancel_url: cancelUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout`,
    //   metadata: {
    //     orderId: body.orderId,
    //   },
    // })

    // return NextResponse.json({ sessionId: session.id, url: session.url })

    // Placeholder jusqu'à l'installation de Stripe
    return NextResponse.json(
      { 
        error: "Stripe not installed. Run: pnpm add stripe",
        message: "Installez Stripe avec 'pnpm add stripe' et configurez STRIPE_SECRET_KEY dans .env.local"
      },
      { status: 501 }
    )
  } catch (error) {
    console.error("Error creating Stripe checkout session:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create checkout session" },
      { status: 500 }
    )
  }
}
