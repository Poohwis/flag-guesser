import { CONTINENTS } from "./constants";

export interface FlagQuestion {
  id: number;
  name: string;
  altNames?: string[];
  countryCode: string;
  capital?: string;
  languages?: string[];
  continent?: string;
  currency?: {name: string, code : string, symbol: string}
  subregion?: string;
  areaKm2?: number;
  tld?: string;
  options: string[];
}

export type GameMode = "multiple-choice" | "text-input" | null;

export interface GameState {
  gameMode: GameMode;
  currentQuestion: number;
  selectedAnswer: string | null;
  textAnswer: string;
  showResult: boolean;
  score: number;
  gameComplete: boolean;
  autocompleteEnabled: boolean;
  suggestions: string[];
  flagQuestions: FlagQuestion[];
  isDarkMode: boolean;
  selectedSuggestionIndex: number;
  currentImageLoaded: boolean;
  nextImagePreloaded: boolean;
  isTransitioning: boolean;
  correctAnswers: { countryCode: string; country: string }[];
  incorrectAnswers: { countryCode: string; country: string }[];
}

export type CountryFilter = "un" | "all";

export type QuizLength = number | "all";

export type ContinentFilter = (typeof CONTINENTS)[number];
export type FilterType = { continent: string | null; sovereignOnly: boolean };
