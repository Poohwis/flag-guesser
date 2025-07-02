import { FlagQuestion } from "@/types";
import { CheckCircle, Loader2, XCircle } from "lucide-react";
import { motion } from "motion/react";
import { CountryInformation } from "./country-information";

interface InformationWithAnswerResultProps {
  isCorrect: boolean;
  currentFlag: FlagQuestion;
  loadingDescription: boolean;
  description: string | null;
  extract: string | null;
  sourceUrl: string | null;
  isDarkMode: boolean;
  nextImagePreloaded: boolean;
  currentQuestion: number;
  totalQuestions: number;
  onNextQuestion: (isFinishRequest: boolean) => void;
  nextDisabled: boolean;
}
export const InformationWithAnswerResultSection = ({
  isCorrect,
  currentFlag,
  loadingDescription,
  description,
  extract,
  sourceUrl,
  isDarkMode,
  nextImagePreloaded,
  currentQuestion,
  totalQuestions,
  onNextQuestion,
  nextDisabled = false,
}: InformationWithAnswerResultProps) => {
  return (
    <div className="md:flex flex-col hidden">
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ y: 0, opacity: 1 }}
        className={`my-1 text-start self-center text-sm font-semibold inline-block px-2 rounded-full bg-black/50 ${
          isCorrect ? "text-lime-500" : "text-red-700"
        }`}
      >
        <span className="flex items-center justify-center gap-x-1">
          {isCorrect ? (
            <>
              <CheckCircle size={14} className=" text-lime-500" />
              Correct
            </>
          ) : (
            <>
              <XCircle size={14} className="text-red-700" />
              The correct answer is {currentFlag.name}
            </>
          )}
        </span>
      </motion.div>
      <div className="flex flex-col items-center">
        <CountryInformation
          loadingDescription={loadingDescription}
          description={description}
          extract={extract}
          sourceUrl={sourceUrl}
          currentFlag={currentFlag}
          isDarkMode={isDarkMode}
        />
      </div>
      <div className="flex flex-col items-end justify-center">
        <button
          onClick={() => onNextQuestion(false)}
          className="dark:border px-2 rounded-md text-sm mt-2 w-full md:w-auto bg-black text-white hover:bg-black/80 md:h-8 h-10"
          disabled={
            nextDisabled ||
            (!nextImagePreloaded && currentQuestion < totalQuestions - 1)
          }
        >
          {!nextImagePreloaded && currentQuestion < totalQuestions - 1 ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Loading next...
            </>
          ) : currentQuestion < totalQuestions - 1 ? (
            "Next Question"
          ) : (
            "View Results"
          )}
        </button>
        <div className="flex items-center text-xs text-primary/80">
          or press space
        </div>
      </div>
    </div>
  );
};
