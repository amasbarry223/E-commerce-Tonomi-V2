"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { LAYOUT_CONSTANTS } from "@/lib/constants"
import { toast } from "sonner"

export function AdminSettingsShipping() {
  return (
    <div className="flex flex-col gap-6 w-full">
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Options de livraison</CardTitle>
          <CardDescription>Configurez les méthodes et tarifs de livraison. Configuration démo – non persistée.</CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-sm">Livraison standard</p>
              <p className="text-xs text-muted-foreground">3-5 jours ouvrables</p>
            </div>
            <div className="flex items-center gap-4">
              <Input defaultValue={String(LAYOUT_CONSTANTS.STANDARD_SHIPPING_COST)} className="w-24 text-sm" />
              <Switch defaultChecked />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-sm">Livraison express</p>
              <p className="text-xs text-muted-foreground">1-2 jours ouvrables</p>
            </div>
            <div className="flex items-center gap-4">
              <Input defaultValue={String(LAYOUT_CONSTANTS.EXPRESS_SHIPPING_COST)} className="w-24 text-sm" />
              <Switch defaultChecked />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-sm">{LAYOUT_CONSTANTS.FREE_SHIPPING_LABEL_LONG}</p>
              <p className="text-xs text-muted-foreground">{"A partir d'un montant minimum"}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">Des</span>
                <Input defaultValue={String(LAYOUT_CONSTANTS.FREE_SHIPPING_THRESHOLD)} className="w-20 text-sm" />
                <span className="text-sm text-muted-foreground">EUR</span>
              </div>
              <Switch defaultChecked />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end"><Button onClick={() => toast.info("Configuration démo – les modifications ne sont pas enregistrées.")}>Sauvegarder</Button></div>
    </div>
  )
}
