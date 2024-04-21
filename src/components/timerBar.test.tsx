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

describe("timerBar", () => {
  it("decreases count when playing, and keeps count when not playing (plause-play button)", () => {
    const store = createStore();
    store.set(timerListAtom, {
      active: "a",
      items: [
        { seconds: 2, id: "a" },
        { seconds: 3, id: "b" },
      ],
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
    within(screen.getByLabelText("countdown")).getByText("00:00:01");
    // stop playing
    fireEvent.press(screen.getByLabelText("pause"));
    act(() => {
      store.set(nowAtom, (now) => now + 1000);
    });
    within(screen.getByLabelText("countdown")).getByText("00:00:01");
    fireEvent.press(screen.getByLabelText("play"));
    act(() => {
      store.set(nowAtom, (now) => now + 1000);
    });
  });
  it("decreases count when playing, and keep count when not playing (countdown button)", () => {
    const store = createStore();
    store.set(timerListAtom, {
      active: "a",
      items: [
        { seconds: 2, id: "a" },
        { seconds: 3, id: "b" },
      ],
    });
    render(
      <Provider store={store}>
        <TimerBar />
      </Provider>,
    );
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
    const store = createStore();
    store.set(timerListAtom, {
      active: "a",
      items: [
        { seconds: 2, id: "a" },
        { seconds: 3, id: "b" },
      ],
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
