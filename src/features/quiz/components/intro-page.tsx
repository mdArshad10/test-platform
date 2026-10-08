import type { ReactNode } from "react"
import { useNavigate } from "@tanstack/react-router"
import {
  AlarmClock,
  FileQuestion,
  ListChecks,
  Play,
  Trophy,
} from "lucide-react"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import quizData from "../data/data.json"
import { useQuizStore } from "../store/quiz.store"
import type { QuizData } from "../types/quiz.types"

const data = quizData as QuizData

export function IntroPage() {
  const navigate = useNavigate()
  const loadQuiz = useQuizStore((s) => s.loadQuiz)
  const startQuiz = useQuizStore((s) => s.startQuiz)
  const result = useQuizStore((s) => s.result)

  const { meta, questions } = data

  function handleStart() {
    loadQuiz(data)
    startQuiz()
    void navigate({ to: "/quiz" })
  }

  return (
    <main className="flex min-h-svh items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <Badge variant="secondary" className="w-fit">
            {meta.subject}
          </Badge>
          <CardTitle className="text-xl">{meta.title}</CardTitle>
          <CardDescription>
            Read the instructions carefully before you begin. The timer starts as
            soon as you press Start.
          </CardDescription>
        </CardHeader>

        <CardContent className="flex flex-col gap-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <Stat
              icon={<FileQuestion />}
              label="Questions"
              value={String(questions.length)}
            />
            <Stat
              icon={<AlarmClock />}
              label="Duration"
              value={`${meta.durationMinutes} min`}
            />
            <Stat
              icon={<Trophy />}
              label="Total marks"
              value={String(questions.length * meta.marksPerQuestion)}
            />
          </div>

          <Separator />

          <div className="flex flex-col gap-3">
            <h2 className="flex items-center gap-2 font-heading text-sm font-medium">
              <ListChecks className="size-4 text-muted-foreground" />
              Instructions
            </h2>
            <ul className="flex list-disc flex-col gap-2 pl-5 text-sm text-muted-foreground">
              <li>
                You will see one question at a time with four options. Pick the
                option you think is correct.
              </li>
              <li>
                Use the question palette to jump between questions. It shows
                which questions are attempted, left, or marked for review.
              </li>
              <li>
                Mark any question for review if you want to revisit it before
                submitting.
              </li>
              <li>
                The test <strong className="text-foreground">auto-submits</strong>{" "}
                when the {meta.durationMinutes}-minute timer runs out.
              </li>
              <li>
                Explanations and memory tricks appear on the results page after
                you submit.
              </li>
            </ul>
          </div>
        </CardContent>

        <CardFooter className="flex-col-reverse gap-2 sm:flex-row sm:justify-between">
          {result ? (
            <Button
              variant="ghost"
              onClick={() => void navigate({ to: "/results" })}
            >
              View last result
            </Button>
          ) : (
            <span className="text-xs text-muted-foreground">
              Good luck — you've got this!
            </span>
          )}
          <Button onClick={handleStart}>
            <Play />
            Start test
          </Button>
        </CardFooter>
      </Card>
    </main>
  )
}

function Stat({
  icon,
  label,
  value,
}: {
  icon: ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/30 px-3 py-2.5">
      <span className="flex size-9 shrink-0 items-center justify-center rounded-md bg-background text-muted-foreground ring-1 ring-foreground/10 [&_svg]:size-4">
        {icon}
      </span>
      <span className="flex min-w-0 flex-col">
        <span className="text-xs text-muted-foreground">{label}</span>
        <span className="text-sm font-medium tabular-nums">{value}</span>
      </span>
    </div>
  )
}
