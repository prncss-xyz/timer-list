import { Color, lightColors } from "@/styles";

export function useColor(name: Color) {
  return lightColors[name];
}
