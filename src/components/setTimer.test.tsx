import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react-native";
import { router } from "expo-router";
import { createStore, Provider } from "jotai";

import { SetTimer } from "./setTimer";

import { timerListAtom } from "@/stores/timerLists";
import { mockLocalStorage } from "@/utils/localStorage";

jest.mock("expo-router", () => ({
  router: { back: jest.fn() },
}));

describe("set-timer", () => {
  it("append digits to timer", () => {
    mockLocalStorage();
    for (let i = 0; i < 10; ++i) {
      const digit = String(i);
      const store = createStore();
      store.set(timerListAtom, { type: "clear", target: "a" });
      store.set(timerListAtom, {
        type: "setItemSeconds",
        target: "a",
        seconds: 1,
      });
      render(
        <Provider store={store}>
          <SetTimer timerId="a" />
        </Provider>,
      );
      // start playing
      fireEvent.press(screen.getByText(digit));
      within(screen.getByLabelText("timer")).getByText(`00:00:1${digit}`);
    }
  });
  it("appends 00 to timer", () => {
    mockLocalStorage();
    const store = createStore();
    store.set(timerListAtom, { type: "clear", target: "a" });
    store.set(timerListAtom, {
      type: "setItemSeconds",
      target: "a",
      seconds: 1,
    });
    render(
      <Provider store={store}>
        <SetTimer timerId="a" />
      </Provider>,
    );
    fireEvent.press(screen.getByText("00"));
    within(screen.getByLabelText("timer")).getByText("00:01:00");
  });
  it("closes without updating value", () => {
    mockLocalStorage();
    const store = createStore();
    store.set(timerListAtom, { type: "clear", target: "a" });
    store.set(timerListAtom, {
      type: "setItemSeconds",
      target: "a",
      seconds: 1,
    });
    render(
      <Provider store={store}>
        <SetTimer timerId="a" />
      </Provider>,
    );
    fireEvent.press(screen.getByText("1"));
    fireEvent.press(screen.getByLabelText("cancel"));
    expect(store.get(timerListAtom).items).toMatchObject([
      { seconds: 1, id: "a" },
    ]);
    expect(router.back).toHaveBeenCalled();
  });
  it("closes and updates value", () => {
    mockLocalStorage();
    const store = createStore();
    store.set(timerListAtom, { type: "clear", target: "a" });
    store.set(timerListAtom, {
      type: "setItemSeconds",
      target: "a",
      seconds: 1,
    });
    render(
      <Provider store={store}>
        <SetTimer timerId="a" />
      </Provider>,
    );
    fireEvent.press(screen.getByText("1"));
    fireEvent.press(screen.getByLabelText("done"));
    expect(store.get(timerListAtom).items).toMatchObject([
      { seconds: 11, id: "a" },
    ]);
    expect(router.back).toHaveBeenCalled();
  });
  it("removes last character to timer", () => {
    mockLocalStorage();
    const store = createStore();
    store.set(timerListAtom, { type: "clear", target: "a" });
    store.set(timerListAtom, {
      type: "setItemSeconds",
      target: "a",
      seconds: 12 * 3600 + 34,
    });
    render(
      <Provider store={store}>
        <SetTimer timerId="a" />
      </Provider>,
    );
    // start playing
    fireEvent.press(screen.getByLabelText("backspace"));
    within(screen.getByLabelText("timer")).getByText("01:20:03");
  });
});
