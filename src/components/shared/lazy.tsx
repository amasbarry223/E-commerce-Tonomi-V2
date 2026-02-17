/**
 * Composants lazy-loaded pour optimiser le bundle
 */
import dynamic from 'next/dynamic'

// Admin components - lazy loaded
export const AdminDashboard = dynamic(() => import('../../../components/admin/admin-dashboard').then(m => ({ default: m.AdminDashboard })), {
  loading: () => <div className="flex items-center justify-center h-64">Chargement...</div>,
})

export const AdminProducts = dynamic(() => import('../../../components/admin/admin-products').then(m => ({ default: m.AdminProducts })), {
  loading: () => <div className="flex items-center justify-center h-64">Chargement...</div>,
})

export const AdminOrders = dynamic(() => import('../../../components/admin/admin-orders').then(m => ({ default: m.AdminOrders })), {
  loading: () => <div className="flex items-center justify-center h-64">Chargement...</div>,
})

export const AdminCustomers = dynamic(() => import('../../../components/admin/admin-customers').then(m => ({ default: m.AdminCustomers })), {
  loading: () => <div className="flex items-center justify-center h-64">Chargement...</div>,
})

export const AdminAnalytics = dynamic(() => import('../../../components/admin/admin-analytics').then(m => ({ default: m.AdminAnalytics })), {
  loading: () => <div className="flex items-center justify-center h-64">Chargement...</div>,
})

// Charts - lazy loaded (heavy library)
export const ChartContainer = dynamic(() => import('../../../components/ui/chart').then(m => ({ default: m.ChartContainer })), {
  ssr: false,
})

