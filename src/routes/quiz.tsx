import { Suspense, lazy } from "react"
import { createFileRoute, redirect } from "@tanstack/react-router"

import { RouteErrorBoundary } from "@/error-boundaries"
import { useQuizStore } from "@/features/quiz/store/quiz.store"

const QuizPage = lazy(() =>
  import("@/features/quiz/components/quiz-page").then((m) => ({
    default: m.QuizPage,
  })),
)

export const Route = createFileRoute("/quiz")({
  beforeLoad: () => {
    const { phase } = useQuizStore.getState()
    if (phase === "idle") throw redirect({ to: "/" })
    if (phase === "submitted") throw redirect({ to: "/results" })
  },
  component: QuizRoute,
})

function QuizRoute() {
  return (
    <RouteErrorBoundary>
      <Suspense fallback={<div className="p-6">Loading test…</div>}>
        <QuizPage />
      </Suspense>
    </RouteErrorBoundary>
  )
}
