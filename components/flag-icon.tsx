interface FlagIconProps {
  countryCode: string
  country: string
  size?: "sm" | "md" | "lg"
}

export function FlagIcon({ countryCode, country, size = "sm" }: FlagIconProps) {
  // Size mappings
  const sizes = {
    sm: { width: 32, height: 24 },
    md: { width: 48, height: 36 },
    lg: { width: 64, height: 48 },
  }

  const { width, height } = sizes[size]

  return (
    <img
      src={`https://flagcdn.com/${width}x${height}/${countryCode}.png`}
      srcSet={`https://flagcdn.com/${width * 2}x${height * 2}/${countryCode}.png 2x,
        https://flagcdn.com/${width * 3}x${height * 3}/${countryCode}.png 3x`}
      width={width}
      height={height}
      alt={country}
      className="inline-block rounded-sm shadow-sm"
      title={country}
    />
  )
}
