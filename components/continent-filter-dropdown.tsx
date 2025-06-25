import { ListFilter } from "lucide-react";
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
        <Button variant={"outline"} className="h-6 focus-visible:ring-transparent">
          {continentFilter === null ? "All" : continentFilter}
          <ListFilter size={14} />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuLabel>Continents</DropdownMenuLabel>
        <DropdownMenuItem onClick={() => onContinentFilterChange(null)}>
          All
        </DropdownMenuItem>
        {CONTINENTS.map((continent, index) => (
          <DropdownMenuItem
            key={continent}
            onClick={() => onContinentFilterChange(continent)}
          >
            {continent}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
