import { render } from "@testing-library/react-native";
import { Provider, createStore } from "jotai";

import { activeIdAtom, activeSecondsAtom, timerListAtom } from ".";
import { useInitTimerList } from "./init";

import { delai } from "@/utils/tests";
jest.mock("@/hooks/storage", () => ({
  useStorageAtom: () => true,
}));

describe("timerLists", () => {
  describe("timerUpdateEffect", () => {
    it("triggers when active id change", async () => {
      const store = createStore();
      const cb = jest.fn();
      store.set(timerListAtom, {
        active: "a",
        items: [
          { seconds: 1, id: "a" },
          { seconds: 2, id: "b" },
          { seconds: 3, id: "c" },
        ],
      });
      function Context() {
        useInitTimerList("", cb);
        return null;
      }
      render(
        <Provider store={store}>
          <Context />
        </Provider>,
      );
      store.set(activeIdAtom, "b");
      await delai(0);
      expect(cb.mock.calls).toEqual([[]]);
    });
    it("triggers when active value change", async () => {
      const store = createStore();
      const cb = jest.fn();
      store.set(timerListAtom, {
        active: "a",
        items: [
          { seconds: 1, id: "a" },
          { seconds: 2, id: "b" },
          { seconds: 3, id: "c" },
        ],
      });
      function Context() {
        useInitTimerList("", cb);
        return null;
      }
      render(
        <Provider store={store}>
          <Context />
        </Provider>,
      );
      store.set(activeSecondsAtom, 9);
      await delai(0);
      expect(cb.mock.calls).toEqual([[]]);
    });
  });
});
