import type { Address, Order } from "./types"

const defaultAddr: Address = { id: "addr-def", label: "Domicile", street: "12 Rue de Rivoli", city: "Paris", zipCode: "75001", country: "France", isDefault: true }

export const orders: Order[] = [
  {
    id: "ord-1", orderNumber: "CMD-2026-001", customerId: "cust-1",
    items: [
      { productId: "prod-1", name: "Sac Élégance Parisienne", price: 189.99, quantity: 1, color: "Noir", size: "Moyen", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop" },
      { productId: "prod-6", name: "Portefeuille Continental", price: 69.99, quantity: 1, color: "Rose Poudré", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop" }
    ],
    subtotal: 259.98, shipping: 0, discount: 26.00, tax: 46.80, total: 280.78,
    status: "delivered", paymentMethod: "Carte Visa", shippingAddress: defaultAddr, billingAddress: defaultAddr,
    trackingNumber: "FR123456789", createdAt: "2026-01-15T10:30:00", updatedAt: "2026-01-20T14:00:00"
  },
  {
    id: "ord-2", orderNumber: "CMD-2026-002", customerId: "cust-3",
    items: [
      { productId: "prod-8", name: "Mini Sac Chaîne Dorée", price: 219.99, quantity: 1, color: "Noir", image: "https://images.unsplash.com/photo-1594223274512-ad4803739b7c?w=100&h=100&fit=crop" }
    ],
    subtotal: 219.99, shipping: 5.99, discount: 0, tax: 39.60, total: 265.58,
    status: "shipped", paymentMethod: "PayPal", shippingAddress: { ...defaultAddr, street: "8 Boulevard Haussmann", zipCode: "75009" }, billingAddress: { ...defaultAddr, street: "8 Boulevard Haussmann", zipCode: "75009" },
    trackingNumber: "FR987654321", createdAt: "2026-02-01T09:15:00", updatedAt: "2026-02-03T11:00:00"
  },
  {
    id: "ord-3", orderNumber: "CMD-2026-003", customerId: "cust-2",
    items: [
      { productId: "prod-4", name: "Sac à Dos Urban Explorer", price: 149.99, quantity: 1, color: "Noir", size: "Standard", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop" },
      { productId: "prod-10", name: "Porte-Cartes Minimaliste", price: 39.99, quantity: 2, color: "Bleu Nuit", image: "https://images.unsplash.com/photo-1627123424574-724758594e93?w=100&h=100&fit=crop" }
    ],
    subtotal: 229.97, shipping: 0, discount: 0, tax: 41.39, total: 271.36,
    status: "confirmed", paymentMethod: "Carte Mastercard", shippingAddress: { ...defaultAddr, street: "45 Avenue Victor Hugo", city: "Lyon", zipCode: "69002" }, billingAddress: { ...defaultAddr, street: "45 Avenue Victor Hugo", city: "Lyon", zipCode: "69002" },
    createdAt: "2026-02-10T16:45:00", updatedAt: "2026-02-10T16:45:00"
  },
  {
    id: "ord-4", orderNumber: "CMD-2026-004", customerId: "cust-5",
    items: [
      { productId: "prod-3", name: "Pochette Soirée Cristal", price: 89.99, quantity: 1, color: "Or", image: "https://images.unsplash.com/photo-1566150905458-1bf1fc113f0d?w=100&h=100&fit=crop" }
    ],
    subtotal: 89.99, shipping: 5.99, discount: 0, tax: 16.20, total: 112.18,
    status: "pending", paymentMethod: "Carte Visa", shippingAddress: { ...defaultAddr, street: "67 Rue du Commerce", city: "Bordeaux", zipCode: "33000" }, billingAddress: { ...defaultAddr, street: "67 Rue du Commerce", city: "Bordeaux", zipCode: "33000" },
    createdAt: "2026-02-14T08:20:00", updatedAt: "2026-02-14T08:20:00"
  },
  {
    id: "ord-5", orderNumber: "CMD-2026-005", customerId: "cust-7",
    items: [
      { productId: "prod-12", name: "Écharpe Cachemire & Soie", price: 119.99, quantity: 1, color: "Gris Perle", image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=100&h=100&fit=crop" },
      { productId: "prod-15", name: "Trousse Maquillage Luxe", price: 49.99, quantity: 1, color: "Rose", image: "https://images.unsplash.com/photo-1512201078372-9c6b2a0d528a?w=100&h=100&fit=crop" }
    ],
    subtotal: 169.98, shipping: 0, discount: 17.00, tax: 27.54, total: 180.52,
    status: "delivered", paymentMethod: "Apple Pay", shippingAddress: { ...defaultAddr, street: "3 Place Bellecour", city: "Lyon", zipCode: "69002" }, billingAddress: { ...defaultAddr, street: "3 Place Bellecour", city: "Lyon", zipCode: "69002" },
    trackingNumber: "FR111222333", createdAt: "2026-01-25T12:00:00", updatedAt: "2026-01-30T09:30:00"
  },
  {
    id: "ord-6", orderNumber: "CMD-2026-006", customerId: "cust-4",
    items: [
      { productId: "prod-2", name: "Sac Bohème Chic", price: 129.99, quantity: 1, color: "Beige", image: "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=100&h=100&fit=crop" }
    ],
    subtotal: 129.99, shipping: 5.99, discount: 0, tax: 23.40, total: 159.38,
    status: "shipped", paymentMethod: "Carte Visa", shippingAddress: { ...defaultAddr, street: "23 Rue de la Paix", city: "Marseille", zipCode: "13001" }, billingAddress: { ...defaultAddr, street: "23 Rue de la Paix", city: "Marseille", zipCode: "13001" },
    trackingNumber: "FR444555666", createdAt: "2026-02-08T14:30:00", updatedAt: "2026-02-11T10:00:00"
  },
  {
    id: "ord-7", orderNumber: "CMD-2026-007", customerId: "cust-1",
    items: [
      { productId: "prod-16", name: "Sac Seau Moderne", price: 139.99, quantity: 1, color: "Caramel", image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=100&h=100&fit=crop" },
      { productId: "prod-11", name: "Ceinture Cuir Artisanale", price: 79.99, quantity: 1, color: "Brun", size: "85cm", image: "https://images.unsplash.com/photo-1606760227091-3dd870d97f1d?w=100&h=100&fit=crop" }
    ],
    subtotal: 219.98, shipping: 0, discount: 22.00, tax: 35.64, total: 233.62,
    status: "pending", paymentMethod: "Carte Visa", shippingAddress: defaultAddr, billingAddress: defaultAddr,
    createdAt: "2026-02-15T11:00:00", updatedAt: "2026-02-15T11:00:00"
  },
  {
    id: "ord-8", orderNumber: "CMD-2025-098", customerId: "cust-6",
    items: [
      { productId: "prod-22", name: "Sac Banane Sporty", price: 59.99, quantity: 1, color: "Noir", image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=100&h=100&fit=crop" }
    ],
    subtotal: 59.99, shipping: 5.99, discount: 0, tax: 10.80, total: 76.78,
    status: "cancelled", paymentMethod: "PayPal", shippingAddress: { ...defaultAddr, street: "15 Allée des Roses", city: "Toulouse", zipCode: "31000" }, billingAddress: { ...defaultAddr, street: "15 Allée des Roses", city: "Toulouse", zipCode: "31000" },
    createdAt: "2025-12-20T09:00:00", updatedAt: "2025-12-22T15:00:00"
  },
]
