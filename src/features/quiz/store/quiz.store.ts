import { create } from "zustand"
import { devtools } from "zustand/middleware"

import type {
  Question,
  QuestionStatus,
  QuizData,
  QuizMeta,
  QuizPhase,
  QuizResult,
} from "../types/quiz.types"

function shuffle<T>(items: readonly T[]): T[] {
  const copy = [...items]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

function prepareQuestions(questions: Question[]): Question[] {
  return shuffle(questions).map((question) => {
    const correctOption = question.options[question.answer]
    const options = shuffle(question.options)
    return { ...question, options, answer: options.indexOf(correctOption) }
  })
}

export function getQuestionStatus(
  answers: Record<string, number>,
  marked: Record<string, boolean>,
  questionId: string,
): QuestionStatus {
  const isAnswered = answers[questionId] !== undefined
  const isMarked = marked[questionId] === true

  if (isAnswered && isMarked) return "answered-marked"
  if (isMarked) return "marked"
  if (isAnswered) return "answered"
  return "unseen"
}

interface QuizState {
  phase: QuizPhase
  questions: Question[]
  meta: QuizMeta | null
  currentIndex: number
  answers: Record<string, number>
  marked: Record<string, boolean>
  endsAt: number | null
  remainingMs: number
  result: QuizResult | null

  loadQuiz: (data: QuizData) => void
  startQuiz: () => void
  selectAnswer: (questionId: string, optionIndex: number) => void
  clearAnswer: (questionId: string) => void
  toggleMark: (questionId: string) => void
  goTo: (index: number) => void
  next: () => void
  prev: () => void
  tick: () => void
  submitQuiz: () => void
  resetQuiz: () => void
}

function buildResult(state: QuizState): QuizResult {
  const { questions, answers, meta } = state
  const marksPerQuestion = meta?.marksPerQuestion ?? 1
  const negativeMarking = meta?.negativeMarking ?? 0

  let attempted = 0
  let correct = 0
  let wrong = 0

  const results = questions.map((question) => {
    const selectedIndex =
      answers[question.id] !== undefined ? answers[question.id] : null
    const isCorrect = selectedIndex === question.answer
    if (selectedIndex !== null) {
      attempted += 1
      if (isCorrect) correct += 1
      else wrong += 1
    }
    return { question, selectedIndex, isCorrect }
  })

  const total = questions.length
  const marksTotal = total * marksPerQuestion
  const marksObtained = correct * marksPerQuestion - wrong * negativeMarking

  return {
    total,
    attempted,
    correct,
    wrong,
    left: total - attempted,
    marksObtained,
    marksTotal,
    accuracy: attempted > 0 ? (correct / attempted) * 100 : 0,
    results,
  }
}

export const useQuizStore = create<QuizState>()(
  devtools(
    (set, get) => ({
      phase: "idle",
      questions: [],
      meta: null,
      currentIndex: 0,
      answers: {},
      marked: {},
      endsAt: null,
      remainingMs: 0,
      result: null,

      loadQuiz: (data) =>
        set({
          questions: prepareQuestions(data.questions),
          meta: data.meta,
          phase: "idle",
          currentIndex: 0,
          answers: {},
          marked: {},
          endsAt: null,
          remainingMs: data.meta.durationMinutes * 60_000,
          result: null,
        }),

      startQuiz: () =>
        set((state) => {
          const minutes = state.meta?.durationMinutes ?? 0
          const durationMs = minutes * 60_000
          return {
            phase: "in-progress",
            currentIndex: 0,
            answers: {},
            marked: {},
            result: null,
            endsAt: Date.now() + durationMs,
            remainingMs: durationMs,
          }
        }),

      selectAnswer: (questionId, optionIndex) =>
        set((state) => ({
          answers: { ...state.answers, [questionId]: optionIndex },
        })),

      clearAnswer: (questionId) =>
        set((state) => {
          const answers = { ...state.answers }
          delete answers[questionId]
          return { answers }
        }),

      toggleMark: (questionId) =>
        set((state) => ({
          marked: { ...state.marked, [questionId]: !state.marked[questionId] },
        })),

      goTo: (index) =>
        set((state) => ({
          currentIndex: Math.min(Math.max(index, 0), state.questions.length - 1),
        })),

      next: () =>
        set((state) => ({
          currentIndex: Math.min(
            state.currentIndex + 1,
            state.questions.length - 1,
          ),
        })),

      prev: () =>
        set((state) => ({ currentIndex: Math.max(state.currentIndex - 1, 0) })),

      tick: () => {
        const state = get()
        if (state.phase !== "in-progress" || state.endsAt === null) return
        const remaining = state.endsAt - Date.now()
        if (remaining <= 0) {
          set({ remainingMs: 0 })
          state.submitQuiz()
          return
        }
        set({ remainingMs: remaining })
      },

      submitQuiz: () =>
        set((state) => {
          if (state.phase !== "in-progress") return state
          return { ...state, phase: "submitted", result: buildResult(state) }
        }),

      resetQuiz: () =>
        set({
          phase: "idle",
          currentIndex: 0,
          answers: {},
          marked: {},
          endsAt: null,
          remainingMs: get().meta
            ? (get().meta!.durationMinutes ?? 0) * 60_000
            : 0,
          result: null,
        }),
    }),
    { name: "QuizStore" },
  ),
)
