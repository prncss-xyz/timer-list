import { createStore } from "jotai";

import {
  currentIdAtom,
  currentIndexAtom,
  duplicateIdAtom,
  removeIdAtom,
  timerListAtom,
} from ".";

function getStore() {
  const store = createStore();
  store.set(timerListAtom, {
    index: 1,
    items: [
      { seconds: 1, id: "a" },
      { seconds: 2, id: "b" },
      { seconds: 3, id: "c" },
    ],
  });
  return store;
}

describe("timerList", () => {
  describe("index", () => {
    describe("removeIdAtom", () => {
      describe("it should preserve selected atom id", () => {
        test("when deletion occurs before selected", () => {
          const store = getStore();
          const before = store.get(currentIdAtom);
          store.set(removeIdAtom, "a");
          const after = store.get(currentIdAtom);
          expect(after).toBe(before);
        });
        test("when deletion occurs after selected", () => {
          const store = getStore();
          const before = store.get(currentIdAtom);
          store.set(removeIdAtom, "c");
          const after = store.get(currentIdAtom);
          expect(after).toBe(before);
        });
      });
      describe("when selected is deleted", () => {
        it("should keep last position if last element is deleted", () => {
          const store = getStore();
          store.set(currentIndexAtom, 2);
          store.set(removeIdAtom, "c");
          const after = store.get(currentIndexAtom);
          expect(after).toBe(1);
        });
        it("should keep same selected index otherwise", () => {
          const store = getStore();
          store.set(removeIdAtom, "b");
          const after = store.get(currentIndexAtom);
          expect(after).toBe(1);
        });
      });
    });
    describe("duplicateIdAtom", () => {
      describe("it should select newly created element when creation occurs on selected", () => {
        const store = getStore();
        store.set(duplicateIdAtom, "b");
        const after = store.get(currentIndexAtom);
        expect(after).toBe(2);
      });
      describe("it should preserve selected atom id", () => {
        test("when deletion occurs before selected", () => {
          const store = getStore();
          const before = store.get(currentIdAtom);
          store.set(duplicateIdAtom, "a");
          const after = store.get(currentIdAtom);
          expect(after).toBe(before);
        });
        test("when deletion occurs after selected", () => {
          const store = getStore();
          const before = store.get(currentIdAtom);
          store.set(duplicateIdAtom, "c");
          const after = store.get(currentIdAtom);
          expect(after).toBe(before);
        });
      });
    });
  });
});
