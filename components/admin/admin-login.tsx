"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useLogsStore } from "@/lib/stores/logs-store"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Mail, Loader2 } from "lucide-react"

export function AdminLogin() {
  const [email, setEmail] = useState("admin@tonomi.com")
  const [password, setPassword] = useState("admin123")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((state) => state.login)
  const addLog = useLogsStore((state) => state.addLog)
  const { setCurrentView } = useStore()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        // Ajouter un log de connexion
        const user = useAuthStore.getState().user
        if (user) {
          addLog({
            action: 'login',
            userId: user.id,
            userEmail: user.email,
            description: `Connexion de ${user.email}`,
          })
        }
        
        // Connexion réussie : changer la vue vers admin et naviguer vers dashboard
        setCurrentView("admin")
        // Attendre que le store soit mis à jour
        await new Promise(resolve => setTimeout(resolve, 50))
        // Rediriger vers la page d'accueil qui affichera automatiquement le dashboard
        router.replace("/")
      } else {
        setError("Email ou mot de passe incorrect")
      }
    } catch (err) {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center justify-center mb-4">
            <img 
              src="/images/logo.png" 
              alt="TONOMI ACCESSOIRES" 
              className="h-20 md:h-24 w-auto object-contain"
            />
          </div>
          <CardTitle className="text-2xl text-center">Accès Back-office</CardTitle>
          <CardDescription className="text-center">
            Connectez-vous pour accéder au tableau de bord administrateur
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@tonomi.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Mot de passe</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10"
                  required
                  disabled={loading}
                />
              </div>
            </div>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Connexion...
                </>
              ) : (
                "Se connecter"
              )}
            </Button>

            <div className="text-xs text-muted-foreground text-center pt-4 border-t border-border">
              <p>Identifiants par défaut :</p>
              <p className="font-mono mt-1">admin@tonomi.com / admin123</p>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
