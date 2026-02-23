"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Store, Truck, CreditCard, Bell, Shield, Users, FileText, Plus, Trash2, Edit, Search, Filter } from "lucide-react"
import { useUsersStore, type AdminUser } from "@/lib/stores/users-store"
import { formatDate, formatDateShort } from "@/lib/formatters"
import { userSchema, getZodErrorMessage } from "@/lib/utils/validation"
import { useLogsStore, type LogAction } from "@/lib/stores/logs-store"
import { useAuthStore } from "@/lib/stores/auth-store"
import { toast } from "sonner"
import { PaginationSimple as Pagination } from "@/components/ui/pagination"
import { usePagination } from "@/hooks/use-pagination"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog"
import { AdminSettingsGeneral } from "./admin-settings-general"
import { AdminSettingsShipping } from "./admin-settings-shipping"
import { RoleGuard } from "@/lib/guards"
import { ROUTES } from "@/lib/routes"

export function AdminSettings() {
  return (
    <RoleGuard
      role="super-admin"
      fallback={
        <div className="flex flex-col gap-6 w-full">
          <div>
            <h2 className="text-xl font-bold">Paramètres</h2>
            <p className="text-sm text-muted-foreground mt-1">Configuration de la boutique</p>
          </div>
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Accès réservé</CardTitle>
              <CardDescription>
                Seuls les super-administrateurs peuvent accéder aux paramètres (utilisateurs, logs, etc.).
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild>
                <Link href={ROUTES.dashboard}>Retour au tableau de bord</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      }
    >
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h2 className="text-xl font-bold">Paramètres</h2>
        <p className="text-sm text-muted-foreground">Configuration de la boutique</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none p-0 overflow-x-auto">
          <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 gap-2 text-sm">
            <Store className="h-4 w-4" /> Général
          </TabsTrigger>
          <TabsTrigger value="shipping" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 gap-2 text-sm">
            <Truck className="h-4 w-4" /> Livraison
          </TabsTrigger>
          <TabsTrigger value="payments" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 gap-2 text-sm">
            <CreditCard className="h-4 w-4" /> Paiement
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 gap-2 text-sm">
            <Bell className="h-4 w-4" /> Notifications
          </TabsTrigger>
          <TabsTrigger value="users" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 gap-2 text-sm">
            <Users className="h-4 w-4" /> Utilisateurs
          </TabsTrigger>
          <TabsTrigger value="logs" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 gap-2 text-sm">
            <FileText className="h-4 w-4" /> Logs
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="pt-6">
          <AdminSettingsGeneral />
        </TabsContent>

        <TabsContent value="shipping" className="pt-6">
          <AdminSettingsShipping />
        </TabsContent>

        <TabsContent value="payments" className="pt-6">
          <div className="flex flex-col gap-6 w-full">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Méthodes de paiement</CardTitle>
                <CardDescription>Activez et configurez les moyens de paiement acceptés. Configuration démo – non persistée.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                      <CreditCard className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">Carte bancaire</p>
                      <p className="text-xs text-muted-foreground">Visa, Mastercard, CB</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm">PayPal</p>
                      <p className="text-xs text-muted-foreground">Paiement sécurisé via PayPal</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end"><Button onClick={() => toast.info("Configuration démo – les modifications ne sont pas enregistrées.")}>Sauvegarder</Button></div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="pt-6">
          <div className="flex flex-col gap-6 w-full">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notifications email</CardTitle>
                <CardDescription>Gérez les emails automatiques envoyés aux clients et administrateurs. Configuration démo – non persistée.</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {[
                  { label: "Confirmation de commande", desc: "Email envoyé au client après commande", default: true },
                  { label: "Expédition de commande", desc: "Notification de suivi d'expédition", default: true },
                  { label: "Nouvelle commande (admin)", desc: "Notification pour l'administrateur", default: true },
                  { label: "Stock faible", desc: "Alerte quand un produit est en stock faible", default: false },
                  { label: "Nouvel avis client", desc: "Notification quand un avis est posté", default: false },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between py-3 border-b border-border last:border-0">
                    <div>
                      <p className="font-medium text-sm">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.default} />
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="flex justify-end"><Button onClick={() => toast.info("Configuration démo – les modifications ne sont pas enregistrées.")}>Sauvegarder</Button></div>
          </div>
        </TabsContent>

        <TabsContent value="users" className="pt-6">
          <UsersManagement />
        </TabsContent>

        <TabsContent value="logs" className="pt-6">
          <LogsManagement />
        </TabsContent>
      </Tabs>
    </div>
    </RoleGuard>
  )
}

// Composant pour la gestion des utilisateurs
function UsersManagement() {
  const { users, addUser, updateUser, deleteUser } = useUsersStore()
  const { user: currentUser } = useAuthStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [userToDelete, setUserToDelete] = useState<string | null>(null)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "admin" as "admin" | "super-admin",
    active: true,
  })

  const filtered = useMemo(() => users, [users])
  const {
    paginatedData,
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
    goToPage,
  } = usePagination(filtered, { itemsPerPage: 10 })

  const handleOpenDialog = (user?: AdminUser) => {
    if (user) {
      setEditingUser(user)
      setFormData({
        email: user.email,
        password: "",
        name: user.name,
        role: user.role,
        active: user.active,
      })
    } else {
      setEditingUser(null)
      setFormData({
        email: "",
        password: "",
        name: "",
        role: "admin",
        active: true,
      })
    }
    setIsDialogOpen(true)
  }

  const handleSubmit = () => {
    const toValidate = {
      name: formData.name,
      email: formData.email,
      role: formData.role,
      password: formData.password.trim() || undefined,
    }
    if (!editingUser && !formData.password.trim()) {
      toast.error('Le mot de passe est requis pour un nouvel utilisateur')
      return
    }
    const parsed = userSchema.safeParse(toValidate)
    if (!parsed.success) {
      toast.error(getZodErrorMessage(parsed.error, 'Vérifiez les champs.'))
      return
    }
    setIsSubmitting(true)
    if (editingUser) {
      const updates: Partial<AdminUser> = {
        email: parsed.data.email,
        name: parsed.data.name,
        role: parsed.data.role,
        active: formData.active,
      }
      if (parsed.data.password) {
        updates.password = parsed.data.password
      }
      updateUser(editingUser.id, updates)
      const authUser = useAuthStore.getState().user
        useLogsStore.getState().addLog({
          action: 'update_user',
          userId: authUser?.id ?? 'system',
          userEmail: authUser?.email ?? 'system',
          description: `Modification de l'utilisateur ${formData.name} (${formData.email})`,
        })
      toast.success(`Utilisateur "${parsed.data.name}" modifié avec succès`)
    } else {
      addUser({
        ...formData,
        name: parsed.data.name,
        email: parsed.data.email,
        password: parsed.data.password!,
        role: parsed.data.role,
      })
      toast.success(`Utilisateur "${parsed.data.name}" créé avec succès`)
    }
    setIsDialogOpen(false)
    setEditingUser(null)
    setFormData({ email: "", password: "", name: "", role: "admin", active: true })
    setIsSubmitting(false)
  }
  
  const handleDeleteClick = (id: string) => {
    setUserToDelete(id)
    setDeleteDialogOpen(true)
  }

  const confirmDeleteUser = () => {
    if (!userToDelete) return
    setIsDeleting(true)
    const user = users.find(u => u.id === userToDelete)
    if (user) {
      deleteUser(userToDelete)
      const authUser = useAuthStore.getState().user
      useLogsStore.getState().addLog({
        action: 'delete_user',
        userId: authUser?.id ?? 'system',
        userEmail: authUser?.email ?? 'system',
        description: `Suppression de l'utilisateur ${user.name} (${user.email})`,
      })
      toast.success(`Utilisateur "${user.name}" supprimé avec succès`)
    }
    setUserToDelete(null)
    setIsDeleting(false)
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Gestion des Utilisateurs</CardTitle>
            <CardDescription>Créez et gérez les comptes administrateurs</CardDescription>
          </div>
          <Button type="button" onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Nouvel utilisateur
          </Button>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rôle</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Créé le</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {paginatedData.map((user, index) => (
                  <TableRow key={user.id} index={index}>
                    <TableCell className="font-medium">{user.name}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.role === "super-admin" ? "default" : "secondary"}>
                        {user.role === "super-admin" ? "Super Admin" : "Admin"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.active ? "default" : "destructive"}>
                        {user.active ? "Actif" : "Inactif"}
                      </Badge>
                    </TableCell>
                    <TableCell>{formatDateShort(user.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-11 w-11 sm:h-8 sm:w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleOpenDialog(user)
                          }}
                          disabled={user.email === currentUser?.email}
                          aria-label={`Modifier l'utilisateur ${user.name}`}
                          title={user.email === currentUser?.email ? "Vous ne pouvez pas modifier votre propre compte" : undefined}
                        >
                          <Edit className="h-4 w-4" aria-hidden />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="h-11 w-11 sm:h-8 sm:w-8"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteClick(user.id)
                          }}
                          disabled={user.email === currentUser?.email || user.role === "super-admin"}
                          aria-label={`Supprimer l'utilisateur ${user.name}`}
                          title={
                            user.email === currentUser?.email
                              ? "Vous ne pouvez pas supprimer votre propre compte"
                              : user.role === "super-admin"
                                ? "Les super-admins ne peuvent pas être supprimés"
                                : undefined
                          }
                        >
                          <Trash2 className="h-4 w-4 text-destructive" aria-hidden />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          {/* Pagination dans la carte : toujours visible sous le tableau */}
          {filtered.length > 0 && (
            <div className="border-t border-border bg-muted/20 px-4 py-3 sm:px-6 mt-4">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalItems}
                itemsPerPage={itemsPerPage}
                onPageChange={goToPage}
                itemLabel="utilisateurs"
                className="w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog Création / Édition utilisateur */}
      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open)
          if (!open) {
            setEditingUser(null)
            setFormData({ email: "", password: "", name: "", role: "admin", active: true })
          }
        }}
      >
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto" key={editingUser?.id ?? "new"} size="lg">
          <DialogHeader>
            <DialogTitle className="flex items-center justify-between">
              <span>{editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</span>
              {editingUser && (
                <div className="flex items-center gap-2">
                  <Badge variant={formData.active ? "default" : "destructive"}>
                    {formData.active ? "Actif" : "Inactif"}
                  </Badge>
                  <Badge variant={formData.role === "super-admin" ? "default" : "secondary"}>
                    {formData.role === "super-admin" ? "Super Admin" : "Admin"}
                  </Badge>
                </div>
              )}
            </DialogTitle>
          </DialogHeader>

          {editingUser && (
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg mb-4">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <Users className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium">{editingUser.name}</p>
                <p className="text-sm text-muted-foreground">{editingUser.email}</p>
              </div>
            </div>
          )}

          <div className="flex flex-col gap-6">
            <div>
              <h4 className="font-semibold text-sm mb-3">Informations personnelles</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="user-name" className="text-sm">Nom complet</Label>
                  <Input
                    id="user-name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jean Dupont"
                    className="mt-1.5"
                  />
                </div>
                <div>
                  <Label htmlFor="user-email" className="text-sm">Email</Label>
                  <Input
                    id="user-email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@tonomi.com"
                    className="mt-1.5"
                  />
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3">Sécurité</h4>
              <div>
                <Label htmlFor="user-password" className="text-sm">
                  Mot de passe {editingUser && <span className="text-muted-foreground font-normal">(laisser vide pour ne pas modifier)</span>}
                </Label>
                <Input
                  id="user-password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="mt-1.5"
                />
                {!editingUser && (
                  <p className="text-xs text-muted-foreground mt-1">
                    Le mot de passe doit contenir au moins 8 caractères
                  </p>
                )}
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-sm mb-3">Permissions</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="user-role" className="text-sm">Rôle</Label>
                  <Select
                    value={formData.role}
                    onValueChange={(value: "admin" | "super-admin") => setFormData({ ...formData, role: value })}
                  >
                    <SelectTrigger id="user-role" className="mt-1.5">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="super-admin">Super Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.role === "super-admin"
                      ? "Accès complet à toutes les fonctionnalités"
                      : "Accès standard à l'administration"}
                  </p>
                </div>
                <div>
                  <Label htmlFor="user-status" className="text-sm">Statut du compte</Label>
                  <div className="mt-1.5 flex items-center justify-between p-3 border border-border rounded-lg">
                    <div>
                      <p className="text-sm font-medium">Compte actif</p>
                      <p className="text-xs text-muted-foreground">
                        {formData.active ? "L'utilisateur peut se connecter" : "L'utilisateur ne peut pas se connecter"}
                      </p>
                    </div>
                    <Switch
                      id="user-status"
                      checked={formData.active}
                      onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                    />
                  </div>
                </div>
              </div>
            </div>

            {editingUser && (
              <div className="border-t border-border pt-4">
                <h4 className="font-semibold text-sm mb-3">Informations supplémentaires</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Créé le</p>
                    <p className="font-medium">{formatDate(editingUser.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Dernière connexion</p>
                    <p className="font-medium">
                      {editingUser.lastLogin ? formatDate(editingUser.lastLogin) : "Jamais"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="flex justify-end gap-2 pt-4 mt-4 border-t border-border">
            <Button variant="outline" onClick={() => setIsDialogOpen(false)} size="sm">
              Annuler
            </Button>
            <Button onClick={handleSubmit} size="sm" className="gap-1.5" loading={isSubmitting}>
              {editingUser ? (
                <>
                  <Edit className="h-3.5 w-3.5" />
                  Enregistrer
                </>
              ) : (
                <>
                  <Plus className="h-3.5 w-3.5" />
                  Créer l&apos;utilisateur
                </>
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        title="Supprimer l'utilisateur"
        description={
          userToDelete
            ? (() => {
                const user = users.find((u) => u.id === userToDelete)
                return user
                  ? `Êtes-vous sûr de vouloir supprimer l'utilisateur "${user.name}" (${user.email}) ? Cette action est irréversible.`
                  : "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
              })()
            : "Êtes-vous sûr de vouloir supprimer cet utilisateur ? Cette action est irréversible."
        }
        onConfirm={confirmDeleteUser}
        loading={isDeleting}
      />
    </div>
  )
}

// Composant pour la gestion des logs
function LogsManagement() {
  const { getLogs, clearLogs, deleteLog } = useLogsStore()
  const [filterAction, setFilterAction] = useState<LogAction | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [clearLogsDialogOpen, setClearLogsDialogOpen] = useState(false)

  const filteredLogs = getLogs(filterAction !== "all" ? { action: filterAction } : {}).filter(
    (log) =>
      log.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      log.userEmail.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const actionLabels: Record<LogAction, string> = {
    login: "Connexion",
    logout: "Déconnexion",
    create_product: "Création produit",
    update_product: "Modification produit",
    delete_product: "Suppression produit",
    create_order: "Création commande",
    update_order: "Modification commande",
    create_user: "Création utilisateur",
    update_user: "Modification utilisateur",
    delete_user: "Suppression utilisateur",
    update_settings: "Modification paramètres",
    other: "Autre",
  }

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Gestion des Logs</CardTitle>
          <CardDescription>Traçabilité des actions dans le système</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher dans les logs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterAction} onValueChange={(value) => setFilterAction(value as LogAction | "all")}>
                <SelectTrigger className="w-48">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Toutes les actions</SelectItem>
                  {Object.entries(actionLabels).map(([value, label]) => (
                    <SelectItem key={value} value={value}>
                      {label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={() => setClearLogsDialogOpen(true)}>
                Effacer les logs
              </Button>
            </div>

            <div className="border rounded-lg overflow-hidden">
              <div className="max-h-[600px] overflow-y-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date/Heure</TableHead>
                      <TableHead>Action</TableHead>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Description</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredLogs.length === 0 ? (
                      <TableRow>
                        <TableCell colSpan={5} className="py-0 border-0">
                          <AdminEmptyState
                            title="Aucun log trouvé"
                            description="Les logs d'activité apparaîtront ici."
                            icon={FileText}
                          />
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log, index) => (
                        <TableRow key={log.id} index={index}>
                          <TableCell className="text-sm">
                            {new Date(log.timestamp).toLocaleString("fr-FR")}
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">{actionLabels[log.action] || log.action}</Badge>
                          </TableCell>
                          <TableCell>{log.userEmail}</TableCell>
                          <TableCell className="max-w-md truncate">{log.description}</TableCell>
                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-11 w-11 sm:h-8 sm:w-8"
                              onClick={() => {
                                deleteLog(log.id)
                                toast.success("Log supprimé avec succès")
                              }}
                              aria-label="Supprimer le log"
                            >
                              <Trash2 className="h-4 w-4" aria-hidden />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Clear Logs Confirmation Dialog */}
      <ConfirmDeleteDialog
        open={clearLogsDialogOpen}
        onOpenChange={setClearLogsDialogOpen}
        title="Supprimer tous les logs"
        description="Êtes-vous sûr de vouloir supprimer tous les logs ? Cette action est irréversible et supprimera toute l'historique des actions."
        onConfirm={() => {
          clearLogs()
          toast.success("Tous les logs ont été supprimés")
        }}
        confirmLabel="Supprimer tous les logs"
      />
    </div>
  )
}
