"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Moon, Sun, Home, Clock } from "lucide-react"

import { ModeSelection } from "./components/mode-selection"
import { GameComplete } from "./components/game-complete"
import { FlagImage } from "./components/flag-image"
import { MultipleChoice } from "./components/multiple-choice"
import { TextInput } from "./components/text-input"
import { AnswerHistory } from "./components/answer-history"

import { generateQuestions, preloadNextImage, getAllCountries, formatTime } from "./utils"
import { DEFAULT_QUIZ_LENGTH, type QuizLength, DEFAULT_COUNTRY_FILTER } from "./constants"
import type { GameMode, FlagQuestion, CountryFilter } from "./types"

export default function FlagGame() {
  // Game state
  const [gameMode, setGameMode] = useState<GameMode>(null)
  const [selectedGameMode, setSelectedGameMode] = useState<GameMode>(null)
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [textAnswer, setTextAnswer] = useState("")
  const [showResult, setShowResult] = useState(false)
  const [score, setScore] = useState(0)
  const [gameComplete, setGameComplete] = useState(false)
  const [autocompleteEnabled, setAutocompleteEnabled] = useState(true)
  const [suggestions, setSuggestions] = useState<string[]>([])
  const [flagQuestions, setFlagQuestions] = useState<FlagQuestion[]>([])
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1)
  const [quizLength, setQuizLength] = useState<QuizLength>(DEFAULT_QUIZ_LENGTH)
  const [countryFilter, setCountryFilter] = useState<CountryFilter>(DEFAULT_COUNTRY_FILTER)
  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<number>(4)

  // Track correct and incorrect answers
  const [correctAnswers, setCorrectAnswers] = useState<{ countryCode: string; country: string }[]>([])
  const [incorrectAnswers, setIncorrectAnswers] = useState<{ countryCode: string; country: string }[]>([])

  // Image loading states
  const [currentImageLoaded, setCurrentImageLoaded] = useState(false)
  const [nextImagePreloaded, setNextImagePreloaded] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)

  // Timer state
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedTime, setElapsedTime] = useState(0)
  const [finalTime, setFinalTime] = useState(0)

  const allCountries = getAllCountries()
  const currentFlag = flagQuestions[currentQuestion]

  const isCorrect =
    gameMode === "multiple-choice"
      ? selectedAnswer === currentFlag?.country
      : textAnswer.toLowerCase().trim() === currentFlag?.country.toLowerCase()

  // Initialize questions
  useEffect(() => {
    const questions = generateQuestions(quizLength, countryFilter, multipleChoiceOptions)
    setFlagQuestions(questions)
  }, [quizLength, countryFilter, multipleChoiceOptions])

  // Start timer when game mode is selected
  useEffect(() => {
    if (gameMode && !startTime) {
      setStartTime(Date.now())
    }
  }, [gameMode, startTime])

  // Update timer every second during game
  useEffect(() => {
    if (!startTime || gameComplete) return

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000))
    }, 1000)

    return () => clearInterval(interval)
  }, [startTime, gameComplete])

  // Preload next image when current question changes
  useEffect(() => {
    if (flagQuestions.length > 0 && currentImageLoaded) {
      setNextImagePreloaded(false)
      preloadNextImage(flagQuestions, currentQuestion).then(setNextImagePreloaded)
    }
  }, [currentQuestion, flagQuestions, currentImageLoaded])

  // Handlers
  const handleModeSelect = (mode: GameMode) => {
    setSelectedGameMode(mode)
  }

  const handleStartGame = () => {
    if (selectedGameMode) {
      setGameMode(selectedGameMode)
      // Reset answer history when starting a new game
      setCorrectAnswers([])
      setIncorrectAnswers([])
    }
  }

  const handleQuizLengthChange = (length: QuizLength | number) => {
    if (typeof length === "number") {
      // Ensure the number is either 10, 20, or another valid number
      if (length <= 10) {
        setQuizLength(10)
      } else if (length <= 20) {
        setQuizLength(20)
      } else {
        // For custom numbers above 20
        setQuizLength(length as QuizLength)
      }
    } else {
      setQuizLength(length)
    }
  }

  const handleCountryFilterChange = (filter: CountryFilter) => {
    setCountryFilter(filter)
  }

  const handleMultipleChoiceOptionsChange = (options: number) => {
    setMultipleChoiceOptions(options)
  }

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return
    setSelectedAnswer(answer)
    setShowResult(true)

    if (answer === currentFlag.country) {
      setScore(score + 1)
      // Add to correct answers
      setCorrectAnswers([...correctAnswers, { countryCode: currentFlag.countryCode, country: currentFlag.country }])
    } else {
      // Add to incorrect answers
      setIncorrectAnswers([...incorrectAnswers, { countryCode: currentFlag.countryCode, country: currentFlag.country }])
    }
  }

  const handleTextInputChange = (value: string) => {
    setTextAnswer(value)
    setSelectedSuggestionIndex(-1)

    if (autocompleteEnabled && value.length > 0) {
      const filtered = allCountries
        .filter((country) => country.toLowerCase().startsWith(value.toLowerCase()))
        .slice(0, 5)
      setSuggestions(filtered)
    } else {
      setSuggestions([])
    }
  }

  const handleTextSubmit = () => {
    if (showResult || !textAnswer.trim()) return
    setShowResult(true)
    setSuggestions([])

    if (textAnswer.toLowerCase().trim() === currentFlag.country.toLowerCase()) {
      setScore(score + 1)
      // Add to correct answers
      setCorrectAnswers([...correctAnswers, { countryCode: currentFlag.countryCode, country: currentFlag.country }])
    } else {
      // Add to incorrect answers
      setIncorrectAnswers([...incorrectAnswers, { countryCode: currentFlag.countryCode, country: currentFlag.country }])
    }
  }

  const handleSuggestionClick = (suggestion: string) => {
    setTextAnswer(suggestion)
    setSuggestions([])
    setSelectedSuggestionIndex(-1)
  }

  const handleNextQuestion = () => {
    if (currentQuestion < flagQuestions.length - 1) {
      if (nextImagePreloaded) {
        setIsTransitioning(true)

        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1)
          setSelectedAnswer(null)
          setTextAnswer("")
          setShowResult(false)
          setSuggestions([])
          setSelectedSuggestionIndex(-1)
          setCurrentImageLoaded(false)
          setIsTransitioning(false)
        }, 150)
      }
    } else {
      // Save final time before completing the game
      setFinalTime(elapsedTime)
      setGameComplete(true)
    }
  }

  const handleBackToMenu = () => {
    setGameMode(null)
    setCurrentQuestion(0)
    setSelectedAnswer(null)
    setTextAnswer("")
    setShowResult(false)
    setScore(0)
    setGameComplete(false)
    setSuggestions([])
    setSelectedSuggestionIndex(-1)
    setCurrentImageLoaded(false)
    setNextImagePreloaded(false)
    setIsTransitioning(false)
    setStartTime(null)
    setElapsedTime(0)
    setFinalTime(0)
    setCorrectAnswers([])
    setIncorrectAnswers([])

    // Keep the current quiz length and country filter
    const newQuestions = generateQuestions(quizLength, countryFilter, multipleChoiceOptions)
    setFlagQuestions(newQuestions)
  }

  const handleResetGame = () => {
    handleBackToMenu()
  }

  const handleToggleTheme = () => {
    setIsDarkMode(!isDarkMode)
  }

  const handleCurrentImageLoad = () => {
    setCurrentImageLoaded(true)
  }

  // Mode Selection Screen
  if (!gameMode) {
    return (
      <ModeSelection
        isDarkMode={isDarkMode}
        autocompleteEnabled={autocompleteEnabled}
        quizLength={quizLength}
        countryFilter={countryFilter}
        selectedGameMode={selectedGameMode}
        multipleChoiceOptions={multipleChoiceOptions}
        onModeSelect={handleModeSelect}
        onToggleTheme={handleToggleTheme}
        onToggleAutocomplete={setAutocompleteEnabled}
        onQuizLengthChange={handleQuizLengthChange}
        onCountryFilterChange={handleCountryFilterChange}
        onMultipleChoiceOptionsChange={handleMultipleChoiceOptionsChange}
        onStartGame={handleStartGame}
      />
    )
  }

  // Game Complete Screen
  if (gameComplete) {
    return (
      <GameComplete
        isDarkMode={isDarkMode}
        gameMode={gameMode}
        score={score}
        totalQuestions={flagQuestions.length}
        elapsedTime={finalTime}
        onResetGame={handleResetGame}
        onToggleTheme={handleToggleTheme}
        correctAnswers={correctAnswers}
        incorrectAnswers={incorrectAnswers}
      />
    )
  }

  // Main Game Screen
  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div
        className={`min-h-screen flex items-center justify-center p-4 transition-colors ${
          isDarkMode ? "bg-gradient-to-t from-violet-400 to-black" : "bg-gradient-to-b from-orange-100 to-orange-200"
        }`}
      >
        <Card className="w-full max-w-2xl min-h-[600px] flex flex-col backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/30 shadow-2xl">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold">Flag Guesser</CardTitle>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" onClick={handleBackToMenu} className="p-2" title="Back to Main Menu">
                  <Home className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={handleToggleTheme} className="p-2" title="Toggle Theme">
                  {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
                </Button>
              </div>
            </div>
            <div className="flex flex-wrap justify-between items-center gap-2 text-sm">
              <div className="flex flex-wrap gap-2">
                <Badge
                  variant="outline"
                  className="backdrop-blur-sm bg-white/20 dark:bg-gray-700/20 border-white/30 dark:border-gray-600/30"
                >
                  {gameMode === "multiple-choice" ? "Multiple Choice" : "Text Input"}
                </Badge>
                <Badge
                  variant="outline"
                  className="backdrop-blur-sm bg-white/20 dark:bg-gray-700/20 border-white/30 dark:border-gray-600/30"
                >
                  Question {currentQuestion + 1}/{flagQuestions.length}
                </Badge>
                <Badge
                  variant="outline"
                  className="backdrop-blur-sm bg-white/20 dark:bg-gray-700/20 border-white/30 dark:border-gray-600/30"
                >
                  Score: {score}
                </Badge>
              </div>
              <div className="flex items-center gap-1 text-gray-600 dark:text-gray-400">
                <Clock className="h-4 w-4" />
                <span className="font-mono text-sm">{formatTime(elapsedTime)}</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-6 flex-1 flex flex-col">
            {/* Flag Display */}
            <div className="text-center">
              <h2 className="text-lg font-semibold mb-4">Which country does this flag belong to?</h2>
              <div className="flex justify-center">
                <FlagImage
                  countryCode={currentFlag.countryCode}
                  country={currentFlag.country}
                  onLoad={handleCurrentImageLoad}
                  isLoading={isTransitioning}
                />
              </div>
            </div>

            {/* Game Mode Components */}
            {gameMode === "multiple-choice" && (
              <MultipleChoice
                currentFlag={currentFlag}
                selectedAnswer={selectedAnswer}
                showResult={showResult}
                isCorrect={isCorrect}
                currentImageLoaded={currentImageLoaded}
                nextImagePreloaded={nextImagePreloaded}
                currentQuestion={currentQuestion}
                totalQuestions={flagQuestions.length}
                onAnswerSelect={handleAnswerSelect}
                onNextQuestion={handleNextQuestion}
              />
            )}

            {gameMode === "text-input" && (
              <TextInput
                currentFlag={currentFlag}
                textAnswer={textAnswer}
                showResult={showResult}
                isCorrect={isCorrect}
                currentImageLoaded={currentImageLoaded}
                nextImagePreloaded={nextImagePreloaded}
                currentQuestion={currentQuestion}
                totalQuestions={flagQuestions.length}
                autocompleteEnabled={autocompleteEnabled}
                suggestions={suggestions}
                selectedSuggestionIndex={selectedSuggestionIndex}
                onTextInputChange={handleTextInputChange}
                onTextSubmit={handleTextSubmit}
                onSuggestionClick={handleSuggestionClick}
                onNextQuestion={handleNextQuestion}
                onSuggestionIndexChange={setSelectedSuggestionIndex}
                onClearSuggestions={() => {
                  setSuggestions([])
                  setSelectedSuggestionIndex(-1)
                }}
              />
            )}

            {/* Answer History */}
            <AnswerHistory correctAnswers={correctAnswers} incorrectAnswers={incorrectAnswers} />

            {/* Credit line */}
            <div className="mt-auto pt-2 text-xs text-center text-gray-500 dark:text-gray-400">
              <a href="https://flagpedia.net" target="_blank" rel="noopener noreferrer" className="hover:underline">
                Flags from Flagpedia.net
              </a>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
