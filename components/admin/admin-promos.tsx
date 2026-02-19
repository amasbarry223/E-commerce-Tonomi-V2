"use client"

import { promoCodes, formatPrice, formatDate } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus, Tag, Copy, Trash2, MoreHorizontal, Percent, Calendar, Settings, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { useState } from "react"

export function AdminPromos() {
  const [showAdd, setShowAdd] = useState(false)

  const activeCount = promoCodes.filter(p => p.active && new Date(p.endDate) > new Date()).length

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold">Codes promo</h2>
          <p className="text-sm text-muted-foreground">{promoCodes.length} codes | {activeCount} actifs</p>
        </div>
        <Dialog open={showAdd} onOpenChange={setShowAdd}>
          <DialogTrigger asChild>
            <Button size="sm" className="gap-1.5"><Plus className="h-3.5 w-3.5" /> Nouveau code</Button>
          </DialogTrigger>
          <DialogContent className="max-w-lg">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Nouveau code promo
              </DialogTitle>
            </DialogHeader>
            
            <Tabs defaultValue="basic" className="mt-4">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic" className="gap-1.5 text-xs">
                  <Tag className="h-3.5 w-3.5" />
                  Code
                </TabsTrigger>
                <TabsTrigger value="conditions" className="gap-1.5 text-xs">
                  <Settings className="h-3.5 w-3.5" />
                  Conditions
                </TabsTrigger>
                <TabsTrigger value="dates" className="gap-1.5 text-xs">
                  <Calendar className="h-3.5 w-3.5" />
                  Dates
                </TabsTrigger>
                <TabsTrigger value="preview" className="gap-1.5 text-xs">
                  <Eye className="h-3.5 w-3.5" />
                  Aperçu
                </TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="promo-code" className="text-sm font-medium">Code promo</Label>
                  <Input 
                    id="promo-code"
                    className="mt-1.5 font-mono uppercase font-bold" 
                    placeholder="SUMMER2026"
                    maxLength={20}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <Label htmlFor="promo-type" className="text-sm font-medium">Type</Label>
                    <Select defaultValue="percentage">
                      <SelectTrigger id="promo-type" className="mt-1.5">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">
                          <div className="flex items-center gap-2">
                            <Percent className="h-3.5 w-3.5" />
                            Pourcentage
                          </div>
                        </SelectItem>
                        <SelectItem value="fixed">Montant fixe</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label htmlFor="promo-value" className="text-sm font-medium">Valeur</Label>
                    <Input 
                      id="promo-value"
                      type="number" 
                      className="mt-1.5" 
                      placeholder="10"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2 p-3 bg-muted/50 rounded-lg">
                  <input 
                    type="checkbox" 
                    id="promo-active"
                    defaultChecked
                    className="h-4 w-4 rounded border-border"
                  />
                  <Label htmlFor="promo-active" className="text-sm cursor-pointer">
                    Actif immédiatement
                  </Label>
                </div>
              </TabsContent>

              <TabsContent value="conditions" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="promo-min-amount" className="text-sm font-medium">Montant minimum (€)</Label>
                  <Input 
                    id="promo-min-amount"
                    type="number" 
                    className="mt-1.5" 
                    placeholder="0"
                    min="0"
                    step="0.01"
                  />
                </div>
                <div>
                  <Label htmlFor="promo-max-uses" className="text-sm font-medium">Limite d'utilisations</Label>
                  <Input 
                    id="promo-max-uses"
                    type="number" 
                    className="mt-1.5" 
                    placeholder="100"
                    min="1"
                  />
                </div>
              </TabsContent>

              <TabsContent value="dates" className="space-y-4 mt-4">
                <div>
                  <Label htmlFor="promo-start-date" className="text-sm font-medium">Date de début</Label>
                  <Input 
                    id="promo-start-date"
                    type="date" 
                    className="mt-1.5"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
                <div>
                  <Label htmlFor="promo-end-date" className="text-sm font-medium">Date de fin</Label>
                  <Input 
                    id="promo-end-date"
                    type="date" 
                    className="mt-1.5"
                    min={new Date().toISOString().split('T')[0]}
                  />
                </div>
              </TabsContent>

              <TabsContent value="preview" className="mt-4">
                <div className="p-4 bg-muted/30 rounded-lg border border-border">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Tag className="h-4 w-4 text-muted-foreground" />
                      <span className="font-mono font-bold text-lg">SUMMER2026</span>
                    </div>
                    <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400 text-xs">
                      Actif
                    </Badge>
                  </div>
                  <div className="space-y-2">
                    <p className="text-2xl font-bold">-10%</p>
                    <div className="flex flex-col gap-1 text-xs text-muted-foreground">
                      <span>Min. commande : 0€</span>
                      <span>Limite : 100 utilisations</span>
                      <span>Période : 01/01/2026 - 31/12/2026</span>
                    </div>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-3 text-center">
                  Aperçu du code promo tel qu'il apparaîtra dans la liste
                </p>
              </TabsContent>
            </Tabs>

            <div className="flex justify-end gap-2 pt-4 mt-4 border-t">
              <Button variant="outline" onClick={() => setShowAdd(false)} size="sm">
                Annuler
              </Button>
              <Button onClick={() => setShowAdd(false)} size="sm" className="gap-1.5">
                <Plus className="h-3.5 w-3.5" />
                Créer
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {promoCodes.map(promo => {
          const isExpired = new Date(promo.endDate) < new Date()
          const isActive = promo.active && !isExpired

          return (
            <Card key={promo.id} className={`${!isActive ? "opacity-60" : ""}`}>
              <CardContent className="pt-6">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-muted-foreground" />
                    <span className="font-mono font-bold text-lg">{promo.code}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Badge className={isActive
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-400"
                    }>
                      {isExpired ? "Expire" : isActive ? "Actif" : "Inactif"}
                    </Badge>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem className="gap-2"><Copy className="h-3.5 w-3.5" /> Copier le code</DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 text-destructive"><Trash2 className="h-3.5 w-3.5" /> Supprimer</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>

                <p className="text-2xl font-bold mb-1">
                  {promo.type === "percentage" ? `-${promo.value}%` : promo.type === "fixed" ? `-${formatPrice(promo.value)}` : "Livraison gratuite"}
                </p>
                {promo.minAmount && promo.minAmount > 0 && (
                  <p className="text-xs text-muted-foreground">Min. commande : {formatPrice(promo.minAmount)}</p>
                )}

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-border text-xs text-muted-foreground">
                  <span>{promo.usedCount}/{promo.maxUses} utilise{promo.usedCount > 1 ? "s" : ""}</span>
                  <span>Expire le {formatDate(promo.endDate)}</span>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
