"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "sonner"
import { useSettings } from "@/hooks"
import { useState, useCallback, useEffect } from "react"

export function AdminSettingsGeneral() {
  const { settings, isLoading } = useSettings()

  const [formData, setFormData] = useState({
    shopName: "",
    shopDescription: "",
    contactEmail: "",
    contactPhone: "",
    address: "",
    currency: "EUR",
    language: "fr",
    promoBannerText: "",
    lowStockThreshold: 10,
  })

  // Charger les paramètres depuis l'API
  useEffect(() => {
    if (!isLoading && settings) {
      setFormData({
        shopName: (settings.shopName as string) || "",
        shopDescription: (settings.shopDescription as string) || "",
        contactEmail: (settings.contactEmail as string) || "",
        contactPhone: (settings.contactPhone as string) || "",
        address: (settings.address as string) || "",
        currency: (settings.currency as string) || "EUR",
        language: (settings.language as string) || "fr",
        promoBannerText: (settings.promoBannerText as string) || "",
        lowStockThreshold: typeof settings.lowStockThreshold === "number" ? settings.lowStockThreshold : 10,
      })
    }
  }, [settings, isLoading])

  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSave = useCallback(async () => {
    setIsSubmitting(true)
    try {
      const response = await fetch("/api/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          settings: [
            { key: "shopName", value: formData.shopName, description: "Nom de la boutique" },
            { key: "shopDescription", value: formData.shopDescription, description: "Description de la boutique" },
            { key: "contactEmail", value: formData.contactEmail, description: "Email de contact" },
            { key: "contactPhone", value: formData.contactPhone, description: "Téléphone de contact" },
            { key: "address", value: formData.address, description: "Adresse de la boutique" },
            { key: "currency", value: formData.currency, description: "Devise" },
            { key: "language", value: formData.language, description: "Langue" },
            { key: "promoBannerText", value: formData.promoBannerText, description: "Bandeau promotionnel" },
            { key: "lowStockThreshold", value: formData.lowStockThreshold, description: "Seuil d'alerte pour stock faible" },
          ],
        }),
      })
      if (!response.ok) {
        throw new Error("Failed to save settings")
      }
      toast.success("Paramètres enregistrés avec succès")
    } catch (error) {
      toast.error("Erreur lors de l'enregistrement des paramètres")
    } finally {
      setIsSubmitting(false)
    }
  }, [formData])

  return (
    <div className="flex flex-col gap-6">
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 lg:gap-8">
        <Card className="h-fit">
          <CardHeader>
            <CardTitle className="text-lg">Informations de la boutique</CardTitle>
            <CardDescription>Détails généraux de votre boutique.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-5">
            <div>
              <Label className="text-base font-medium" htmlFor="promoBannerText">Bandeau promotionnel (Header)</Label>
              <Input
                id="promoBannerText"
                value={formData.promoBannerText}
                onChange={(e) => setFormData({ ...formData, promoBannerText: e.target.value })}
                className="mt-2 h-11 text-base border-accent ring-accent"
                placeholder="Ex: Livraison gratuite dès 100€ | Code BIENVENUE10 = -10%"
              />
              <p className="text-xs text-muted-foreground mt-1.5">S&apos;affiche tout en haut de chaque page du magasin.</p>
            </div>
            <hr className="border-border" />
            <div>
              <Label className="text-base font-medium" htmlFor="shopName">Nom de la boutique</Label>
              <Input
                id="shopName"
                value={formData.shopName}
                onChange={(e) => setFormData({ ...formData, shopName: e.target.value })}
                className="mt-2 h-11 text-base"
              />
            </div>
            <div>
              <Label className="text-base font-medium" htmlFor="shopDescription">Description</Label>
              <Textarea
                id="shopDescription"
                value={formData.shopDescription}
                onChange={(e) => setFormData({ ...formData, shopDescription: e.target.value })}
                className="mt-2 min-h-[120px] text-base"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label className="text-base font-medium" htmlFor="contactEmail">Email de contact</Label>
                <Input
                  id="contactEmail"
                  value={formData.contactEmail}
                  onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  className="mt-2 h-11 text-base"
                />
              </div>
              <div>
                <Label className="text-base font-medium" htmlFor="contactPhone">Téléphone</Label>
                <Input
                  id="contactPhone"
                  value={formData.contactPhone}
                  onChange={(e) => setFormData({ ...formData, contactPhone: e.target.value })}
                  className="mt-2 h-11 text-base"
                />
              </div>
            </div>
            <div>
              <Label className="text-base font-medium" htmlFor="address">Adresse</Label>
              <Input
                id="address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="mt-2 h-11 text-base"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <Label className="text-base font-medium">Devise</Label>
                <Select
                  value={formData.currency}
                  onValueChange={(val) => setFormData({ ...formData, currency: val })}
                >
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
                <Select
                  value={formData.language}
                  onValueChange={(val) => setFormData({ ...formData, language: val })}
                >
                  <SelectTrigger className="mt-2 h-11 text-base"><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fr">Français</SelectItem>
                    <SelectItem value="en">English</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div>
              <Label className="text-base font-medium" htmlFor="lowStockThreshold">Seuil d'alerte stock faible</Label>
              <Input
                id="lowStockThreshold"
                type="number"
                min="0"
                value={formData.lowStockThreshold}
                onChange={(e) => setFormData({ ...formData, lowStockThreshold: parseInt(e.target.value, 10) || 0 })}
                className="mt-2 h-11 text-base"
              />
              <p className="text-xs text-muted-foreground mt-1.5">Les produits avec un stock inférieur ou égal à ce nombre seront signalés comme stock faible.</p>
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
        <Button onClick={handleSave} disabled={isSubmitting || isLoading}>
          {isSubmitting ? "Sauvegarde..." : "Sauvegarder"}
        </Button>
      </div>
    </div>
  )
}
