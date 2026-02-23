"use client"

import { useState } from "react"
import Link from "next/link"
import { ROUTES } from "@/lib/routes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { emailFieldSchema } from "@/lib/utils/validation"
import { toast } from "sonner"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [error, setError] = useState("")
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    const result = emailFieldSchema.safeParse(email)
    if (!result.success) {
      setError(result.error.issues[0]?.message ?? "Email invalide")
      return
    }
    setSubmitted(true)
    toast.success("Si un compte existe pour cet email, vous recevrez un lien de réinitialisation.")
  }

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4 bg-muted/30">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardDescription>Email envoyé</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Si un compte existe pour l&apos;adresse indiquée, vous recevrez un lien pour réinitialiser votre mot de passe. Pensez à vérifier les spams.
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
          <CardDescription>Mot de passe oublié</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Saisissez l&apos;email associé à votre compte. Nous vous enverrons un lien pour réinitialiser votre mot de passe.
          </p>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <p className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
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
            <Button type="submit" className="w-full">
              Envoyer le lien
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
