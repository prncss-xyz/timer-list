import fc from "fast-check";

import {
  TimerAcive,
  TimerStopped,
  getDelai,
  setDelai,
  timerToggle,
} from "./core";

describe("toggle", () => {
  it("should be its own invert (from active)", () => {
    fc.assert(
      fc.property(fc.tuple(fc.integer(), fc.integer()), ([event, now]) => {
        const t: TimerAcive = { type: "timer_active", event };
        expect(timerToggle(timerToggle(t, now), now)).toEqual(t);
      }),
    );
  });
  it("should be its own invert (from stopped)", () => {
    fc.assert(
      fc.property(fc.tuple(fc.integer(), fc.integer()), ([delai, now]) => {
        const t: TimerStopped = { type: "timer_stopped", delai };
        expect(timerToggle(timerToggle(t, now), now)).toEqual(t);
      }),
    );
  });
});

describe("getDelai", () => {
  it("should return delai (from active)", () => {
    expect(getDelai({ type: "timer_active", event: 1010 }, 10)).toBe(1000);
  });
  it("should return delai (from stopped)", () => {
    expect(getDelai({ type: "timer_stopped", delai: 1000 }, 10)).toBe(1000);
  });
});

describe("setDelai", () => {
  it("should be consistent with getDelai (from active)", () => {
    fc.assert(
      fc.property(fc.tuple(fc.integer(), fc.integer()), ([delai, now]) => {
        const t: TimerAcive = { type: "timer_active", event: 0 };
        expect(getDelai(setDelai(t, delai, now), now)).toBe(delai);
      }),
    );
  });
  it("should be consistent with getDelai (from stopped)", () => {
    fc.assert(
      fc.property(fc.tuple(fc.integer(), fc.integer()), ([delai, now]) => {
        const t: TimerStopped = { type: "timer_stopped", delai: 0 };
        expect(getDelai(setDelai(t, delai, now), now)).toBe(delai);
      }),
    );
  });
});
