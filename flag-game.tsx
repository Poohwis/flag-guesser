"use client";

import { playSound } from "react-sounds";
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Home, Clock, Volume2, VolumeOff } from "lucide-react";
import { useTheme } from "next-themes";
// import successSound from "./sounds/success.mp3"
// import errorSound from "./sounds/error.mp3"

import { ModeSelection } from "./components/mode-selection";
import { GameComplete } from "./components/game-complete";
import { FlagImage } from "./components/flag-image";
import { MultipleChoice } from "./components/multiple-choice";
import { TextInput } from "./components/text-input";
import { AnswerHistory } from "./components/answer-history";

import {
  generateQuestions,
  preloadNextImage,
  getAllCountries,
  formatTime,
  fetchWikiMediaCountryDescription,
  getFlagCount,
} from "./utils";
import {
  DEFAULT_QUIZ_LENGTH,
  type QuizLength,
  DEFAULT_COUNTRY_FILTER,
  ALTNAME_USE_COUNTRY,
  TOTAL_UN_COUNTRIES,
  TOTAL_ALL_COUNTRIES,
} from "./constants";
import type {
  GameMode,
  FlagQuestion,
  CountryFilter,
  ContinentFilter,
} from "./types";
import { Background } from "./components/background";
import { ThemeSettingButton } from "./components/ThemeSettingButton";
import { useBackgroundStore } from "./store/backgroundStore";
import { useWindowSizeStore } from "./store/windowSizeStore";
import { useSoundStore } from "./store/soundStore";

export default function FlagGame() {
  // Game state
  const [gameMode, setGameMode] = useState<GameMode>(null);
  const [selectedGameMode, setSelectedGameMode] =
    useState<GameMode>("multiple-choice");
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [textAnswer, setTextAnswer] = useState("");
  const [showResult, setShowResult] = useState(false);
  const [score, setScore] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [autocompleteEnabled, setAutocompleteEnabled] = useState(true);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [flagQuestions, setFlagQuestions] = useState<FlagQuestion[]>([]);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [quizLength, setQuizLength] = useState<QuizLength>(DEFAULT_QUIZ_LENGTH);
  const [countryFilter, setCountryFilter] = useState<CountryFilter>(
    DEFAULT_COUNTRY_FILTER
  );
  const [continentFilter, setContinentFilter] =
    useState<ContinentFilter | null>(null);

  const [multipleChoiceOptions, setMultipleChoiceOptions] = useState<number>(4);

  // Track correct and incorrect answers
  const [correctAnswers, setCorrectAnswers] = useState<
    { countryCode: string; country: string }[]
  >([]);
  const [incorrectAnswers, setIncorrectAnswers] = useState<
    { countryCode: string; country: string }[]
  >([]);

  const handlePlaySuccessSound = () =>
    playSound("/sounds/success.mp3", { volume: 0.4, rate: 1.3 });
  const handlePlayErrorSound = () =>
    playSound("/sounds/error.mp3", { volume: 0.4, rate: 1.3 });

  const { soundEnabled, setSoundEnabled } = useSoundStore();
  const [answerLength, setAnswerLength] = useState<{
    correct: number;
    incorrect: number;
  }>({ correct: 0, incorrect: 0 });

  useEffect(() => {
    if (!soundEnabled) return;
    if (
      correctAnswers.length !== 0 &&
      answerLength.correct !== correctAnswers.length
    ) {
      // playCorrect();
      handlePlaySuccessSound();
      setAnswerLength((prev) => ({ ...prev, correct: correctAnswers.length }));
    }
    if (
      incorrectAnswers.length !== 0 &&
      answerLength.incorrect !== incorrectAnswers.length
    ) {
      handlePlayErrorSound();
      setAnswerLength((prev) => ({
        ...prev,
        incorrect: incorrectAnswers.length,
      }));
    }
  }, [correctAnswers, incorrectAnswers]);

  // Image loading states
  const [currentImageLoaded, setCurrentImageLoaded] = useState(false);
  const [nextImagePreloaded, setNextImagePreloaded] = useState(false);
  const [isTransitioning, setIsTransitioning] = useState(false);

  // Timer state
  const [startTime, setStartTime] = useState<number | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [finalTime, setFinalTime] = useState(0);

  // Description state
  const [description, setDescription] = useState<string | null>(null);
  const [sourceUrl, setSourceUrl] = useState<string | null>(null);
  const [extract, setExtract] = useState<string | null>(null);

  const [loadingDescription, setLoadingDescription] = useState<boolean>(true);

  const [showInfomation, setShowInformation] = useState(true);
  const allCountries = getAllCountries();
  const currentFlag = flagQuestions[currentQuestion];

  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [nextDisable, setNextDisabled] = useState(false);

  const {
    backgroundEnabled,
    backgroundIndex,
    setBackgroundIndex,
    setBackgroundEnabled,
  } = useBackgroundStore();
  const { windowWidth, setWindowWidth } = useWindowSizeStore();

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
      setWindowWidth(window.innerWidth);
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const isCorrect =
    gameMode === "multiple-choice"
      ? selectedAnswer === currentFlag?.name
      : (() => {
          const answer = textAnswer.toLowerCase().trim();
          const main = currentFlag?.name?.toLowerCase();
          const alt = Array.isArray(currentFlag?.altNames)
            ? currentFlag.altNames.map((n) => n.toLowerCase().trim())
            : [];
          return answer === main || alt.includes(answer);
        })();

  const [flagCount, setFlagCount] = useState<{ un: number; all: number }>({
    un: TOTAL_UN_COUNTRIES,
    all: TOTAL_ALL_COUNTRIES,
  });

  // Initialize questions
  const [prevContinent, setPrevContinent] = useState<ContinentFilter | null>(
    null
  );
  const [prevCountryFilter, setPrevCountryFilter] = useState<"un" | "all">(
    "un"
  );

  useEffect(() => {
    const { un, all } = getFlagCount(continentFilter);
    setFlagCount({ un, all });

    if (continentFilter && continentFilter !== prevContinent) {
      setQuizLength(countryFilter === "un" ? un : all);
    } else if (
      (!continentFilter && prevContinent !== null) ||
      countryFilter !== prevCountryFilter
    ) {
      setQuizLength(10);
    }

    setPrevContinent(continentFilter);
    setPrevCountryFilter(countryFilter);
  }, [continentFilter, countryFilter]);

  useEffect(() => {
    const questions = generateQuestions(
      quizLength,
      countryFilter,
      continentFilter,
      multipleChoiceOptions
    );
    setFlagQuestions(questions);
  }, [quizLength, countryFilter, continentFilter, multipleChoiceOptions]);

  // Start timer when game mode is selected
  useEffect(() => {
    if (gameMode && !startTime) {
      setStartTime(Date.now());
    }
  }, [gameMode, startTime]);

  // Update timer every second during game
  useEffect(() => {
    if (!startTime || gameComplete) return;

    const interval = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);

    return () => clearInterval(interval);
  }, [startTime, gameComplete]);

  // Preload next image when current question changes
  useEffect(() => {
    if (flagQuestions.length > 0 && currentImageLoaded) {
      setNextImagePreloaded(false);
      preloadNextImage(flagQuestions, currentQuestion).then(
        setNextImagePreloaded
      );
    }
  }, [currentQuestion, flagQuestions, currentImageLoaded]);

  // Fetch country description
  useEffect(() => {
    if (currentFlag?.name) {
      setLoadingDescription(true);
      setDescription(null); // Clear previous description
      setSourceUrl(null); // Clear previous source URL

      if (showInfomation) {
        const country =
          ALTNAME_USE_COUNTRY.includes(currentFlag.countryCode) &&
          Array.isArray(currentFlag.altNames) &&
          currentFlag.altNames.length > 0
            ? currentFlag.altNames[0]
            : currentFlag.name;
        fetchWikiMediaCountryDescription(country).then((result) => {
          setDescription(result.description);
          setSourceUrl(result.sourceUrl);
          setExtract(result.extract);
          setLoadingDescription(false);
        });
      }
    }
  }, [currentFlag, showInfomation]);

  // Handlers
  const handleModeSelect = (mode: GameMode) => {
    setSelectedGameMode(mode);
  };

  const handleStartGame = () => {
    if (selectedGameMode) {
      setGameMode(selectedGameMode);
      // Reset answer history when starting a new game
      setCorrectAnswers([]);
      setIncorrectAnswers([]);
    }
  };

  const handleToggleSetShowInformation = () => {
    setShowInformation((prev) => !prev);
  };

  const handleQuizLengthChange = (length: QuizLength | number) => {
    setQuizLength(length);
  };

  const handleCountryFilterChange = (filter: CountryFilter) => {
    setCountryFilter(filter);
  };

  const handleContinentFilterChange = (filter: ContinentFilter | null) => {
    setContinentFilter(filter);
  };

  const handleMultipleChoiceOptionsChange = (options: number) => {
    setMultipleChoiceOptions(options);
  };

  const handleAnswerSelect = (answer: string) => {
    if (showResult) return;
    setSelectedAnswer(answer);
    setShowResult(true);

    if (answer === currentFlag.name) {
      setScore(score + 1);
      // Add to correct answers
      setCorrectAnswers([
        ...correctAnswers,
        { countryCode: currentFlag.countryCode, country: currentFlag.name },
      ]);
    } else {
      // Add to incorrect answers
      setIncorrectAnswers([
        ...incorrectAnswers,
        { countryCode: currentFlag.countryCode, country: currentFlag.name },
      ]);
    }
  };

  const handleTextInputChange = (value: string) => {
    setTextAnswer(value);
    setSelectedSuggestionIndex(-1);

    if (autocompleteEnabled && value.length > 0) {
      const filtered = allCountries
        .filter((country) =>
          country.toLowerCase().startsWith(value.toLowerCase())
        )
        .slice(0, 5);
      setSuggestions(filtered);
    } else {
      setSuggestions([]);
    }
  };

  const handleTextSubmit = () => {
    if (showResult || !textAnswer.trim()) return;
    setShowResult(true);
    setSuggestions([]);

    const answer = textAnswer.toLowerCase().trim();
    const isMainName = answer === currentFlag.name.toLowerCase();
    const isAltName = Array.isArray(currentFlag.altNames)
      ? currentFlag.altNames.some((alt) => alt.toLowerCase().trim() === answer)
      : false;

    if (isMainName || isAltName) {
      setScore(score + 1);
      // Add to correct answers
      setCorrectAnswers([
        ...correctAnswers,
        { countryCode: currentFlag.countryCode, country: currentFlag.name },
      ]);
    } else {
      // Add to incorrect answers
      setIncorrectAnswers([
        ...incorrectAnswers,
        { countryCode: currentFlag.countryCode, country: currentFlag.name },
      ]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    setTextAnswer(suggestion);
    setSuggestions([]);
    setSelectedSuggestionIndex(-1);
  };

  const handleNextQuestion = (isFinishRequest: boolean) => {
    if (currentQuestion < flagQuestions.length - 1 && !isFinishRequest) {
      if (nextImagePreloaded) {
        setIsTransitioning(true);

        setTimeout(() => {
          setCurrentQuestion(currentQuestion + 1);
          setSelectedAnswer(null);
          setTextAnswer("");
          setShowResult(false);
          setSuggestions([]);
          setSelectedSuggestionIndex(-1);
          setCurrentImageLoaded(false);
          setIsTransitioning(false);
        }, 150);
      }
    } else {
      // Save final time before completing the game
      setFinalTime(elapsedTime);
      setGameComplete(true);
    }
  };

  const handleBackToMenu = () => {
    setGameMode(null);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setTextAnswer("");
    setShowResult(false);
    setScore(0);
    setGameComplete(false);
    setSuggestions([]);
    setSelectedSuggestionIndex(-1);
    setCurrentImageLoaded(false);
    setNextImagePreloaded(false);
    setIsTransitioning(false);
    setStartTime(null);
    setElapsedTime(0);
    setFinalTime(0);
    setCorrectAnswers([]);
    setContinentFilter(null);
    setIncorrectAnswers([]);

    const newQuestions = generateQuestions(
      quizLength,
      countryFilter,
      continentFilter,
      multipleChoiceOptions
    );
    setFlagQuestions(newQuestions);
  };

  const handleResetGame = () => {
    handleBackToMenu();
  };

  const { setTheme, resolvedTheme } = useTheme();
  const handleToggleTheme = () => {
    setTheme(resolvedTheme === "dark" ? "light" : "dark");
  };

  const handleCurrentImageLoad = () => {
    setCurrentImageLoaded(true);
  };

  // Mode Selection Screen
  if (!gameMode) {
    return (
      <ModeSelection
        flagCount={flagCount}
        continentFilter={continentFilter}
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
        onContinentFilterChange={handleContinentFilterChange}
        backgroundEnabled={backgroundEnabled}
        backgroundIndex={backgroundIndex}
        setBackgroundEnabled={setBackgroundEnabled}
        setBackgroundIndex={setBackgroundIndex}
      />
    );
  }

  // Game Complete Screen
  if (gameComplete) {
    return (
      <GameComplete
        gameMode={gameMode}
        score={score}
        totalQuestions={flagQuestions.length}
        elapsedTime={finalTime}
        onResetGame={handleResetGame}
        onToggleTheme={handleToggleTheme}
        correctAnswers={correctAnswers}
        incorrectAnswers={incorrectAnswers}
        backgroundEnabled={backgroundEnabled}
        backgroundIndex={backgroundIndex}
        setBackgroundEnabled={setBackgroundEnabled}
        setBackgroundIndex={setBackgroundIndex}
      />
    );
  }

  // Main Game Screen
  return (
    <Background
      backgroundIndex={backgroundIndex}
      backgroundEnabled={backgroundEnabled}
    >
      <Card className="w-full max-w-3xl min-h-[600px] flex flex-col backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/30 shadow-2xl">
        <CardHeader className="md:px-6 md:py-6 px-6 py-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl moirai">Flag Quizzer</CardTitle>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToMenu}
                className="p-2"
                title="Back to Main Menu"
              >
                <Home className="h-4 w-4" />
              </Button>
              <Button
                onClick={() => setSoundEnabled(!soundEnabled)}
                variant={"ghost"}
                size={"sm"}
                className="p-2"
              >
                {soundEnabled ? <Volume2 /> : <VolumeOff />}
              </Button>
              <ThemeSettingButton
                backgroundEnabled={backgroundEnabled}
                onToggleBackgroundEnabled={setBackgroundEnabled}
                handleNextQuestion={handleNextQuestion}
                onBackgroundChange={setBackgroundIndex}
                backgroundIndex={backgroundIndex}
              />
            </div>
          </div>
          <div className="flex flex-wrap justify-between items-center gap-2 text-sm">
            <div className="flex flex-wrap gap-2">
              <Badge
                variant="outline"
                className="backdrop-blur-sm bg-white/20 dark:bg-gray-700/20 border-white/30 dark:border-gray-600/30"
              >
                {gameMode === "multiple-choice"
                  ? "Multiple Choice"
                  : "Text Input"}
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
            <div className="flex items-center gap-1 text-primary/80">
              <Clock className="h-4 w-4" />
              <span className="font-mono text-sm ">
                {formatTime(elapsedTime)}
              </span>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6 flex-1 flex flex-col">
          {/* Flag Display */}
          <div className="text-center">
            <h2 className="text-lg font-semibold mb-4">
              This flag represents which place?
            </h2>
            <div className="flex justify-center">
              <FlagImage
                countryCode={currentFlag.countryCode}
                country={currentFlag.name}
                onLoad={handleCurrentImageLoad}
                isLoading={isTransitioning}
              />
            </div>
          </div>

          {/* Game Mode Components */}
          {gameMode === "multiple-choice" && (
            <MultipleChoice
              isSmallScreen={isSmallScreen}
              currentFlag={currentFlag}
              selectedAnswer={selectedAnswer}
              description={description}
              extract={extract}
              sourceUrl={sourceUrl}
              loadingDescription={loadingDescription}
              showInformation={showInfomation}
              toggleInformation={handleToggleSetShowInformation}
              showResult={showResult}
              isCorrect={isCorrect}
              currentImageLoaded={currentImageLoaded}
              nextImagePreloaded={nextImagePreloaded}
              currentQuestion={currentQuestion}
              totalQuestions={flagQuestions.length}
              onAnswerSelect={handleAnswerSelect}
              onNextQuestion={handleNextQuestion}
              nextDisabled={nextDisable}
              setNextDisabled={setNextDisabled}
            />
          )}

          {gameMode === "text-input" && (
            <TextInput
              isSmallScreen={isSmallScreen}
              currentFlag={currentFlag}
              textAnswer={textAnswer}
              showResult={showResult}
              isCorrect={isCorrect}
              description={description}
              extract={extract}
              sourceUrl={sourceUrl}
              loadingDescription={loadingDescription}
              showInformation={showInfomation}
              toggleInformation={handleToggleSetShowInformation}
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
              nextDisabled={nextDisable}
              setNextDisabled={setNextDisabled}
              onClearSuggestions={() => {
                setSuggestions([]);
                setSelectedSuggestionIndex(-1);
              }}
            />
          )}

          {/* Answer History */}
          <AnswerHistory
            correctAnswers={correctAnswers}
            incorrectAnswers={incorrectAnswers}
          />
        </CardContent>
      </Card>
    </Background>
  );
}
