"use client"

import { useState, useEffect } from "react"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { AdminBreadcrumb } from "@/components/ui/breadcrumb-nav"
import {
  LayoutDashboard, Package, FolderKanban, LayoutPanelTop, ShoppingCart, Users,
  BarChart3, Tag, Star, Settings, Store, Menu, X, ChevronRight, LogOut,
} from "lucide-react"
import { PAGES, ROUTES, ADMIN_SLUG_TO_PAGE } from "@/lib/routes"
import { getAdminPath } from "@/lib/auth/routes"
import type { AdminPageKey } from "@/lib/routes"
import { useAdminAuthStore } from "@/lib/stores/admin-auth-store"
import { FullScreenLoading } from "@/components/ui/full-screen-loading"

/** Dérive la clé de page admin depuis le pathname (/dashboard ou /admin/xxx). */
function getAdminPageKeyFromPathname(pathname: string): AdminPageKey {
  if (pathname === ROUTES.dashboard) return PAGES.admin.dashboard
  if (pathname.startsWith(ROUTES.admin + "/")) {
    const segment = pathname.slice((ROUTES.admin + "/").length).split("/")[0]
    return ADMIN_SLUG_TO_PAGE[segment] ?? PAGES.admin.dashboard
  }
  return PAGES.admin.dashboard
}

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

/** Entrées du menu admin (Tout le monde est super-admin par défaut maintenant). */
function getNavItems() {
  return navItems
}

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const activePage = getAdminPageKeyFromPathname(pathname ?? "")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const router = useRouter()
  const { isAuthenticated, logout } = useAdminAuthStore()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true)
    if (!isAuthenticated) {
      router.push(ROUTES.admin + "/login")
    }
  }, [isAuthenticated, router])

  const handleLogout = () => {
    logout()
    router.push(ROUTES.admin + "/login")
  }

  if (!mounted || !isAuthenticated) {
    return <FullScreenLoading ariaLabel="Vérification de l'authentification" />
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
          <a href={ROUTES.home} className="flex items-center justify-center text-foreground hover:text-accent transition-colors w-full">
            <Image
              src="/images/logo.png"
              alt="TONOMI ACCESSOIRES"
              width={120}
              height={64}
              className="h-16 w-auto object-contain"
              priority
            />
          </a>
          <Button variant="ghost" size="icon" className="absolute right-4 lg:hidden h-11 w-11" onClick={() => setSidebarOpen(false)} aria-label="Fermer le menu">
            <X className="h-4 w-4" aria-hidden />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {getNavItems().map(item => {
            const Icon = item.icon
            const isActive = activePage === item.id
            const href = getAdminPath(item.id)
            return (
              <Link
                key={item.id}
                href={href}
                onClick={() => setSidebarOpen(false)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm mb-0.5 transition-colors ${isActive
                  ? "bg-accent/15 text-foreground font-medium"
                  : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                  }`}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-3 border-t border-border space-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground"
            asChild
          >
            <Link href={ROUTES.home}>
              <Store className="h-4 w-4" />
              Voir la boutique
              <ChevronRight className="h-3 w-3 ml-auto" />
            </Link>
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
              <AdminBreadcrumb
                dashboardHref={ROUTES.dashboard}
                isDashboard={activePage === PAGES.admin.dashboard}
                currentLabel={
                  activePage !== PAGES.admin.dashboard
                    ? navItems.find((n) => n.id === activePage)?.label ?? "Back-Office"
                    : undefined
                }
              />
            </nav>
          </div>
          <div className="flex items-center gap-3">
            <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-foreground" title="Admin">
              AD
            </div>
            <Button variant="ghost" size="icon" onClick={handleLogout} title="Se déconnecter">
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6 md:p-8 lg:p-10">
          {children}
        </main>
      </div>
    </div>
  )
}
