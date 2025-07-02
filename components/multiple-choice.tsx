"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle,
  XCircle,
  Loader2,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import type { FlagQuestion } from "../types";
import { motion } from "motion/react";
import { InformationWithAnswerResultSection } from "./Information-with-answer-result";
import { AnswerResult } from "./answer-result";
import { ShowInfoButton } from "./show-info-button";
import { useTheme } from "next-themes";

interface MultipleChoiceProps {
  currentFlag: FlagQuestion;
  selectedAnswer: string | null;
  showResult: boolean;
  isCorrect: boolean;
  currentImageLoaded: boolean;
  nextImagePreloaded: boolean;
  currentQuestion: number;
  totalQuestions: number;
  description: string | null;
  extract: string | null;
  sourceUrl: string | null;
  loadingDescription: boolean;
  showInformation: boolean;
  isSmallScreen: boolean;
  nextDisabled: boolean;
  setNextDisabled: (state: boolean) => void;
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
  description,
  sourceUrl,
  extract,
  loadingDescription,
  showInformation,
  isSmallScreen,
  nextDisabled,
  setNextDisabled,
  toggleInformation,
  onAnswerSelect,
  onNextQuestion,
}: MultipleChoiceProps) {
  // Keyboard support for multiple choice
  const {resolvedTheme} =useTheme()
  const isDarkMode = resolvedTheme === "dark"
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
      if (event.code === "Space" && !nextDisabled) {
        event.preventDefault();
        setNextDisabled(true);
        onNextQuestion(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [showResult, onNextQuestion, nextDisabled]);

  // Re-enable next button when question changes or result is hidden
  useEffect(() => {
    setNextDisabled(false);
  }, [currentQuestion, showResult]);

  return (
    <div className="flex-1 flex flex-col">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-1 md:gap-3 mb-1">
        {currentFlag.options.map((option, index) => {
          let buttonVariant: "default" | "destructive" | "outline" = "outline";
          let icon = null;

          if (showResult && selectedAnswer) {
            if (option === currentFlag.name) {
              buttonVariant = "default";
              icon = <CheckCircle className="w-4 h-4 ml-2 text-green-600" />;
            } else if (
              option === selectedAnswer &&
              option !== currentFlag.name
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
                showResult && option === currentFlag.name
                  ? "bg-green-100 border-green-500 text-green-800 hover:bg-green-100"
                  : showResult &&
                    option === selectedAnswer &&
                    option !== currentFlag.name
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
      <ShowInfoButton
        showInformation={showInformation}
        toggleInformation={toggleInformation}
      />

      {/* Reserved space for result - ensure consistent height */}
      <motion.div
        animate={showInformation && !isSmallScreen ? { height: 400 } : { height: 120 }}
        className="flex-col justify-center "
      >
        {showResult ? (
          <div className="flex flex-col">
            {showInformation && !isSmallScreen ? (
              <InformationWithAnswerResultSection
                isCorrect={isCorrect}
                currentFlag={currentFlag}
                loadingDescription={loadingDescription}
                description={description}
                extract={extract}
                sourceUrl={sourceUrl}
                isDarkMode={isDarkMode}
                nextImagePreloaded={nextImagePreloaded}
                currentQuestion={currentQuestion}
                totalQuestions={totalQuestions}
                onNextQuestion={() => {
                  setNextDisabled(true);
                  onNextQuestion(false);
                }}
                nextDisabled={nextDisabled}
              />
            ) : (
              <AnswerResult
                isCorrect={isCorrect}
                currentFlag={currentFlag}
                nextImagePreloaded={nextImagePreloaded}
                currentQuestion={currentQuestion}
                totalQuestions={totalQuestions}
                onNextQuestion={() => {
                  setNextDisabled(true);
                  onNextQuestion(false);
                }}
                nextDisabled={nextDisabled}
              />
            )}
          </div>
        ) : (
          <div className="flex h-full flex-col justify-center translate-y-3">
            <div className="text-center text-sm text-primary/80">
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
