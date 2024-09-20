import {
  act,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react-native";
import { createStore, Provider } from "jotai";

import { TimerBar } from "./timerBar";

import { nowAtom } from "@/stores/now";
import { timerListAtom } from "@/stores/timerLists";
import { mockLocalStorage } from "@/utils/localStorage";

describe("timerBar", () => {
  it("decreases count when playing, and keeps count when not playing (plause-play button)", () => {
    mockLocalStorage();
    const store = createStore();
    store.set(timerListAtom, { type: "clear", target: "a" });
    store.set(timerListAtom, {
      type: "setItemSeconds",
      target: "a",
      seconds: 3,
    });
    render(
      <Provider store={store}>
        <TimerBar />
      </Provider>,
    );
    within(screen.getByLabelText("countdown")).getByText("00:00:03");
    // start playing
    fireEvent.press(screen.getByLabelText("play"));
    act(() => {
      store.set(nowAtom, (now) => now + 1000);
    });
    // stop playing
    within(screen.getByLabelText("countdown")).getByText("00:00:02");
    fireEvent.press(screen.getByLabelText("pause"));
    act(() => {
      store.set(nowAtom, (now) => now + 1000);
    });
    within(screen.getByLabelText("countdown")).getByText("00:00:02");
  });
  it("decreases count when playing, and keep count when not playing (countdown button)", () => {
    mockLocalStorage();
    const store = createStore();
    store.set(timerListAtom, { type: "clear", target: "a" });
    store.set(timerListAtom, {
      type: "setItemSeconds",
      target: "a",
      seconds: 2,
    });
    store.set(timerListAtom, {
      type: "setItemSeconds",
      target: "b",
      seconds: 3,
    });
    render(
      <Provider store={store}>
        <TimerBar />
      </Provider>,
    );
    within(screen.getByLabelText("countdown")).getByText("00:00:02");

    // start playing
    fireEvent.press(screen.getByLabelText("countdown"));
    act(() => {
      store.set(nowAtom, (now) => now + 1000);
    });
    within(screen.getByLabelText("countdown")).getByText("00:00:01");
    // stop playing
    fireEvent.press(screen.getByLabelText("countdown"));
    act(() => {
      store.set(nowAtom, (now) => now + 1000);
    });
    within(screen.getByLabelText("countdown")).getByText("00:00:01");
  });
  it("resets timer", () => {
    mockLocalStorage();
    const store = createStore();
    store.set(timerListAtom, { type: "clear", target: "a" });
    store.set(timerListAtom, {
      type: "setItemSeconds",
      target: "a",
      seconds: 2,
    });
    store.set(timerListAtom, {
      type: "setItemSeconds",
      target: "b",
      seconds: 3,
    });
    render(
      <Provider store={store}>
        <TimerBar />
      </Provider>,
    );
    // start playing
    fireEvent.press(screen.getByLabelText("play"));
    act(() => {
      store.set(nowAtom, (now) => now + 1000);
    });
    fireEvent.press(screen.getByLabelText("reset"));
    within(screen.getByLabelText("countdown")).getByText("00:00:02");
  });
});
