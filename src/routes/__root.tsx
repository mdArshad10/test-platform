import { createRootRoute, Outlet } from "@tanstack/react-router"
import { lazy, Suspense } from "react"
import { RootErrorBoundary } from "@/error-boundaries"

const TanStackRouterDevtools = import.meta.env.PROD
  ? () => null
  : lazy(() =>
      import("@tanstack/router-devtools").then((mod) => ({
        default: mod.TanStackRouterDevtools,
      })),
    )

function RootSuspenseFallback() {
  return <div>Loading…</div>
}

function RootLayout() {
  return (
    <RootErrorBoundary>
      <Suspense fallback={<RootSuspenseFallback />}>
        <Outlet />
      </Suspense>
      <Suspense>
        <TanStackRouterDevtools />
      </Suspense>
    </RootErrorBoundary>
  )
}

export const Route = createRootRoute({
  component: RootLayout,
})
