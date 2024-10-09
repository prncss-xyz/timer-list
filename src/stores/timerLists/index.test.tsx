import { render } from "@testing-library/react-native";
import { Provider, createStore } from "jotai";

import { activeIdAtom, activeSecondsAtom, timerListAtom } from ".";
import { useInitTimerList } from "./init";

import { mockLocalStorage } from "@/utils/localStorage";
import { delai } from "@/utils/tests";

describe("timerLists", () => {
  describe("timerUpdateEffect", () => {
    it.skip("triggers when active id change", async () => {
      mockLocalStorage();
      const store = createStore();
      store.set(timerListAtom, { type: "clear", target: "a" });
      store.set(timerListAtom, {
        type: "setItemSeconds",
        target: "a",
        seconds: 1,
      });
      store.set(timerListAtom, {
        type: "setItemSeconds",
        target: "b",
        seconds: 2,
      });
      store.set(timerListAtom, {
        type: "setItemSeconds",
        target: "c",
        seconds: 3,
      });
      const cb = jest.fn();
      function Context() {
        useInitTimerList(cb);
        return null;
      }
      render(
        <Provider store={store}>
          <Context />
        </Provider>,
      );
      store.set(activeIdAtom, "b");
      await delai(0);
      expect(cb).toHaveBeenCalled();
    });
    it("triggers when active value change", async () => {
      mockLocalStorage();
      const store = createStore();
      store.set(timerListAtom, { type: "clear", target: "a" });
      store.set(timerListAtom, {
        type: "setItemSeconds",
        target: "a",
        seconds: 1,
      });
      store.set(timerListAtom, {
        type: "setItemSeconds",
        target: "b",
        seconds: 2,
      });
      store.set(timerListAtom, {
        type: "setItemSeconds",
        target: "c",
        seconds: 3,
      });
      const cb = jest.fn();
      function Context() {
        useInitTimerList(cb);
        return null;
      }
      render(
        <Provider store={store}>
          <Context />
        </Provider>,
      );
      store.set(activeSecondsAtom, 9);
      await delai(0);
      expect(cb).toHaveBeenCalled();
    });
  });
});
