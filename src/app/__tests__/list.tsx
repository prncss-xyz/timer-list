import {
  act,
  fireEvent,
  render,
  screen,
  within,
} from "@testing-library/react-native";
import { createStore, Provider } from "jotai";

import Page from "@/app/list";
import { nowAtom } from "@/stores/now";
import { timerListAtom } from "@/stores/timerLists";

describe("list page", () => {
  it("should render properly", () => {
    const store = createStore();
    store.set(timerListAtom, {
      index: 0,
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
  it("should decrease count when playing", () => {
    const store = createStore();
    store.set(timerListAtom, {
      index: 0,
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
  it("should clear list", () => {
    const store = createStore();
    store.set(timerListAtom, {
      index: 0,
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
    act(() => {
      fireEvent.press(screen.getByText("clear all"));
    });
    const res = screen.getAllByLabelText("duration");
    expect(res.length).toBe(1);
    expect(within(res[0]).getByText("00:00:00"));
  });
  it("should duplicate an item", () => {
    const store = createStore();
    store.set(timerListAtom, {
      index: 0,
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
    act(() => {
      fireEvent.press(screen.getAllByLabelText("duplicate")[0]);
    });
    const res = screen.getAllByLabelText("duration");
    expect(res.length).toBe(4);
    expect(within(res[0]).getByText("00:00:01"));
    expect(within(res[1]).getByText("00:00:01"));
    expect(within(res[2]).getByText("00:00:02"));
    expect(within(res[3]).getByText("00:00:03"));
  });
  it("remove add an item", () => {
    const store = createStore();
    store.set(timerListAtom, {
      index: 0,
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
    act(() => {
      fireEvent.press(screen.getAllByLabelText("remove")[0]);
    });
    const res = screen.getAllByLabelText("duration");
    expect(res.length).toBe(2);
    expect(within(res[0]).getByText("00:00:02"));
    expect(within(res[1]).getByText("00:00:03"));
  });
});
