import fc from "fast-check";

import { eq, insert, nextValue, remove } from "./core";

describe("insert", () => {
  it("inserts from empty list", () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        expect(insert([], 0, n)).toEqual([n]);
      }),
    );
  });
  it("inverts remove", () => {
    fc.assert(
      fc.property(
        fc
          .array(fc.integer(), { minLength: 1 })
          .chain((xs) =>
            fc.tuple(
              fc.constant(xs),
              fc.integer({ min: 0, max: xs.length - 1 }),
            ),
          ),
        ([xs, i]) => {
          const x = xs[i];
          expect(insert(remove(xs, i), i, x)).toEqual(xs);
        },
      ),
    );
  });
});

describe("remove", () => {
  it("remove from singleton list", () => {
    fc.assert(
      fc.property(fc.integer(), (n) => {
        expect(remove([n], 0)).toEqual([]);
      }),
    );
  });
  it("inverts insert", () => {
    fc.assert(
      fc.property(
        fc
          .array(fc.integer(), { minLength: 1 })
          .chain((xs) =>
            fc.tuple(
              fc.constant(xs),
              fc.integer({ min: 0, max: xs.length - 1 }),
              fc.integer(),
            ),
          ),
        ([xs, i, n]) => {
          expect(remove(insert(xs, i, n), i)).toEqual(xs);
        },
      ),
    );
  });
});

describe("nextId", () => {
  it("returns falsy on empty array", () => {
    expect(nextValue([], eq("toto"))).toBeFalsy();
  });
  it("finds next id", () => {
    expect(nextValue(["a", "b"], eq("a"))).toBe("b");
  });
  it("returns last id when there is no next", () => {
    expect(nextValue(["a", "b"], eq("b"))).toBe("b");
  });
  it("returns first id when not found", () => {
    expect(nextValue(["a", "b"], eq("c"))).toBe("a");
  });
});
