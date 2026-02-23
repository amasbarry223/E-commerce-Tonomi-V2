"use client"

import { useState } from "react"
import Link from "next/link"
import { useSearchParams } from "next/navigation"
import { ROUTES } from "@/lib/routes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { resetPasswordSchema, getZodErrorMessage } from "@/lib/utils/validation"
import { toast } from "sonner"

export default function ResetPasswordPage() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const result = resetPasswordSchema.safeParse({ password, confirmPassword })
    if (!result.success) {
      setError(getZodErrorMessage(result.error))
      return
    }
    setSubmitted(true)
    toast.success("Mot de passe mis à jour. Vous pouvez vous connecter.")
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardDescription>Mot de passe mis à jour</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Votre mot de passe a bien été modifié. Connectez-vous avec votre nouveau mot de passe.
            </p>
            <Button asChild variant="default" className="w-full">
              <Link href={ROUTES.login}>Se connecter</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardDescription>Lien invalide ou expiré</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Le lien de réinitialisation est invalide ou a expiré. Demandez un nouveau lien depuis la page « Mot de passe oublié ».
            </p>
            <Button asChild variant="default" className="w-full">
              <Link href={ROUTES.forgotPassword}>Mot de passe oublié</Link>
            </Button>
            <Button asChild variant="ghost" className="w-full">
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
          <CardDescription>Nouveau mot de passe</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Choisissez un nouveau mot de passe (au moins 6 caractères).
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
            <div className="space-y-2">
              <Label htmlFor="password">Nouveau mot de passe</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Confirmer le mot de passe</Label>
              <Input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="new-password"
              />
            </div>
            <Button type="submit" className="w-full">
              Enregistrer le mot de passe
            </Button>
          </form>
          <Button asChild variant="ghost" className="w-full">
            <Link href={ROUTES.login}>Retour à la connexion</Link>
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
