import fc from "fast-check";

import { fromSeconds, normalizeSeconds, pad, toSeconds } from "./seconds";

describe("pad", () => {
  it("pads to 0 chars", () => expect(pad(".", 0, "")).toBe(""));
  it("pads to 1 chars", () => expect(pad(".", 1, "a")).toBe("a"));
  it("pads to 2 chars", () => expect(pad(".", 2, "a")).toBe(".a"));
});

describe("toSeconds", () => {
  it("converts 0", () => {
    expect(fromSeconds(0)).toBe("00:00:00");
  });
  it("converts second", () => {
    expect(fromSeconds(1)).toBe("00:00:01");
  });
  it("converts minute", () => {
    expect(fromSeconds(60)).toBe("00:01:00");
  });
  it("converts hour", () => {
    expect(fromSeconds(3600)).toBe("01:00:00");
  });
});

describe("normalizeSeconds", () => {
  it("normalizes 0", () => {
    expect(normalizeSeconds("0")).toBe("00:00:00");
  });
  it("normalizes colon position", () => {
    expect(normalizeSeconds(":190")).toBe("00:01:90");
  });
  it("removes extra digits", () => {
    expect(normalizeSeconds("9:012345")).toBe("01:23:45");
  });
  it("preserves seconds conversion", () => {
    fc.assert(
      fc.property(fc.integer({ min: 0, max: 999999 }), (digits) => {
        const str = String(digits);
        expect(toSeconds(normalizeSeconds(str))).toBe(toSeconds(str));
      }),
    );
  });
});

describe("fromSeconds", () => {
  it("inverts fromSeconds, as long as they can be expressed in a 6 charaters format", () => {
    fc.assert(
      fc.property(fc.nat({ max: 99 * 3600 + 59 * 60 + 59 }), (seconds) => {
        expect(toSeconds(fromSeconds(seconds))).toBe(seconds);
      }),
    );
  });
});
