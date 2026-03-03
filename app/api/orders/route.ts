/**
 * API Route pour les commandes
 */

import { NextResponse } from "next/server"
import { getOrders, createOrder } from "@/lib/services/orders"
import { createServerClient } from "@/lib/supabase/client"
import { customerRepository } from "@/lib/repositories"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const skip = searchParams.get("skip")
    const take = searchParams.get("take")
    const customerId = searchParams.get("customerId")

    const orders = await getOrders({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    })

    // Filtrer par customerId si fourni
    const filteredOrders = customerId
      ? orders.filter((o) => o.customerId === customerId)
      : orders

    return NextResponse.json(filteredOrders)
  } catch (error) {
    console.error("Error fetching orders:", error)
    return NextResponse.json(
      { error: "Failed to fetch orders" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const {
      email,
      firstName,
      lastName,
      phone,
      shippingAddress,
      billingAddress,
      items,
      subtotal,
      shipping,
      discount,
      tax,
      total,
      paymentMethod,
      promoCodeId,
      notes,
    } = body

    // Vérifier que l'utilisateur est authentifié (optionnel pour les commandes guest)
    let customerId: string

    if (email) {
      // Chercher ou créer le customer
      let customer = await customerRepository.findByEmail(email)
      
      if (!customer) {
        // Créer un customer guest (sans compte Supabase Auth)
        customer = await customerRepository.create({
          firstName: firstName || "",
          lastName: lastName || "",
          email,
          phone: phone || "",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent((firstName || "") + "+" + (lastName || ""))}&background=random`,
          segment: "new",
          totalSpent: 0,
          orderCount: 0,
        })
      } else {
        // Mettre à jour les infos si nécessaire
        if (firstName || lastName || phone) {
          customer = await customerRepository.update(customer.id, {
            firstName: firstName || customer.firstName,
            lastName: lastName || customer.lastName,
            phone: phone || customer.phone,
          })
        }
      }

      customerId = customer.id
    } else {
      // Si pas d'email, essayer de récupérer depuis Supabase Auth
      const supabase = createServerClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return NextResponse.json(
          { error: "Email requis ou utilisateur non authentifié" },
          { status: 400 }
        )
      }

      let customer = await customerRepository.findByEmail(user.email!)
      if (!customer) {
        customer = await customerRepository.create({
          id: user.id,
          firstName: firstName || "",
          lastName: lastName || "",
          email: user.email!,
          phone: phone || "",
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent((firstName || "") + "+" + (lastName || ""))}&background=random`,
          segment: "new",
          totalSpent: 0,
          orderCount: 0,
        })
      }

      customerId = customer.id
    }

    // Créer la commande
    const order = await createOrder({
      customerId,
      shippingAddress: {
        label: "Livraison",
        street: shippingAddress.address,
        city: shippingAddress.city,
        zipCode: shippingAddress.zip,
        country: shippingAddress.country || "France",
        isDefault: false,
      },
      billingAddress: {
        label: "Facturation",
        street: billingAddress?.address || shippingAddress.address,
        city: billingAddress?.city || shippingAddress.city,
        zipCode: billingAddress?.zip || shippingAddress.zip,
        country: billingAddress?.country || shippingAddress.country || "France",
        isDefault: false,
      },
      items,
      subtotal,
      shipping,
      discount,
      tax,
      total,
      paymentMethod,
      promoCodeId,
      notes,
    })

    return NextResponse.json(order, { status: 201 })
  } catch (error) {
    console.error("Error creating order:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create order" },
      { status: 500 }
    )
  }
}
