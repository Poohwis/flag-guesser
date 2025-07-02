"use client";
import { ChevronDown, ExternalLink, LoaderCircle } from "lucide-react";
import { motion } from "motion/react";
import { Separator } from "./ui/separator";
import { ScrollArea } from "./ui/scroll-area";

interface CountryDescriptionProps {
  description: string | null;
  sourceUrl: string | null;
  extract: string | null;
  loadingDescription: boolean;
  countryEmoji: string;
  countryName: string;
  forHoverPage?: boolean;
}

export function CountryDescription({
  description,
  sourceUrl,
  extract,
  loadingDescription,
  countryEmoji,
  countryName,
  forHoverPage,
}: CountryDescriptionProps) {
  return (
    <div className="flex items-start w-full">
      {description && (
        <motion.div
          style={{ padding: forHoverPage ? 0 : 8 }}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="dark:bg-black/20 w-full bg-white/60  rounded-md flex flex-col max-h-[190px]"
        >
          <CountryHeader
            countryName={countryName}
            countryEmoji={countryEmoji}
            description={description}
          />
          <CountryExtract extract={extract} sourceUrl={sourceUrl} />
        </motion.div>
      )}
      {loadingDescription && (
        <div className="rounded-lg w-full h-[150px] bg-white/60 flex items-center justify-center">
          <LoaderCircle className="animate-spin" />
        </div>
      )}
    </div>
  );
}

export const CountryHeader = ({
  countryName,
  countryEmoji,
  description,
}: {
  countryName: string;
  countryEmoji: string;
  description: string;
}) => {
  return (
    <div className="px-1 text-start">
      <div className="inline-block font-bold ">
        {countryName}
        <span className="ml-2 text-primary/50">{countryEmoji}</span>
      </div>
      <h3 className="font-semibold text-sm text-primary/80">{description}</h3>
      <Separator className="my-2 bg-primary/20" />
    </div>
  );
};

export const CountryExtract = ({
  extract,
  sourceUrl,
  forHoverPage,
}: {
  extract: string | null;
  sourceUrl: string | null;
  forHoverPage?: boolean;
}) => {
  return (
    <ScrollArea
      style={{ height: forHoverPage ? 100 : 200 }}
      type="auto"
      className=" text-sm text-balance text-start leading-relaxed pl-1 pr-2"
    >
      {extract}
      <br />
      {sourceUrl && (
        <a
          href={sourceUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-blue-400 underline hover:text-blue-300"
        >
          Read more at wikipedia
        </a>
      )}
    </ScrollArea>
  );
};
