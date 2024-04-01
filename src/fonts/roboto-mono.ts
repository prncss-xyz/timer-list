import { useFonts, RobotoMono_500Medium } from "@expo-google-fonts/roboto-mono";

export function useRobotoMono() {
  const [fontsLoaded, fontError] = useFonts({
    RobotoMono_500Medium,
  });
  if (__DEV__ && fontError) throw fontError;
  return fontsLoaded && !fontError;
}
