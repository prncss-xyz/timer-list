import { useColorScheme } from "react-native";

import { lightColors, darkColors } from "@/styles";

export function useColor(name: keyof typeof lightColors) {
  if (useColorScheme() === "dark") return darkColors[name];
  return lightColors[name];
}
