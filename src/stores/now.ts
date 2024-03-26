import { atom } from "jotai";

const resolution = 200;

export const nowAtom = atom(0);
nowAtom.onMount = (setAtom) => {
  const timer = setInterval(() => {
    return setAtom(Date.now());
  }, resolution);
  return () => clearInterval(timer);
};
