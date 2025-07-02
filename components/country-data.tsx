import { CountryInfo } from "@/constants";
import { FlagQuestion } from "@/types";
import { motion } from "motion/react";
import { ScrollArea } from "./ui/scroll-area";

interface CountryDataProps {
  country: CountryInfo | FlagQuestion;
  forHoverPage? : boolean
}
export function CountryData({ country ,forHoverPage }: CountryDataProps) {
  return (
    <ScrollArea type="auto">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className={`flex flex-col ${forHoverPage ? "pl-1 text-primary/80" : "pl-2"} max-h-[120px] `}
      >
        {[
          { label: "Capital City", value: country.capital },
          {
            label: "Official Language",
            value: Array.isArray(country.languages)
              ? country.languages.join(", ")
              : country.languages,
          },
          {
            label: "Currency",
            value:
              country.currency &&
              !Array.isArray(country.currency) &&
              typeof country.currency === "object" &&
              "name" in country.currency &&
              "code" in country.currency &&
              "symbol" in country.currency
                ? `${country.currency.name} (${country.currency.code}) — ${country.currency.symbol}`
                : null,
          },
          {
            label: "Area (km²)",
            value: country.areaKm2
              ? `${country.areaKm2.toLocaleString()} km²`
              : null,
          },
          {
            label: "Top-Level Domain (TLD)",
            value: Array.isArray(country.tld)
              ? country.tld.join(", ")
              : country.tld,
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
    </ScrollArea>
  );
}
