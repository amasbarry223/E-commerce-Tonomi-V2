import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Home, Search } from "lucide-react"
import { ROUTES } from "@/lib/routes"

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-background">
      <div className="text-center max-w-md space-y-6">
        <p className="text-6xl font-serif font-bold text-muted-foreground">404</p>
        <h1 className="text-2xl font-semibold text-foreground">Page introuvable</h1>
        <p className="text-muted-foreground">
          La page que vous recherchez n’existe pas ou a été déplacée.
        </p>
        <div className="flex flex-wrap justify-center gap-3 pt-4">
          <Button asChild variant="default" className="gap-2">
            <Link href={ROUTES.home}>
              <Home className="h-4 w-4" aria-hidden />
              Retour à l’accueil
            </Link>
          </Button>
          <Button asChild variant="outline" className="gap-2">
            <Link href={ROUTES.login}>
              <Search className="h-4 w-4" aria-hidden />
              Connexion admin
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
