import { getDebouncer } from "./debouncer";

describe("debouncer", () => {
  it("return a function which debounces calls", async () => {
    const delai = 500;
    const cb = jest.fn();
    const debounced = getDebouncer(cb, delai);
    let i = 0;
    debounced(++i);
    debounced(++i);
    debounced(++i);
    await new Promise((resolve) => setTimeout(() => resolve(true), delai));
    debounced(++i);
    await new Promise((resolve) => setTimeout(() => resolve(true), delai));
    expect(cb.mock.calls).toEqual([[3], [4]]);
  });
});
