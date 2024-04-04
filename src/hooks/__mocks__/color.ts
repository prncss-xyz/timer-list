import { lightColors } from "@/styles";

export function useColor(name: keyof typeof lightColors) {
  return lightColors[name];
}
