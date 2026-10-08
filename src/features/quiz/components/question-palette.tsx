import { cn } from "@/lib/utils"
import { getQuestionStatus, useQuizStore } from "../store/quiz.store"
import type { QuestionStatus } from "../types/quiz.types"

const STATUS_CLASSES: Record<QuestionStatus, string> = {
  unseen:
    "border-border bg-muted/40 text-muted-foreground hover:bg-muted hover:text-foreground",
  answered:
    "border-emerald-500/40 bg-emerald-500/15 text-emerald-700 hover:bg-emerald-500/25 dark:text-emerald-400",
  marked:
    "border-amber-500/50 bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:text-amber-400",
  "answered-marked":
    "border-amber-500/50 bg-amber-500/15 text-amber-700 hover:bg-amber-500/25 dark:text-amber-400",
}

const STATUS_LABEL: Record<QuestionStatus, string> = {
  unseen: "not attempted",
  answered: "attempted",
  marked: "marked for review",
  "answered-marked": "attempted and marked for review",
}

export function QuestionPalette({
  className,
  onJump,
}: {
  className?: string
  onJump?: () => void
}) {
  const questions = useQuizStore((s) => s.questions)
  const answers = useQuizStore((s) => s.answers)
  const marked = useQuizStore((s) => s.marked)
  const currentIndex = useQuizStore((s) => s.currentIndex)
  const goTo = useQuizStore((s) => s.goTo)

  const answeredCount = questions.filter(
    (q) => answers[q.id] !== undefined,
  ).length
  const markedCount = questions.filter((q) => marked[q.id]).length
  const leftCount = questions.length - answeredCount

  return (
    <div className={cn("flex flex-col gap-4", className)}>
      <div className="grid grid-cols-6 gap-2 sm:grid-cols-8 lg:grid-cols-5">
        {questions.map((question, index) => {
          const status = getQuestionStatus(answers, marked, question.id)
          const isCurrent = index === currentIndex
          return (
            <button
              key={question.id}
              type="button"
              aria-label={`Go to question ${index + 1} (${STATUS_LABEL[status]})`}
              aria-current={isCurrent ? "true" : undefined}
              onClick={() => {
                goTo(index)
                onJump?.()
              }}
              className={cn(
                "relative flex size-9 items-center justify-center rounded-md border text-xs font-medium tabular-nums transition-colors outline-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
                STATUS_CLASSES[status],
                isCurrent && "ring-2 ring-ring ring-offset-2 ring-offset-background",
              )}
            >
              {index + 1}
              {status === "answered-marked" && (
                <span className="absolute -top-1 -right-1 size-2 rounded-full bg-emerald-500 ring-2 ring-background" />
              )}
            </button>
          )
        })}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-2 text-xs text-muted-foreground">
        <LegendItem
          className="border-emerald-500/40 bg-emerald-500/15"
          label={`Attempted (${answeredCount})`}
        />
        <LegendItem
          className="border-amber-500/50 bg-amber-500/15"
          label={`Marked (${markedCount})`}
        />
        <LegendItem
          className="border-border bg-muted/40"
          label={`Left (${leftCount})`}
        />
      </div>
    </div>
  )
}

function LegendItem({
  className,
  label,
}: {
  className?: string
  label: string
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span className={cn("size-3 rounded-[4px] border", className)} />
      {label}
    </span>
  )
}
