import { DisplayMode, FilterType } from "@/types";
import { motion } from "motion/react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CONTINENTS, DisplayModeLables, DisplayModes } from "@/constants";
import { Dot, Menu } from "lucide-react";
import { Dispatch, SetStateAction } from "react";

interface FilterButtonContainerProps {
  filter: FilterType;
  setFilter: (filter: FilterType) => void;
  setDisplayMode: Dispatch<SetStateAction<DisplayMode | null>>;
  displayMode: DisplayMode | null;
}

export const FilterButtonContainer = ({
  filter,
  setFilter,
  setDisplayMode,
  displayMode,
}: FilterButtonContainerProps) => {
  return (
    <div className="flex md:flex-row flex-col justify-start md:items-center gap-x-4 gap-y-1 mb-2">
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
      <div className="md:ml-0 ml-1 flex flex-row items-center gap-x-2">
        <span className="text-sm text-primary/80">View by: </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-sm bg-black px-2 rounded-full text-white outline-none border-2 border-white/20">
              {displayMode ? DisplayModeLables[displayMode] : "Flag"}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[180px]">
            <DropdownMenuLabel>View by</DropdownMenuLabel>
            <DropdownMenuItem
              className="hover:cursor-pointer text-sm flex flex-row justify-between items-center"
              onClick={() => setDisplayMode(null)}
            >
              Flag
              {!displayMode && <Dot />}
            </DropdownMenuItem>
            {DisplayModes.map((d) => (
              <DropdownMenuItem
                key={d}
                className="hover:cursor-pointer text-sm flex flex-row justify-between items-center"
                onClick={() => setDisplayMode(d as DisplayMode)}
              >
                {DisplayModeLables[d as keyof typeof DisplayModeLables]}
                {displayMode === d && <Dot />}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="md:ml-0 ml-1 flex flex-row items-center gap-x-2">
        <span className="text-sm text-primary/80 md:inline-block">
          Continent filter:{" "}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="text-sm bg-black px-2 rounded-full border-2 border-white/20 text-white outline-none">
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
