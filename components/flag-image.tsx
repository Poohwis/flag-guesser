"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
import { sameFlagCountry } from "@/constants";

interface FlagImageProps {
  countryCode: string;
  country: string;
  onLoad?: () => void;
  isLoading?: boolean;
}

export function FlagImage({
  countryCode,
  country,
  onLoad,
  isLoading,
}: FlagImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false);

  const handleImageLoad = () => {
    setImageLoaded(true);
    onLoad?.();
  };

  if (countryCode in sameFlagCountry) {
  }
  return (
    <div className="relative w-auto h-40 shadow-sm shadow-black">
      {/* Loading skeleton */}
      {(!imageLoaded || isLoading) && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-lg border-2 border-gray-300 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {countryCode in sameFlagCountry && (
        <span className="text-sm absolute right-2 bg-black/50 text-white rounded-full px-2 mt-2 w-max-64">
          {sameFlagCountry[countryCode as keyof typeof sameFlagCountry]}
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
          srcSet={`https://flagcdn.com/h240/${countryCode}.webp`}
        />
        <source
          type="image/png"
          srcSet={`https://flagcdn.com/h240/${countryCode}.png`}
        />
        <img
          src={`https://flagcdn.com/h240/${countryCode}.png`}
          height="160"
          alt={`Flag of ${country}`}
          className="w-auto h-40 object-cover shadow-lg"
          crossOrigin="anonymous"
          onLoad={handleImageLoad}
        />
      </picture>
    </div>
  );
}
