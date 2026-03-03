/**
 * API Route pour récupérer l'utilisateur actuel
 */

import { NextResponse } from "next/server"
import { createServerClient } from "@/lib/supabase/client"
import { customerRepository } from "@/lib/repositories"
import type { Customer } from "@/lib/types"

export async function GET(request: Request) {
  try {
    // Récupérer le token depuis les headers
    const authHeader = request.headers.get("authorization")
    const supabase = createServerClient()
    
    // Si un token est fourni, l'utiliser
    let user
    if (authHeader?.startsWith("Bearer ")) {
      const token = authHeader.substring(7)
      const { data, error } = await supabase.auth.getUser(token)
      if (error || !data.user) {
        return NextResponse.json({ user: null, customer: null })
      }
      user = data.user
    } else {
      // Sinon, essayer de récupérer depuis la session
      const { data: { user: sessionUser }, error: authError } = await supabase.auth.getUser()
      if (authError || !sessionUser) {
        return NextResponse.json({ user: null, customer: null })
      }
      user = sessionUser
    }

    const customer = await customerRepository.findByEmail(user.email!)
    
    if (!customer) {
      return NextResponse.json({ user: null, customer: null })
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
        id: user.id,
        email: user.email!,
        firstName: customer.firstName,
        lastName: customer.lastName,
      },
      customer: customerData,
    })
  } catch (error) {
    console.error("Error getting current user:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Erreur lors de la récupération" },
      { status: 500 }
    )
  }
}
