"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { useNavigationStore, useUIStore } from "@/lib/store-context"
import { PAGES } from "@/lib/routes"
import { useProducts, useOrders } from "@/hooks"
import { formatPrice, formatDate, getStatusColor, getStatusLabel } from "@/lib/formatters"
import { useCustomerAuthStore } from "@/lib/stores/customer-auth-store"
import { clientRegisterSchema, clientLoginSchema, emailFieldSchema, getZodErrorMessage } from "@/lib/utils/validation"
import { resetPassword } from "@/lib/services/auth"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardDescription, CardHeader } from "@/components/ui/card"
import { Package, Heart, MapPin, User, ShoppingBag, Info, LogOut } from "lucide-react"
import { Empty, EmptyHeader, EmptyMedia, EmptyTitle, EmptyDescription, EmptyContent } from "@/components/ui/empty"
import { ProductCard } from "./product-card"
import { toast } from "sonner"

type GuestMode = "guest" | "signup" | "login"

function AccountSignupForm({ onSuccess, onSwitchToLogin }: { onSuccess: () => void; onSwitchToLogin: () => void }) {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const register = useCustomerAuthStore((s) => s.register)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFieldErrors({})
    
    console.log("📝 Tentative d'inscription...", { firstName, lastName, email: email.substring(0, 5) + "***" })
    
    const result = clientRegisterSchema.safeParse({ firstName, lastName, email, password })
    if (!result.success) {
      console.log("❌ Erreur de validation:", result.error.issues)
      const errs: Record<string, string> = {}
      result.error.issues.forEach((e) => {
        const p = e.path[0] as string
        if (!errs[p]) errs[p] = e.message
      })
      setFieldErrors(errs)
      setError(getZodErrorMessage(result.error))
      return
    }
    
    setLoading(true)
    setError("")
    
    try {
      console.log("🔄 Appel de register()...")
      const success = await register(result.data.firstName, result.data.lastName, result.data.email, result.data.password)
      console.log("✅ Register retourné:", success)
      
      if (success) {
        toast.success("Compte créé. Vous êtes connecté.")
        onSuccess()
      } else {
        setError("L'inscription a échoué. Veuillez réessayer.")
      }
    } catch (err: unknown) {
      console.error("❌ Erreur lors de l'inscription:", err)
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue."
      setError(errorMessage)
      toast.error("Erreur lors de l'inscription", { description: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardDescription>Créer un compte client</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Inscription optionnelle. Vous pourrez retrouver vos commandes et favoris.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="signup-firstName">Prénom <span className="text-destructive" aria-hidden="true">*</span></Label>
              <Input
                id="signup-firstName"
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Prénom"
                autoComplete="given-name"
                aria-invalid={!!fieldErrors.firstName}
                aria-describedby={fieldErrors.firstName ? "signup-firstName-error" : undefined}
              />
              {fieldErrors.firstName && (
                <p id="signup-firstName-error" className="text-xs text-destructive">{fieldErrors.firstName}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="signup-lastName">Nom <span className="text-destructive" aria-hidden="true">*</span></Label>
              <Input
                id="signup-lastName"
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Nom"
                autoComplete="family-name"
                aria-invalid={!!fieldErrors.lastName}
                aria-describedby={fieldErrors.lastName ? "signup-lastName-error" : undefined}
              />
              {fieldErrors.lastName && (
                <p id="signup-lastName-error" className="text-xs text-destructive">{fieldErrors.lastName}</p>
              )}
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-email">Email <span className="text-destructive" aria-hidden="true">*</span></Label>
            <Input
              id="signup-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              autoComplete="email"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "signup-email-error" : undefined}
            />
            {fieldErrors.email && (
              <p id="signup-email-error" className="text-xs text-destructive">{fieldErrors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="signup-password">Mot de passe <span className="text-destructive" aria-hidden="true">*</span></Label>
            <Input
              id="signup-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="new-password"
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? "signup-password-error" : undefined}
            />
            {fieldErrors.password && (
              <p id="signup-password-error" className="text-xs text-destructive">{fieldErrors.password}</p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Création..." : "S&apos;inscrire"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Déjà un compte ?{" "}
          <button type="button" onClick={onSwitchToLogin} className="underline hover:no-underline text-foreground">
            Se connecter
          </button>
        </p>
      </CardContent>
    </Card>
  )
}

function AccountLoginForm({ onSuccess, onSwitchToSignup }: { onSuccess: () => void; onSwitchToSignup: () => void }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState("")
  const [forgotEmailError, setForgotEmailError] = useState("")
  const [forgotLoading, setForgotLoading] = useState(false)
  const login = useCustomerAuthStore((s) => s.login)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setFieldErrors({})
    
    console.log("🔐 Tentative de connexion...", { email: email.substring(0, 5) + "***" })
    
    const result = clientLoginSchema.safeParse({ email, password })
    if (!result.success) {
      console.log("❌ Erreur de validation:", result.error.issues)
      const errs: Record<string, string> = {}
      result.error.issues.forEach((e) => {
        const p = e.path[0] as string
        if (!errs[p]) errs[p] = e.message
      })
      setFieldErrors(errs)
      setError(getZodErrorMessage(result.error))
      return
    }
    
    setLoading(true)
    setError("")
    
    try {
      console.log("🔄 Appel de login()...")
      const ok = await login(result.data.email, result.data.password)
      console.log("✅ Login retourné:", ok)
      
      if (ok) {
        toast.success("Vous êtes connecté.")
        onSuccess()
      } else {
        setError("Email ou mot de passe incorrect.")
      }
    } catch (err: unknown) {
      console.error("❌ Erreur lors de la connexion:", err)
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue."
      setError(errorMessage)
      toast.error("Erreur lors de la connexion", { description: errorMessage })
    } finally {
      setLoading(false)
    }
  }

  const handleForgotSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setForgotEmailError("")
    const result = emailFieldSchema.safeParse(forgotEmail.trim())
    if (!result.success) {
      setForgotEmailError(result.error.issues[0]?.message ?? "Email invalide")
      return
    }
    setForgotLoading(true)
    try {
      await resetPassword(result.data)
      toast.success("Un email de réinitialisation vous a été envoyé.")
      setShowForgotPassword(false)
      setForgotEmail("")
    } catch (err: unknown) {
      setForgotEmailError(err instanceof Error ? err.message : "Erreur lors de l'envoi de l'email")
    } finally {
      setForgotLoading(false)
    }
  }

  if (showForgotPassword) {
    return (
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardDescription>Mot de passe oublié</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground">
            Saisissez votre adresse email pour recevoir un lien de réinitialisation.
          </p>
          <form onSubmit={handleForgotSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="forgot-email">Email</Label>
              <Input
                id="forgot-email"
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                placeholder="vous@exemple.com"
                autoComplete="email"
                aria-invalid={!!forgotEmailError}
                aria-describedby={forgotEmailError ? "forgot-email-error" : undefined}
              />
              {forgotEmailError && (
                <p id="forgot-email-error" className="text-xs text-destructive">{forgotEmailError}</p>
              )}
            </div>
            <Button type="submit" className="w-full" disabled={forgotLoading}>
              {forgotLoading ? "Envoi..." : "Envoyer le lien"}
            </Button>
          </form>
          <p className="text-center text-sm text-muted-foreground">
            <button
              type="button"
              onClick={() => { setShowForgotPassword(false); setForgotEmailError(""); setForgotEmail("") }}
              className="underline hover:no-underline text-foreground"
            >
              Retour à la connexion
            </button>
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardDescription>Se connecter à mon compte</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-sm text-destructive" role="alert">
              {error}
            </p>
          )}
          <div className="space-y-2">
            <Label htmlFor="login-email">Email <span className="text-destructive" aria-hidden="true">*</span></Label>
            <Input
              id="login-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vous@exemple.com"
              autoComplete="email"
              aria-invalid={!!fieldErrors.email}
              aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
            />
            {fieldErrors.email && (
              <p id="login-email-error" className="text-xs text-destructive">{fieldErrors.email}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="login-password">Mot de passe <span className="text-destructive" aria-hidden="true">*</span></Label>
            <Input
              id="login-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              aria-invalid={!!fieldErrors.password}
              aria-describedby={fieldErrors.password ? "login-password-error" : undefined}
            />
            {fieldErrors.password && (
              <p id="login-password-error" className="text-xs text-destructive">{fieldErrors.password}</p>
            )}
            <p className="text-right">
              <button
                type="button"
                onClick={() => setShowForgotPassword(true)}
                className="text-xs text-muted-foreground hover:text-foreground underline hover:no-underline"
              >
                Mot de passe oublié ?
              </button>
            </p>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Connexion..." : "Se connecter"}
          </Button>
        </form>
        <p className="text-center text-sm text-muted-foreground">
          Pas encore de compte ?{" "}
          <button type="button" onClick={onSwitchToSignup} className="underline hover:no-underline text-foreground">
            S&apos;inscrire
          </button>
        </p>
      </CardContent>
    </Card>
  )
}

function AccountGuestView({
  mode,
  onSignup,
  onLogin,
  onShowSignup,
  onShowLogin,
}: {
  mode: GuestMode
  onSignup: () => void
  onLogin: () => void
  onShowSignup: () => void
  onShowLogin: () => void
}) {
  return (
    <div className="mx-auto max-w-5xl px-4 py-8 space-y-8">
      <Alert className="rounded-lg border-amber-500/50 bg-amber-500/10" role="status">
        <Info className="h-4 w-4 text-amber-600 dark:text-amber-400" aria-hidden />
        <AlertDescription>
          <strong>Mode démo</strong> — Vous pouvez acheter sans compte. Créer un compte est optionnel pour retrouver
          vos commandes et favoris.
        </AlertDescription>
      </Alert>

      {mode === "guest" && (
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button onClick={onShowSignup} variant="default" size="lg">
            S&apos;inscrire
          </Button>
          <Button onClick={onShowLogin} variant="outline" size="lg">
            Se connecter
          </Button>
        </div>
      )}
      {mode === "signup" && <AccountSignupForm onSuccess={onSignup} onSwitchToLogin={onShowLogin} />}
      {mode === "login" && <AccountLoginForm onSuccess={onLogin} onSwitchToSignup={onShowSignup} />}
    </div>
  )
}

function AccountAuthenticatedView() {
  const { navigate } = useNavigationStore()
  const { wishlist } = useUIStore()
  const currentCustomerId = useCustomerAuthStore((s) => s.currentCustomerId)
  const currentCustomer = useCustomerAuthStore((s) => s.currentCustomer)
  const logout = useCustomerAuthStore((s) => s.logout)
  const { orders, isLoading: isLoadingOrders } = useOrders()
  const { products, isLoading: isLoadingProducts } = useProducts()

  if (!currentCustomer || !currentCustomerId) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 text-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  const customerOrders = orders.filter((o) => o.customerId === currentCustomer.id)
  const wishlistProducts = products.filter((p) => wishlist.some((w) => w.productId === p.id))

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div className="flex items-center gap-4">
          <div className="relative h-16 w-16 rounded-full overflow-hidden shrink-0">
            <Image
              src={currentCustomer.avatar || `https://ui-avatars.com/api/?name=${encodeURIComponent(currentCustomer.firstName + "+" + currentCustomer.lastName)}&background=random`}
              alt={`${currentCustomer.firstName} ${currentCustomer.lastName}`}
              fill
              className="object-cover"
              sizes="64px"
            />
          </div>
          <div>
            <h1 className="font-serif text-2xl font-bold">
              {currentCustomer.firstName} {currentCustomer.lastName}
            </h1>
            <p className="text-sm text-muted-foreground">{currentCustomer.email}</p>
          </div>
        </div>
        <Button variant="outline" size="sm" onClick={async () => { await logout() }} className="gap-2">
          <LogOut className="h-4 w-4" />
          Se déconnecter
        </Button>
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none p-0 overflow-x-auto">
          <TabsTrigger
            value="orders"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 gap-2"
          >
            <Package className="h-4 w-4" /> Commandes
          </TabsTrigger>
          <TabsTrigger
            value="wishlist"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 gap-2"
          >
            <Heart className="h-4 w-4" /> Favoris ({wishlist.length})
          </TabsTrigger>
          <TabsTrigger
            value="addresses"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 gap-2"
          >
            <MapPin className="h-4 w-4" /> Adresses
          </TabsTrigger>
          <TabsTrigger
            value="profile"
            className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 gap-2"
          >
            <User className="h-4 w-4" /> Profil
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="pt-6">
          {customerOrders.length === 0 ? (
            <Empty className="py-12 border-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <ShoppingBag className="size-6" aria-hidden />
                </EmptyMedia>
                <EmptyTitle>Aucune commande pour le moment</EmptyTitle>
                <EmptyDescription>Vos commandes apparaîtront ici une fois passées.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="flex flex-col gap-4">
              {customerOrders.map((order) => (
                <div key={order.id} className="bg-card border border-border rounded-lg p-4 md:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <p className="font-mono font-bold">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                  </div>
                  <div className="flex flex-col gap-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <div className="relative h-12 w-12 rounded overflow-hidden shrink-0">
                          <Image
                            src={item.image}
                            alt={item.name}
                            fill
                            className="object-cover"
                            sizes="48px"
                          />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-sm font-bold">Total : {formatPrice(order.total)}</span>
                    {order.trackingNumber && (
                      <span className="text-xs text-muted-foreground">Suivi : {order.trackingNumber}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="wishlist" className="pt-6">
          {wishlistProducts.length === 0 ? (
            <Empty className="py-12 border-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <Heart className="size-6" aria-hidden />
                </EmptyMedia>
                <EmptyTitle>Votre liste de favoris est vide</EmptyTitle>
                <EmptyDescription>Les articles que vous ajoutez aux favoris apparaîtront ici.</EmptyDescription>
              </EmptyHeader>
              <EmptyContent>
                <Button onClick={() => navigate(PAGES.store.catalog)} variant="outline">
                  Découvrir nos articles
                </Button>
              </EmptyContent>
            </Empty>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {wishlistProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="addresses" className="pt-6">
          {(currentCustomer.addresses || []).length === 0 ? (
            <Empty className="py-12 border-0">
              <EmptyHeader>
                <EmptyMedia variant="icon">
                  <MapPin className="size-6" aria-hidden />
                </EmptyMedia>
                <EmptyTitle>Aucune adresse</EmptyTitle>
                <EmptyDescription>Ajoutez une adresse lors de votre prochaine commande.</EmptyDescription>
              </EmptyHeader>
            </Empty>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {(currentCustomer.addresses || []).map((addr) => (
                <div key={addr.id} className="bg-card border border-border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-sm">{addr.label}</span>
                    {addr.isDefault && (
                      <Badge variant="secondary" className="text-xs">
                        Par défaut
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{addr.street}</p>
                  <p className="text-sm text-muted-foreground">
                    {addr.zipCode} {addr.city}
                  </p>
                  <p className="text-sm text-muted-foreground">{addr.country}</p>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="profile" className="pt-6">
          <div className="bg-card border border-border rounded-lg p-6 max-w-lg">
            <h3 className="font-semibold mb-4">Informations personnelles</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Prénom</span>
                <span>{currentCustomer.firstName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Nom</span>
                <span>{currentCustomer.lastName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Email</span>
                <span>{currentCustomer.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Téléphone</span>
                <span>{currentCustomer.phone || "—"}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Client depuis</span>
                <span>{formatDate(currentCustomer.createdAt)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Total des achats</span>
                <span className="font-bold">{formatPrice(currentCustomer.totalSpent)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Commandes</span>
                <span>{currentCustomer.orderCount}</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export function AccountPage() {
  const currentCustomerId = useCustomerAuthStore((s) => s.currentCustomerId)
  const initialize = useCustomerAuthStore((s) => s.initialize)
  const isLoading = useCustomerAuthStore((s) => s.isLoading)
  const [guestMode, setGuestMode] = useState<GuestMode>("guest")

  useEffect(() => {
    initialize()
  }, [initialize])

  if (isLoading) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-8 text-center">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    )
  }

  if (currentCustomerId) {
    return <AccountAuthenticatedView />
  }

  return (
    <AccountGuestView
      mode={guestMode}
      onSignup={() => setGuestMode("guest")}
      onLogin={() => setGuestMode("guest")}
      onShowSignup={() => setGuestMode("signup")}
      onShowLogin={() => setGuestMode("login")}
    />
  )
}
