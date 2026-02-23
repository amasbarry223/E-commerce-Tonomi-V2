"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Image from "next/image"
import { useNavigationStore, useUIStore } from "@/lib/store-context"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import {
  LayoutDashboard, Package, FolderKanban, LayoutPanelTop, ShoppingCart, Users,
  BarChart3, Tag, Star, Settings, Store, Sun, Moon, Menu, X, ChevronRight, LogOut,
} from "lucide-react"
import { PAGES, ROUTES } from "@/lib/routes"

const navItems = [
  { id: PAGES.admin.dashboard, label: "Tableau de bord", icon: LayoutDashboard },
  { id: PAGES.admin.products, label: "Produits", icon: Package },
  { id: PAGES.admin.categories, label: "Catégories", icon: FolderKanban },
  { id: PAGES.admin.heroSlides, label: "Bannières hero", icon: LayoutPanelTop },
  { id: PAGES.admin.orders, label: "Commandes", icon: ShoppingCart },
  { id: PAGES.admin.customers, label: "Clients", icon: Users },
  { id: PAGES.admin.analytics, label: "Analytics", icon: BarChart3 },
  { id: PAGES.admin.promos, label: "Codes promo", icon: Tag },
  { id: PAGES.admin.reviews, label: "Avis clients", icon: Star },
  { id: PAGES.admin.settings, label: "Paramètres", icon: Settings },
]

/** Entrées du menu admin visibles selon le rôle (Paramètres = super-admin uniquement). */
function getNavItemsForRole(role: "admin" | "super-admin" | undefined) {
  if (role === "super-admin") return navItems
  return navItems.filter((item) => item.id !== PAGES.admin.settings)
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentPage, navigate, setCurrentView } = useNavigationStore()
  const { darkMode, toggleDarkMode } = useUIStore()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()

  const handleLogout = () => {
    logout()
    router.push(ROUTES.login)
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed z-50 lg:static inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="relative flex items-center justify-center h-20 px-4 border-b border-border">
          <button onClick={() => setCurrentView("store")} className="flex items-center justify-center text-foreground hover:text-accent transition-colors w-full">
            <Image 
              src="/images/logo.png" 
              alt="TONOMI ACCESSOIRES" 
              width={120}
              height={64}
              className="h-16 w-auto object-contain"
              priority
            />
          </button>
          <Button variant="ghost" size="icon" className="absolute right-4 lg:hidden h-11 w-11" onClick={() => setSidebarOpen(false)} aria-label="Fermer le menu">
            <X className="h-4 w-4" aria-hidden />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {getNavItemsForRole(user?.role).map(item => {
            const Icon = item.icon
            const isActive = currentPage === item.id
            return (
              <button
                key={item.id}
                onClick={() => { navigate(item.id); setSidebarOpen(false) }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors ${
                  isActive
                    ? "bg-accent/15 text-foreground font-medium"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </button>
            )
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground"
            onClick={() => setCurrentView("store")}
          >
            <Store className="h-4 w-4" />
            Voir la boutique
            <ChevronRight className="h-3 w-3 ml-auto" />
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
            aria-label="Se déconnecter et aller à la page de connexion admin"
          >
            <LogOut className="h-4 w-4" aria-hidden />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <Button variant="ghost" size="icon" className="lg:hidden shrink-0 h-11 w-11 sm:h-9 sm:w-9" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <nav aria-label="Fil d'Ariane">
              <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  {currentPage === PAGES.admin.dashboard ? (
                    <BreadcrumbPage>Tableau de bord</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink asChild>
                      <button type="button" onClick={() => navigate(PAGES.admin.dashboard)} className="hover:text-foreground transition-colors">
                        Tableau de bord
                      </button>
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {currentPage !== PAGES.admin.dashboard && (
                  <>
                    <BreadcrumbSeparator />
                    <BreadcrumbItem>
                      <BreadcrumbPage>
                        {navItems.find(n => n.id === currentPage)?.label || "Back-Office"}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                )}
              </BreadcrumbList>
            </Breadcrumb>
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-muted-foreground">Connecté en tant que</span>
              <span className="text-sm font-medium">{user?.email || "Admin"}</span>
            </div>
            <Button variant="ghost" size="icon" className="h-11 w-11 sm:h-9 sm:w-9" onClick={toggleDarkMode} aria-label={darkMode ? "Désactiver le mode sombre" : "Activer le mode sombre"}>
              {darkMode ? <Sun className="h-4 w-4" aria-hidden /> : <Moon className="h-4 w-4" aria-hidden />}
            </Button>
            <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-foreground" title={user?.email ?? "Admin"}>
              {user?.email ? (user.email.slice(0, 2).toUpperCase()) : "AD"}
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  )
}
