/**
 * Store Zustand pour l'UI (theme, navigation, modals)
 */
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface UIStore {
  darkMode: boolean
  currentView: 'store' | 'admin'
  currentPage: string
  searchQuery: string
  selectedProductId: string | null
  selectedCategorySlug: string | null
  toggleDarkMode: () => void
  setCurrentView: (view: 'store' | 'admin') => void
  navigate: (page: string) => void
  setSearchQuery: (query: string) => void
  selectProduct: (id: string | null) => void
  selectCategory: (slug: string | null) => void
}

export const useUIStore = create<UIStore>()(
  persist(
    (set) => ({
      darkMode: false,
      currentView: 'store',
      currentPage: 'home',
      searchQuery: '',
      selectedProductId: null,
      selectedCategorySlug: null,
      
      toggleDarkMode: () => set((state) => {
        const newDarkMode = !state.darkMode
        if (newDarkMode) {
          document.documentElement.classList.add('dark')
        } else {
          document.documentElement.classList.remove('dark')
        }
        return { darkMode: newDarkMode }
      }),
      
      setCurrentView: (view) => set({
        currentView: view,
        currentPage: view === 'admin' ? 'dashboard' : 'home',
      }),
      
      navigate: (page) => {
        set({ currentPage: page })
        window.scrollTo(0, 0)
      },
      
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      selectProduct: (id) => set({ selectedProductId: id }),
      
      selectCategory: (slug) => set({ selectedCategorySlug: slug }),
    }),
    {
      name: 'ui-storage',
      partialize: (state) => ({
        darkMode: state.darkMode,
        currentView: state.currentView,
        currentPage: state.currentPage,
      }),
    }
  )
)

