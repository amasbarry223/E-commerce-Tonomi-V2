import type { Customer } from "./types"

export const customers: Customer[] = [
  {
    id: "cust-1", firstName: "Marie", lastName: "Dupont", email: "marie.dupont@email.com", phone: "+33 6 12 34 56 78",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop",
    segment: "vip", totalSpent: 1589.96, orderCount: 8, createdAt: "2024-03-15",
    addresses: [{ id: "addr-1", label: "Domicile", street: "12 Rue de Rivoli", city: "Paris", zipCode: "75001", country: "France", isDefault: true }]
  },
  {
    id: "cust-2", firstName: "Sophie", lastName: "Martin", email: "sophie.martin@email.com", phone: "+33 6 23 45 67 89",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop",
    segment: "regular", totalSpent: 459.97, orderCount: 3, createdAt: "2025-01-20",
    addresses: [{ id: "addr-2", label: "Domicile", street: "45 Avenue Victor Hugo", city: "Lyon", zipCode: "69002", country: "France", isDefault: true }]
  },
  {
    id: "cust-3", firstName: "Camille", lastName: "Bernard", email: "camille.bernard@email.com", phone: "+33 6 34 56 78 90",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&h=100&fit=crop",
    segment: "vip", totalSpent: 2340.50, orderCount: 12, createdAt: "2024-06-10",
    addresses: [{ id: "addr-3", label: "Bureau", street: "8 Boulevard Haussmann", city: "Paris", zipCode: "75009", country: "France", isDefault: true }]
  },
  {
    id: "cust-4", firstName: "Léa", lastName: "Moreau", email: "lea.moreau@email.com", phone: "+33 6 45 67 89 01",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop",
    segment: "new", totalSpent: 129.99, orderCount: 1, createdAt: "2026-01-28",
    addresses: [{ id: "addr-4", label: "Domicile", street: "23 Rue de la Paix", city: "Marseille", zipCode: "13001", country: "France", isDefault: true }]
  },
  {
    id: "cust-5", firstName: "Julie", lastName: "Petit", email: "julie.petit@email.com", phone: "+33 6 56 78 90 12",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=100&h=100&fit=crop",
    segment: "regular", totalSpent: 679.95, orderCount: 5, createdAt: "2024-11-05",
    addresses: [{ id: "addr-5", label: "Domicile", street: "67 Rue du Commerce", city: "Bordeaux", zipCode: "33000", country: "France", isDefault: true }]
  },
  {
    id: "cust-6", firstName: "Emma", lastName: "Robert", email: "emma.robert@email.com", phone: "+33 6 67 89 01 23",
    avatar: "https://images.unsplash.com/photo-1488426862026-3ee34a7d66df?w=100&h=100&fit=crop",
    segment: "inactive", totalSpent: 89.99, orderCount: 1, createdAt: "2024-08-12",
    addresses: [{ id: "addr-6", label: "Domicile", street: "15 Allée des Roses", city: "Toulouse", zipCode: "31000", country: "France", isDefault: true }]
  },
  {
    id: "cust-7", firstName: "Chloé", lastName: "Richard", email: "chloe.richard@email.com", phone: "+33 6 78 90 12 34",
    avatar: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=100&h=100&fit=crop",
    segment: "vip", totalSpent: 1890.45, orderCount: 10, createdAt: "2024-05-22",
    addresses: [{ id: "addr-7", label: "Domicile", street: "3 Place Bellecour", city: "Lyon", zipCode: "69002", country: "France", isDefault: true }]
  },
  {
    id: "cust-8", firstName: "Manon", lastName: "Durand", email: "manon.durand@email.com", phone: "+33 6 89 01 23 45",
    avatar: "https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=100&h=100&fit=crop",
    segment: "new", totalSpent: 219.99, orderCount: 1, createdAt: "2026-02-10",
    addresses: [{ id: "addr-8", label: "Domicile", street: "91 Rue de Lille", city: "Lille", zipCode: "59000", country: "France", isDefault: true }]
  },
]
