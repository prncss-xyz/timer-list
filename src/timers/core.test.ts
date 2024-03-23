import fc from "fast-check";

import {
  TimerAcive,
  TimerStopped,
  getElapsed,
  setElapsed,
  timerToggle,
} from "./core";

describe("toggle", () => {
  it("should be its own invert (from active)", () => {
    fc.assert(
      fc.property(fc.tuple(fc.integer(), fc.integer()), ([since, now]) => {
        const t: TimerAcive = { type: "timer_active", since };
        expect(timerToggle(timerToggle(t, now), now)).toEqual(t);
      }),
    );
  });
  it("should be its own invert (from stopped)", () => {
    fc.assert(
      fc.property(fc.tuple(fc.integer(), fc.integer()), ([elapsed, now]) => {
        const t: TimerStopped = { type: "timer_stopped", elapsed };
        expect(timerToggle(timerToggle(t, now), now)).toEqual(t);
      }),
    );
  });
});

describe("getElapsed", () => {
  it("should return delai (from active)", () => {
    expect(getElapsed({ type: "timer_active", since: 10 }, 1010)).toBe(1000);
  });
  it("should return delai (from stopped)", () => {
    expect(getElapsed({ type: "timer_stopped", elapsed: 1000 }, 10)).toBe(1000);
  });
});

describe("setElapsed", () => {
  it("should be consistent with getElapsed (from active)", () => {
    fc.assert(
      fc.property(fc.tuple(fc.integer(), fc.integer()), ([elapsed, now]) => {
        const t: TimerAcive = { type: "timer_active", since: 0 };
        expect(getElapsed(setElapsed(t, elapsed, now), now)).toBe(elapsed);
      }),
    );
  });
  it("should be consistent with getElapsed (from stopped)", () => {
    fc.assert(
      fc.property(fc.tuple(fc.integer(), fc.integer()), ([elapsed, now]) => {
        const t: TimerStopped = { type: "timer_stopped", elapsed: 0 };
        expect(getElapsed(setElapsed(t, elapsed, now), now)).toBe(elapsed);
      }),
    );
  });
});
