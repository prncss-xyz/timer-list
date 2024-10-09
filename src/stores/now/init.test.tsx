import { render } from "@testing-library/react-native";
import { Provider, createStore } from "jotai";

import { nowAtom } from ".";
import { useInitNow } from "./init";

import { delai } from "@/utils/tests";

describe("now", () => {
  it.skip("increment when time passes", async () => {
    const store = createStore();
    function Context() {
      useInitNow();
      return null;
    }
    render(
      <Provider store={store}>
        <Context />
      </Provider>,
    );
    await delai(500);
    expect(store.get(nowAtom)).toBeGreaterThanOrEqual(400);
  });
});
