"use client"

import { useStore } from "@/lib/store-context"
import { useAuthStore } from "@/lib/stores/auth-store"
import { Button } from "@/components/ui/button"
import {
  LayoutDashboard, Package, FolderKanban, ShoppingCart, Users,
  BarChart3, Tag, Star, Settings, Store, Sun, Moon, Menu, X, ChevronRight, LogOut,
} from "lucide-react"
import { useState } from "react"

const navItems = [
  { id: "dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { id: "admin-products", label: "Produits", icon: Package },
  { id: "admin-categories", label: "Catégories", icon: FolderKanban },
  { id: "admin-orders", label: "Commandes", icon: ShoppingCart },
  { id: "admin-customers", label: "Clients", icon: Users },
  { id: "admin-analytics", label: "Analytics", icon: BarChart3 },
  { id: "admin-promos", label: "Codes promo", icon: Tag },
  { id: "admin-reviews", label: "Avis clients", icon: Star },
  { id: "admin-settings", label: "Parametres", icon: Settings },
]

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const { currentPage, navigate, setCurrentView, darkMode, toggleDarkMode } = useStore()
  const { user, logout } = useAuthStore()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const handleLogout = () => {
    logout()
    setCurrentView("store")
  }

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed z-50 lg:static inset-y-0 left-0 w-64 bg-card border-r border-border flex flex-col transition-transform duration-300 ${sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
        <div className="flex items-center justify-between h-20 px-4 border-b border-border">
          <button onClick={() => setCurrentView("store")} className="flex items-center gap-2 text-foreground hover:text-accent transition-colors">
            <img 
              src="/images/logo.png" 
              alt="TONOMI ACCESSOIRES" 
              className="h-20 w-auto object-contain"
            />
          </button>
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex-1 overflow-y-auto py-4 px-3">
          {navItems.map(item => {
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
            variant="ghost"
            size="sm"
            className="w-full justify-start gap-2 text-muted-foreground hover:text-destructive"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar */}
        <header className="h-16 border-b border-border bg-card flex items-center justify-between px-4 shrink-0">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setSidebarOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <h1 className="font-semibold text-lg capitalize">
              {navItems.find(n => n.id === currentPage)?.label || "Back-Office"}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:flex flex-col items-end">
              <span className="text-xs text-muted-foreground">Connecté en tant que</span>
              <span className="text-sm font-medium">{user?.email || "Admin"}</span>
            </div>
            <Button variant="ghost" size="icon" onClick={toggleDarkMode}>
              {darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <div className="h-8 w-8 rounded-full bg-accent/20 flex items-center justify-center text-xs font-bold text-foreground">
              AD
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
