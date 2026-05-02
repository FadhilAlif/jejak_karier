import { create } from 'zustand'

type ViewMode = 'kanban' | 'list'

interface UIState {
  sidebarCollapsed: boolean
  viewMode: ViewMode
  commandPaletteOpen: boolean
  highlightedAppId: string | null
  toggleSidebar: () => void
  setViewMode: (mode: ViewMode) => void
  toggleCommandPalette: () => void
  setCommandPaletteOpen: (open: boolean) => void
  setHighlightedAppId: (id: string | null) => void
}

export const useUIStore = create<UIState>((set) => ({
  sidebarCollapsed: false,
  viewMode: 'kanban',
  commandPaletteOpen: false,
  highlightedAppId: null,

  toggleSidebar: () =>
    set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),

  setViewMode: (mode: ViewMode) =>
    set({ viewMode: mode }),

  toggleCommandPalette: () =>
    set((state) => ({ commandPaletteOpen: !state.commandPaletteOpen })),

  setCommandPaletteOpen: (open: boolean) =>
    set({ commandPaletteOpen: open }),

  setHighlightedAppId: (id: string | null) =>
    set({ highlightedAppId: id }),
}))
