/**
 * API Route pour les témoignages/avis
 */

import { NextResponse } from "next/server"
import { getReviews, getReviewsByProduct, createReview } from "@/lib/services/reviews"
import { createServerClient } from "@/lib/supabase/client"
import { customerRepository } from "@/lib/repositories"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const productId = searchParams.get("productId")
    const skip = searchParams.get("skip")
    const take = searchParams.get("take")

    if (productId) {
      const reviews = await getReviewsByProduct(productId, {
        skip: skip ? parseInt(skip, 10) : undefined,
        take: take ? parseInt(take, 10) : undefined,
      })
      return NextResponse.json(reviews)
    }

    const reviews = await getReviews({
      skip: skip ? parseInt(skip, 10) : undefined,
      take: take ? parseInt(take, 10) : undefined,
    })
    return NextResponse.json(reviews)
  } catch (error) {
    console.error("Error fetching reviews:", error)
    return NextResponse.json(
      { error: "Failed to fetch reviews" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { productId, rating, title, comment, email } = body

    if (!productId || !rating || !title || !comment) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Vérifier si l'utilisateur est authentifié
    let customerId: string

    if (email) {
      // Chercher le customer par email
      const customer = await customerRepository.findByEmail(email)
      if (!customer) {
        return NextResponse.json(
          { error: "Customer not found. Please create an account first." },
          { status: 404 }
        )
      }
      customerId = customer.id
    } else {
      // Essayer de récupérer depuis Supabase Auth
      const supabase = createServerClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (!user) {
        return NextResponse.json(
          { error: "Email requis ou utilisateur non authentifié" },
          { status: 401 }
        )
      }

      let customer = await customerRepository.findByEmail(user.email!)
      if (!customer) {
        return NextResponse.json(
          { error: "Customer not found. Please create an account first." },
          { status: 404 }
        )
      }
      customerId = customer.id
    }

    // Vérifier que le customer n'a pas déjà laissé un avis pour ce produit
    const existingReviews = await getReviewsByProduct(productId)
    const hasExistingReview = existingReviews.some((r) => r.customerId === customerId)

    if (hasExistingReview) {
      return NextResponse.json(
        { error: "Vous avez déjà laissé un avis pour ce produit" },
        { status: 400 }
      )
    }

    // Créer l'avis
    const review = await createReview({
      productId,
      customerId,
      rating: parseInt(rating, 10),
      title,
      comment,
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create review" },
      { status: 500 }
    )
  }
}
