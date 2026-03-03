/**
 * API Route pour initialiser un paiement Flutterwave
 * 
 * NOTE: Cette route nécessite l'installation de Flutterwave:
 * pnpm add flutterwave-node-v3
 * 
 * Et la configuration des variables d'environnement:
 * FLUTTERWAVE_SECRET_KEY=FLWSECK_TEST_...
 */

import { NextResponse } from "next/server"
import Flutterwave from "flutterwave-node-v3"

export async function POST(request: Request) {
  try {
    const flutterwave = new Flutterwave(
      process.env.NEXT_PUBLIC_FLUTTERWAVE_PUBLIC_KEY!,
      process.env.FLUTTERWAVE_SECRET_KEY!
    )

    const body = await request.json()
    const { 
      amount, 
      currency = "XOF", // Franc CFA pour le Mali
      customerEmail, 
      customerName,
      customerPhone,
      txRef, // Référence unique de transaction
      redirectUrl,
      items,
      orderId
    } = body

    if (!amount || !customerEmail || !txRef) {
      return NextResponse.json(
        { error: "Amount, customerEmail, and txRef are required" },
        { status: 400 }
      )
    }

    // Créer le paiement
    const paymentData = {
      tx_ref: txRef,
      amount: amount,
      currency: currency,
      redirect_url: redirectUrl || `${process.env.NEXT_PUBLIC_APP_URL}/checkout/success`,
      payment_options: "card,mobilemoney,banktransfer", // Options de paiement pour le Mali
      customer: {
        email: customerEmail,
        name: customerName || "Client",
        phone_number: customerPhone || "",
      },
      customizations: {
        title: "Tonomi - Paiement",
        description: `Paiement pour la commande ${orderId || txRef}`,
        logo: `${process.env.NEXT_PUBLIC_APP_URL}/logo.png`, // Optionnel
      },
      meta: {
        orderId: orderId || txRef,
        items: JSON.stringify(items || []),
      },
    }

    const response = await flutterwave.Payment.initiate(paymentData)

    if (response.status === "success") {
      return NextResponse.json({
        status: "success",
        data: {
          link: response.data.link, // URL de redirection vers Flutterwave
          txRef: response.data.tx_ref,
        },
      })
    } else {
      return NextResponse.json(
        { error: "Failed to initialize payment", details: response.message },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Error initializing Flutterwave payment:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to initialize payment" },
      { status: 500 }
    )
  }
}
