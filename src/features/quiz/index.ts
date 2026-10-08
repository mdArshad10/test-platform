import quizData from "./data/data.json"
import { getQuestionStatus, useQuizStore } from "./store/quiz.store"
import type { QuizData } from "./types/quiz.types"

export const quizBank = quizData as QuizData

export { getQuestionStatus, useQuizStore }
export type {
  Question,
  QuestionResult,
  QuestionStatus,
  QuizData,
  QuizMeta,
  QuizPhase,
  QuizResult,
} from "./types/quiz.types"
