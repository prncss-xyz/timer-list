import { atom, createStore } from "jotai";
import { focusAtom } from "jotai-optics";

import { activateAtom, resolvedAtom } from "./atoms";

describe("atoms", () => {
  describe("resolvedAtom", () => {
    const referenceAtom = atom(1);
    const listAtom = atom(["a", "b", "c"]);
    const valueFactory = (i: number) => focusAtom(listAtom, (o) => o.at(i));
    const valueAtom = resolvedAtom(referenceAtom, valueFactory);
    it("resolves reference", () => {
      const store = createStore();
      expect(store.get(valueAtom)).toBe("b");
    });
    it("updates reference", () => {
      const store = createStore();
      expect(store.set(valueAtom, "x"));
      expect(store.get(valueAtom)).toBe("x");
    });
  });
  describe("activate atom", () => {
    const valueAtom = atom(1);
    const acAtom = activateAtom(0, valueAtom);
    it("updates value to reference", () => {
      const store = createStore();
      expect(store.get(acAtom)).toBeFalsy();
      expect(store.set(acAtom));
      expect(store.get(acAtom)).toBeTruthy();
      expect(store.get(valueAtom)).toBe(0);
    });
  });
});
