import { ALTNAME_USE_COUNTRY } from "@/constants";
import { fetchWikiMediaCountryDescription } from "@/utils";
import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { getFlagEmoji } from "./country-information";
import {
  CountryExtract,
  CountryHeader,
} from "./coutry-description";
import { ImageItem } from "./flag-image";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "./ui/hover-card";
import { CountryData } from "./country-data";
import { ChevronLeft } from "lucide-react";

interface FlagCardProps {
  code: string;
  country: { name: string; [key: string]: any };
  wikiData: { [key: string]: any };
  setWikiData: (name: string, data: any) => void;
}

export function FlagCard({
  code,
  country,
  wikiData,
  setWikiData,
}: FlagCardProps) {
  const [localData, setLocalData] = useState(wikiData[country.name] || null);
  const [showExtract, setShowExtract] = useState(false);

  useEffect(() => {
    if (!wikiData[country.name]) {
      const countryName =
        ALTNAME_USE_COUNTRY.includes(code) &&
        Array.isArray(country.altNames) &&
        country.altNames.length > 0
          ? country.altNames[0]
          : country.name;
      fetchWikiMediaCountryDescription(countryName).then((result) => {
        const data = {
          description: result.description ?? "",
          extract: result.extract ?? "",
          sourceUrl: result.sourceUrl ?? "",
        };
        setWikiData(country.name, data);
        setLocalData(data);
      });
    }
  }, [country.name, wikiData, setWikiData]);

  return (
    <HoverCard>
      <HoverCardTrigger>
        <motion.div className="flex flex-col h-[120px] items-center gap-y-1 bg-white/10 py-2 rounded-sm hover:bg-white/20 hover:cursor-pointer">
          <div className="h-20 flex justify-center">
            <ImageItem countryCode={code} country={country.name} />
          </div>
          <div className="text-sm text-center">{country.name}</div>
        </motion.div>
      </HoverCardTrigger>
      <HoverCardContent className="md:w-[400px] w-[300px] ">
        <div className="relative">
          <button
            onClick={() => setShowExtract(!showExtract)}
            className="absolute right-1 top-1"
          >
            <ChevronLeft size={15} className={` ${showExtract ? "" : "rotate-180"} transition-all`} />
          </button>
          <CountryHeader
            countryName={country.name}
            countryEmoji={getFlagEmoji(code)}
            description={localData?.description || ""}
          />
          {!showExtract ? (
            <CountryData country={country} forHoverPage />
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <CountryExtract
                extract={localData?.extract || ""}
                sourceUrl={localData?.sourceUrl || ""}
                forHoverPage
              />
            </motion.div>
          )}
        </div>
      </HoverCardContent>
    </HoverCard>
  );
}
