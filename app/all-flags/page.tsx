"use client";

import { Background } from "@/components/background";
import { FilterButtonContainer } from "@/components/filter-button";
import { FlagCard } from "@/components/flag-card";
import { FlagIcon } from "@/components/flag-icon";
import { ThemeSettingButton } from "@/components/ThemeSettingButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { CountryInfo, DisplayModeLables } from "@/constants";
import { useBackgroundStore } from "@/store/backgroundStore";
import { DisplayMode, FilterType } from "@/types";
import { filterCountries } from "@/utils";
import { ArrowDown, ArrowLeftToLine } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function AllFlagsPage() {
  const {
    backgroundEnabled,
    backgroundIndex,
    setBackgroundEnabled,
    setBackgroundIndex,
  } = useBackgroundStore();

  const [displayMode, setDisplayMode] = useState<DisplayMode | null>(null);
  const [filter, setFilter] = useState<FilterType>({
    continent: null,
    sovereignOnly: true,
  });
  const [sort, setSort] = useState<"country" | "info">("country");
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");

  // const flags = useMemo(() => {
  //   return filterCountries(filter);
  // }, [filter]);
  const flags = useMemo(() => {
  const filtered = filterCountries(filter);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "country") {
      return sortDirection === "asc"
        ? a[1].name.localeCompare(b[1].name)
        : b[1].name.localeCompare(a[1].name);
    }

    if (sort === "info" && displayMode) {
      const getVal = (c: CountryInfo): string | number => {
        switch (displayMode) {
          case "capital": return c.capital || "";
          case "languages": return c.languages?.join(", ") || "";
          case "areaKm2": return c.areaKm2 ?? 0;
          case "tld": return c.tld || "";
          case "currency":
            const cur = c.currency;
            return cur && typeof cur === "object" && "name" in cur
              ? cur.name
              : "";
          default: return "";
        }
      };

      const valA = getVal(a[1]);
      const valB = getVal(b[1]);

      if (typeof valA === "number" && typeof valB === "number") {
        return sortDirection === "asc" ? valA - valB : valB - valA;
      }

      return sortDirection === "asc"
        ? String(valA).localeCompare(String(valB))
        : String(valB).localeCompare(String(valA));
    }

    return 0;
  });

  return sorted;
}, [filter, sort, sortDirection, displayMode]);


  useEffect(() => {
    if (filter.continent === "Antarctica") {
      setFilter((prev) => ({ ...prev, sovereignOnly: false }));
    }
  }, [filter.continent, filter.sovereignOnly]);

  const [wikiDataCache, setWikiDataCache] = useState<{
    [countryName: string]: {
      description: string;
      extract: string;
      sourceUrl: string;
    };
  }>({});

  const setWikiData = (name: string, data: any) => {
    setWikiDataCache((prev) => ({
      ...prev,
      [name]: data,
    }));
  };

  return (
    <Background
      backgroundEnabled={backgroundEnabled}
      backgroundIndex={backgroundIndex}
    >
      <Card
        className="w-full max-w-3xl flex flex-col backdrop-blur-xl
       bg-white/20 dark:bg-gray-900/20 border
        border-white/30 dark:border-gray-700/30 shadow-2xl"
      >
        <CardHeader className="md:px-6 md:py-6 px-6 py-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-3xl moirai">Flag Quizzer</CardTitle>
            <div className="flex items-center gap-2">
              <Link href={"/"}>
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-2"
                  title="Back to Main Menu"
                >
                  <ArrowLeftToLine className="h-4 w-4" />
                </Button>
              </Link>
              <ThemeSettingButton
                backgroundEnabled={backgroundEnabled}
                onToggleBackgroundEnabled={setBackgroundEnabled}
                onBackgroundChange={setBackgroundIndex}
                backgroundIndex={backgroundIndex}
              />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-2 flex flex-col">
          {/* flag filter */}
          <FilterButtonContainer
            filter={filter}
            setFilter={setFilter}
            setDisplayMode={setDisplayMode}
            displayMode={displayMode}
          />
          {!displayMode ? (
            <>
              <div className="h-[22px]"></div>
              <ScrollArea type="auto">
                <div
                  className="grid md:grid-cols-3 grid-cols-2 gap-2  
             h-[500px] md:h-[900px] transition-all pr-4"
                  style={{
                    gridAutoRows: "min-content",
                  }}
                >
                  {flags.map(([code, country], index) => (
                    <FlagCard
                      key={code}
                      code={code}
                      country={country}
                      wikiData={wikiDataCache}
                      setWikiData={setWikiData}
                    />
                  ))}
                </div>
              </ScrollArea>
            </>
          ) : (
            <>
              <div className="grid grid-cols-2 text-primary/80 justify-between text-sm pr-4 border-b-2 border-primary/20 px-4 h-[22px]">
                <div className="flex flex-row gap-x-6">
                  <div className="font-semibold">Flag</div>
                  <button
                    onClick={() => {
                      if (sort === "country") {
                        setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
                      } else {
                        setSort("country");
                        setSortDirection("asc");
                      }
                    }}
                    className={`hover:underline hover:text-orange-300 dark:hover:text-blue-300 transition-colors font-semibold flex flex-row items-center gap-x-1 ${
                      sort === "country" && "dark:text-blue-300 text-orange-300"
                    }`}
                  >
                    Country
                    {sort === "country" && (
                      <ArrowDown
                        size={12}
                        className={sortDirection === "desc" ? "rotate-180" : ""}
                      />
                    )}
                  </button>
                </div>
                <button
                  onClick={() => {
                    if (sort === "info") {
                      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
                    } else {
                      setSort("info");
                      setSortDirection("asc");
                    }
                  }}
                  className={`hover:underline hover:text-orange-300 dark:hover:text-blue-300 transition-colors font-semibold flex flex-row items-center gap-x-1 ${
                    sort === "info" && "dark:text-blue-300 text-orange-300"
                  }`}
                >
                  {DisplayModeLables[displayMode]}
                  {sort === "info" && (
                    <ArrowDown
                      size={12}
                      className={sortDirection === "desc" ? "rotate-180" : ""}
                    />
                  )}
                </button>
              </div>
              <ScrollArea>
                <div className="md:h-[900px] h-[500px] pr-4">
                  {flags.map(([code, country], index) => (
                    <FlagLine
                      key={code}
                      code={code}
                      country={country}
                      displayMode={displayMode}
                    />
                  ))}
                </div>
              </ScrollArea>
            </>
          )}
        </CardContent>
      </Card>
    </Background>
  );
}

interface FlagLineProps {
  code: string;
  country: CountryInfo;
  displayMode: DisplayMode;
}
const FlagLine = ({ code, country, displayMode }: FlagLineProps) => {
  const getDisplayValue = (mode: DisplayMode, country: CountryInfo) => {
    switch (mode) {
      case "capital":
        return country.capital;
      case "languages":
        return country.languages?.join(", ");
      case "areaKm2":
        return country.areaKm2?.toLocaleString();
      case "tld":
        return country.tld;
      case "currency":
        const c = country.currency;
        return c && typeof c === "object" && "name" in c
          ? `${c.name} (${c.code}) — ${c.symbol}`
          : null;
      default:
        return null;
    }
  };
  return (
    <div
      className="text-sm grid grid-cols-2 gap-x-2 items-center text-primary justify-between px-4 rounded-sm py-1 mb-1
      bg-white/60 dark:bg-black/80"
    >
      <div className="flex flex-row gap-x-4">
        <FlagIcon countryCode={code} country={country.name} size="sm" />
        {country.name}
      </div>
      <div className="ml-2">{getDisplayValue(displayMode, country)}</div>
    </div>
  );
};
