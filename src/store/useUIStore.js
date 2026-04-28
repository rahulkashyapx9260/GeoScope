import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useUIStore = create(
  persist(
    (set) => ({
      searchTerm: '',
      region: 'All',
      sortBy: 'name-asc',
      populationOrder: 'none',
      hoveredCountry: null,
      selectedCountry: null,
      themeMode: 'light',
      setSearchTerm: (value) => set({ searchTerm: value }),
      setRegion: (value) => set({ region: value }),
      setSortBy: (value) => set({ sortBy: value }),
      setPopulationOrder: (value) => set({ populationOrder: value }),
      setHoveredCountry: (country) => set({ hoveredCountry: country }),
      setSelectedCountry: (country) => set({ selectedCountry: country }),
      toggleTheme: () =>
        set((state) => ({
          themeMode: state.themeMode === 'light' ? 'dark' : 'light',
        })),
    }),
    {
      name: 'geoscope-ui-storage',
      partialize: (state) => ({ themeMode: state.themeMode }),
    }
  )
)
