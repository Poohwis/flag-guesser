import { Dot, ListFilter } from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { CONTINENTS } from "@/constants";
import { ContinentFilter } from "@/types";

interface ContinentFilterOptionsProps {
  continentFilter: ContinentFilter | null;
  onContinentFilterChange: (filter: ContinentFilter | null) => void;
}
export function ContinentFilterOptions({
  continentFilter,
  onContinentFilterChange,
}: ContinentFilterOptionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant={"outline"}
          className="h-6 focus-visible:ring-transparent font-semibold"
        >
          {continentFilter === null ? "All" : continentFilter}
          <ListFilter size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[150px]">
        <DropdownMenuLabel>Continents</DropdownMenuLabel>
        <DropdownMenuItem
          className="hover:cursor-pointer flex flex-row item-center justify-between"
          onClick={() => onContinentFilterChange(null)}
        >
          All
          {!continentFilter && <Dot />}
        </DropdownMenuItem>
        {CONTINENTS.map((continent) => (
          <DropdownMenuItem
            key={continent}
            onClick={() => onContinentFilterChange(continent)}
            className="hover:cursor-pointer flex flex-row item-center justify-between"
          >
            {continent}
            {continent === continentFilter && <Dot color="green" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
