"use client";

import { MapDisplay } from "./map-display";
import { CountryDescription } from "./coutry-description";
import { FlagQuestion } from "@/types";
import { motion } from "motion/react";

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
  function getFlagEmoji(countryCode: string) {
    return countryCode.slice(0,2)
      .toUpperCase()
      .replace(/./g, (char) =>
        String.fromCodePoint(127397 + char.charCodeAt(0))
      );
  }
  const emoji = getFlagEmoji(currentFlag.countryCode)
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      className="relative flex md:flex-row w-full h-auto gap-2 flex-col items-center md:items-start bg-white/20 p-2 rounded-xl"
    >
      <div className="z-10 absolute right-2 -top-4 font-bold text-base bg-black text-white px-2 py-1 rounded-full flex items-center justify-center">
        {/* <span className="uppercase text-sm font-mono bg-white text-black rounded-full px-1 mr-1"> */}
        {/* {currentFlag.countryCode} */}
        {/* </span> */}
        <span className="bg- text-white/80 mr-1 px-1 ">{emoji}</span>
        {currentFlag.country}
      </div>
      <MapDisplay countryName={currentFlag.country} isDarkMode={isDarkMode} />
      <div className="flex flex-col gap-y-2 w-full">
        <CountryDescription
          loadingDescription={loadingDescription}
          extract={extract}
          description={description}
          sourceUrl={sourceUrl}
        />
        <CountryData currentFlag={currentFlag} />
      </div>
    </motion.div>
  );
}

interface CountryDataProps {
  currentFlag: FlagQuestion;
}
function CountryData({ currentFlag }: CountryDataProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className={`flex flex-col pl-2 max-h-[120px] ${
        currentFlag.country === "South Africa" &&
        "overflow-y-scroll custom-scrollbar"
      }`}
    >
      {[
        { label: "Capital City", value: currentFlag.capital },
        {
          label: "Official Language",
          value: Array.isArray(currentFlag.language) 
            ? currentFlag.language.join(", ")
            : currentFlag.language,
        },
        
        {
          label: "Currency",
          value:
            Array.isArray(currentFlag.currency) &&
            currentFlag.currency.length === 3
              ? `${currentFlag.currency[0]} (${currentFlag.currency[1]}) — ${currentFlag.currency[2]}`
              : null  ,
        } ,
        {
          label: "Area (km²)",
          value: currentFlag.areaKm
            ? `${currentFlag.areaKm.toLocaleString()} km²`
            : null,
        },
        {
          label: "Top-Level Domain (TLD)",
          value: Array.isArray(currentFlag.tld)
            ? currentFlag.tld.join(", ")
            : currentFlag.tld,
        },
      ].map(({ label, value }, index) =>
         value ? (
          <div key={index} className="text-sm flex flex-row gap-x-2">
            <h3 className="font-semibold text-nowrap">{label}:</h3>
            <p className="text-start">{value}</p>
          </div>
        ) : null
      )}
    </motion.div>
  );
}
