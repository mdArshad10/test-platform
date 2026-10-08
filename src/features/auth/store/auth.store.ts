import { create } from "zustand"
import { devtools, persist } from "zustand/middleware"

interface AuthState {
  token: string | null
  isAuthenticated: boolean
  setToken: (token: string | null) => void
  logout: () => void
}

export const useAuthStore = create<AuthState>()(
  devtools(
    persist(
      (set) => ({
        token: null,
        isAuthenticated: false,
        setToken: (token) => set({ token, isAuthenticated: !!token }),
        logout: () => set({ token: null, isAuthenticated: false }),
      }),
      { name: "auth-storage" },
    ),
    { name: "AuthStore" },
  ),
)

