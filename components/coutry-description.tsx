"use client";
import { ExternalLink, LoaderCircle } from "lucide-react";
import { motion } from "motion/react";

interface CountryDescriptionProps {
  description: string | null;
  sourceUrl: string | null;
  loadingDescription: boolean;
}

export function CountryDescription({
  description,
  sourceUrl,
  loadingDescription,
}: CountryDescriptionProps) {
  return (
    <div className="flex items-start w-full">
      {description && (
        <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
          transition={{delay : 0.1}}
          className="dark:bg-black/20 w-full bg-white/60 p-2 rounded-lg flex flex-col max-h-[200px]"
        >
          <h3 className="font-semibold text-base text-start">Information</h3>
          <p className="text-sm leading-relaxed text-start text-balance line-clamp-5">
            {description}
          </p>
          {sourceUrl && (
            <a
              href={sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-white bg-black px-2 rounded-md text-sm transition-colors mt-2 items-center flex self-start gap-1 hover:bg-black/80"
            >
              {new URL(sourceUrl).hostname.split(".")[1]}{" "}
              <ExternalLink size={14} />
            </a>
          )}
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
