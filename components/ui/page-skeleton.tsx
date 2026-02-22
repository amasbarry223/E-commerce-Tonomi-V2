"use client"

import { Skeleton } from "@/components/ui/skeleton"

/** Skeleton affiché pendant le chargement lazy d’une page (Suspense fallback). */
export function PageSkeleton() {
  return (
    <div className="w-full min-h-[40vh] flex flex-col gap-6 p-4 md:p-6" aria-hidden>
      <div className="flex gap-4">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 flex-1 max-w-md" />
      </div>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <Skeleton key={i} className="aspect-square rounded-lg" variant="card" />
        ))}
      </div>
    </div>
  )
}
