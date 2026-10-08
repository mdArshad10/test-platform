import { createFileRoute } from "@tanstack/react-router"
import { Suspense, lazy } from "react"
import { RouteErrorBoundary } from "@/error-boundaries"

// Lazy-load the page component — Suspense above handles the fallback
const IntroPage = lazy(() =>
  import("@/features/quiz/components/intro-page").then((m) => ({
    default: m.IntroPage,
  })),
)

export const Route = createFileRoute("/")({
  component: IndexPage,
})

function IndexPage() {
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<div>Loading…</div>}>
        <IntroPage />
      </Suspense>
    </RouteErrorBoundary>
  )
}
