"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"

export function AdminSettingsGeneral() {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Informations de la boutique</CardTitle>
            <CardDescription>Détails généraux de votre boutique. Configuration démo – non persistée.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div>
              <Label className="text-base font-medium">Nom de la boutique</Label>
              <Input defaultValue="TONOMI ACCESSOIRES" className="mt-2 h-11 text-base" />
            </div>
            <div>
              <Label className="text-base font-medium">Description</Label>
              <Textarea defaultValue="Boutique en ligne de maroquinerie de luxe. Découvrez nos collections de sacs, portefeuilles et accessoires en cuir véritable." className="mt-2 min-h-[120px] text-base" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label className="text-base font-medium">Email de contact</Label>
                <Input defaultValue="contact@tonomi.com" className="mt-2 h-11 text-base" />
              </div>
              <div>
                <Label className="text-base font-medium">Téléphone</Label>
                <Input defaultValue="+33 1 23 45 67 89" className="mt-2 h-11 text-base" />
              </div>
            </div>
            <div>
              <Label className="text-base font-medium">Adresse</Label>
              <Input defaultValue="12 Rue du Faubourg Saint-Honoré, 75008 Paris" className="mt-2 h-11 text-base" />
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
                    <SelectItem value="fr">Français</SelectItem>
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
              <Textarea defaultValue="Découvrez notre collection de sacs en cuir, portefeuilles et accessoires de luxe. Livraison gratuite dès 100 €." className="mt-2 min-h-[120px] text-base" />
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
        <Button onClick={() => toast.info("Configuration démo – les modifications ne sont pas enregistrées.")}>Sauvegarder</Button>
      </div>
    </div>
  )
}
