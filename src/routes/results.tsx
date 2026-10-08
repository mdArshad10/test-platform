import { Suspense, lazy } from "react"
import { createFileRoute, redirect } from "@tanstack/react-router"

import { RouteErrorBoundary } from "@/error-boundaries"
import { useQuizStore } from "@/features/quiz/store/quiz.store"

const ResultPage = lazy(() =>
  import("@/features/quiz/components/result-page").then((m) => ({
    default: m.ResultPage,
  })),
)

export const Route = createFileRoute("/results")({
  beforeLoad: () => {
    const { phase, result } = useQuizStore.getState()
    if (phase !== "submitted" || !result) throw redirect({ to: "/" })
  },
  component: ResultRoute,
})

function ResultRoute() {
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<div className="p-6">Loading result…</div>}>
        <ResultPage />
      </Suspense>
    </RouteErrorBoundary>
  )
}
