"use client";

import { MapDisplay } from "./map-display";
import { CountryDescription } from "./coutry-description";
import { FlagQuestion } from "@/types";
import { motion } from "motion/react";
import { CountryData } from "./country-data";

export function getFlagEmoji(countryCode: string) {
  return countryCode
    .slice(0, 2)
    .toUpperCase()
    .replace(/./g, (char) => String.fromCodePoint(127397 + char.charCodeAt(0)));
}

interface CountryInformationProps {
  currentFlag: FlagQuestion;
  description: string | null;
  extract: string | null;
  sourceUrl: string | null;
  loadingDescription: boolean;
  isDarkMode: boolean;
}
export function CountryInformation({
  description,
  sourceUrl,
  extract,
  loadingDescription,
  currentFlag,
  isDarkMode,
}: CountryInformationProps) {
  const emoji = getFlagEmoji(currentFlag.countryCode);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative flex md:flex-row mt-1 w-full h-auto gap-2 flex-col items-center md:items-start bg-white/20 p-2 rounded-xl"
    >
      <MapDisplay countryName={currentFlag.name}  />
      <div className="flex flex-col gap-y-2 w-full">
        <CountryDescription
          countryEmoji={emoji}
          countryName={currentFlag.name}
          loadingDescription={loadingDescription}
          extract={extract}
          description={description}
          sourceUrl={sourceUrl}
        />
        <CountryData country={currentFlag} />
      </div>
    </motion.div>
  );
}
