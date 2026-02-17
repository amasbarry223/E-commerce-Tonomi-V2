"use client"

import { useStore } from "@/lib/store-context"
import { customers, orders, products, formatPrice, formatDate, getStatusColor, getStatusLabel } from "@/lib/data"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Package, Heart, MapPin, User, ShoppingBag } from "lucide-react"
import { ProductCard } from "./product-card"

export function AccountPage() {
  const { wishlist, navigate } = useStore()
  const customer = customers[0] // Simulated logged-in user
  const customerOrders = orders.filter(o => o.customerId === customer.id)
  const wishlistProducts = products.filter(p => wishlist.some(w => w.productId === p.id))

  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <img src={customer.avatar} alt={customer.firstName} className="h-16 w-16 rounded-full object-cover" crossOrigin="anonymous" />
        <div>
          <h1 className="font-serif text-2xl font-bold">{customer.firstName} {customer.lastName}</h1>
          <p className="text-sm text-muted-foreground">{customer.email}</p>
        </div>
      </div>

      <Tabs defaultValue="orders">
        <TabsList className="w-full justify-start bg-transparent border-b border-border rounded-none p-0 overflow-x-auto">
          <TabsTrigger value="orders" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 gap-2">
            <Package className="h-4 w-4" /> Commandes
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 gap-2">
            <Heart className="h-4 w-4" /> Favoris ({wishlist.length})
          </TabsTrigger>
          <TabsTrigger value="addresses" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 gap-2">
            <MapPin className="h-4 w-4" /> Adresses
          </TabsTrigger>
          <TabsTrigger value="profile" className="rounded-none border-b-2 border-transparent data-[state=active]:border-accent data-[state=active]:bg-transparent px-4 py-3 gap-2">
            <User className="h-4 w-4" /> Profil
          </TabsTrigger>
        </TabsList>

        {/* Orders */}
        <TabsContent value="orders" className="pt-6">
          {customerOrders.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingBag className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground">Aucune commande pour le moment</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {customerOrders.map(order => (
                <div key={order.id} className="bg-card border border-border rounded-lg p-4 md:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                    <div>
                      <p className="font-mono font-bold">{order.orderNumber}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(order.createdAt)}</p>
                    </div>
                    <Badge className={getStatusColor(order.status)}>{getStatusLabel(order.status)}</Badge>
                  </div>
                  <div className="flex flex-col gap-3">
                    {order.items.map((item, i) => (
                      <div key={i} className="flex gap-3 items-center">
                        <img src={item.image} alt={item.name} className="h-12 w-12 rounded object-cover" crossOrigin="anonymous" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm truncate">{item.name}</p>
                          <p className="text-xs text-muted-foreground">x{item.quantity}</p>
                        </div>
                        <span className="text-sm font-medium">{formatPrice(item.price * item.quantity)}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
                    <span className="text-sm font-bold">Total : {formatPrice(order.total)}</span>
                    {order.trackingNumber && (
                      <span className="text-xs text-muted-foreground">Suivi : {order.trackingNumber}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Wishlist */}
        <TabsContent value="wishlist" className="pt-6">
          {wishlistProducts.length === 0 ? (
            <div className="text-center py-12">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-3" />
              <p className="text-muted-foreground mb-4">Votre liste de favoris est vide</p>
              <Button onClick={() => navigate("catalog")} variant="outline">Découvrir nos articles</Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {wishlistProducts.map(product => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </TabsContent>

        {/* Addresses */}
        <TabsContent value="addresses" className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {customer.addresses.map(addr => (
              <div key={addr.id} className="bg-card border border-border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm">{addr.label}</span>
                  {addr.isDefault && <Badge variant="secondary" className="text-xs">Par défaut</Badge>}
                </div>
                <p className="text-sm text-muted-foreground">{addr.street}</p>
                <p className="text-sm text-muted-foreground">{addr.zipCode} {addr.city}</p>
                <p className="text-sm text-muted-foreground">{addr.country}</p>
              </div>
            ))}
          </div>
        </TabsContent>

        {/* Profile */}
        <TabsContent value="profile" className="pt-6">
          <div className="bg-card border border-border rounded-lg p-6 max-w-lg">
            <h3 className="font-semibold mb-4">Informations personnelles</h3>
            <div className="flex flex-col gap-3 text-sm">
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Prénom</span>
                <span>{customer.firstName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Nom</span>
                <span>{customer.lastName}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Email</span>
                <span>{customer.email}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Téléphone</span>
                <span>{customer.phone}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Client depuis</span>
                <span>{formatDate(customer.createdAt)}</span>
              </div>
              <div className="flex justify-between py-2 border-b border-border">
                <span className="text-muted-foreground">Total des achats</span>
                <span className="font-bold">{formatPrice(customer.totalSpent)}</span>
              </div>
              <div className="flex justify-between py-2">
                <span className="text-muted-foreground">Commandes</span>
                <span>{customer.orderCount}</span>
              </div>
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
