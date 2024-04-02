import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react-native";
import { createStore, Provider } from "jotai";

import { SetTimer } from "./setTimer";

import { timerListAtom } from "@/stores/timerLists";
import { TimerList } from "@/stores/timerLists/model";

describe("set-timer", () => {
  it("should rendrer properly", () => {
    const store = createStore();
    store.set(timerListAtom, {
      index: 0,
      items: [{ seconds: 1, id: "a" }],
    });
    const tree = render(
      <Provider store={store}>
        <SetTimer timerId="a" />
      </Provider>,
    );
    expect(tree).toMatchSnapshot();
  });
  it("should append digits to timer", () => {
    const timerList: TimerList = {
      index: 0,
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
  it("should append 00 to timer", () => {
    const store = createStore();
    store.set(timerListAtom, {
      index: 0,
      // 23 * 3600 + 1 => "23:00:01"
      items: [{ seconds: 23 * 3600 + 1, id: "a" }],
    });
    render(
      <Provider store={store}>
        <SetTimer timerId="a" />
      </Provider>,
    );
    // start playing
    fireEvent.press(screen.getByText("00"));
    within(screen.getByLabelText("timer")).getByText("00:01:00");
  });
  it("should remove last character to timer", () => {
    const store = createStore();
    store.set(timerListAtom, {
      index: 0,
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
