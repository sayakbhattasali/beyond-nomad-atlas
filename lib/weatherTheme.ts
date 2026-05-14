// Weather state definitions for Bhubaneswar atmospheric system
export type WeatherState =
  | "clear-day"
  | "clear-night"
  | "cloudy-day"
  | "cloudy-night"
  | "rain-day"
  | "rain-night";

export type WeatherTheme = {
  // Image filter adjustments (applied via style)
  imageBrightness: number;
  imageSaturation: number;
  imageContrast: number;

  // Primary overlay gradient (CSS gradient string)
  overlayGradient: string;

  // Tint layer (color + opacity via rgba)
  tintColor: string;

  // Glow blob colors (CSS color strings)
  glowPrimary: string;
  glowSecondary: string;

  // Atmosphere feel label (used in aria/debug)
  label: string;

  // Rain streaks
  showRain: boolean;

  // Fog pulse
  showFog: boolean;

  // Animated cloud drift
  showClouds: boolean;
};

export const weatherThemes: Record<WeatherState, WeatherTheme> = {
  "clear-day": {
    imageBrightness: 0.92,
    imageSaturation: 1.12,
    imageContrast: 1.04,
    overlayGradient:
      "linear-gradient(to bottom, rgba(10,6,2,0.18) 0%, rgba(8,7,6,0.32) 55%, rgba(8,7,6,0.88) 100%)",
    tintColor: "rgba(255, 160, 70, 0.08)",
    glowPrimary: "rgba(255, 160, 70, 0.22)",
    glowSecondary: "rgba(255, 210, 140, 0.14)",
    label: "Clear Day",
    showRain: false,
    showFog: false,
    showClouds: false,
  },

  "clear-night": {
    imageBrightness: 0.78,
    imageSaturation: 0.82,
    imageContrast: 1.08,
    overlayGradient:
      "linear-gradient(to bottom, rgba(8,12,35,0.35) 0%, rgba(6,8,22,0.48) 55%, rgba(8,7,6,0.90) 100%)",
    tintColor: "rgba(50, 70, 160, 0.12)",
    glowPrimary: "rgba(80, 120, 255, 0.22)",
    glowSecondary: "rgba(255, 148, 60, 0.15)",
    label: "Clear Night",
    showRain: false,
    showFog: false,
    showClouds: false,
  },

  "cloudy-day": {
    imageBrightness: 0.85,
    imageSaturation: 0.78,
    imageContrast: 0.98,
    overlayGradient:
      "linear-gradient(to bottom, rgba(20,18,16,0.22) 0%, rgba(14,12,10,0.38) 55%, rgba(8,7,6,0.88) 100%)",
    tintColor: "rgba(140, 145, 155, 0.10)",
    glowPrimary: "rgba(170, 160, 145, 0.18)",
    glowSecondary: "rgba(130, 135, 140, 0.12)",
    label: "Cloudy Day",
    showRain: false,
    showFog: true,
    showClouds: true,
  },

  "cloudy-night": {
    imageBrightness: 0.72,
    imageSaturation: 0.68,
    imageContrast: 1.04,
    overlayGradient:
      "linear-gradient(to bottom, rgba(10,12,20,0.35) 0%, rgba(8,10,16,0.50) 55%, rgba(8,7,6,0.92) 100%)",
    tintColor: "rgba(70, 75, 100, 0.12)",
    glowPrimary: "rgba(90, 95, 140, 0.18)",
    glowSecondary: "rgba(60, 65, 90, 0.12)",
    label: "Cloudy Night",
    showRain: false,
    showFog: true,
    showClouds: true,
  },

  "rain-day": {
    imageBrightness: 0.80,
    imageSaturation: 0.72,
    imageContrast: 1.06,
    overlayGradient:
      "linear-gradient(to bottom, rgba(10,18,30,0.28) 0%, rgba(8,14,24,0.42) 55%, rgba(8,7,6,0.90) 100%)",
    tintColor: "rgba(60, 100, 165, 0.15)",
    glowPrimary: "rgba(60, 110, 210, 0.22)",
    glowSecondary: "rgba(80, 130, 190, 0.14)",
    label: "Rain Day",
    showRain: true,
    showFog: false,
    showClouds: false,
  },

  "rain-night": {
    imageBrightness: 0.68,
    imageSaturation: 0.65,
    imageContrast: 1.10,
    overlayGradient:
      "linear-gradient(to bottom, rgba(6,10,24,0.38) 0%, rgba(6,10,20,0.52) 55%, rgba(8,7,6,0.93) 100%)",
    tintColor: "rgba(35, 65, 130, 0.18)",
    glowPrimary: "rgba(50, 90, 200, 0.24)",
    glowSecondary: "rgba(40, 70, 150, 0.14)",
    label: "Rain Night",
    showRain: true,
    showFog: false,
    showClouds: false,
  },
};

// Resolve weather API condition + hour → WeatherState
export function resolveWeatherState(
  condition: string,
  hour: number
): WeatherState {
  const isNight = hour < 6 || hour >= 19;

  const lower = condition.toLowerCase();
  if (lower.includes("rain") || lower.includes("drizzle") || lower.includes("thunder")) {
    return isNight ? "rain-night" : "rain-day";
  }
  if (lower.includes("cloud") || lower.includes("overcast") || lower.includes("mist") || lower.includes("haze") || lower.includes("fog")) {
    return isNight ? "cloudy-night" : "cloudy-day";
  }
  return isNight ? "clear-night" : "clear-day";
}
