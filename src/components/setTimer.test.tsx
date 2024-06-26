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
import { TimerList } from "@/stores/timerLists/model";
import { mockLocalStorage } from "@/utils/localStorage";

jest.mock("expo-router", () => ({
  router: { back: jest.fn() },
}));

describe("set-timer", () => {
  beforeEach(() => {
    mockLocalStorage();
  });
  it("append digits to timer", () => {
    const timerList: TimerList = {
      active: "a",
      items: [{ seconds: 1, id: "a" }],
    };
    for (let i = 0; i < 10; ++i) {
      const digit = String(i);
      const store = createStore();
      store.set(timerListAtom, timerList);
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
    const store = createStore();
    store.set(timerListAtom, {
      active: "a",
      // 23 * 3600 + 1 => "23:00:01"
      items: [{ seconds: 23 * 3600 + 1, id: "a" }],
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
    jest.resetAllMocks();
    const store = createStore();
    store.set(timerListAtom, {
      active: "a",
      items: [{ seconds: 1, id: "a" }],
    });
    render(
      <Provider store={store}>
        <SetTimer timerId="a" />
      </Provider>,
    );
    fireEvent.press(screen.getByText("1"));
    fireEvent.press(screen.getByLabelText("cancel"));
    expect(store.get(timerListAtom).items).toEqual([{ seconds: 1, id: "a" }]);
    expect((router.back as any).mock.calls).toHaveLength(1);
  });
  it("closes and updates value", () => {
    jest.resetAllMocks();
    const store = createStore();
    store.set(timerListAtom, {
      active: "a",
      items: [{ seconds: 1, id: "a" }],
    });
    render(
      <Provider store={store}>
        <SetTimer timerId="a" />
      </Provider>,
    );
    fireEvent.press(screen.getByText("1"));
    fireEvent.press(screen.getByLabelText("done"));
    expect(store.get(timerListAtom).items).toEqual([{ seconds: 11, id: "a" }]);
    expect((router.back as any).mock.calls).toHaveLength(1);
  });
  it("removes last character to timer", () => {
    const store = createStore();
    store.set(timerListAtom, {
      active: "a",
      // 23 * 3600 + 1 => "12:00:34"
      items: [{ seconds: 12 * 3600 + 34, id: "a" }],
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
