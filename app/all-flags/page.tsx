"use client";

import { Background } from "@/components/background";
import { FilterButtonContainer } from "@/components/filter-button";
import { FlagCard } from "@/components/flag-card";
import { ThemeSettingButton } from "@/components/ThemeSettingButton";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useBackgroundStore } from "@/store/backgroundStore";
import { FilterType } from "@/types";
import { filterCountries } from "@/utils";
import { ArrowLeftToLine } from "lucide-react";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";

export default function AllFlagsPage() {
  const {
    backgroundEnabled,
    backgroundIndex,
    setBackgroundEnabled,
    setBackgroundIndex,
  } = useBackgroundStore();

  const [filter, setFilter] = useState<FilterType>({
    continent: null,
    sovereignOnly: true,
  });

  const filteredFlags = useMemo(() => {
    return filterCountries(filter);
  }, [filter]);

  const flags = filteredFlags;

  useEffect(() => {
    if (filter.continent === "Antarctica") {
      setFilter({ ...filter, sovereignOnly: false });
    }
  }, [filter.continent]);

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
          <FilterButtonContainer filter={filter} setFilter={setFilter} />
          <ScrollArea type="auto">
            <div
              className="grid md:grid-cols-3 grid-cols-2 gap-2 pr-2  
             h-[500px] md:h-[900px] transition-all mr-2"
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
        </CardContent>
      </Card>
    </Background>
  );
}
