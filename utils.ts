import {
  COUNTRY_DATA,
  isUNCountry,
  type QuizLength,
  TOTAL_UN_COUNTRIES,
  TOTAL_ALL_COUNTRIES,
  CountryInfo,
} from "./constants";
import type { FlagQuestion, CountryFilter } from "./types";

// Image preloader utility
export const preloadImage = (src: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve();
    img.onerror = reject;
    img.src = src;
  });
};

// Get all country names for autocomplete
export const getAllCountries = (): string[] => {
  return Object.values(COUNTRY_DATA).map((country) => country.name);
};

// Get random wrong options that aren't the correct answer
export const getRandomWrongOptions = (
  correctAnswer: string,
  count: number
): string[] => {
  const allCountries = getAllCountries();
  const wrongOptions: string[] = [];

  while (wrongOptions.length < count) {
    const randomIndex = Math.floor(Math.random() * allCountries.length);
    const option = allCountries[randomIndex];

    if (option !== correctAnswer && !wrongOptions.includes(option)) {
      wrongOptions.push(option);
    }
  }

  return wrongOptions;
};

// Generate random questions from country data
export const generateQuestions = (
  quizLength: QuizLength = 20,
  countryFilter: CountryFilter = "un",
  optionsCount = 4
): FlagQuestion[] => {
  let entries = Object.entries(COUNTRY_DATA);

  // Filter for UN countries if selected
  if (countryFilter === "un") {
    entries = entries.filter(([code]) => isUNCountry(code));
  }

  // Shuffle the entries
  const shuffled = [...entries].sort();
  // const shuffled = [...entries].sort(() => 0.5 - Math.random());

  // Determine how many entries to use
  let selectedEntries: [string, CountryInfo][];
  if (quizLength === "all") {
    selectedEntries = shuffled as [string, CountryInfo][];
  } else {
    selectedEntries = shuffled.slice(0, quizLength) as [string, CountryInfo][];
  }

  return selectedEntries.map((entry, index) => {
    const [code, countryInfo] = entry;
    const name = countryInfo.name;

    // Generate random wrong options (optionsCount - 1 because one option is the correct answer)
    const wrongOptions = getRandomWrongOptions(name[0], optionsCount - 1);

    // Combine correct answer with wrong options and shuffle
    const options = [name, ...wrongOptions];
    options.sort(() => 0.5 - Math.random());

    return {
      id: index + 1,
      country: name,
      altNames : countryInfo.altNames,
      language: countryInfo.languages,
      continent: countryInfo.continent,
      subregion: countryInfo.subregion,
      capital: countryInfo.capital,
      currency: countryInfo.currency?.name
        ? [
            countryInfo.currency.name,
            countryInfo.currency.code,
            countryInfo.currency.symbol,
          ]
        : [],
      areaKm: countryInfo.areaKm2,
      tld: countryInfo.tld,
      countryCode: code,
      options: options,
    };
  });
};

// Preload next question's image
export const preloadNextImage = async (
  flagQuestions: FlagQuestion[],
  currentIndex: number
): Promise<boolean> => {
  if (currentIndex + 1 < flagQuestions.length) {
    const nextQuestion = flagQuestions[currentIndex + 1];
    try {
      await preloadImage(
        `https://flagcdn.com/h240/${nextQuestion.countryCode}.webp`
      );
      return true;
    } catch {
      // Fallback to PNG if WebP fails
      try {
        await preloadImage(
          `https://flagcdn.com/h240/${nextQuestion.countryCode}.png`
        );
        return true;
      } catch (error) {
        console.warn("Failed to preload next image:", error);
        return false;
      }
    }
  }
  return false;
};

// Format time in MM:SS format
export const formatTime = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes.toString().padStart(2, "0")}:${remainingSeconds
    .toString()
    .padStart(2, "0")}`;
};

// Get the display name for quiz length
export const getQuizLengthDisplay = (
  quizLength: QuizLength,
  countryFilter: CountryFilter
): string => {
  if (quizLength === "all") {
    return countryFilter === "un"
      ? `All UN Countries (${TOTAL_UN_COUNTRIES})`
      : `All Countries (${TOTAL_ALL_COUNTRIES})`;
  } else {
    return `${quizLength} Questions`;
  }
};

export const fetchCountryDescription = async (
  countryName: string,
  apiKey: string
): Promise<{ description: string | null; sourceUrl: string | null }> => {
  const encodedCountryName = encodeURIComponent(countryName);
  const kgUrl = `https://kgsearch.googleapis.com/v1/entities:search?query=${encodedCountryName}&languages=en&types=Country&key=${apiKey}`;

  try {
    const response = await fetch(kgUrl);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();

    if (data.itemListElement && data.itemListElement.length > 0) {
      const firstResult = data.itemListElement[0].result;

      const isCountryOrPlace =
        firstResult["@type"] &&
        (firstResult["@type"].includes("Country") ||
          firstResult["@type"].includes("Place"));

      if (isCountryOrPlace) {
        if (
          firstResult.detailedDescription &&
          firstResult.detailedDescription.articleBody
        ) {
          const description = firstResult.detailedDescription.articleBody;
          return {
            description: description.split(" ").length > 5 ? description : null,
            sourceUrl: firstResult.detailedDescription.url || null,
          };
        } else if (firstResult.description) {
          const description = firstResult.description;
          return {
            description: description.split(" ").length > 5 ? description : null,
            sourceUrl: null,
          };
        }
      }
    }
    return { description: "No information found for this country.", sourceUrl: null };
  } catch (error: any) {
    console.error("Error fetching country description:", error);
    return { description: null, sourceUrl: null };
  }
};
