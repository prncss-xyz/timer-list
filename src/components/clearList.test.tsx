import { render, fireEvent, screen } from "@testing-library/react-native";
import { createStore, Provider } from "jotai";

import { ClearList } from "./clearList";

import { timerListAtom } from "@/stores/timerLists";
import { TimerList } from "@/stores/timerLists/model";

jest.mock("@/utils/uuid", () => ({
  getUUID: () => "x",
}));

describe("clearList", () => {
  it("clears timerList", () => {
    const timerList: TimerList = {
      active: "a",
      items: [
        { seconds: 1, id: "a" },
        { seconds: 2, id: "b" },
      ],
    };
    const store = createStore();
    store.set(timerListAtom, timerList);
    render(
      <Provider store={store}>
        <ClearList />
      </Provider>,
    );
    fireEvent.press(screen.getByText("clear all"));
    expect(store.get(timerListAtom)).toEqual({
      active: "x",
      items: [{ seconds: 0, id: "x" }],
    });
  });
});
