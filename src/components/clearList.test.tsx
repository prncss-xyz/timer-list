import { render, fireEvent, screen } from "@testing-library/react-native";
import { createStore, Provider } from "jotai";

import { ClearList } from "./clearList";

import { timerListAtom } from "@/stores/timerLists";
import { mockLocalStorage } from "@/utils/localStorage";

describe("clearList", () => {
  it("clears timerList", () => {
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
    render(
      <Provider store={store}>
        <ClearList />
      </Provider>,
    );
    fireEvent.press(screen.getByText("clear all"));
    expect(store.get(timerListAtom)).toMatchObject({
      items: [{ seconds: 0 }],
    });
  });
});
