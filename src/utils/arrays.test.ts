import fc from "fast-check";

import { insert, remove, replace } from "./arrays";

describe("replace", () => {
  it("should replace an element of a list", () => {
    fc.assert(
      fc.property(
        fc.tuple(fc.array(fc.integer()), fc.array(fc.integer())),
        ([xs, ys]) => {
          const from = [...xs, 0, ...ys];
          const to = [...xs, 1, ...ys];
          const index = xs.length;
          if (index < from.length) expect(replace(index, from, 1)).toEqual(to);
        },
      ),
    );
  });
});

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
