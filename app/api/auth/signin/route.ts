/**
 * API Route pour la connexion
 */

import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/client"
import { customerRepository } from "@/lib/repositories"
import type { Customer } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, userId, firstName, lastName } = body

    if (!email || !userId) {
      return NextResponse.json(
        { error: "Email et userId requis" },
        { status: 400 }
      )
    }

    // Le signIn Supabase Auth est déjà fait côté client
    // On récupère juste le customer depuis la base
    let customer = await customerRepository.findByEmail(email)

    if (!customer) {
      // Si le customer n'existe pas, le créer
      customer = await customerRepository.create({
        id: userId,
        firstName: firstName || "",
        lastName: lastName || "",
        email,
        phone: "",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent((firstName || "") + "+" + (lastName || ""))}&background=random`,
        segment: "new",
        totalSpent: 0,
        orderCount: 0,
      })
    }

    const customerData: Customer = {
      id: customer.id,
      firstName: customer.firstName,
      lastName: customer.lastName,
      email: customer.email,
      phone: customer.phone || "",
      avatar: customer.avatar || "",
      segment: customer.segment as Customer["segment"],
      totalSpent: Number(customer.totalSpent),
      orderCount: customer.orderCount,
      createdAt: customer.createdAt.toISOString(),
      addresses: customer.addresses.map((addr) => ({
        id: addr.id,
        label: addr.label,
        street: addr.street,
        city: addr.city,
        zipCode: addr.zipCode,
        country: addr.country,
        isDefault: addr.isDefault,
      })),
    }

    return NextResponse.json({
      user: {
        id: userId,
        email,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
      customer: customerData,
    })
  } catch (error) {
    console.error("Error in signin:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de la connexion" },
      { status: 500 }
    )
  }
}
