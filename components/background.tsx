"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export const backgroundList = [
  "dark_01_australia.webp",
  "dark_02_capedown.webp",
  "dark_03_newyork.webp",
  "dark_04_shanghai.webp",
  "dark_05_switzerland.webp",
  "dark_06_sydney.webp",
  "dark_07_bankok.webp",
  "light_01_manila.webp",
  "light_02_newyork.webp",
  "light_03_tokyo-01.webp",
  "light_05_switzerland.webp",
  "light_06_tokyo-02.webp",
  "light_07_switzerland.webp",
];

export function Background({
  children,
  backgroundEnabled,
  backgroundIndex,
}: {
  children: React.ReactNode;
  backgroundEnabled: boolean;
  backgroundIndex: number;
}) {
  const { resolvedTheme } = useTheme();
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);
  if (!isMounted) return null;

  const gradientClass =
    resolvedTheme === "dark"
      ? "bg-gradient-to-t from-violet-400 to-black"
      : "bg-gradient-to-t from-orange-100 to-orange-200";

  const backgroundImage =
    resolvedTheme === "dark"
      ? `url('/images/wallpaper/${backgroundList[backgroundIndex]}')`
      : `url('/images/wallpaper/${backgroundList[backgroundIndex]}')`;

  return (
    <div
      className={`relative min-h-screen flex items-center justify-center transition-colors bg-cover bg-bottom 
        ${!backgroundEnabled ? gradientClass : ""}
        `}
      style={backgroundEnabled ? { backgroundImage: backgroundImage } : {}}
    >
      {resolvedTheme === "dark" ? (
        <div className="absolute inset-0 bg-black opacity-70 pointer-events-none z-0" />
      ) : (
        <div className="absolute inset-0 bg-black opacity-20 pointer-events-none z-0" />
      )}
      <div
        style={{
          backgroundImage: "url('/images/wallpaper/film-grain2.webp')",
          mixBlendMode: "overlay",
        }}
        className="absolute inset-0 bg-repeat opacity-[0.15] pointer-events-none bg-cover"
      />
      {children}
    </div>
  );
}
