"use client";

import type React from "react";

import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import type { FlagQuestion } from "../types";
import { motion } from "motion/react";
import { AnswerResult } from "./answer-result";
import { InformationWithAnswerResultSection } from "./Information-with-answer-result";

interface TextInputProps {
  currentFlag: FlagQuestion;
  textAnswer: string;
  showResult: boolean;
  isCorrect: boolean;
  currentImageLoaded: boolean;
  nextImagePreloaded: boolean;
  currentQuestion: number;
  totalQuestions: number;
  autocompleteEnabled: boolean;
  suggestions: string[];
  selectedSuggestionIndex: number;
  showInformation: boolean;
  isDarkMode: boolean;
  description: string | null;
  sourceUrl: string | null;
  loadingDescription: boolean;
  isSmallScreen: boolean;
  toggleInformation: () => void;
  onTextInputChange: (value: string) => void;
  onTextSubmit: () => void;
  onSuggestionClick: (suggestion: string) => void;
  onNextQuestion: (isFinishRequest: boolean) => void;
  onSuggestionIndexChange: (index: number) => void;
  onClearSuggestions: () => void;
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
  showInformation,
  isDarkMode,
  description,
  sourceUrl,
  loadingDescription,
  isSmallScreen,
  toggleInformation,
  onTextInputChange,
  onTextSubmit,
  onSuggestionClick,
  onNextQuestion,
  onSuggestionIndexChange,
  onClearSuggestions,
}: TextInputProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-focus input when question loads
  useEffect(() => {
    if (currentImageLoaded && !showResult && inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentImageLoaded, currentQuestion]);

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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (
        selectedSuggestionIndex >= 0 &&
        suggestions[selectedSuggestionIndex]
      ) {
        // Select the highlighted suggestion
        onSuggestionClick(suggestions[selectedSuggestionIndex]);
      } else {
        onTextSubmit();
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (suggestions.length > 0) {
        onSuggestionIndexChange(
          selectedSuggestionIndex < suggestions.length - 1
            ? selectedSuggestionIndex + 1
            : 0
        );
      }
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (suggestions.length > 0) {
        onSuggestionIndexChange(
          selectedSuggestionIndex > 0
            ? selectedSuggestionIndex - 1
            : suggestions.length - 1
        );
      }
    } else if (e.key === "Escape") {
      onClearSuggestions();
    }
  };

  return (
    <div className="flex flex-col ">
      <div className="space-y-4 mb-1">
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

        <div className="h-[40px]">
          {!showResult && (
            <Button
              onClick={onTextSubmit}
              disabled={!textAnswer.trim() || !currentImageLoaded}
              className="w-full dark:bg-[#09080e] dark:hover:bg-[#09080e]/80 dark:border-[#09080e]/30 dark:text-white"
            >
              Submit Answer
            </Button>
          )}
        </div>
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

      {/* Reserved space for result - ensure consistent height to prevent layout jumps */}
      <motion.div
        animate={showInformation ? { height: 400 } : { height: 100 }}
        className="flex-col justify-center"
      >
        {showResult ? (
          <div className="flex flex-col">
            {showInformation && isSmallScreen ? (
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
      </motion.div>
    </div>
  );
}
