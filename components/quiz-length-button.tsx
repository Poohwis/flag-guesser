import { TOTAL_UN_COUNTRIES, TOTAL_ALL_COUNTRIES } from "@/constants";
import { Button } from "./ui/button";
import { QuizLength } from "@/types";

interface QuizLengthButtonProps {
  onQuizLengthChange: (length: number) => void;
  countryFilter: string;
  quizLength: QuizLength;
  buttonName: string;
  type: "mini" | "quarter" | "half" | "full";
}
export function QuizLengthButton({
  buttonName,
  onQuizLengthChange,
  countryFilter,
  quizLength,
  type,
}: QuizLengthButtonProps) {
  const divider = {quarter : 4, half : 2 , full : 1}
  return (
    <Button
      onClick={() =>
        type === "mini" ? onQuizLengthChange(10) :
        onQuizLengthChange(
          Math.floor(
            (countryFilter === "un"
              ? TOTAL_UN_COUNTRIES
              : TOTAL_ALL_COUNTRIES) / divider[type]
          )
        )
      }
      className={`h-16 flex flex-col items-center dark:hover:text-white/60 justify-center space-y-1 
                      backdrop-blur-sm bg-white/30 dark:bg-gray-700/30  hover:text-white border border-gray-300 dark:border-gray-700 ${
                        quizLength ===
                        Math.floor(
                          (countryFilter === "un"
                            ? TOTAL_UN_COUNTRIES
                            : TOTAL_ALL_COUNTRIES) / divider[type]
                        ) || ( type === "mini" && quizLength === 10 )
                          ? "bg-[#2d2d2c] dark:bg-[#1b182a] text-white"
                          : "text-black dark:text-white"
                      }`}
    >
      <span className="font-semibold">{buttonName}</span>
      <span className="text-xs opacity-75">
        {Math.floor(
          (countryFilter === "un" ? TOTAL_UN_COUNTRIES : TOTAL_ALL_COUNTRIES) /
            4
        )}{" "}
        questions
      </span>
    </Button>
  );
}
