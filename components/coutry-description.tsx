"use client";
import { ExternalLink, LoaderCircle } from "lucide-react";
import { motion } from "motion/react";

interface CountryDescriptionProps {
  description: string | null;
  sourceUrl: string | null;
  extract: string | null;
  loadingDescription: boolean;
}

export function CountryDescription({
  description,
  sourceUrl,
  extract,
  loadingDescription,
}: CountryDescriptionProps) {
  return (
    <div className="flex items-start w-full">
      {description && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="dark:bg-black/20 w-full bg-white/60 p-2 rounded-lg flex flex-col max-h-[190px]"
        >
          <h3 className="font-semibold text-base text-start">{description}</h3>
          <p className="text-sm leading-relaxed text-start text-balance overflow-y-scroll custom-scrollbar">
            {extract}
            <br />
            {sourceUrl && (
              <a href={sourceUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 underline hover:text-blue-300">
                Read more at wikipedia
              </a>
            )}
          </p>
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
