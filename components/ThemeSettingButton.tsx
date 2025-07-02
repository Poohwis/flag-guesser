"use client";

import { Dot, Ellipsis, Moon, Settings, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { ToggleGroup, ToggleGroupItem } from "./ui/toggle-group";
import { Switch } from "./ui/switch";
import { Separator } from "./ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { backgroundList } from "./background";
import { useEffect, useState } from "react";

interface ThemeSettingButtonProps {
  backgroundEnabled: boolean;
  backgroundIndex: number;
  handleNextQuestion?: (isFinishRequest: boolean) => void;
  onToggleBackgroundEnabled: (enabled: boolean) => void;
  onBackgroundChange: (index: number) => void;
}
export function ThemeSettingButton({
  backgroundEnabled,
  backgroundIndex,
  handleNextQuestion,
  onToggleBackgroundEnabled,
  onBackgroundChange,
}: ThemeSettingButtonProps) {
  const { resolvedTheme, setTheme } = useTheme();

  useEffect(() => {
    const themePrefix = resolvedTheme === "dark" ? "dark" : "light";
    const themeBackgrounds = backgroundList
      .map((bg, i) => ({ bg, index: i }))
      .filter(({ bg }) => bg.startsWith(themePrefix));

    // Only change if the current background does not match the theme
    if (!backgroundList[backgroundIndex]?.startsWith(themePrefix)) {
      const random =
        themeBackgrounds[Math.floor(Math.random() * themeBackgrounds.length)];
      if (random) {
        onBackgroundChange(random.index);
      }
    }
    // const random =
    //   themeBackgrounds[Math.floor(Math.random() * themeBackgrounds.length)];
    // onBackgroundChange(random.index);
  }, [resolvedTheme]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant={"ghost"} size={"sm"} className="p-2">
          {/* <Ellipsis /> */}
          <Settings />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="w-[200px] text-sm flex flex-col gap-y-3 py-4 text-primary/80"
      >
        <div className="flex flex-row items-center justify-between mx-4">
          <div>Theme</div>
          <ToggleGroup
            type="single"
            value={resolvedTheme}
            onValueChange={(value) => value && setTheme(value)}
            size={"sm"}
            variant={"outline"}
          >
            <ToggleGroupItem
              aria-label="toggle light"
              value="light"
              className="data-[state=on]:bg-black/20"
            >
              <Sun className="h-4 w-4" />
            </ToggleGroupItem>
            <ToggleGroupItem aria-label="toggle dark" value="dark">
              <Moon className="h-4 w-4" />
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        <Separator />
        <div className="flex flex-col gap-y-2 px-4">
          <div className="flex flex-row items-center justify-between">
            <label htmlFor="background-toggle">Background</label>
            <Switch
              id="background-toggle"
              checked={backgroundEnabled}
              onCheckedChange={(checked) => {
                onToggleBackgroundEnabled(checked);
              }}
              onClick={(e) => e.stopPropagation()}
              className="scale-[0.75]"
            />
          </div>
        </div>
        <DropdownMenuSub>
          <DropdownMenuSubTrigger
            disabled={!backgroundEnabled}
            className={`px-4 ${
              backgroundEnabled ? "" : "text-gray-200 dark:text-gray-700"
            }`}
          >
            Select picture
          </DropdownMenuSubTrigger>
          <DropdownMenuPortal>
            <DropdownMenuSubContent>
              <DropdownMenuLabel className="text-primary/80">
                background
              </DropdownMenuLabel>
              {backgroundList.map((name, index) => {
                if (name.split("_")[0] === resolvedTheme) {
                  return (
                    <DropdownMenuItem
                      key={name}
                      onClick={() => onBackgroundChange(index)}
                      className="hover:cursor-pointer flex flex-row item-center justify-between"
                    >
                      {name
                        .split("_")[2]
                        .split(".")[0]
                        .replace(/^\w/, (c) => c.toUpperCase())}
                      {index === backgroundIndex && <Dot />}
                    </DropdownMenuItem>
                  );
                }
              })}
            </DropdownMenuSubContent>
          </DropdownMenuPortal>
        </DropdownMenuSub>
        {handleNextQuestion && (
          <>
            <Separator />
            <DropdownMenuItem
              onClick={() => handleNextQuestion(true)}
              className="hover:cursor-pointer text-center  justify-center"
            >
              Finish
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
