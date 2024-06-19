import {
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react-native";
import { router } from "expo-router";
import { createStore, Provider } from "jotai";
import { ReactNode } from "react";

import { RawTimerList } from "./raw";

import { timerListAtom } from "@/stores/timerLists";
import { useInitTimerList } from "@/stores/timerLists/init";
import { mockLocalStorage } from "@/utils/localStorage";

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

describe("timerList", () => {
  beforeEach(() => {
    mockLocalStorage();
  });
  it("selects timer by clicking, and fire on change", async () => {
    const cb = jest.fn();
    function Context({ children }: { children: ReactNode }) {
      useInitTimerList(cb);
      return children;
    }
    const store = createStore();
    store.set(timerListAtom, {
      active: "a",
      items: [
        { seconds: 1, id: "a" },
        { seconds: 2, id: "b" },
        { seconds: 3, id: "c" },
      ],
    });
    render(
      <Provider store={store}>
        <Context>
          <RawTimerList />
        </Context>
      </Provider>,
    );
    fireEvent.press(screen.getAllByLabelText("duration")[2]);
    within(
      within(screen.getByLabelText("active")).getByLabelText("duration"),
    ).getByText("00:00:03");
    fireEvent.press(screen.getAllByLabelText("duration")[1]);
    // waiting for effect to happen
    await new Promise((resolve) => resolve(true));
    expect(cb.mock.calls).toHaveLength(1);
  });
  it("duplicate an item", () => {
    const store = createStore();
    store.set(timerListAtom, {
      active: "a",
      items: [
        { seconds: 1, id: "a" },
        { seconds: 2, id: "b" },
        { seconds: 3, id: "c" },
      ],
    });
    render(
      <Provider store={store}>
        <RawTimerList />
      </Provider>,
    );
    fireEvent.press(screen.getAllByLabelText("duplicate")[0]);
    const res = screen.getAllByLabelText("duration");
    expect(res.length).toBe(4);
    expect(within(res[0]).getByText("00:00:01"));
    expect(within(res[1]).getByText("00:00:01"));
    expect(within(res[2]).getByText("00:00:02"));
    expect(within(res[3]).getByText("00:00:03"));
  });
  it("remove an item", async () => {
    const store = createStore();
    store.set(timerListAtom, {
      active: "a",
      items: [
        { seconds: 1, id: "a" },
        { seconds: 2, id: "b" },
        { seconds: 3, id: "c" },
      ],
    });
    render(
      <Provider store={store}>
        <RawTimerList />
      </Provider>,
    );
    fireEvent.press(screen.getAllByLabelText("remove")[0]);
    const res = screen.getAllByLabelText("duration");
    expect(res.length).toBe(2);
    expect(within(res[0]).getByText("00:00:02"));
    expect(within(res[1]).getByText("00:00:03"));
  });
  it("selects an item and go to set-timer page", () => {
    jest.resetAllMocks();
    const store = createStore();
    store.set(timerListAtom, {
      active: "a",
      items: [
        { seconds: 1, id: "a" },
        { seconds: 2, id: "b" },
        { seconds: 3, id: "c" },
      ],
    });
    render(
      <Provider store={store}>
        <RawTimerList />
      </Provider>,
    );
    fireEvent.press(screen.getAllByLabelText("edit")[1]);
    within(
      within(screen.getByLabelText("active")).getByLabelText("duration"),
    ).getByText("00:00:02");
    expect(router.push).toHaveBeenCalledWith("/set-timer/b");
  });
});
