import { createFileRoute } from "@tanstack/react-router"
import { Suspense, lazy } from "react"
import { RouteErrorBoundary } from "@/error-boundaries"

const LoginPage = lazy(() =>
  import("@/features/auth/components/login-page").then((m) => ({ default: m.LoginPage })),
)

export const Route = createFileRoute("/auth/login")({
  component: LoginRoute,
})

function LoginRoute() {
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<div>Loading…</div>}>
        <LoginPage />
      </Suspense>
    </RouteErrorBoundary>
  )
}

