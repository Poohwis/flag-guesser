"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { RotateCcw, Moon, Sun, Clock } from "lucide-react"
import { formatTime } from "../utils"
import type { GameMode } from "../types"
import { FlagIcon } from "./flag-icon"

interface GameCompleteProps {
  isDarkMode: boolean
  gameMode: GameMode
  score: number
  totalQuestions: number
  elapsedTime?: number
  onResetGame: () => void
  onToggleTheme: () => void
  correctAnswers: { countryCode: string; country: string }[]
  incorrectAnswers: { countryCode: string; country: string }[]
}

export function GameComplete({
  isDarkMode,
  gameMode,
  score,
  totalQuestions,
  elapsedTime = 0,
  onResetGame,
  onToggleTheme,
  correctAnswers,
  incorrectAnswers,
}: GameCompleteProps) {
  const getScoreMessage = () => {
    if (score === totalQuestions) {
      return "Perfect score! You're a flag expert! 🎉"
    } else if (score >= totalQuestions * 0.7) {
      return "Great job! You know your flags well! 👏"
    } else {
      return "Good effort! Keep practicing to improve! 💪"
    }
  }

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div
        className={`min-h-screen flex items-center justify-center p-4 transition-colors ${
          isDarkMode ? "bg-gradient-to-t from-violet-400 to-black" : "bg-gradient-to-t from-white to-orange-200"
        }`}
      >
        <Card className="w-full max-w-md backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/30 shadow-2xl">
          <CardHeader className="text-center relative">
            <Button variant="ghost" size="sm" onClick={onToggleTheme} className="absolute top-4 right-4 p-2">
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <CardTitle className="text-2xl font-bold text-green-600 dark:text-green-400">Game Complete!</CardTitle>
            <div className="flex flex-col items-center gap-2 mt-2">
              <Badge
                variant="outline"
                className="backdrop-blur-sm bg-white/20 dark:bg-gray-700/20 border-white/30 dark:border-gray-600/30"
              >
                {gameMode === "multiple-choice" ? "Multiple Choice Mode" : "Text Input Mode"}
              </Badge>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span className="font-mono text-sm">Time: {formatTime(elapsedTime)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-bold text-gray-800 dark:text-gray-200">
              {score}/{totalQuestions}
            </div>
            <p className="text-gray-600 dark:text-gray-400">{getScoreMessage()}</p>

            {/* Answer Summary */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="border rounded-lg p-3 bg-green-50/70 dark:bg-green-900/30 backdrop-blur-sm border-white/20 dark:border-gray-600/20">
                <h3 className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                  Correct ({correctAnswers.length})
                </h3>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {correctAnswers.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">None</p>
                  ) : (
                    correctAnswers.map((answer, index) => (
                      <div key={`correct-${index}`} className="relative group">
                        <FlagIcon countryCode={answer.countryCode} country={answer.country} size="sm" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {answer.country}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="border rounded-lg p-3 bg-red-50/70 dark:bg-red-900/30 backdrop-blur-sm border-white/20 dark:border-gray-600/20">
                <h3 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                  Incorrect ({incorrectAnswers.length})
                </h3>
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {incorrectAnswers.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">None</p>
                  ) : (
                    incorrectAnswers.map((answer, index) => (
                      <div key={`incorrect-${index}`} className="relative group">
                        <FlagIcon countryCode={answer.countryCode} country={answer.country} size="sm" />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {answer.country}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>

            <Button
              onClick={onResetGame}
              className="w-full backdrop-blur-sm bg-blue-600/80 hover:bg-blue-700/80 border border-blue-500/30"
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Play Again
            </Button>
            <div className="pt-4 text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200/30 dark:border-gray-700/30 mt-2">
              <p>
                Flag images and country data from{" "}
                <a
                  href="https://flagpedia.net"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline dark:text-blue-400"
                >
                  Flagpedia.net
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
