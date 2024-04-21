import { fromError } from "./fromError";

describe("fromError", () => {
  it("returns undefined on error", () => {
    const err = (_x: number) => {
      throw new Error("an error");
      // eslint-disable-next-line no-unreachable
      return 3;
    };
    expect(fromError(err)(3)).toBeUndefined();
  });
  it("returns identity otherwise", () => {
    const cb = (x: number) => x;
    expect(fromError(cb)(3)).toBe(3);
  });
});
