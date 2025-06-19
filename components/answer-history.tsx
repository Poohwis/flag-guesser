"use client"

import { motion } from "motion/react";
import { FlagIcon } from "./flag-icon"
import { useEffect } from "react"

interface AnswerHistoryProps {
  correctAnswers: { countryCode: string; country: string }[]
  incorrectAnswers: { countryCode: string; country: string }[]
}

export function AnswerHistory({ correctAnswers, incorrectAnswers }: AnswerHistoryProps) {
  // Add this useEffect to scroll to the bottom when answers change
  useEffect(() => {
    const correctContainer = document.getElementById("correct-answers-container")
    const incorrectContainer = document.getElementById("incorrect-answers-container")

    if (correctContainer && correctAnswers.length > 0) {
      correctContainer.scrollTop = correctContainer.scrollHeight
    }

    if (incorrectContainer && incorrectAnswers.length > 0) {
      incorrectContainer.scrollTop = incorrectContainer.scrollHeight
    }
  }, [correctAnswers, incorrectAnswers])

  return (
    <div className="md:grid hidden grid-cols-2 gap-4 mt-4">
      <div className="border rounded-lg p-3 bg-green-50 dark:bg-green-900/20">
        <h3 className="text-sm font-medium text-green-700 dark:text-green-400 mb-2 flex items-center justify-between">
          <span>Correct ({correctAnswers.length})</span>
        </h3>
        <div className="relative">


          <div
            id="correct-answers-container"
            className="grid grid-cols-4 gap-1.5 h-24 overflow-y-auto pr-1 custom-scrollbar overflow-x-hidden"
            style={{
              gridAutoRows: "min-content",
              gridTemplateColumns: "repeat(auto-fill, minmax(32px, 1fr))",
            }}
          >
            {correctAnswers.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic col-span-4">No correct answers yet</p>
            ) : (
              correctAnswers.map((answer, index) => (
                <motion.div
                 initial={{scale: 0}}
                 whileInView={{scale: 1}}
                 key={`correct-${index}`} className="relative group flex items-center justify-center">
                  <FlagIcon countryCode={answer.countryCode} country={answer.country} size="sm" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    {answer.country}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
      <div className="border rounded-lg p-3 bg-red-50 dark:bg-red-900/20">
        <h3 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2 flex items-center justify-between">
          <span>Incorrect ({incorrectAnswers.length})</span>
        </h3>
        <div className="relative">


          <div
            id="incorrect-answers-container"
            className="grid grid-cols-4 gap-1.5 h-24 overflow-y-auto pr-1 custom-scrollbar overflow-x-hidden"
            style={{
              gridAutoRows: "min-content",
              gridTemplateColumns: "repeat(auto-fill, minmax(32px, 1fr))",
            }}
          >
            {incorrectAnswers.length === 0 ? (
              <p className="text-xs text-gray-500 dark:text-gray-400 italic col-span-4">No incorrect answers yet</p>
            ) : (
              incorrectAnswers.map((answer, index) => (
                <motion.div
                 initial={{scale: 0}}
                 whileInView={{scale: 1}}
                 key={`incorrect-${index}`} className="relative group flex items-center justify-center">
                  <FlagIcon countryCode={answer.countryCode} country={answer.country} size="sm" />
                  <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none z-20">
                    {answer.country}
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
