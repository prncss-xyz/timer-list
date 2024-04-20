import { useSetAtom } from "jotai";
import { useEffect } from "react";

import { nowAtom } from ".";

const resolution = 200;

export function useInitNow() {
  const setAtom = useSetAtom(nowAtom);
  useEffect(() => {
    const timer = setInterval(() => {
      return setAtom(Date.now());
    }, resolution);
    return () => clearInterval(timer);
  }, [setAtom]);
  return true;
}
