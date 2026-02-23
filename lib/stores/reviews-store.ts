/**
 * Store Zustand pour les avis clients (fiche produit + modération admin).
 * Persisté en localStorage pour que les avis visiteurs et les actions admin soient conservés.
 */
import { create } from "zustand"
import { persist } from "zustand/middleware"
import type { Review } from "@/lib/types"
import { getDefaultReviews } from "@/lib/services"

const STORAGE_KEY = "tonomi_reviews"

export type ReviewInput = Omit<Review, "id" | "createdAt" | "status">

interface ReviewsState {
  reviews: Review[]
  addReview: (review: ReviewInput) => void
  approveReview: (id: string) => void
  rejectReview: (id: string) => void
}

function generateId(): string {
  return `rev-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export const useReviewsStore = create<ReviewsState>()(
  persist(
    (set, get) => ({
      reviews: getDefaultReviews(),

      addReview: (review) => {
        const newReview: Review = {
          ...review,
          id: generateId(),
          createdAt: new Date().toISOString().slice(0, 10),
          status: "pending",
        }
        set({ reviews: [...get().reviews, newReview] })
      },

      approveReview: (id) => {
        set({
          reviews: get().reviews.map((r) =>
            r.id === id ? { ...r, status: "approved" as const } : r
          ),
        })
      },

      rejectReview: (id) => {
        set({
          reviews: get().reviews.map((r) =>
            r.id === id ? { ...r, status: "rejected" as const } : r
          ),
        })
      },
    }),
    {
      name: STORAGE_KEY,
      partialize: (state) => ({ reviews: state.reviews }),
      onRehydrateStorage: () => (persistedState) => {
        const state = persistedState as { reviews?: Review[] } | undefined
        if (!state?.reviews?.length) {
          useReviewsStore.setState({ reviews: getDefaultReviews() })
        }
      },
    }
  )
)
