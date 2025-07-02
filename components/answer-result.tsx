import { FlagQuestion } from "@/types";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { motion } from "motion/react";

interface AnswerResultProps {
  isCorrect: boolean;
  currentFlag: FlagQuestion;
  nextImagePreloaded: boolean;
  currentQuestion: number;
  totalQuestions: number;
  onNextQuestion: (isFinishRequest: boolean) => void;
  nextDisabled: boolean;
}
export const AnswerResult = ({
  isCorrect,
  currentFlag,
  nextImagePreloaded,
  currentQuestion,
  totalQuestions,
  onNextQuestion,
  nextDisabled = false,
}: AnswerResultProps) => {
  return (
    <div className="flex flex-col items-center self-center w-full justify-center md:mt-1 mt-4 gap-y-4">
      <motion.div
        initial={{ opacity: 0, y: 5 }}
        animate={{ y: 0, opacity: 1 }}
        className={`text-sm font-semibold inline-block px-2 w-auto text-center rounded-full bg-black/50  ${
          isCorrect ? "text-lime-500" : "text-red-700"
        }`}
      >
        <span className="flex items-center justify-center gap-x-1">
          {isCorrect ? (
            <>
              <CheckCircle size={14} className=" text-lime-500" />
              {"Correct"}
            </>
          ) : (
            <>
              <XCircle size={14} className="text-red-700" />
              The correct answer is {currentFlag.name}
            </>
          )}
        </span>
      </motion.div>
      <div className="flex flex-col gap-y-1 items-center justify-center w-full">
        <button
          onClick={() => onNextQuestion(false)}
          className="px-2 rounded-lg text-sm mt-2 w-full text-nowrap md:w-[50%] bg-black text-white hover:bg-black/80 md:h-10 h-10 dark:border shadow-black shadow"
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
        <div className="md:flex hidden items-center text-xs text-primary/80">
          or press space
        </div>
      </div>
    </div>
  );
};
