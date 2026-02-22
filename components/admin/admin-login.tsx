"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useLogsStore } from "@/lib/stores/logs-store"
import { useStore } from "@/lib/store-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Mail, Loader2 } from "lucide-react"
import { defaultTransition } from "@/lib/animations"
import { loginSchema } from "@/src/lib/utils/validation"

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
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      setError(parsed.error.errors.map((e) => e.message).join(". ") || "Vérifiez les champs.")
      return
    }
    setLoading(true)

    try {
      const success = await login(parsed.data.email, parsed.data.password)
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
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 relative overflow-hidden bg-gradient-to-br from-[oklch(0.98_0.008_85)] via-[oklch(0.99_0.004_90)] to-[oklch(0.97_0.012_75)]">
      {/* Formes douces animées */}
      <motion.div
        className="absolute top-[10%] right-[15%] w-[320px] h-[320px] rounded-full opacity-[0.12] blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.76 0.08 60) 0%, transparent 70%" }}
        animate={{
          x: [0, 25, 0],
          y: [0, -20, 0],
          scale: [1, 1.08, 1],
        }}
        transition={{ duration: 14, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-[20%] left-[10%] w-[280px] h-[280px] rounded-full opacity-[0.08] blur-3xl"
        style={{ background: "radial-gradient(circle, oklch(0.76 0.06 55) 0%, transparent 70%" }}
        animate={{
          x: [0, -20, 0],
          y: [0, 25, 0],
          scale: [1.05, 1, 1.05],
        }}
        transition={{ duration: 11, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full opacity-[0.06] blur-3xl -translate-x-1/2 -translate-y-1/2"
        style={{ background: "radial-gradient(circle, oklch(0.7 0.05 65) 0%, transparent 65%" }}
        animate={{ scale: [1, 1.12, 1] }}
        transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute inset-0 pointer-events-none opacity-[0.5]"
        style={{
          background: "linear-gradient(105deg, transparent 0%, oklch(1 0 0 / 0.4) 45%, transparent 55%)",
          backgroundSize: "200% 100%",
        }}
        animate={{ backgroundPosition: ["0% 0%", "200% 0%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      />

      {/* Container centré — logo + formulaire */}
      <motion.div
        className="relative z-10 w-full max-w-[420px]"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ ...defaultTransition, duration: 0.5 }}
      >
        <Card className="w-full bg-white/90 backdrop-blur-xl border border-white/80 shadow-xl shadow-black/[0.04] rounded-2xl overflow-hidden">
          <div className="h-1 w-full bg-gradient-to-r from-accent/80 via-accent to-accent/80" />
          <CardHeader className="space-y-1 pt-8 pb-2 px-8 sm:px-10">
            <div className="flex items-center justify-center mb-6">
              <img
                src="/images/logo.png"
                alt="TONOMI ACCESSOIRES"
                className="h-32 md:h-40 w-auto object-contain"
              />
            </div>
            <CardDescription className="text-center text-base text-muted-foreground leading-relaxed">
              Connectez-vous pour accéder au tableau de bord administrateur
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 sm:px-10 pb-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {error && (
                <Alert variant="destructive" className="rounded-xl">
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-medium">
                  Email
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="admin@tonomi.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-border/80 bg-secondary/30 focus:bg-background transition-colors"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-medium">
                  Mot de passe
                </Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  <Input
                    id="password"
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 h-11 rounded-xl border-border/80 bg-secondary/30 focus:bg-background transition-colors"
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              <Button
                type="submit"
                className="w-full h-11 rounded-xl bg-accent text-accent-foreground hover:bg-accent/90 font-medium shadow-sm mt-1"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Connexion...
                  </>
                ) : (
                  "Se connecter"
                )}
              </Button>

              <div className="text-xs text-muted-foreground text-center pt-5 mt-2 border-t border-border/60">
                <p>Identifiants par défaut :</p>
                <p className="font-mono mt-1 text-muted-foreground/90">admin@tonomi.com / admin123</p>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
