"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import type { FlagQuestion } from "../types";
import { CountryInformation } from "./country-information";
import { motion } from "motion/react";
import { InformationWithAnswerResultSection } from "./Information-with-answer-result";
import { AnswerResult } from "./answer-result";

interface MultipleChoiceProps {
  currentFlag: FlagQuestion;
  selectedAnswer: string | null;
  showResult: boolean;
  isCorrect: boolean;
  currentImageLoaded: boolean;
  nextImagePreloaded: boolean;
  currentQuestion: number;
  totalQuestions: number;
  isDarkMode: boolean;
  description: string | null;
  sourceUrl: string | null;
  loadingDescription: boolean;
  showInformation: boolean;
  isSmallScreen : boolean
  toggleInformation: () => void;
  onAnswerSelect: (answer: string) => void;
  onNextQuestion: (isFinishRequest: boolean) => void;
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
  isDarkMode,
  description,
  sourceUrl,
  loadingDescription,
  showInformation,
  isSmallScreen,
  toggleInformation,
  onAnswerSelect,
  onNextQuestion,
}: MultipleChoiceProps) {
  // Keyboard support for multiple choice
  useEffect(() => {
    if (showResult || !currentImageLoaded) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      const key = event.key;
      if (key >= "1" && key <= "8") {
        const index = Number.parseInt(key) - 1;
        if (currentFlag && currentFlag.options[index]) {
          onAnswerSelect(currentFlag.options[index]);
        }
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showResult, currentFlag, currentImageLoaded, onAnswerSelect]);

  // Spacebar support for next question and view results
  useEffect(() => {
    if (!showResult) return;

    const handleKeyPress = (event: KeyboardEvent) => {
      if (event.code === "Space") {
        event.preventDefault();
        onNextQuestion(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showResult, onNextQuestion]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-3 mb-1">
        {currentFlag.options.map((option, index) => {
          let buttonVariant: "default" | "destructive" | "outline" = "outline";
          let icon = null;

          if (showResult && selectedAnswer) {
            if (option === currentFlag.country) {
              buttonVariant = "default";
              icon = <CheckCircle className="w-4 h-4 ml-2 text-green-600" />;
            } else if (
              option === selectedAnswer &&
              option !== currentFlag.country
            ) {
              buttonVariant = "destructive";
              icon = <XCircle className="w-4 h-4 ml-2 text-red-600" />;
            }
          }

          return (
            <Button
              key={option}
              variant={buttonVariant}
              onClick={() => onAnswerSelect(option)}
              disabled={showResult || !currentImageLoaded}
              className={`md:h-12 h-8 text-left justify-between text-balance ${
                showResult && option === currentFlag.country
                  ? "bg-green-100 border-green-500 text-green-800 hover:bg-green-100"
                  : showResult &&
                    option === selectedAnswer &&
                    option !== currentFlag.country
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
          );
        })}
      </div>

      {/* Show infomation toggle */}
      <div className="md:flex hidden flex-row items-center justify-end gap-x-1 mb-4">
        <button
          className="text-sm dark:text-white/80 text-gray-700"
          onClick={toggleInformation}
        >
          show information
        </button>
        <input
          onClick={toggleInformation}
          type="checkbox"
          className="accent-primary hover:cursor-pointer"
          checked={showInformation}
          readOnly
        />
      </div>

      {/* Reserved space for result - ensure consistent height */}
      <motion.div
        animate={showInformation ? { height: 400 } : { height: 100 }}
        className="flex-col justify-center"
      >
        {showResult ? (
          <div className="flex flex-col">
            {showInformation && !isSmallScreen ? (
              <InformationWithAnswerResultSection
                isCorrect={isCorrect}
                currentFlag={currentFlag}
                loadingDescription={loadingDescription}
                description={description}
                sourceUrl={sourceUrl}
                isDarkMode={isDarkMode}
                nextImagePreloaded={nextImagePreloaded}
                currentQuestion={currentQuestion}
                totalQuestions={totalQuestions}
                onNextQuestion={onNextQuestion}
              />
            ) : (
              <AnswerResult
                isCorrect={isCorrect}
                currentFlag={currentFlag}
                nextImagePreloaded={nextImagePreloaded}
                currentQuestion={currentQuestion}
                totalQuestions={totalQuestions}
                onNextQuestion={onNextQuestion}
              />
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col justify-center">
            <div className="text-center text-gray-400 dark:text-gray-500 text-sm">
              {!currentImageLoaded
                ? "Loading flag image..."
                : "Click an answer above or press number on your keyboard to answer"}
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}


