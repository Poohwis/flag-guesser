"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { CheckCircle, XCircle, Loader2 } from "lucide-react"
import type { FlagQuestion } from "../types"

interface TextInputProps {
  currentFlag: FlagQuestion
  textAnswer: string
  showResult: boolean
  isCorrect: boolean
  currentImageLoaded: boolean
  nextImagePreloaded: boolean
  currentQuestion: number
  totalQuestions: number
  autocompleteEnabled: boolean
  suggestions: string[]
  selectedSuggestionIndex: number
  onTextInputChange: (value: string) => void
  onTextSubmit: () => void
  onSuggestionClick: (suggestion: string) => void
  onNextQuestion: () => void
  onSuggestionIndexChange: (index: number) => void
  onClearSuggestions: () => void
}

export function TextInput({
  currentFlag,
  textAnswer,
  showResult,
  isCorrect,
  currentImageLoaded,
  nextImagePreloaded,
  currentQuestion,
  totalQuestions,
  autocompleteEnabled,
  suggestions,
  selectedSuggestionIndex,
  onTextInputChange,
  onTextSubmit,
  onSuggestionClick,
  onNextQuestion,
  onSuggestionIndexChange,
  onClearSuggestions,
}: TextInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)

  // Auto-focus input when question loads
  useEffect(() => {
    if (currentImageLoaded && !showResult && inputRef.current) {
      inputRef.current.focus()
    }
  }, [currentImageLoaded, currentQuestion])

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (selectedSuggestionIndex >= 0 && suggestions[selectedSuggestionIndex]) {
        // Select the highlighted suggestion
        onSuggestionClick(suggestions[selectedSuggestionIndex])
      } else {
        onTextSubmit()
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (suggestions.length > 0) {
        onSuggestionIndexChange(selectedSuggestionIndex < suggestions.length - 1 ? selectedSuggestionIndex + 1 : 0)
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (suggestions.length > 0) {
        onSuggestionIndexChange(selectedSuggestionIndex > 0 ? selectedSuggestionIndex - 1 : suggestions.length - 1)
      }
    } else if (e.key === "Escape") {
      onClearSuggestions()
    }
  }

  return (
    <div className="flex flex-col h-[250px]">
      <div className="space-y-4 mb-6">
        <div className="relative">
          <Input
            ref={inputRef}
            type="text"
            placeholder="Type the country name..."
            value={textAnswer}
            onChange={(e) => onTextInputChange(e.target.value)}
            disabled={showResult || !currentImageLoaded}
            className="text-lg h-12"
            onKeyDown={handleKeyDown}
          />

          {/* Autocomplete Suggestions */}
          {suggestions.length > 0 && !showResult && (
            <div className="absolute top-full left-0 right-0 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-md shadow-lg z-10 mt-1">
              {suggestions.map((suggestion, index) => (
                <button
                  key={suggestion}
                  className={`w-full text-left px-4 py-2 border-b border-gray-100 dark:border-gray-700 last:border-b-0 transition-colors ${
                    index === selectedSuggestionIndex
                      ? "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                      : "hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
                  onClick={() => onSuggestionClick(suggestion)}
                >
                  {suggestion}
                </button>
              ))}
            </div>
          )}
        </div>

        {!showResult && (
          <Button onClick={onTextSubmit} disabled={!textAnswer.trim() || !currentImageLoaded} className="w-full dark:bg-[#09080e] dark:hover:bg-[#09080e]/80 dark:border-[#09080e]/30 dark:text-white">
            Submit Answer
          </Button>
        )}
      </div>

      {/* Reserved space for result - ensure consistent height to prevent layout jumps */}
      <div className="min-h-[180px] flex flex-col justify-center">
        {showResult ? (
          <div className="space-y-4">
            <div
              className={`p-4 rounded-lg border-2 ${
                isCorrect ? "bg-green-50 border-green-200 text-green-800" : "bg-red-50 border-red-200 text-red-800"
              }`}
            >
              <div className="flex items-center gap-2">
                {isCorrect ? (
                  <CheckCircle className="w-5 h-5 text-green-600" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600" />
                )}
                <span className="font-semibold">{isCorrect ? "Correct!" : "Incorrect!"}</span>
              </div>
              {!isCorrect && (
                <p className="mt-2">
                  The correct answer is: <strong>{currentFlag.country}</strong>
                </p>
              )}
            </div>
            <div className="text-center">
              <div className="flex flex-col items-center gap-2">
                <Button
                  onClick={onNextQuestion}
                  className="w-full md:w-auto bg-black text-white dark:hover:bg-black dark:hover:opacity-80"
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
                <div className="flex items-center gap-2 text-xs text-gray-500 dark:text-white/80">
                  or press space
                  
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col justify-center">
            <div className="text-center text-gray-400 dark:text-gray-500 text-sm">
              {!currentImageLoaded
                ? "Loading flag image..."
                : textAnswer.trim()
                  ? "Press Enter or click Submit"
                  : "Type your answer above"}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
