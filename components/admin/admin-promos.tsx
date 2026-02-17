"use client"

import { promoCodes, formatPrice, formatDate } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Tag, Copy, Trash2, MoreHorizontal } from "lucide-react"
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
          <DialogContent>
            <DialogHeader><DialogTitle>Nouveau code promo</DialogTitle></DialogHeader>
            <div className="flex flex-col gap-4">
              <div>
                <Label className="text-sm">Code</Label>
                <Input className="mt-1 font-mono uppercase" placeholder="EX: SUMMER2026" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Type</Label>
                  <Select defaultValue="percentage">
                    <SelectTrigger className="mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage">Pourcentage</SelectItem>
                      <SelectItem value="fixed">Montant fixe</SelectItem>
                      <SelectItem value="shipping">Livraison gratuite</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label className="text-sm">Valeur</Label>
                  <Input type="number" className="mt-1" placeholder="10" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Min. commande</Label>
                  <Input type="number" className="mt-1" placeholder="0" />
                </div>
                <div>
                  <Label className="text-sm">Limite utilisations</Label>
                  <Input type="number" className="mt-1" placeholder="100" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm">Debut</Label>
                  <Input type="date" className="mt-1" />
                </div>
                <div>
                  <Label className="text-sm">Fin</Label>
                  <Input type="date" className="mt-1" />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="outline" onClick={() => setShowAdd(false)}>Annuler</Button>
                <Button onClick={() => setShowAdd(false)}>Creer</Button>
              </div>
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
