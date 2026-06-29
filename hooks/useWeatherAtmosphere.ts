"use client";

import { useEffect, useState } from "react";
import {
  WeatherState,
  WeatherTheme,
  resolveWeatherState,
  weatherThemes,
} from "@/lib/weatherTheme";

// OpenWeatherMap free API — Bhubaneswar coords
const BHUBANESWAR_LAT = 20.2961;
const BHUBANESWAR_LON = 85.8245;
const OWM_API_KEY = "bd5e378503941ddeb2130bab26b"; // open demo key for free tier

type UseWeatherAtmosphereResult = {
  theme: WeatherTheme;
  state: WeatherState;
  isLoaded: boolean;
};

export function useWeatherAtmosphere(): UseWeatherAtmosphereResult {
  const [state, setState] = useState<WeatherState>("clear-day");
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const hour = new Date().getHours();

    // Check localStorage cache first
    try {
      const cached = localStorage.getItem("atlas_weather");
      if (cached) {
        const { condition, timestamp } = JSON.parse(cached);
        // Cache is valid for 30 minutes
        if (Date.now() - timestamp < 30 * 60 * 1000) {
          setState(resolveWeatherState(condition, hour));
          setIsLoaded(true);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to read from localStorage", e);
    }

    async function fetchWeather() {
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${BHUBANESWAR_LAT}&longitude=${BHUBANESWAR_LON}&current=weathercode&timezone=Asia%2FKolkata`
        );
        if (!res.ok) throw new Error("Weather fetch failed");
        const data = await res.json();
        const code: number = data?.current?.weathercode ?? 0;
        const condition = wmoCodeToCondition(code);
        const resolvedState = resolveWeatherState(condition, hour);
        
        setState(resolvedState);

        // Cache the weather condition
        try {
          localStorage.setItem(
            "atlas_weather",
            JSON.stringify({ condition, timestamp: Date.now() })
          );
        } catch (e) {
          console.warn("Failed to save to localStorage", e);
        }
      } catch {
        // Fallback: time-only resolution, no external dependency
        setState(resolveWeatherState("clear", hour));
      } finally {
        setIsLoaded(true);
      }
    }

    fetchWeather();
  }, []);

  return {
    theme: weatherThemes[state],
    state,
    isLoaded,
  };
}

// WMO Weather code → simplified condition string
// https://open-meteo.com/en/docs#weathervariables
function wmoCodeToCondition(code: number): string {
  if (code === 0) return "clear";
  if (code <= 3) return "cloudy";
  if (code <= 49) return "fog";
  if (code <= 67) return "rain";
  if (code <= 77) return "rain"; // snow (unlikely in Bhubaneswar)
  if (code <= 82) return "rain";
  if (code <= 99) return "thunderstorm rain";
  return "clear";
}
