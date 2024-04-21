import { render } from "@testing-library/react-native";
import { Provider, createStore } from "jotai";

import { countDownTextAtom } from ".";
import { useInitCountDown } from "./init";
import { nowAtom } from "../now";
import { timerListAtom } from "../timerLists";
import { timerActiveAtom, toggleTimerAtom } from "../timers";

import { delai } from "@/utils/tests";

describe("countDown", () => {
  it("do not rings before times expires, rings when times expires and updates to next item", async () => {
    const alarm = jest.fn();
    const store = createStore();
    store.set(timerListAtom, {
      active: "a",
      items: [
        {
          id: "a",
          seconds: 1,
        },
        {
          id: "b",
          seconds: 2,
        },
      ],
    });
    function Context() {
      useInitCountDown(alarm);
      return null;
    }
    render(
      <Provider store={store}>
        <Context />
      </Provider>,
    );
    store.set(toggleTimerAtom);
    expect(store.get(timerActiveAtom)).toBeTruthy();
    store.set(nowAtom, (x) => x + 500);
    await delai(0);
    expect(alarm.mock.calls).toEqual([]);
    store.set(nowAtom, (x) => x + 500);
    await delai(0);
    expect(alarm.mock.calls).toEqual([[]]);
    expect(store.get(countDownTextAtom)).toBe("00:00:02");
  });
});
