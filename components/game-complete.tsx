"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { RotateCcw, Moon, Sun, Clock } from "lucide-react";
import { formatTime } from "../utils";
import type { GameMode } from "../types";
import { FlagIcon } from "./flag-icon";
import { Background } from "./background";
import { Footer } from "./footer";
import { ThemeSettingButton } from "./ThemeSettingButton";
import Link from "next/link";

interface GameCompleteProps {
  gameMode: GameMode;
  score: number;
  totalQuestions: number;
  elapsedTime?: number;
  backgroundEnabled: boolean;
  backgroundIndex: number;
  onResetGame: () => void;
  onToggleTheme: () => void;
  correctAnswers: { countryCode: string; country: string }[];
  incorrectAnswers: { countryCode: string; country: string }[];
  setBackgroundEnabled: (enabled: boolean) => void;
  setBackgroundIndex: (index: number) => void;
}

export function GameComplete({
  gameMode,
  score,
  totalQuestions,
  elapsedTime = 0,
  onResetGame,
  onToggleTheme,
  correctAnswers,
  incorrectAnswers,
  backgroundEnabled,
  backgroundIndex,
  setBackgroundEnabled,
  setBackgroundIndex,
}: GameCompleteProps) {
  const getScoreMessage = () => {
    if (score === totalQuestions) {
      return "Perfect score! You're a flag expert! 🎉";
    } else if (score >= totalQuestions * 0.7) {
      return "Great job! You know your flags well! 👏";
    } else {
      return "Good effort! Keep practicing to improve! 💪";
    }
  };

  return (
    <Background
      backgroundEnabled={backgroundEnabled}
      backgroundIndex={backgroundIndex}
    >
      <div className={`w-full min-h-screen flex items-center justify-center }`}>
        <Card className="w-full max-w-2xl backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/30 shadow-2xl">
          <CardHeader className="text-center relative">
            <div className="absolute top-4 right-4 p-2">
              <ThemeSettingButton
                backgroundEnabled={backgroundEnabled}
                onToggleBackgroundEnabled={setBackgroundEnabled}
                onBackgroundChange={setBackgroundIndex}
                backgroundIndex={backgroundIndex}
              />
            </div>
            <CardTitle className="bg-gray-800 self-center px-2 py-2 rounded-lg shadow shadow-black font-bold text-green-600 dark:text-green-400 moirai text-5xl">
              Quiz Complete!
            </CardTitle>
            <div className="flex flex-col items-center gap-2 mt-2 translate-y-3">
              <Badge
                variant="outline"
                className="backdrop-blur-sm bg-white/20 dark:bg-gray-700/20 border-white/30 dark:border-gray-600/30"
              >
                {gameMode === "multiple-choice"
                  ? "Multiple Choice Mode"
                  : "Text Input Mode"}
              </Badge>
              <div className="flex items-center gap-1 text-primary/80">
                <Clock className="h-4 w-4" />
                <span className="font-mono text-sm">
                  Time: {formatTime(elapsedTime)}
                </span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <div className="text-4xl font-bold text-gray-800 dark:text-gray-200">
              {score}/{totalQuestions}
            </div>
            <p className="text-primary/80 font-semibold">{getScoreMessage()}</p>
            <div className="flex flex-col items-center justify-start space-y-1">
              <div className="text-sm text-primary/60 italic">
                A{" "}
                <Link href={"/all-flags"}>
                  <span className="underline dark:hover:text-orange-500 hover:text-primary">full list of flags</span>
                </Link>
                {" "}is available if you’re interested.
              </div>
            </div>

            {/* Answer Summary */}
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div className="border rounded-lg p-3 bg-green-50/70 dark:bg-green-900/30 backdrop-blur-sm border-white/20 dark:border-gray-600/20">
                <h3 className="text-sm font-medium text-green-700 dark:text-green-400 mb-2">
                  Correct: {correctAnswers.length}
                </h3>
                <div
                  style={{
                    gridAutoRows: "min-content",
                    gridTemplateColumns:
                      "repeat(auto-fill, minmax(32px, 1fr)) ",
                  }}
                  className="grid grid-cols-4 gap-1.5 min-h-24 max-h-96 overflow-y-auto pr-1 custom-scrollbar overflow-x-hidden"
                >
                  {correctAnswers.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      None
                    </p>
                  ) : (
                    correctAnswers.map((answer, index) => (
                      <div key={`correct-${index}`} className="relative group">
                        <FlagIcon
                          countryCode={answer.countryCode}
                          country={answer.country}
                          size="sm"
                        />
                        <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
                          {answer.country}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
              <div className="border rounded-lg p-3 bg-red-50/70 dark:bg-red-900/30 backdrop-blur-sm border-white/20 dark:border-gray-600/20 ">
                <h3 className="text-sm font-medium text-red-700 dark:text-red-400 mb-2">
                  Incorrect: {incorrectAnswers.length}
                </h3>
                <div
                  className="grid grid-cols-4 gap-1.5 min-h-24 max-h-96 overflow-y-auto pr-1 custom-scrollbar overflow-x-hidden"
                  style={{
                    gridAutoRows: "min-content",
                    gridTemplateColumns: "repeat(auto-fill, minmax(32px, 1fr))",
                  }}
                >
                  {incorrectAnswers.length === 0 ? (
                    <p className="text-xs text-gray-500 dark:text-gray-400 italic">
                      None
                    </p>
                  ) : (
                    incorrectAnswers.map((answer, index) => (
                      <div
                        key={`incorrect-${index}`}
                        className="relative group"
                      >
                        <FlagIcon
                          countryCode={answer.countryCode}
                          country={answer.country}
                          size="sm"
                        />
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
              className="w-full backdrop-blur-sm group text-white bg-orange-700/80 hover:bg-orange-800/80 border border-orange-600/30
              dark:bg-[#09080e] dark:hover:bg-[#09080e]/80 dark:border-white/30 shadow-sm shadow-black dark:border dark:border-gray-800"
            >
              <RotateCcw className="w-4 h-4 mr-2 group-hover:-rotate-[360deg] transition duration-1000" />
              Play Again
            </Button>
            <Footer />
          </CardContent>
        </Card>
      </div>
    </Background>
  );
}
