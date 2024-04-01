import { useFonts, Inter_600SemiBold } from "@expo-google-fonts/inter";

export function useInter() {
  const [fontsLoaded, fontError] = useFonts({
    Inter_600SemiBold,
  });
  if (__DEV__ && fontError) throw fontError;
  return fontsLoaded && !fontError;
}
