"use client";
import { ExternalLink, Plus, Minus } from "lucide-react";
import { useState, useRef, useMemo } from "react";
import { motion } from "motion/react";

interface MapDisplayProps {
  countryName: string;
  isDarkMode: boolean;
}

interface ImageCache {
  [key: string]: string; // Key: 'countryName-zoom-isDarkMode', Value: 'mapUrl'
}

export function MapDisplay({ countryName, isDarkMode }: MapDisplayProps) {
  const [currentZoom, setCurrentZoom] = useState(5);

  const imageCache = useRef<ImageCache>({});

  const baseUrl = "https://maps.googleapis.com/maps/api/staticmap";
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const darkMapId = "74a608c119d30ae0ee259c09";
  const lightMapId = "74a808c119d30ae08b4ad7cd";

  const cacheKey = `${encodeURIComponent(
    countryName
  )}-${currentZoom}-${isDarkMode}`;

  const mapUrl = useMemo(() => {
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
    console.log(newMapUrl)
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

  // Basic check for API key
  if (!apiKey) {
    return;
  }

  return (
    <motion.div
      initial={{ scale: 0.9, opacity: 0 }}
      whileInView={{ scale: 1, opacity: 1 }}
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
          onClick={() =>
            setCurrentZoom((prevZoom) => Math.min(prevZoom + 1, 7))
          }
          className="text-white  p-1 bg-black hover:bg-black/80 rounded-t-md transition-color"
        >
          <Plus size={14} />
        </button>
        <button
          onClick={() =>
            setCurrentZoom((prevZoom) => Math.max(prevZoom - 1, 3))
          }
          className="text-white p-1 bg-black hover:bg-black/80 rounded-b-md transition-color"
        >
          <Minus size={14} />
        </button>
      </div>
      <img
        src={mapUrl}
        alt={`Map of ${countryName}`}
        width={260}
        height={312}
        className="rounded-xl shadow-sm shadow-black"
      />
    </motion.div>
  );
}
