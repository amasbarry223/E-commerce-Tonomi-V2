"use client"

import { useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { LAYOUT_CONSTANTS } from "@/lib/constants"
import { toast } from "sonner"

export function AdminSettingsShipping() {
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = useCallback(async () => {
    setIsSaving(true)
    await new Promise(r => setTimeout(r, 400))
    toast.info("Configuration démo – les modifications ne sont pas enregistrées.")
    setIsSaving(false)
  }, [])
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
              <p className="font-medium text-sm" id="shipping-standard-label">Livraison standard</p>
              <p className="text-xs text-muted-foreground">3-5 jours ouvrables</p>
            </div>
            <div className="flex items-center gap-4">
              <Input defaultValue={String(LAYOUT_CONSTANTS.STANDARD_SHIPPING_COST)} className="w-24 text-sm" aria-label="Prix livraison standard" />
              <Switch defaultChecked aria-labelledby="shipping-standard-label" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-sm" id="shipping-express-label">Livraison express</p>
              <p className="text-xs text-muted-foreground">1-2 jours ouvrables</p>
            </div>
            <div className="flex items-center gap-4">
              <Input defaultValue={String(LAYOUT_CONSTANTS.EXPRESS_SHIPPING_COST)} className="w-24 text-sm" aria-label="Prix livraison express" />
              <Switch defaultChecked aria-labelledby="shipping-express-label" />
            </div>
          </div>
          <div className="flex items-center justify-between p-4 border border-border rounded-lg">
            <div>
              <p className="font-medium text-sm" id="shipping-free-label">{LAYOUT_CONSTANTS.FREE_SHIPPING_LABEL_LONG}</p>
              <p className="text-xs text-muted-foreground">{"A partir d\'un montant minimum"}</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1">
                <span className="text-sm text-muted-foreground">Des</span>
                <Input defaultValue={String(LAYOUT_CONSTANTS.FREE_SHIPPING_THRESHOLD)} className="w-20 text-sm" aria-label="Seuil livraison gratuite" />
                <span className="text-sm text-muted-foreground">EUR</span>
              </div>
              <Switch defaultChecked aria-labelledby="shipping-free-label" />
            </div>
          </div>
        </CardContent>
      </Card>
      <div className="flex justify-end"><Button loading={isSaving} onClick={handleSave}>Sauvegarder</Button></div>
    </div>
  )
}
