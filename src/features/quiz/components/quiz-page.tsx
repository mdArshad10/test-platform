import { useEffect, useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import {
  AlarmClock,
  ChevronLeft,
  ChevronRight,
  Flag,
  LayoutGrid,
  Send,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

import { useCountdown } from "../hooks/use-countdown"
import { useQuizStore } from "../store/quiz.store"
import { QuestionPalette } from "./question-palette"
import { SubmitConfirmDialog } from "./submit-confirm-dialog"

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"]

export function QuizPage() {
  const navigate = useNavigate()

  const phase = useQuizStore((s) => s.phase)
  const questions = useQuizStore((s) => s.questions)
  const meta = useQuizStore((s) => s.meta)
  const currentIndex = useQuizStore((s) => s.currentIndex)
  const answers = useQuizStore((s) => s.answers)
  const marked = useQuizStore((s) => s.marked)
  const next = useQuizStore((s) => s.next)
  const prev = useQuizStore((s) => s.prev)
  const selectAnswer = useQuizStore((s) => s.selectAnswer)
  const clearAnswer = useQuizStore((s) => s.clearAnswer)
  const toggleMark = useQuizStore((s) => s.toggleMark)

  const timer = useCountdown()
  const [submitOpen, setSubmitOpen] = useState(false)
  const [paletteOpen, setPaletteOpen] = useState(false)

  useEffect(() => {
    if (phase === "idle") void navigate({ to: "/", replace: true })
    else if (phase === "submitted")
      void navigate({ to: "/results", replace: true })
  }, [phase, navigate])

  const question = questions[currentIndex]
  if (!question) return null

  const selected = answers[question.id]
  const isMarked = marked[question.id] === true
  const isFirst = currentIndex === 0
  const isLast = currentIndex === questions.length - 1
  const answeredCount = questions.filter(
    (q) => answers[q.id] !== undefined,
  ).length
  const progressPct = questions.length
    ? (answeredCount / questions.length) * 100
    : 0
  const marksPerQuestion = meta?.marksPerQuestion ?? 1

  return (
    <main className="min-h-svh bg-muted/20">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 px-4 py-3">
          <div className="flex min-w-0 flex-col">
            <span className="truncate font-heading text-sm font-medium">
              {meta?.title ?? "Test"}
            </span>
            <span className="text-xs text-muted-foreground">
              {answeredCount} of {questions.length} answered
            </span>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={cn(
                "flex items-center gap-1.5 rounded-md border px-2.5 py-1 text-sm font-medium tabular-nums",
                timer.isLow
                  ? "border-destructive/40 bg-destructive/10 text-destructive"
                  : "border-border bg-muted/40",
              )}
            >
              <AlarmClock className="size-4" />
              {timer.formatted}
            </span>

            <Button onClick={() => setSubmitOpen(true)}>
              <Send />
              Submit
            </Button>

            <Drawer open={paletteOpen} onOpenChange={setPaletteOpen}>
              <DrawerTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon"
                    className="lg:hidden"
                    aria-label="Open question palette"
                  />
                }
              >
                <LayoutGrid />
              </DrawerTrigger>
              <DrawerContent>
                <DrawerHeader>
                  <DrawerTitle>Question palette</DrawerTitle>
                </DrawerHeader>
                <div className="overflow-y-auto p-4">
                  <QuestionPalette onJump={() => setPaletteOpen(false)} />
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>

        <Progress
          value={progressPct}
          className="[&_[data-slot=progress-track]]:h-0.5 [&_[data-slot=progress-track]]:rounded-none"
        />
      </header>

      <div className="mx-auto grid max-w-6xl gap-6 px-4 py-6 lg:grid-cols-[minmax(0,1fr)_260px]">
        <section className="flex min-w-0 flex-col gap-4">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between gap-2">
                <Badge variant="secondary">
                  Question {currentIndex + 1} of {questions.length}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {marksPerQuestion} mark
                  {marksPerQuestion === 1 ? "" : "s"}
                </span>
              </div>
              <CardTitle
                id="question-label"
                className="text-lg leading-relaxed text-pretty"
              >
                {question.question}
              </CardTitle>
            </CardHeader>

            <CardContent>
              <div
                role="radiogroup"
                aria-labelledby="question-label"
                className="grid gap-2"
              >
                {question.options.map((option, index) => {
                  const isSelected = selected === index
                  return (
                    <label
                      key={index}
                      className={cn(
                        "group flex cursor-pointer items-start gap-3 rounded-lg border border-input bg-transparent px-3.5 py-3 text-sm transition-colors hover:bg-muted/50 has-[:focus-visible]:border-ring has-[:focus-visible]:ring-3 has-[:focus-visible]:ring-ring/50",
                        isSelected && "border-primary/40 bg-muted",
                      )}
                    >
                      <input
                        type="radio"
                        name={question.id}
                        value={index}
                        checked={isSelected}
                        onChange={() => selectAnswer(question.id, index)}
                        className="sr-only"
                      />
                      <span
                        aria-hidden="true"
                        className={cn(
                          "mt-0.5 flex size-4 shrink-0 items-center justify-center rounded-full border border-input",
                          isSelected && "border-primary bg-primary",
                        )}
                      >
                        {isSelected && (
                          <span className="size-2 rounded-full bg-primary-foreground" />
                        )}
                      </span>
                      <span className="flex min-w-0 flex-1 gap-2 leading-snug">
                        <span className="font-medium text-muted-foreground">
                          {OPTION_LETTERS[index] ?? index + 1}.
                        </span>
                        <span className="text-pretty">{option}</span>
                      </span>
                    </label>
                  )
                })}
              </div>
            </CardContent>

            <CardFooter className="flex-wrap justify-between gap-2">
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" onClick={prev} disabled={isFirst}>
                  <ChevronLeft />
                  Previous
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => clearAnswer(question.id)}
                  disabled={selected === undefined}
                >
                  Clear
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button
                  variant={isMarked ? "secondary" : "outline"}
                  onClick={() => toggleMark(question.id)}
                  aria-pressed={isMarked}
                >
                  <Flag />
                  {isMarked ? "Unmark" : "Mark for review"}
                </Button>
                {isLast ? (
                  <Button onClick={() => setSubmitOpen(true)}>
                    <Send />
                    Submit
                  </Button>
                ) : (
                  <Button onClick={next}>
                    Next
                    <ChevronRight />
                  </Button>
                )}
              </div>
            </CardFooter>
          </Card>
        </section>

        <aside className="hidden lg:block">
          <Card className="sticky top-24">
            <CardHeader>
              <CardTitle className="text-sm">Question palette</CardTitle>
            </CardHeader>
            <CardContent>
              <QuestionPalette />
            </CardContent>
          </Card>
        </aside>
      </div>

      <SubmitConfirmDialog open={submitOpen} onOpenChange={setSubmitOpen} />
    </main>
  )
}
