"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import type { FlagQuestion } from "../types"

interface MultipleChoiceProps {
  currentFlag: FlagQuestion
  selectedAnswer: string | null
  showResult: boolean
  isCorrect: boolean
  currentImageLoaded: boolean
  nextImagePreloaded: boolean
  currentQuestion: number
  totalQuestions: number
  onAnswerSelect: (answer: string) => void
  onNextQuestion: () => void
}

export function MultipleChoice({
  currentFlag,
  selectedAnswer,
  showResult,
  isCorrect,
  currentImageLoaded,
  nextImagePreloaded,
  currentQuestion,
  totalQuestions,
  onAnswerSelect,
  onNextQuestion,
}: MultipleChoiceProps) {
  // Keyboard support for multiple choice
  useEffect(() => {
    if (showResult || !currentImageLoaded) return

    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key
      if (key >= "1" && key <= "8") {
        const index = Number.parseInt(key) - 1
        if (currentFlag && currentFlag.options[index]) {
          onAnswerSelect(currentFlag.options[index])
        }
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [showResult, currentFlag, currentImageLoaded, onAnswerSelect])

  // Spacebar support for next question and view results
  useEffect(() => {
    if (!showResult) return

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault()
        onNextQuestion()
      }
    }

    window.addEventListener("keydown", handleKeyPress)
    return () => window.removeEventListener("keydown", handleKeyPress)
  }, [showResult, onNextQuestion])

  return (
    <div className="flex-1 flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6 ">
        {currentFlag.options.map((option, index) => {
          let buttonVariant: "default" | "destructive" | "outline" = "outline"
          let icon = null

          if (showResult && selectedAnswer) {
            if (option === currentFlag.country) {
              buttonVariant = "default"
              icon = <CheckCircle className="w-4 h-4 ml-2 text-green-600" />
            } else if (option === selectedAnswer && option !== currentFlag.country) {
              buttonVariant = "destructive"
              icon = <XCircle className="w-4 h-4 ml-2 text-red-600" />
            }
          }

          return (
            <Button
              key={option}
              variant={buttonVariant}
              onClick={() => onAnswerSelect(option)}
              disabled={showResult || !currentImageLoaded}
              className={`h-12 text-left justify-between text-balance ${
                showResult && option === currentFlag.country
                  ? "bg-green-100 border-green-500 text-green-800 hover:bg-green-100"
                  : showResult && option === selectedAnswer && option !== currentFlag.country
                    ? "bg-red-100 border-red-500 text-red-800 hover:bg-red-100"
                    : ""
              }`}
            >
              <span className="flex items-center gap-2">
                <Badge
                  variant="secondary"
                  className="text-xs w-6 h-6 rounded-full p-0 flex items-center justify-center"
                >
                  {index + 1}
                </Badge>
                {option}
              </span>
              {icon}
            </Button>
          )
        })}
      </div>

      {/* Reserved space for result - ensure consistent height */}
      <div className="min-h-[140px] flex flex-col justify-center">
        {showResult ? (
          <div className="text-center space-y-4">
            <div className={`text-lg font-semibold ${isCorrect ? "text-green-600" : "text-red-600"}`}>
              {isCorrect ? "Correct! 🎉" : `Wrong! The correct answer is ${currentFlag.country} 🤔`}
            </div>
            <div className="flex flex-col items-center gap-1">
              <Button
                onClick={onNextQuestion}
                className="w-full md:w-auto"
                disabled={!nextImagePreloaded && currentQuestion < totalQuestions - 1}
              >
                {!nextImagePreloaded && currentQuestion < totalQuestions - 1 ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Loading next...
                  </>
                ) : currentQuestion < totalQuestions - 1 ? (
                  "Next Question"
                ) : (
                  "View Results"
                )}
              </Button>
              <div className="flex items-center text-xs text-gray-500">
                or press space
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center">
            <div className="text-center text-gray-400 dark:text-gray-500 text-sm">
              {!currentImageLoaded
                ? "Loading flag image..."
                : "Click an answer above or press number on your keyboard"}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
