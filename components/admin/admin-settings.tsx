"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Store, Truck, CreditCard, Bell, Shield, FileText, Trash2, Search, Filter } from "lucide-react"
import { useLogsStore, type LogAction } from "@/lib/stores/logs-store"
import { toast } from "sonner"
import { AdminEmptyState } from "@/components/admin/admin-empty-state"
import { ConfirmDeleteDialog } from "@/components/ui/confirm-delete-dialog"
import { AdminSettingsGeneral } from "./admin-settings-general"
import { AdminSettingsShipping } from "./admin-settings-shipping"
export function AdminSettings() {
  const [isSavingPayments, setIsSavingPayments] = useState(false)
  const [isSavingNotifications, setIsSavingNotifications] = useState(false)

  const handleSavePayments = async () => {
    setIsSavingPayments(true)
    await new Promise(r => setTimeout(r, 400))
    toast.info("Configuration démo – les modifications ne sont pas enregistrées.")
    setIsSavingPayments(false)
  }

  const handleSaveNotifications = async () => {
    setIsSavingNotifications(true)
    await new Promise(r => setTimeout(r, 400))
    toast.info("Configuration démo – les modifications ne sont pas enregistrées.")
    setIsSavingNotifications(false)
  }
  return (
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
                      <p className="font-medium text-sm" id="pay-card-label">Carte bancaire</p>
                      <p className="text-xs text-muted-foreground">Visa, Mastercard, CB</p>
                    </div>
                  </div>
                  <Switch defaultChecked aria-labelledby="pay-card-label" />
                </div>
                <div className="flex items-center justify-between p-4 border border-border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-lg bg-indigo-100 dark:bg-indigo-900/30 flex items-center justify-center">
                      <Shield className="h-5 w-5 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium text-sm" id="pay-paypal-label">PayPal</p>
                      <p className="text-xs text-muted-foreground">Paiement sécurisé via PayPal</p>
                    </div>
                  </div>
                  <Switch defaultChecked aria-labelledby="pay-paypal-label" />
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
                      <p className="font-medium text-sm" id={`notif-${item.label.replace(/\s+/g, '-').toLowerCase()}`}>{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                    <Switch defaultChecked={item.default} aria-labelledby={`notif-${item.label.replace(/\s+/g, '-').toLowerCase()}`} />
                  </div>
                ))}
              </CardContent>
            </Card>
            <div className="flex justify-end"><Button onClick={() => toast.info("Configuration démo – les modifications ne sont pas enregistrées.")}>Sauvegarder</Button></div>
          </div>
        </TabsContent>


        <TabsContent value="logs" className="pt-6">
          <LogsManagement />
        </TabsContent>
      </Tabs>
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
