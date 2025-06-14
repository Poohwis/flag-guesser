"use client"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Moon, Sun, Play } from "lucide-react"
import { TOTAL_ALL_COUNTRIES, TOTAL_UN_COUNTRIES, type CountryFilter, type QuizLength } from "../constants"
import { getQuizLengthDisplay } from "../utils"
import type { GameMode } from "../types"

interface ModeSelectionProps {
  isDarkMode: boolean
  autocompleteEnabled: boolean
  quizLength: QuizLength
  countryFilter: CountryFilter
  selectedGameMode: GameMode
  multipleChoiceOptions: number
  onModeSelect: (mode: GameMode) => void
  onToggleTheme: () => void
  onToggleAutocomplete: (enabled: boolean) => void
  onQuizLengthChange: (length: QuizLength) => void
  onCountryFilterChange: (filter: CountryFilter) => void
  onMultipleChoiceOptionsChange: (options: number) => void
  onStartGame: () => void
}

export function ModeSelection({
  isDarkMode,
  autocompleteEnabled,
  quizLength,
  countryFilter,
  selectedGameMode,
  multipleChoiceOptions,
  onModeSelect,
  onToggleTheme,
  onToggleAutocomplete,
  onQuizLengthChange,
  onCountryFilterChange,
  onMultipleChoiceOptionsChange,
  onStartGame,
}: ModeSelectionProps) {
  const optionChoices = [4, 6, 8]

  return (
    <div className={isDarkMode ? "dark" : ""}>
      <div
        className={`min-h-screen flex items-center justify-center p-4 transition-colors ${
          isDarkMode ? "bg-gradient-to-t from-violet-400 to-black" : "bg-gradient-to-t from-white to-orange-200"
        }`}
      >
        <Card className="w-full max-w-2xl backdrop-blur-xl bg-white/20 dark:bg-gray-900/20 border border-white/30 dark:border-gray-700/30 shadow-2xl">
          <CardHeader className="text-center relative">
            <Button variant="ghost" size="sm" onClick={onToggleTheme} className="absolute top-4 right-4 p-2">
              {isDarkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <CardTitle className="text-3xl font-bold text-gray-800 dark:text-gray-200 mb-2">Flag Guesser</CardTitle>
            <p className="dark:text-white/50 text-gray-700">The Ultimate Flag Challenge — Start Guessing!</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Country Filter Selection */}
            <Card className="backdrop-blur-md bg-gray-50/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-600/20">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Country Selection</Label>
                  <RadioGroup
                    value={countryFilter}
                    onValueChange={(value) => onCountryFilterChange(value as CountryFilter)}
                    className="grid grid-cols-1 md:grid-cols-2 gap-3"
                  >
                    <Label
                      htmlFor="un-countries"
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all cursor-pointer backdrop-blur-sm ${
                        countryFilter === "un"
                          ? "bg-blue-50/70 border-blue-500 dark:bg-blue-900/30 dark:border-blue-400"
                          : "bg-white/50 border-gray-200/50 hover:border-gray-300 dark:bg-gray-800/50 dark:border-gray-700/50 dark:hover:border-gray-600"
                      }`}
                    >
                      <RadioGroupItem value="un" id="un-countries" className="sr-only" />
                      <div className="w-10 h-10 rounded-full bg-blue-100/70 dark:bg-blue-900/50 flex items-center justify-center mb-2">
                        <img
                          src="https://flagcdn.com/32x24/un.png"
                          srcSet="https://flagcdn.com/64x48/un.png 2x,
        https://flagcdn.com/96x72/un.png 3x"
                          width="24"
                          height="18"
                          alt="UN Flag"
                          className="rounded-sm"
                        />
                      </div>
                      <span className="font-medium font-semibold">UN Recognized Countries</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{TOTAL_UN_COUNTRIES} flags</span>
                    </Label>
                    <Label
                      htmlFor="all-countries"
                      className={`flex flex-col items-center justify-center p-4 rounded-lg border-2 transition-all cursor-pointer backdrop-blur-sm ${
                        countryFilter === "all"
                          ? "bg-green-50/70 border-green-500 dark:bg-green-900/30 dark:border-green-400"
                          : "bg-white/50 border-gray-200/50 hover:border-gray-300 dark:bg-gray-800/50 dark:border-gray-700/50 dark:hover:border-gray-600"
                      }`}
                    >
                      <RadioGroupItem value="all" id="all-countries" className="sr-only" />
                      <div className="w-10 h-10 rounded-full bg-green-100/70 dark:bg-green-900/50 flex items-center justify-center mb-2 overflow-hidden">
                        <img src="/images/globe.png" alt="World Globe" className="w-8 h-8 object-contain" />
                      </div>
                      <span className="font-medium font-semibold">All Flags</span>
                      <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">{TOTAL_ALL_COUNTRIES} flags</span>
                    </Label>
                  </RadioGroup>
                </div>
              </CardContent>
            </Card>

            {/* Quiz Length Selection */}
            <Card className="backdrop-blur-md bg-gray-50/50 dark:bg-gray-800/50 border border-white/20 dark:border-gray-600/20">
              <CardContent className="p-4">
                <div className="space-y-3">
                  <Label className="text-sm font-semibold">Quiz Length</Label>
                  <div className="grid grid-cols-2 gap-3">
                    <Button
                      onClick={() => onQuizLengthChange(10)}
                      className={`h-16 flex flex-col items-center dark:hover:text-black justify-center space-y-1 
                      backdrop-blur-sm bg-white/30 dark:bg-gray-700/30  hover:text-white border border-gray-300 dark:border-gray-700
                       ${quizLength === 10 ? "bg-[#2d2d2c] dark:bg-[#1b182a] text-white" : "text-black dark:text-white"}` }
                    >
                      <span className="font-semibold">Mini</span>
                      <span className="text-xs opacity-75">10 questions</span>
                    </Button>

                    <Button
                      onClick={() =>
                        onQuizLengthChange(
                          Math.floor((countryFilter === "un" ? TOTAL_UN_COUNTRIES : TOTAL_ALL_COUNTRIES) / 4),
                        )
                      }
                      className={`h-16 flex flex-col items-center dark:hover:text-black justify-center space-y-1 
                      backdrop-blur-sm bg-white/30 dark:bg-gray-700/30  hover:text-white border border-gray-300 dark:border-gray-700 ${quizLength ===
                        Math.floor((countryFilter === "un" ? TOTAL_UN_COUNTRIES : TOTAL_ALL_COUNTRIES) / 4) ? "bg-[#2d2d2c] dark:bg-[#1b182a] text-white" : "text-black dark:text-white"}`}
                    >
                      <span className="font-semibold">Quarter</span>
                      <span className="text-xs opacity-75">
                        {Math.floor((countryFilter === "un" ? TOTAL_UN_COUNTRIES : TOTAL_ALL_COUNTRIES) / 4)} questions
                      </span>
                    </Button>

                    <Button
                      onClick={() =>
                        onQuizLengthChange(
                          Math.floor((countryFilter === "un" ? TOTAL_UN_COUNTRIES : TOTAL_ALL_COUNTRIES) / 2),
                        )
                      }
                      className={`h-16 flex flex-col items-center dark:hover:text-black justify-center space-y-1 
                      backdrop-blur-sm bg-white/30 dark:bg-gray-700/30  hover:text-white border border-gray-300 dark:border-gray-700 ${quizLength ===
                        Math.floor((countryFilter === "un" ? TOTAL_UN_COUNTRIES : TOTAL_ALL_COUNTRIES) / 2) ? "bg-[#2d2d2c] dark:bg-[#1b182a] text-white" : "text-black dark:text-white"}`}
                    >
                      <span className="font-semibold">Half</span>
                      <span className="text-xs opacity-75">
                        {Math.floor((countryFilter === "un" ? TOTAL_UN_COUNTRIES : TOTAL_ALL_COUNTRIES) / 2)} questions
                      </span>
                    </Button>

                    <Button
                      onClick={() => onQuizLengthChange("all")}
                      className={`h-16 flex flex-col items-center dark:hover:text-black justify-center space-y-1 
                      backdrop-blur-sm bg-white/30 dark:bg-gray-700/30  hover:text-white border border-gray-300 dark:border-gray-700 ${quizLength === "all" ? "bg-[#2d2d2c] dark:bg-[#1b182a] text-white" : "text-black dark:text-white"}`}
                    >
                      <span className="font-semibold">Full</span>
                      <span className="text-xs opacity-75">
                        All {countryFilter === "un" ? TOTAL_UN_COUNTRIES : TOTAL_ALL_COUNTRIES}
                      </span>
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Game Mode Selection */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Multiple Choice Mode */}
              <Card
                className={`cursor-pointer transition-all border-2 hover:shadow-lg backdrop-blur-md ${
                  selectedGameMode === "multiple-choice"
                    ? "border-blue-500 bg-blue-50/70 dark:bg-blue-900/30 dark:border-blue-400"
                    : "border-gray-200/50 hover:border-blue-300 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30"
                }`}
                onClick={() => onModeSelect("multiple-choice")}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-blue-100/70 dark:bg-blue-900/50 rounded-full flex items-center justify-center mx-auto overflow-hidden backdrop-blur-sm">
                    <img
                      src="/images/multiple-choice.webp"
                      alt="Multiple Choice"
                      className="w-12 h-12 object-contain"
                    />
                  </div>
                  <h3 className="text-xl font-semibold">Multiple Choice</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Choose from multiple options for each flag. Perfect for beginners and quick gameplay.
                  </p>

                  {/* Multiple Choice Options */}
                  <div className="pt-2 border-t border-gray-200/30 dark:border-gray-700/30">
                    <Label className="text-sm font-medium mb-2 block">Number of Options</Label>
                    <div className="flex justify-center gap-2">
                      {optionChoices.map((option) => (
                        <Button
                          key={option}
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            onMultipleChoiceOptionsChange(option)
                            onModeSelect("multiple-choice")
                          }}
                          className={`w-12 backdrop-blur-sm bg-gray-500/20 dark:bg-gray-700/20 border-white/30 hover:text-white dark:hover:text-black dark:border-gray-600/30 ${multipleChoiceOptions === option ? "bg-[#2d2d2c] dark:bg-[#1b182a] text-white" : "text-black dark:text-white"} `}
                        >
                          {option}
                        </Button>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Text Input Mode */}
              <Card
                className={`cursor-pointer transition-all border-2 hover:shadow-lg backdrop-blur-md ${
                  selectedGameMode === "text-input"
                    ? "border-green-500 bg-green-50/70 dark:bg-green-900/30 dark:border-green-400"
                    : "border-gray-200/50 hover:border-green-300 dark:border-gray-700/50 bg-white/30 dark:bg-gray-800/30"
                }`}
                onClick={() => onModeSelect("text-input")}
              >
                <CardContent className="p-6 text-center space-y-4">
                  <div className="w-16 h-16 bg-green-100/70 dark:bg-green-900/50 rounded-full flex items-center justify-center mx-auto overflow-hidden backdrop-blur-sm">
                    <img src="/images/typing-mode.webp" alt="Typing Mode" className="w-12 h-12 object-contain" />
                  </div>
                  <h3 className="text-xl font-semibold">Typing</h3>
                  <p className="text-gray-600 dark:text-gray-400 text-sm">
                    Type the country name yourself. More challenging and tests your knowledge better.
                  </p>

                  {/* Autocomplete Toggle */}
                  <div className="pt-2 border-t border-gray-200/30 dark:border-gray-700/30">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autocomplete-toggle" className="text-sm cursor-pointer">
                        Enable Autocomplete
                      </Label>
                      <Switch
                        id="autocomplete-toggle"
                        checked={autocompleteEnabled}
                        onCheckedChange={(checked) => {
                          onToggleAutocomplete(checked)
                          onModeSelect("text-input")
                        }}
                        onClick={(e) => e.stopPropagation()}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Start Game Button */}
            <Button
              onClick={onStartGame}
              disabled={!selectedGameMode}
              size="lg"
              className="w-full text-white py-6 text-lg font-medium mt-4 backdrop-blur-sm bg-orange-700/80 hover:bg-orange-800/80 border border-orange-600/30
              dark:bg-[#09080e] dark:hover:bg-[#09080e]/80 dark:border-[#09080e]/30
              "
            >
              <Play className="w-5 h-5 mr-2" />
              Start Guess
            </Button>

            <div className="text-center text-sm text-gray-500 flex flex-col items-center justify-center dark:text-gray-400 space-y-2">
              {selectedGameMode ? (
                <p className="dark:text-white/80 text-white/80 opacity-0 bg-orange-800 dark:bg-black px-2 rounded-full opacity-80">
                  {selectedGameMode === "multiple-choice"
                    ? `${multipleChoiceOptions} options per question`
                    : `Text input mode ${autocompleteEnabled ? "with" : "without"} autocomplete`}{" "}
                  · {getQuizLengthDisplay(quizLength, countryFilter)}
                </p>
              ) : (
                <p>Select a game mode to continue</p>
              )}
              <div className="pt-2 border-t border-gray-200/30 dark:border-gray-700/30 mt-2">
                <p className="dark:text-white/80 text-black">
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
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
