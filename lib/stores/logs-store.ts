/**
 * Store Zustand pour la gestion des logs de traçabilité
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type LogAction = 
  | 'login' 
  | 'logout' 
  | 'create_product' 
  | 'update_product' 
  | 'delete_product'
  | 'create_order'
  | 'update_order'
  | 'create_user'
  | 'update_user'
  | 'delete_user'
  | 'update_settings'
  | 'other'

export interface LogEntry {
  id: string
  action: LogAction
  userId: string
  userEmail: string
  description: string
  details?: Record<string, unknown>
  timestamp: string
  ipAddress?: string
}

interface LogsStore {
  logs: LogEntry[]
  addLog: (entry: Omit<LogEntry, 'id' | 'timestamp'>) => void
  getLogs: (filters?: { action?: LogAction; userId?: string; startDate?: string; endDate?: string }) => LogEntry[]
  clearLogs: () => void
  deleteLog: (id: string) => void
}

export const useLogsStore = create<LogsStore>()(
  persist(
    (set, get) => ({
      logs: [],

      addLog: (entryData) => {
        const newLog: LogEntry = {
          ...entryData,
          id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
          timestamp: new Date().toISOString(),
        }
        set((state) => ({
          logs: [newLog, ...state.logs].slice(0, 1000), // Garder seulement les 1000 derniers logs
        }))
      },

      getLogs: (filters = {}) => {
        let filteredLogs = [...get().logs]

        if (filters.action) {
          filteredLogs = filteredLogs.filter((log) => log.action === filters.action)
        }

        if (filters.userId) {
          filteredLogs = filteredLogs.filter((log) => log.userId === filters.userId)
        }

        if (filters.startDate) {
          filteredLogs = filteredLogs.filter((log) => log.timestamp >= filters.startDate!)
        }

        if (filters.endDate) {
          filteredLogs = filteredLogs.filter((log) => log.timestamp <= filters.endDate!)
        }

        return filteredLogs
      },

      clearLogs: () => {
        set({ logs: [] })
      },

      deleteLog: (id) => {
        set((state) => ({
          logs: state.logs.filter((log) => log.id !== id),
        }))
      },
    }),
    {
      name: 'logs-storage',
    }
  )
)
