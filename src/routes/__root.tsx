import { createRootRoute, Outlet } from "@tanstack/react-router"
import { TanStackRouterDevtools } from "@tanstack/router-devtools"
import { Suspense } from "react"
import { RootErrorBoundary } from "@/error-boundaries"

function RootSuspenseFallback() {
  return <div>Loading…</div>
}

function RootLayout() {
  return (
    <RootErrorBoundary>
      <Suspense fallback={<RootSuspenseFallback />}>
        <Outlet />
      </Suspense>
      <TanStackRouterDevtools />
    </RootErrorBoundary>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})

