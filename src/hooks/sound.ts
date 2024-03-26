import { Audio } from "expo-av";
import { useCallback, useEffect, useState } from "react";

async function playSound(asset: any, setSound: (sound: Audio.Sound) => void) {
  const { sound } = await Audio.Sound.createAsync(asset);
  sound.playAsync();
  setSound(sound);
}

export function usePlay(asset: any) {
  const [sound, setSound] = useState<Audio.Sound>();
  useEffect(() => {
    return () => {
      sound?.unloadAsync();
    };
  }, [sound]);
  return useCallback(() => playSound(asset, setSound), [asset, setSound]);
}
