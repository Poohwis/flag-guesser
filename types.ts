export interface FlagQuestion {
  id: number
  country: string
  countryCode: string
  options: string[]
}

export type GameMode = "multiple-choice" | "text-input" | null

export interface GameState {
  gameMode: GameMode
  currentQuestion: number
  selectedAnswer: string | null
  textAnswer: string
  showResult: boolean
  score: number
  gameComplete: boolean
  autocompleteEnabled: boolean
  suggestions: string[]
  flagQuestions: FlagQuestion[]
  isDarkMode: boolean
  selectedSuggestionIndex: number
  currentImageLoaded: boolean
  nextImagePreloaded: boolean
  isTransitioning: boolean
  correctAnswers: { countryCode: string; country: string }[]
  incorrectAnswers: { countryCode: string; country: string }[]
}

export type CountryFilter = "un" | "all"

export type QuizLength = number | "all"
