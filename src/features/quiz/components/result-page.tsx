import { useEffect } from "react"
import { useNavigate } from "@tanstack/react-router"
import {
  CheckCircle2,
  Lightbulb,
  RotateCcw,
  XCircle,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { cn } from "@/lib/utils"

import { useQuizStore } from "../store/quiz.store"
import type { QuestionResult } from "../types/quiz.types"

export function ResultPage() {
  const navigate = useNavigate()
  const result = useQuizStore((s) => s.result)
  const resetQuiz = useQuizStore((s) => s.resetQuiz)

  useEffect(() => {
    if (!result) void navigate({ to: "/", replace: true })
  }, [result, navigate])

  if (!result) return null

  const percentage = result.total ? (result.correct / result.total) * 100 : 0
  const incorrectResults = result.results.filter(
    (r) => r.selectedIndex !== null && !r.isCorrect,
  )
  const correctResults = result.results.filter((r) => r.isCorrect)
  const leftResults = result.results.filter((r) => r.selectedIndex === null)

  function handleRetake() {
    resetQuiz()
    void navigate({ to: "/" })
  }

  return (
    <main className="min-h-svh bg-muted/20">
      <div className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-heading text-xl font-semibold">Your result</h1>
            <p className="text-sm text-muted-foreground">
              Review your answers, explanations and memory tricks below.
            </p>
          </div>
          <Button variant="outline" onClick={handleRetake}>
            <RotateCcw />
            Retake test
          </Button>
        </div>

        <Card>
          <CardContent className="flex flex-col gap-5">
            <div className="flex flex-wrap items-end justify-between gap-4">
              <div className="flex flex-col gap-1">
                <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Score
                </span>
                <span className="font-heading text-3xl font-semibold tabular-nums">
                  {result.marksObtained}
                  <span className="text-lg font-normal text-muted-foreground">
                    {" "}
                    / {result.marksTotal}
                  </span>
                </span>
              </div>
              <Badge
                variant={percentage >= 50 ? "default" : "destructive"}
                className="text-sm"
              >
                {percentage.toFixed(0)}% overall
              </Badge>
            </div>

            <Progress value={percentage} />

            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              <StatTile
                value={result.correct}
                label="Correct"
                tone="correct"
              />
              <StatTile value={result.wrong} label="Wrong" tone="wrong" />
              <StatTile value={result.left} label="Left" tone="muted" />
              <StatTile
                value={`${result.accuracy.toFixed(0)}%`}
                label="Accuracy"
                tone="muted"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All ({result.total})</TabsTrigger>
            <TabsTrigger value="correct">
              Correct ({correctResults.length})
            </TabsTrigger>
            <TabsTrigger value="incorrect">
              Incorrect ({incorrectResults.length})
            </TabsTrigger>
            <TabsTrigger value="left">Left ({leftResults.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4 flex flex-col gap-4">
            {result.results.map((r, i) => (
              <ReviewCard key={r.question.id} index={i} result={r} />
            ))}
          </TabsContent>
          <TabsContent value="correct" className="mt-4 flex flex-col gap-4">
            {correctResults.map((r) => (
              <ReviewCard
                key={r.question.id}
                index={result.results.indexOf(r)}
                result={r}
              />
            ))}
          </TabsContent>
          <TabsContent value="incorrect" className="mt-4 flex flex-col gap-4">
            {incorrectResults.map((r) => (
              <ReviewCard
                key={r.question.id}
                index={result.results.indexOf(r)}
                result={r}
              />
            ))}
          </TabsContent>
          <TabsContent value="left" className="mt-4 flex flex-col gap-4">
            {leftResults.map((r) => (
              <ReviewCard
                key={r.question.id}
                index={result.results.indexOf(r)}
                result={r}
              />
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}

const OPTION_LETTERS = ["A", "B", "C", "D", "E", "F"]

function ReviewCard({ index, result }: { index: number; result: QuestionResult }) {
  const { question, selectedIndex, isCorrect } = result
  const isLeft = selectedIndex === null

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between gap-2">
          <span className="text-sm font-medium text-muted-foreground">
            Question {index + 1}
          </span>
          {isLeft ? (
            <Badge variant="outline">Not attempted</Badge>
          ) : isCorrect ? (
            <Badge className="border-emerald-500/40 bg-emerald-500/15 text-emerald-700 dark:text-emerald-400">
              <CheckCircle2 />
              Correct
            </Badge>
          ) : (
            <Badge variant="destructive">
              <XCircle />
              Incorrect
            </Badge>
          )}
        </div>
        <CardTitle className="text-base leading-relaxed text-pretty">
          {question.question}
        </CardTitle>
      </CardHeader>

      <CardContent className="flex flex-col gap-4">
        <div className="grid gap-2">
          {question.options.map((option, i) => {
            const isAnswer = i === question.answer
            const isPicked = i === selectedIndex
            return (
              <div
                key={i}
                className={cn(
                  "flex items-start gap-3 rounded-lg border px-3.5 py-2.5 text-sm",
                  isAnswer
                    ? "border-emerald-500/50 bg-emerald-500/10"
                    : isPicked
                      ? "border-destructive/50 bg-destructive/10"
                      : "border-border",
                )}
              >
                <span className="font-medium text-muted-foreground">
                  {OPTION_LETTERS[i] ?? i + 1}.
                </span>
                <span className="min-w-0 flex-1 text-pretty">{option}</span>
                {isAnswer && (
                  <span className="shrink-0 text-xs font-medium text-emerald-700 dark:text-emerald-400">
                    Correct answer
                  </span>
                )}
                {isPicked && !isAnswer && (
                  <span className="shrink-0 text-xs font-medium text-destructive">
                    Your answer
                  </span>
                )}
              </div>
            )
          })}
        </div>

        <Separator />

        <div className="flex flex-col gap-3 text-sm">
          <div className="flex flex-col gap-1">
            <span className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
              Explanation
            </span>
            <p className="text-pretty">{question.explanation}</p>
          </div>
          <div className="flex flex-col gap-1 rounded-lg border border-amber-500/40 bg-amber-500/10 px-3.5 py-3">
            <span className="flex items-center gap-1.5 text-xs font-medium tracking-wide text-amber-700 uppercase dark:text-amber-400">
              <Lightbulb className="size-3.5" />
              Method to remember
            </span>
            <p className="text-pretty">{question.mnemonic}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function StatTile({
  value,
  label,
  tone,
}: {
  value: number | string
  label: string
  tone: "correct" | "wrong" | "muted"
}) {
  const toneClass =
    tone === "correct"
      ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-700 dark:text-emerald-400"
      : tone === "wrong"
        ? "border-destructive/40 bg-destructive/10 text-destructive"
        : "border-border bg-muted/40 text-foreground"

  return (
    <div
      className={cn(
        "flex flex-col items-center gap-0.5 rounded-lg border px-2 py-3",
        toneClass,
      )}
    >
      <span className="text-xl font-semibold tabular-nums">{value}</span>
      <span className="text-xs">{label}</span>
    </div>
  )
}
