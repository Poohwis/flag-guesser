"use client"

import { useState } from "react"
import { Loader2 } from "lucide-react"

interface FlagImageProps {
  countryCode: string
  country: string
  onLoad?: () => void
  isLoading?: boolean
}

export function FlagImage({ countryCode, country, onLoad, isLoading }: FlagImageProps) {
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleImageLoad = () => {
    setImageLoaded(true)
    onLoad?.()
  }

  return (
    <div className="relative w-auto h-40">
      {/* Loading skeleton */}
      {(!imageLoaded || isLoading) && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 rounded-lg border-2 border-gray-300 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
        </div>
      )}

      {/* Actual image */}
      <picture className={`transition-opacity duration-300 ${imageLoaded && !isLoading ? "opacity-100" : "opacity-0"}`}>
        <source type="image/webp" srcSet={`https://flagcdn.com/h240/${countryCode}.webp`} />
        <source type="image/png" srcSet={`https://flagcdn.com/h240/${countryCode}.png`} />
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
  )
}
