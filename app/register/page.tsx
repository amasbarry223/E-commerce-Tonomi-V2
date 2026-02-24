"use client"

import { useState } from "react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { registerSchema, getZodErrorMessage } from "@/lib/utils/validation"
import { StoreProvider } from "@/lib/store-context"
import { GuestOnlyRoute } from "@/lib/guards"
import { toast } from "sonner"

export default function RegisterPage() {
  return (
    <StoreProvider>
      <GuestOnlyRoute>
        <RegisterForm />
      </GuestOnlyRoute>
    </StoreProvider>
  )
}

function RegisterForm() {
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const result = registerSchema.safeParse({ name, email, password })
    if (!result.success) {
      setError(getZodErrorMessage(result.error))
      return
    }
    setSubmitted(true)
    toast.success("Demande enregistrée. Un administrateur vous contactera pour activer votre compte.")
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardDescription>Demande envoyée</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Votre demande de compte a bien été enregistrée. Pour les clients, l&apos;accès sera bientôt automatisé. Pour les administrateurs, un responsable vous contactera pour activer vos accès.
            </p>
            <Button asChild variant="default" className="w-full">
              <Link href={ROUTES.login}>Retour à la connexion</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardDescription>Créer un compte</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground italic">
            Note : La création d&apos;un compte est facultative pour passer commande.
          </p>
          <p className="text-sm text-muted-foreground">
            Renseignez le formulaire ci-dessous pour rejoindre la communauté Tonomi.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="name">Nom</Label>
              <Input
                id="name"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom"
                autoComplete="name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="vous@exemple.com"
                autoComplete="email"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full">
              Envoyer la demande
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            Déjà un compte ?{" "}
            <Link href={ROUTES.login} className="underline hover:no-underline">
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
