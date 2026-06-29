"use client";

import { useWeatherAtmosphere } from "@/hooks/useWeatherAtmosphere";
import { useEffect } from "react";

export default function WeatherProvider({ children }: { children: React.ReactNode }) {
  const { theme, isLoaded } = useWeatherAtmosphere();

  useEffect(() => {
    if (isLoaded && theme) {
      document.documentElement.style.setProperty('--glow-color', theme.glowPrimary);
      document.documentElement.style.setProperty('--glow-secondary', theme.glowSecondary);
      
      // Update the body radial gradient to dynamically reflect the weather state
      document.body.style.background = `
        radial-gradient(circle at 20% 0%, ${theme.glowPrimary}, transparent 40%),
        radial-gradient(circle at 80% 20%, ${theme.glowSecondary}, transparent 35%),
        var(--background)
      `;
    }
  }, [theme, isLoaded]);

  return <>{children}</>;
}
