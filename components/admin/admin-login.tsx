"use client"

import { useState } from "react"
import Image from "next/image"
import { useRouter, useSearchParams } from "next/navigation"
import { motion } from "framer-motion"
import { useAuthStore } from "@/lib/stores/auth-store"
import { useLogsStore } from "@/lib/stores/logs-store"
import { useNavigationStore } from "@/lib/store-context"
import { ROUTES, PAGES, REDIRECT_QUERY, SESSION_EXPIRED_QUERY, ADMIN_SLUG_TO_PAGE } from "@/lib/routes"
import type { AdminPageKey } from "@/lib/routes"
import { getAdminHomeUrl } from "@/lib/auth/routes"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Lock, Mail, Loader2, ArrowLeft } from "lucide-react"
import { defaultTransition } from "@/lib/animations"
import { loginSchema } from "@/lib/utils/validation"

const DEFAULT_LOGIN_EMAIL = (typeof process !== "undefined" && process.env.NEXT_PUBLIC_ADMIN_DEFAULT_EMAIL) || "admin@tonomi.com"
const DEFAULT_LOGIN_PASSWORD = (typeof process !== "undefined" && process.env.NEXT_PUBLIC_ADMIN_DEFAULT_PASSWORD) || "admin123"

export function AdminLogin() {
  const [email, setEmail] = useState(DEFAULT_LOGIN_EMAIL)
  const [password, setPassword] = useState(DEFAULT_LOGIN_PASSWORD)
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const login = useAuthStore((state) => state.login)
  const addLog = useLogsStore((state) => state.addLog)
  const { setCurrentView, navigate } = useNavigationStore()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirectTo = searchParams.get(REDIRECT_QUERY) || ROUTES.dashboard
  const sessionExpired = searchParams.get(SESSION_EXPIRED_QUERY) === "1"

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError("")
    const parsed = loginSchema.safeParse({ email, password })
    if (!parsed.success) {
      const messages = parsed.error.issues.map((issue) => issue.message).filter(Boolean)
      setError(messages.length > 0 ? messages.join(". ") : "Vérifiez les champs.")
      return
    }
    setLoading(true)

    try {
      const success = await login(parsed.data.email, parsed.data.password)
      if (success) {
        const user = useAuthStore.getState().user
        if (user) {
          addLog({
            action: 'login',
            userId: user.id,
            userEmail: user.email,
            description: `Connexion de ${user.email}`,
          })
        }
        setCurrentView("admin")
        let targetUrl = redirectTo
        // Anciens liens ?view=admin&page=... → rediriger vers le path (/dashboard, /admin/xxx)
        if (redirectTo.startsWith("/?") && redirectTo.includes("view=admin")) {
          try {
            const u = new URL(redirectTo, "http://x")
            const pageParam = u.searchParams.get("page")
            const validKeys = Object.values(PAGES.admin) as string[]
            const adminPage: AdminPageKey = pageParam && validKeys.includes(pageParam) ? (pageParam as AdminPageKey) : PAGES.admin.dashboard
            targetUrl = getAdminHomeUrl(adminPage)
          } catch {
            targetUrl = getAdminHomeUrl(PAGES.admin.dashboard)
          }
        } else if (redirectTo.startsWith("/admin")) {
          const segment = redirectTo.replace(/^\/admin\/?/, "").split("/")[0] || "dashboard"
          const page = ADMIN_SLUG_TO_PAGE[segment] ?? PAGES.admin.dashboard
          targetUrl = getAdminHomeUrl(page)
        } else if (redirectTo === ROUTES.dashboard) {
          targetUrl = getAdminHomeUrl(PAGES.admin.dashboard)
        }
        router.replace(targetUrl)
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
      {/* Lien retour boutique — visible en haut à gauche */}
      <div className="absolute top-4 left-4 z-20">
        <button
          type="button"
          onClick={() => {
            setCurrentView("store")
            navigate(PAGES.store.home)
            router.replace(ROUTES.home)
          }}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 rounded-md"
          aria-label="Retour à la boutique"
        >
          <ArrowLeft className="h-4 w-4" />
          Retour à la boutique
        </button>
      </div>
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
              <Image
                src="/images/logo.png"
                alt="TONOMI ACCESSOIRES"
                width={160}
                height={160}
                className="h-32 md:h-40 w-auto object-contain"
              />
            </div>
            <CardDescription className="text-center text-base text-muted-foreground leading-relaxed">
              Espace administrateur — Connectez-vous pour accéder au tableau de bord
            </CardDescription>
          </CardHeader>
          <CardContent className="px-8 sm:px-10 pb-10">
            <form onSubmit={handleSubmit} className="space-y-5">
              {sessionExpired && (
                <Alert className="rounded-xl border-amber-500/50 bg-amber-500/10">
                  <AlertDescription>Session expirée, veuillez vous reconnecter.</AlertDescription>
                </Alert>
              )}
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
                    placeholder={DEFAULT_LOGIN_EMAIL}
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

              {(process.env.NODE_ENV === "development" || process.env.NEXT_PUBLIC_SHOW_DEMO_CREDENTIALS === "true") && (
                <div className="text-xs text-muted-foreground text-center pt-5 mt-2 border-t border-border/60">
                  <p>Identifiants par défaut :</p>
                  <p className="font-mono mt-1 text-muted-foreground/90">{DEFAULT_LOGIN_EMAIL} / ••••••••</p>
                </div>
              )}
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
