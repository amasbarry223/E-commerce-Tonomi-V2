"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Store, Truck, CreditCard, Bell, Shield } from "lucide-react"

export function AdminSettings() {
  return (
    <div className="flex flex-col gap-6 max-w-3xl">
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
        </TabsList>

        <TabsContent value="general" className="pt-6">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Informations de la boutique</CardTitle>
                <CardDescription>Details generaux de votre boutique</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <Label className="text-sm">Nom de la boutique</Label>
                  <Input defaultValue="LUXE - Maroquinerie de luxe" className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">Description</Label>
                  <Textarea defaultValue="Boutique en ligne de maroquinerie de luxe. Decouvrez nos collections de sacs, portefeuilles et accessoires en cuir veritable." className="mt-1 min-h-[80px]" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Email de contact</Label>
                    <Input defaultValue="contact@luxe-store.fr" className="mt-1" />
                  </div>
                  <div>
                    <Label className="text-sm">Telephone</Label>
                    <Input defaultValue="+33 1 23 45 67 89" className="mt-1" />
                  </div>
                </div>
                <div>
                  <Label className="text-sm">Adresse</Label>
                  <Input defaultValue="12 Rue du Faubourg Saint-Honore, 75008 Paris" className="mt-1" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label className="text-sm">Devise</Label>
                    <Select defaultValue="EUR">
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="EUR">EUR - Euro</SelectItem>
                        <SelectItem value="USD">USD - Dollar US</SelectItem>
                        <SelectItem value="GBP">GBP - Livre Sterling</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-sm">Langue</Label>
                    <Select defaultValue="fr">
                      <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="fr">Francais</SelectItem>
                        <SelectItem value="en">English</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">SEO</CardTitle>
                <CardDescription>Optimisation pour les moteurs de recherche</CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div>
                  <Label className="text-sm">Titre de la page</Label>
                  <Input defaultValue="LUXE - Maroquinerie de luxe en ligne" className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">Meta description</Label>
                  <Textarea defaultValue="Decouvrez notre collection de sacs en cuir, portefeuilles et accessoires de luxe. Livraison gratuite des 100EUR." className="mt-1" />
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button>Sauvegarder</Button>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="shipping" className="pt-6">
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Options de livraison</CardTitle>
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
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Methodes de paiement</CardTitle>
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
          <div className="flex flex-col gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Notifications email</CardTitle>
                <CardDescription>Gerez les emails automatiques</CardDescription>
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
      </Tabs>
    </div>
  )
}
