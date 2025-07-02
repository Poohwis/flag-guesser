"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { SAMEFLAG_COUNTRY } from "@/constants";

interface FlagImageProps {
  countryCode: string;
  country: string;
  onLoad?: () => void;
  isLoading?: boolean;
  isSmallImage?: boolean;
}

export function FlagImage({
  countryCode,
  country,
  onLoad,
  isLoading,
  isSmallImage,
}: FlagImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);
  const size = isSmallImage ? "h80" : "h240";

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  if (countryCode in SAMEFLAG_COUNTRY) {
  }
  return (
    <div
      className={`relative w-auto ${
        isSmallImage ? "h-20" : "h-40"
      } shadow-sm shadow-black`}
    >
      {/* Loading skeleton */}
      {(!imageLoaded || isLoading) && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-lg border-2 border-gray-300 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {countryCode in SAMEFLAG_COUNTRY && (
        <span className="text-sm absolute right-2 bg-black/50 text-white rounded-full px-2 mt-2 w-max-64">
          {SAMEFLAG_COUNTRY[countryCode as keyof typeof SAMEFLAG_COUNTRY]}
        </span>
      )}
      {/* Actual image */}
      <picture
        className={`transition-opacity duration-300  ${
          imageLoaded && !isLoading ? "opacity-100" : "opacity-0"
        }`}
      >
        <source
          type="image/webp"
          srcSet={`https://flagcdn.com/${size}/${countryCode}.webp`}
        />
        <source
          type="image/png"
          srcSet={`https://flagcdn.com/${size}/${countryCode}.png`}
        />
        <img
          src={`https://flagcdn.com/${size}/${countryCode}.png`}
          height={isSmallImage ? 80 : 160}
          alt={`Flag of ${country}`}
          className={`w-auto object-cover shadow-lg ${
            isSmallImage ? "h-20" : "h-40"
          }`}
          crossOrigin="anonymous"
          onLoad={handleImageLoad}
        />
      </picture>
    </div>
  );
}

export const ImageItem = ({
  countryCode,
  country,
}: {
  countryCode: string;
  country: string;
}) => {
  return (
    <picture className={`transition-opacity duration-300 `}>
      <source
        type="image/webp"
        srcSet={`https://flagcdn.com/h80/${countryCode}.webp`}
      />
      <source
        type="image/png"
        srcSet={`https://flagcdn.com/h80/${countryCode}.png`}
      />
      <img
        src={`https://flagcdn.com/h80/${countryCode}.png`}
        height={80}
        alt={`Flag of ${country}`}
        className={`w-auto object-cover shadow-lg h-20
        }`}
        crossOrigin="anonymous"
      />
    </picture>
  );
};