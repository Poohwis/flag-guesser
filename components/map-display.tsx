"use client";
import { ExternalLink, Plus, Minus } from "lucide-react";
import { useState, useRef, useMemo, SetStateAction, useEffect } from "react";
import { motion } from "motion/react";
import { useTheme } from "next-themes";
import { getFormattedName } from "@/constants";

interface MapDisplayProps {
  countryName: string;
  imageRatio?: number;
}

interface ImageCache {
  [key: string]: string; // Key: 'countryName-zoom-isDarkMode', Value: 'mapUrl'
}

const DEFAULT_ZOOM = 4;
export function MapDisplay({ countryName, imageRatio }: MapDisplayProps) {
  const [currentZoom, setCurrentZoom] = useState(DEFAULT_ZOOM);
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  const imageCache = useRef<ImageCache>({});

  const baseUrl = "https://maps.googleapis.com/maps/api/staticmap";
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const darkMapId = "74a608c119d30ae0ee259c09";
  const lightMapId = "74a808c119d30ae08b4ad7cd";

  const cacheKey = `${encodeURIComponent(
    countryName
  )}-${currentZoom}-${isDarkMode}`;

  const mapUrl = useMemo(() => {
    if (currentZoom === DEFAULT_ZOOM) return null;
    if (imageCache.current[cacheKey]) {
      console.log(`MapDisplay: Cache hit for ${cacheKey}`);
      return imageCache.current[cacheKey];
    }

    const newMapUrl = `${baseUrl}?center=${encodeURIComponent(
      countryName
    )}&zoom=${currentZoom}&size=260x312&markers=color:red%7Csize:mid%7C${encodeURIComponent(
      countryName
    )}&key=${apiKey}&map_id=${isDarkMode ? darkMapId : lightMapId}`;

    imageCache.current[cacheKey] = newMapUrl; // or finalMapUrl if you added marker
    console.log(`MapDisplay: Cache miss for ${cacheKey}, generating new URL.`);
    return newMapUrl; // or finalMapUrl
  }, [
    countryName,
    currentZoom,
    isDarkMode,
    apiKey,
    baseUrl,
    darkMapId,
    lightMapId,
    cacheKey,
  ]);

  const formattedCountryName = countryName
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "_");
  const themePrefix = isDarkMode ? "dark" : "light";
  const localUrl = `/images/maps/${themePrefix}_${formattedCountryName}.png`;

  const urlToUse = currentZoom === DEFAULT_ZOOM ? localUrl : mapUrl || localUrl;

  // Basic check for API key
  if (!apiKey) {
    return;
  }

  return (
    <MapStatic
      countryName={countryName}
      setCurrentZoom={setCurrentZoom}
      url={urlToUse}
      currentZoom={currentZoom}
    />
  );
}

interface MapStaticProps {
  countryName: string;
  setCurrentZoom: React.Dispatch<React.SetStateAction<number>>;
  imageRatio?: number;
  url: string
  currentZoom : number
}

const MapStatic = ({
  countryName,
  setCurrentZoom,
  url,
  imageRatio,
  currentZoom
}: MapStaticProps) => {
  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className="relative w-[260px] h-[312px] shrink-0 "
    >
      <button className="absolute right-1 top-1 p-2 rounded-md text-white bg-black hover:bg-black/80 transition-colors ">
        <a
          href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
            countryName
          )}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          <ExternalLink size={14} />
        </a>
      </button>
      <div className="absolute right-1 bottom-4 gap-y-[0.7px] flex flex-col items-center justify-center">
        <button
          disabled={currentZoom === 6}
          onClick={() =>
            setCurrentZoom((prevZoom) => Math.min(prevZoom + 1, 6))
          }
          className={ `text-white p-1  rounded-t-md transition-color ${currentZoom === 6 ? "bg-gray-300" : "bg-black hover:bg-gray-800"}` }
        >
          <Plus size={14} />
        </button>
        <button
          disabled={currentZoom === 2}
          onClick={() =>
            setCurrentZoom((prevZoom) => Math.max(prevZoom - 1, 2))
          }
          className={ `text-white p-1  rounded-b-md transition-color ${currentZoom === 2 ? "bg-gray-300" : "bg-black hover:bg-gray-800"}` }
        >
          <Minus size={14} />
        </button>
      </div>
      <img
        src={url}
        alt={`Map of ${countryName}`}
        width={imageRatio ? 260 * imageRatio : 260}
        height={imageRatio ? 312 * imageRatio : 312}
        className="rounded-md shadow-sm shadow-black"
      />
    </motion.div>
  );
};
