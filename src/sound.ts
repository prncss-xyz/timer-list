import { Audio } from "expo-av";
import { atom } from "jotai";

const soundAtom = atom<Audio.Sound | undefined>(undefined);

export const loadSoundAtom = atom(null, async (get, set, sample: any) => {
  // not awaiting completion
  get(soundAtom)?.unloadAsync();
  const { sound } = await Audio.Sound.createAsync(sample);
  set(soundAtom, sound);
});

export const playSoundAtom = atom(null, (get) => {
  get(soundAtom)?.playAsync();
});
