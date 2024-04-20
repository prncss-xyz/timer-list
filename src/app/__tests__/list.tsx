import {
  act,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react-native";
import { router } from "expo-router";
import { createStore, Provider } from "jotai";
import { ReactNode } from "react";

import Page from "@/app/list";
import { nowAtom } from "@/stores/now";
import { timerListAtom } from "@/stores/timerLists";
import { useInitTimerList } from "@/stores/timerLists/init";

jest.mock("expo-router", () => ({
  router: { push: jest.fn() },
}));

describe("list page", () => {
  it("should render properly", () => {
    const store = createStore();
    store.set(timerListAtom, {
      active: "a",
      items: [
        { seconds: 2, id: "a" },
        { seconds: 3, id: "b" },
      ],
    });
    const tree = render(
      <Provider store={store}>
        <Page />
      </Provider>,
    );
    expect(tree).toMatchSnapshot();
  });
  it("should decrease count when playing, and keep count when not playing (plause-play button)", () => {
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
        <Page />
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
  it("should decrease count when playing, and keep count when not playing (countdown button)", () => {
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
        <Page />
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
  it("should reset timer", () => {
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
        <Page />
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
  it("should clear list", () => {
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
        <Page />
      </Provider>,
    );
    fireEvent.press(screen.getByText("clear all"));
    const res = screen.getAllByLabelText("duration");
    expect(res.length).toBe(1);
    expect(within(res[0]).getByText("00:00:00"));
  });
  it("select timer by clicking, and fire on change", async () => {
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
          <Page />
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
  it("should duplicate an item", () => {
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
        <Page />
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
  it.skip("remove an item", async () => {
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
        <Page />
      </Provider>,
    );
    // FIX: we will have to inject the animation hook to have this passing
    const res = screen.getAllByLabelText("duration");
    expect(res.length).toBe(2);
    expect(within(res[0]).getByText("00:00:02"));
    expect(within(res[1]).getByText("00:00:03"));
  });
  it("should select item and go to set-timer page", () => {
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
        <Page />
      </Provider>,
    );
    fireEvent.press(screen.getAllByLabelText("edit")[1]);
    within(
      within(screen.getByLabelText("active")).getByLabelText("duration"),
    ).getByText("00:00:02");
    expect(router.push).toHaveBeenCalledWith("/set-timer/b");
  });
});
