import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface DashboardState {
  /** Example: selected entity ID */
  selectedId: string | null
  setSelectedId: (id: string | null) => void
}

export const useDashboardStore = create<DashboardState>()(
  devtools(
    (set) => ({
      selectedId: null,
      setSelectedId: (id) => set({ selectedId: id }),
    }),
    { name: "DashboardStore" },
  ),
)

