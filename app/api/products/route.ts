/**
 * API Route pour les produits
 * Utilisé par les composants client pour accéder aux données
 */

import { NextResponse } from "next/server"
import { getProducts, getProductsWithFilters, getFeaturedProducts, searchProducts, createProduct, updateProduct, deleteProduct } from "@/lib/services/products"

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const action = searchParams.get("action")
    const query = searchParams.get("query")
    const limit = searchParams.get("limit")
    const categoryId = searchParams.get("categoryId")
    const minPrice = searchParams.get("minPrice")
    const maxPrice = searchParams.get("maxPrice")
    const featured = searchParams.get("featured")
    const search = searchParams.get("search")

    if (action === "search" && query) {
      const products = await searchProducts(query, limit ? parseInt(limit, 10) : 20)
      return NextResponse.json(products)
    }

    if (action === "featured") {
      const products = await getFeaturedProducts(limit ? parseInt(limit, 10) : 10)
      return NextResponse.json(products)
    }

    if (action === "filters" || categoryId || minPrice || maxPrice || featured || search) {
      const filters: any = {}
      if (categoryId) filters.categoryId = categoryId
      if (minPrice) filters.minPrice = parseFloat(minPrice)
      if (maxPrice) filters.maxPrice = parseFloat(maxPrice)
      if (featured) filters.featured = featured === "true"
      if (search) filters.search = search

      const products = await getProductsWithFilters(filters)
      return NextResponse.json(products)
    }

    // Par défaut, retourner tous les produits
    const products = await getProducts()
    return NextResponse.json(products)
  } catch (error) {
    console.error("Error fetching products:", error)
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 }
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const product = await createProduct(body)
    return NextResponse.json(product, { status: 201 })
  } catch (error) {
    console.error("Error creating product:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to create product" },
      { status: 500 }
    )
  }
}

export async function PUT(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }
    const body = await request.json()
    const product = await updateProduct(id, body)
    return NextResponse.json(product)
  } catch (error) {
    console.error("Error updating product:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to update product" },
      { status: 500 }
    )
  }
}

export async function DELETE(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    const id = searchParams.get("id")
    if (!id) {
      return NextResponse.json({ error: "Product ID is required" }, { status: 400 })
    }
    await deleteProduct(id)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting product:", error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Failed to delete product" },
      { status: 500 }
    )
  }
}
