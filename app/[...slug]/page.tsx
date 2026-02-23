import { redirect } from "next/navigation"
import { ROUTES } from "@/lib/routes"

/**
 * Toute URL non gérée (ex. /catalogue, /panier, /foo) redirige vers l'accueil.
 * L'app est une SPA sur / ; les "pages" sont gérées par l'état (currentPage).
 */
export default function CatchAllPage() {
  redirect(ROUTES.home)
}
