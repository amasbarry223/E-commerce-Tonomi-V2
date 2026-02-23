"use client"

import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { ShieldX } from "lucide-react"

export default function ForbiddenPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md text-center">
        <CardHeader>
          <ShieldX className="h-12 w-12 mx-auto text-destructive" aria-hidden />
          <CardDescription className="text-base font-medium">Accès refusé (403)</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Vous n&apos;avez pas les droits nécessaires pour accéder à cette page.
          </p>
          <p className="text-sm text-muted-foreground">
            Si vous êtes un client, retournez à l&apos;accueil pour continuer vos achats.
          </p>
          <div className="flex flex-wrap gap-2 justify-center">
            <Button asChild variant="outline">
              <Link href={ROUTES.home}>Retour à l’accueil</Link>
            </Button>
            <Button asChild>
              <Link href={ROUTES.dashboard}>Retour au tableau de bord</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
