import { Audio } from "expo-av";
import { atom, useSetAtom } from "jotai";
import { useEffect } from "react";

const soundAtom = atom<Audio.Sound | undefined>(undefined);

//PERF: : this could cause a memory leak if new sound is loaded before loading of the first one has completed
// however, in the current application this is not an issue
const loadSoundAtom = atom(null, async (get, set, sample: any) => {
  // not awaiting completion
  get(soundAtom)?.unloadAsync();
  const { sound } = await Audio.Sound.createAsync(sample);
  set(soundAtom, sound);
});

export function useSound(duckSound: any) {
  const loadSound = useSetAtom(loadSoundAtom);
  useEffect(() => {
    loadSound(duckSound);
  }, []);
}

export const playSoundAtom = atom(null, (get) =>
  setTimeout(() => get(soundAtom)?.playAsync(), 0),
);
