import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import { useQuizStore } from "../store/quiz.store"

export function SubmitConfirmDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  const questions = useQuizStore((s) => s.questions)
  const answers = useQuizStore((s) => s.answers)
  const marked = useQuizStore((s) => s.marked)
  const submitQuiz = useQuizStore((s) => s.submitQuiz)

  const attempted = questions.filter((q) => answers[q.id] !== undefined).length
  const markedCount = questions.filter((q) => marked[q.id]).length
  const left = questions.length - attempted

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Submit test?</DialogTitle>
          <DialogDescription>
            Once submitted you cannot change your answers. Here is a summary of
            your attempt.
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2">
          <SummaryTile label="Attempted" value={attempted} tone="answered" />
          <SummaryTile label="Left" value={left} tone="muted" />
          <SummaryTile label="Marked" value={markedCount} tone="marked" />
        </div>

        <DialogFooter>
          <DialogClose render={<Button variant="outline" />}>
            Keep working
          </DialogClose>
          <Button onClick={() => submitQuiz()}>Submit test</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

function SummaryTile({
  label,
  value,
  tone,
}: {
  label: string
  value: number
  tone: "answered" | "marked" | "muted"
}) {
  const toneClass =
    tone === "answered"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : tone === "marked"
        ? "border-amber-500/50 bg-amber-500/10 text-amber-700 dark:text-amber-400"
        : "border-border bg-muted/40 text-muted-foreground"

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-0.5 rounded-lg border px-2 py-3",
        toneClass,
      )}
    >
      <span className="text-lg font-semibold tabular-nums">{value}</span>
      <span className="text-xs">{label}</span>
    </div>
  )
}
