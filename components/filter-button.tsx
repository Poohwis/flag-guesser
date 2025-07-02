import { FilterType } from "@/types";
import { motion } from "motion/react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { CONTINENTS } from "@/constants";
import { Dot } from "lucide-react";

interface FilterButtonContainerProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
}
export const FilterButtonContainer = ({
  filter,
  setFilter,
}: FilterButtonContainerProps) => {
  return (
    <div className="flex md:flex-row justify-between md:items-center gap-x-4 gap-y-1 mb-2">
      <div
        className="text-sm flex flex-row space-x-1 bg-black/20 dark:bg-white/20 
           self-start py-0.5 px-1 rounded-full relative"
      >
        <motion.div
          animate={{
            width: filter.sovereignOnly ? 129 : 67.5,
            x: filter.sovereignOnly ? -3 : 128,
          }}
          transition={{ type: "tween" }}
          className="absolute z-0 h-[18px] top-[3px] left-2  rounded-full bg-black"
        />
        <button
          disabled={filter.continent === "Antarctica"}
          onClick={() => setFilter({ ...filter, sovereignOnly: true })}
          className={`px-2 z-10 rounded-full hover:bg-black/10 text-white ${
            filter.continent === "Antarctica" && "text-white/10"
          }`}
        >
          Sovereign States
        </button>
        <button
          onClick={() => setFilter({ ...filter, sovereignOnly: false })}
          className={`px-2 z-10 rounded-full hover:bg-black/10 text-white`}
        >
          All flags
        </button>
      </div>
      <div className="flex flex-row items-center gap-x-2">
        <span className="text-sm text-primary/80 md:inline-block hidden">
          By continent:{" "}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="bg-black px-2 rounded-full border-2 border-white/20 text-white">
              {filter.continent || "All"}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[150px]">
            <DropdownMenuLabel>Continents</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => setFilter({ ...filter, continent: null })}
              className="hover:cursor-pointer flex flex-row item-center justify-between"
            >
              All
              {!filter.continent && <Dot />}
            </DropdownMenuItem>
            {CONTINENTS.map((continent) => (
              <DropdownMenuItem
                key={continent}
                onClick={() => setFilter({ ...filter, continent: continent })}
                className="hover:cursor-pointer flex flex-row item-center justify-between"
              >
                {continent}
                {continent === filter.continent && <Dot color="green" />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  );
};
