import { create } from "zustand"
import { devtools } from "zustand/middleware"

interface AppState {
  /** Whether the global loading overlay is visible */
  isLoading: boolean
  setIsLoading: (value: boolean) => void
}

/**
 * Global app-level store — keep this lean.
 * Feature-specific state belongs in each feature's own store.
 */
export const useAppStore = create<AppState>()(
  devtools(
    (set) => ({
      isLoading: false,
      setIsLoading: (value) => set({ isLoading: value }),
    }),
    { name: "AppStore" },
  ),
)

