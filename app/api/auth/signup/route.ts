/**
 * API Route pour l'inscription
 */

import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/client"
import { customerRepository } from "@/lib/repositories"
import type { Customer } from "@/lib/types"

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { email, userId, firstName, lastName } = body

    if (!email || !userId || !firstName || !lastName) {
      return NextResponse.json(
        { error: "Tous les champs sont requis" },
        { status: 400 }
      )
    }

    // Le signUp Supabase Auth est déjà fait côté client
    // On crée juste le customer dans la base de données
    let customer = await customerRepository.findByEmail(email)

    if (!customer) {
      await customerRepository.create({
        id: userId,
        firstName,
        lastName,
        email,
        phone: "",
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(firstName + "+" + lastName)}&background=random`,
        segment: "new",
        totalSpent: 0,
        orderCount: 0,
      })
      // Récupérer le customer créé avec ses relations
      customer = await customerRepository.findByEmail(email)
    } else {
      await customerRepository.update(customer.id, {
        firstName,
        lastName,
      })
      // Récupérer le customer mis à jour avec ses relations
      customer = await customerRepository.findById(customer.id)
    }

    if (!customer) {
      throw new Error("Impossible de créer ou récupérer le customer")
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
      addresses: (customer.addresses || []).map((addr) => ({
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
        firstName,
        lastName,
      },
      customer: customerData,
    })
  } catch (error) {
    console.error("Error in signup:", error)
    
    // Messages d'erreur plus détaillés
    let errorMessage = "Erreur lors de l'inscription"
    let statusCode = 500
    
    if (error instanceof Error) {
      errorMessage = error.message
      
      // Erreurs Prisma communes
      if (error.message.includes("does not exist") || error.message.includes("relation") || error.message.includes("table")) {
        errorMessage = "Les tables de la base de données n'existent pas. Veuillez exécuter 'npx prisma db push' pour créer les tables."
        statusCode = 503 // Service Unavailable
      } else if (error.message.includes("Unique constraint")) {
        errorMessage = "Cet email est déjà utilisé."
        statusCode = 409 // Conflict
      } else if (error.message.includes("Foreign key constraint")) {
        errorMessage = "Erreur de référence dans la base de données."
        statusCode = 400
      }
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: statusCode }
    )
  }
}
