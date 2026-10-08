export interface Question {
  id: string
  question: string
  options: string[]
  answer: number
  explanation: string
  mnemonic: string
}

export interface QuizMeta {
  title: string
  subject: string
  durationMinutes: number
  marksPerQuestion: number
  negativeMarking: number
}

export interface QuizData {
  meta: QuizMeta
  questions: Question[]
}

export type QuestionStatus = "unseen" | "answered" | "marked" | "answered-marked"

export type QuizPhase = "idle" | "in-progress" | "submitted"

export interface QuestionResult {
  question: Question
  selectedIndex: number | null
  isCorrect: boolean
}

export interface QuizResult {
  total: number
  attempted: number
  correct: number
  wrong: number
  left: number
  marksObtained: number
  marksTotal: number
  /** percentage of attempted questions answered correctly */
  accuracy: number
  results: QuestionResult[]
}
