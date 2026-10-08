import { useEffect } from "react"

import { useQuizStore } from "../store/quiz.store"

const LOW_TIME_THRESHOLD_MS = 60_000

export function useCountdown() {
  const phase = useQuizStore((s) => s.phase)
  const remainingMs = useQuizStore((s) => s.remainingMs)
  const tick = useQuizStore((s) => s.tick)

  useEffect(() => {
    if (phase !== "in-progress") return
    const id = window.setInterval(tick, 1000)
    return () => window.clearInterval(id)
  }, [phase, tick])

  const totalSeconds = Math.max(0, Math.ceil(remainingMs / 1000))
  const minutes = Math.floor(totalSeconds / 60)
  const seconds = totalSeconds % 60

  return {
    remainingMs,
    minutes,
    seconds,
    formatted: `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`,
    isLow: remainingMs <= LOW_TIME_THRESHOLD_MS,
  }
}
