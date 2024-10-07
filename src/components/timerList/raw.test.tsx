import {
  act,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react-native";
import { router } from "expo-router";
import { createStore, Provider } from "jotai";
import React, { ReactNode } from "react";

import { RawTimerList } from "./raw";

import { timerListAtom, timerListKey } from "@/stores/timerLists";
import { useInitTimerList } from "@/stores/timerLists/init";
import { mockLocalStorage } from "@/utils/localStorage";

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

// TODO: find an efficient way to inject custom store values
describe("timerList", () => {
  it.skip("selects timer by clicking, and fire on change", async () => {
    mockLocalStorage();
    const cb = jest.fn();
    function Context({ children }: { children: ReactNode }) {
      useInitTimerList(cb);
      return children;
    }
    const store = createStore();
    render(
      <Provider store={store}>
        <Context>
          <RawTimerList />
        </Context>
      </Provider>,
    );
    act(() => {
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
    });
    fireEvent.press(screen.getAllByLabelText("duration")[2]);
    within(
      within(screen.getByLabelText("active")).getByLabelText("duration"),
    ).getByText("00:00:03");
    fireEvent.press(screen.getAllByLabelText("duration")[1]);
    // waiting for effect to happen
    expect(cb.mock.calls).toHaveLength(1);
  });
  it.skip("duplicate an item", async () => {
    mockLocalStorage({
      [timerListKey]: {
        active: "a",
        items: [
          { seconds: 1, id: "a" },
          { seconds: 2, id: "b" },
          { seconds: 3, id: "c" },
          { seconds: 4, id: "d" },
        ],
      },
    });
    const store = createStore();
    render(
      <Provider store={store}>
        <RawTimerList />
      </Provider>,
    );
    await new Promise((resolve) => setTimeout(resolve, 100));
    fireEvent.press(screen.getAllByLabelText("duplicate")[0]);
    const res = screen.getAllByLabelText("duration");
    expect(res.length).toBe(5);
    expect(within(res[0]).getByText("00:00:01"));
    expect(within(res[1]).getByText("00:00:01"));
    expect(within(res[2]).getByText("00:00:02"));
    expect(within(res[3]).getByText("00:00:03"));
    expect(within(res[4]).getByText("00:00:04"));
  });
  it.skip("remove an item", async () => {
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
    render(
      <Provider store={store}>
        <RawTimerList />
      </Provider>,
    );
    fireEvent.press(screen.getAllByLabelText("remove")[1]);
    const res = screen.getAllByLabelText("duration");
    expect(res).toHaveLength(2);
    expect(within(res[0]).getByText("00:00:02"));
    expect(within(res[1]).getByText("00:00:03"));
  });
  it.skip("selects an item and go to set-timer page", async () => {
    mockLocalStorage();
    const store = createStore();
    store.set(timerListAtom, { type: "clear", target: "a" });
    store.set(timerListAtom, {
      type: "setItemSeconds",
      target: "a",
      seconds: 9,
    });
    store.set(timerListAtom, {
      type: "setItemSeconds",
      target: "b",
      seconds: 8,
    });
    store.set(timerListAtom, {
      type: "setItemSeconds",
      target: "c",
      seconds: 3,
    });

    render(
      <Provider store={store}>
        <RawTimerList />
      </Provider>,
    );
    fireEvent.press(screen.getAllByLabelText("edit")[1]);
    within(
      within(screen.getByLabelText("active")).getByLabelText("duration"),
    ).getByText("00:00:08");
    expect(router.push).toHaveBeenCalledWith("/set-timer/b");
  });
});
