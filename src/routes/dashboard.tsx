import { createFileRoute } from "@tanstack/react-router"
import { Suspense, lazy } from "react"
import { RouteErrorBoundary } from "@/error-boundaries"

const DashboardPage = lazy(() =>
  import("@/features/dashboard/components/dashboard-page").then((m) => ({ default: m.DashboardPage })),
)

export const Route = createFileRoute("/dashboard")({
  component: DashboardRoute,
})

function DashboardRoute() {
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<div>Loading dashboard…</div>}>
        <DashboardPage />
      </Suspense>
    </RouteErrorBoundary>
  )
}

