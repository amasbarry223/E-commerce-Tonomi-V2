"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Store, Truck, CreditCard, Bell, Shield, Users, FileText, Plus, Trash2, Edit, Search, Filter } from "lucide-react"
import { useUsersStore, type AdminUser } from "@/lib/stores/users-store"
import { useLogsStore, type LogEntry, type LogAction } from "@/lib/stores/logs-store"
import { useAuthStore } from "@/lib/stores/auth-store"

export function AdminSettings() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <div>
        <h2 className="text-xl font-bold">Parametres</h2>
        <p className="text-sm text-muted-foreground">Configuration de la boutique</p>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none p-0 overflow-x-auto">
          <TabsTrigger value="general" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 gap-2 text-sm">
            <Store className="h-4 w-4" /> General
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
          <div className="flex flex-col gap-6">
            {/* Grille pour les deux cartes principales côte à côte */}
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-lg">Informations de la boutique</CardTitle>
                  <CardDescription>Details generaux de votre boutique</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                  <div>
                    <Label className="text-base font-medium">Nom de la boutique</Label>
                    <Input defaultValue="TONOMI ACCESSOIRES" className="mt-2 h-11 text-base" />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Description</Label>
                    <Textarea defaultValue="Boutique en ligne de maroquinerie de luxe. Decouvrez nos collections de sacs, portefeuilles et accessoires en cuir veritable." className="mt-2 min-h-[120px] text-base" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-base font-medium">Email de contact</Label>
                      <Input defaultValue="contact@tonomi.com" className="mt-2 h-11 text-base" />
                    </div>
                    <div>
                      <Label className="text-base font-medium">Telephone</Label>
                      <Input defaultValue="+33 1 23 45 67 89" className="mt-2 h-11 text-base" />
                    </div>
                  </div>
                  <div>
                    <Label className="text-base font-medium">Adresse</Label>
                    <Input defaultValue="12 Rue du Faubourg Saint-Honore, 75008 Paris" className="mt-2 h-11 text-base" />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <Label className="text-base font-medium">Devise</Label>
                      <Select defaultValue="EUR">
                        <SelectTrigger className="mt-2 h-11 text-base"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="EUR">EUR - Euro</SelectItem>
                          <SelectItem value="USD">USD - Dollar US</SelectItem>
                          <SelectItem value="GBP">GBP - Livre Sterling</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label className="text-base font-medium">Langue</Label>
                      <Select defaultValue="fr">
                        <SelectTrigger className="mt-2 h-11 text-base"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="fr">Francais</SelectItem>
                          <SelectItem value="en">English</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="h-fit">
                <CardHeader>
                  <CardTitle className="text-lg">SEO</CardTitle>
                  <CardDescription>Optimisation pour les moteurs de recherche</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-5">
                  <div>
                    <Label className="text-base font-medium">Titre de la page</Label>
                    <Input defaultValue="TONOMI ACCESSOIRES - Maroquinerie de luxe en ligne" className="mt-2 h-11 text-base" />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Meta description</Label>
                    <Textarea defaultValue="Decouvrez notre collection de sacs en cuir, portefeuilles et accessoires de luxe. Livraison gratuite des 100EUR." className="mt-2 min-h-[120px] text-base" />
                  </div>
                  <div>
                    <Label className="text-base font-medium">Mots-clés (séparés par des virgules)</Label>
                    <Input defaultValue="maroquinerie, sacs, portefeuilles, accessoires, cuir, luxe" className="mt-2 h-11 text-base" />
                  </div>
                  <div>
                    <Label className="text-base font-medium">URL canonique</Label>
                    <Input defaultValue="https://www.tonomi.com" className="mt-2 h-11 text-base" />
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="flex justify-end">
              <Button>Sauvegarder</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="pt-6">
          <div className="flex flex-col gap-6 w-full">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Options de livraison</CardTitle>
                <CardDescription>Configurez les méthodes et tarifs de livraison</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Livraison standard</p>
                    <p className="text-xs text-muted-foreground">3-5 jours ouvrables</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input defaultValue="5.99" className="w-24 text-sm" />
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Livraison express</p>
                    <p className="text-xs text-muted-foreground">1-2 jours ouvrables</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <Input defaultValue="9.99" className="w-24 text-sm" />
                    <Switch defaultChecked />
                  </div>
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div>
                    <p className="font-medium text-sm">Livraison gratuite</p>
                    <p className="text-xs text-muted-foreground">{"A partir d'un montant minimum"}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1">
                      <span className="text-sm text-muted-foreground">Des</span>
                      <Input defaultValue="100" className="w-20 text-sm" />
                      <span className="text-sm text-muted-foreground">EUR</span>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end"><Button>Sauvegarder</Button></div>
          </div>
        </TabsContent>

        <TabsContent value="payments" className="pt-6">
          <div className="flex flex-col gap-6 w-full">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Methodes de paiement</CardTitle>
                <CardDescription>Activez et configurez les moyens de paiement acceptés</CardDescription>
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
                      <p className="text-xs text-muted-foreground">Paiement securise via PayPal</p>
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </CardContent>
            </Card>
            <div className="flex justify-end"><Button>Sauvegarder</Button></div>
          </div>
        </TabsContent>

        <TabsContent value="notifications" className="pt-6">
          <div className="flex flex-col gap-6 w-full">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notifications email</CardTitle>
                <CardDescription>Gerez les emails automatiques envoyés aux clients et administrateurs</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-3">
                {[
                  { label: "Confirmation de commande", desc: "Email envoye au client apres commande", default: true },
                  { label: "Expedition de commande", desc: "Notification de suivi d'expedition", default: true },
                  { label: "Nouvelle commande (admin)", desc: "Notification pour l'administrateur", default: true },
                  { label: "Stock faible", desc: "Alerte quand un produit est en stock faible", default: false },
                  { label: "Nouvel avis client", desc: "Notification quand un avis est poste", default: false },
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
            <div className="flex justify-end"><Button>Sauvegarder</Button></div>
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
  )
}

// Composant pour la gestion des utilisateurs
function UsersManagement() {
  const { users, addUser, updateUser, deleteUser } = useUsersStore()
  const { user: currentUser } = useAuthStore()
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<AdminUser | null>(null)
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    name: "",
    role: "admin" as "admin" | "super-admin",
    active: true,
  })

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
    if (editingUser) {
      updateUser(editingUser.id, formData)
      // Ajouter un log
      const { useLogsStore } = require('@/lib/stores/logs-store')
      const { useAuthStore } = require('@/lib/stores/auth-store')
      const logsStore = useLogsStore.getState()
      const authStore = useAuthStore.getState()
      logsStore.addLog({
        action: 'update_user',
        userId: authStore.user?.id || 'system',
        userEmail: authStore.user?.email || 'system',
        description: `Modification de l'utilisateur ${formData.name} (${formData.email})`,
      })
    } else {
      addUser(formData)
    }
    setIsDialogOpen(false)
    setEditingUser(null)
  }
  
  const handleDelete = (id: string) => {
    const userToDelete = users.find(u => u.id === id)
    if (userToDelete && confirm(`Êtes-vous sûr de vouloir supprimer l'utilisateur ${userToDelete.name} ?`)) {
      deleteUser(id)
      // Ajouter un log
      const { useLogsStore } = require('@/lib/stores/logs-store')
      const { useAuthStore } = require('@/lib/stores/auth-store')
      const logsStore = useLogsStore.getState()
      const authStore = useAuthStore.getState()
      logsStore.addLog({
        action: 'delete_user',
        userId: authStore.user?.id || 'system',
        userEmail: authStore.user?.email || 'system',
        description: `Suppression de l'utilisateur ${userToDelete.name} (${userToDelete.email})`,
      })
    }
  }


  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="text-base">Gestion des Utilisateurs</CardTitle>
            <CardDescription>Créez et gérez les comptes administrateurs</CardDescription>
          </div>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button onClick={() => handleOpenDialog()}>
                <Plus className="h-4 w-4 mr-2" />
                Nouvel utilisateur
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{editingUser ? "Modifier l'utilisateur" : "Nouvel utilisateur"}</DialogTitle>
                <DialogDescription>
                  {editingUser ? "Modifiez les informations de l'utilisateur" : "Créez un nouveau compte administrateur"}
                </DialogDescription>
              </DialogHeader>
              <div className="flex flex-col gap-4 py-4">
                <div>
                  <Label>Nom complet</Label>
                  <Input
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Jean Dupont"
                  />
                </div>
                <div>
                  <Label>Email</Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="admin@tonomi.com"
                  />
                </div>
                <div>
                  <Label>Mot de passe {editingUser && "(laisser vide pour ne pas modifier)"}</Label>
                  <Input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
                <div>
                  <Label>Rôle</Label>
                  <Select value={formData.role} onValueChange={(value: "admin" | "super-admin") => setFormData({ ...formData, role: value })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="admin">Administrateur</SelectItem>
                      <SelectItem value="super-admin">Super Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center justify-between">
                  <Label>Compte actif</Label>
                  <Switch
                    checked={formData.active}
                    onCheckedChange={(checked) => setFormData({ ...formData, active: checked })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsDialogOpen(false)}>Annuler</Button>
                <Button onClick={handleSubmit}>
                  {editingUser ? "Modifier" : "Créer"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
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
                {users.map((user) => (
                  <TableRow key={user.id}>
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
                    <TableCell>{new Date(user.createdAt).toLocaleDateString("fr-FR")}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleOpenDialog(user)}
                          disabled={user.email === currentUser?.email}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDelete(user.id)}
                          disabled={user.email === currentUser?.email || user.role === "super-admin"}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

// Composant pour la gestion des logs
function LogsManagement() {
  const { logs, getLogs, clearLogs, deleteLog } = useLogsStore()
  const [filterAction, setFilterAction] = useState<LogAction | "all">("all")
  const [searchQuery, setSearchQuery] = useState("")

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
              <Button variant="outline" onClick={() => {
                if (confirm("Êtes-vous sûr de vouloir supprimer tous les logs ?")) {
                  clearLogs()
                }
              }}>
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
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          Aucun log trouvé
                        </TableCell>
                      </TableRow>
                    ) : (
                      filteredLogs.map((log) => (
                        <TableRow key={log.id}>
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
                              onClick={() => deleteLog(log.id)}
                            >
                              <Trash2 className="h-4 w-4" />
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
    </div>
  )
}
