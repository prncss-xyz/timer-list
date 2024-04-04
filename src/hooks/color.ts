import { useColorScheme } from "react-native";

import { lightColors, darkColors, Color } from "@/styles";

export function useColor(name: Color) {
  if (useColorScheme() === "dark") return darkColors[name];
  return lightColors[name];
}
