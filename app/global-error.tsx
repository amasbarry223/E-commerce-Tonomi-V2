"use client"

import { useEffect } from "react"
import { captureException } from "@/lib/utils/sentry"

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    captureException(error)
  }, [error])

  return (
    <html lang="fr">
      <body style={{ margin: 0, fontFamily: "system-ui, sans-serif", padding: "2rem", textAlign: "center" }}>
        <h1 style={{ fontSize: "1.5rem", marginBottom: "1rem" }}>Une erreur s&apos;est produite</h1>
        <p style={{ color: "#666", marginBottom: "1.5rem" }}>
          Nous avons été notifiés. Veuillez réessayer.
        </p>
        <button
          type="button"
          onClick={() => reset()}
          style={{
            padding: "0.5rem 1rem",
            background: "#000",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Réessayer
        </button>
      </body>
    </html>
  )
}
