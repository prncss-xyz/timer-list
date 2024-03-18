import { Audio } from "expo-av";
import { atom } from "jotai";

const soundAtom = atom<Audio.Sound | undefined>(undefined);

// FIXME: this could cause a memory leak if new sound is loaded before loading of the first one has completed
// however, in the current application this is not an issue
export const loadSoundAtom = atom(null, async (get, set, sample: any) => {
  // not awaiting completion
  get(soundAtom)?.unloadAsync();
  const { sound } = await Audio.Sound.createAsync(sample);
  set(soundAtom, sound);
});

export const playSoundAtom = atom(null, (get) =>
  setTimeout(() => get(soundAtom)?.playAsync(), 0),
);
