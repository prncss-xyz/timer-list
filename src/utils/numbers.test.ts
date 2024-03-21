import fc from "fast-check";

import { fromSeconds, pad, toSeconds } from "./numbers";

describe("pad", () => {
  it("should pad to 0 chars", () => expect(pad(".", 0, "")).toBe(""));
  it("should pad to 1 chars", () => expect(pad(".", 1, "a")).toBe("a"));
  it("should pad to 2 chars", () => expect(pad(".", 2, "a")).toBe(".a"));
});

describe("toSeconds", () => {
  it("should convert 0", () => {
    expect(fromSeconds(0)).toBe("0:00:00");
  });
  it("should convert second", () => {
    expect(fromSeconds(1)).toBe("0:00:01");
  });
  it("should convert minute", () => {
    expect(fromSeconds(60)).toBe("0:01:00");
  });
  it("should convert hour", () => {
    expect(fromSeconds(3600)).toBe("1:00:00");
  });
});

describe("fromSeconds", () => {
  it("should invert fromSeconds", () => {
    fc.assert(
      fc.property(fc.nat(), (seconds) => {
        expect(toSeconds(fromSeconds(seconds))).toBe(seconds);
      }),
    );
  });
});
