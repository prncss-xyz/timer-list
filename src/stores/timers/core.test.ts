import fc from "fast-check";

import {
  TimerAcive,
  TimerStopped,
  getElapsed,
  setElapsed,
  start,
  stop,
  timerToggle,
} from "./core";

describe("start", () => {
  it("keeps active timer untouched", () => {
    fc.assert(
      fc.property(fc.tuple(fc.integer(), fc.integer()), ([since, now]) => {
        const t: TimerAcive = { type: "timer_active", since };
        expect(start(t, now)).toEqual(t);
      }),
    );
  });
});
describe("stop", () => {
  it("keeps stopped timer untouched", () => {
    fc.assert(
      fc.property(fc.tuple(fc.integer(), fc.integer()), ([elapsed, now]) => {
        const t: TimerStopped = { type: "timer_stopped", elapsed };
        expect(stop(t, now)).toEqual(t);
      }),
    );
  });
});
describe("toggle", () => {
  it("is its own invert (from active)", () => {
    fc.assert(
      fc.property(fc.tuple(fc.integer(), fc.integer()), ([since, now]) => {
        const t: TimerAcive = { type: "timer_active", since };
        expect(timerToggle(timerToggle(t, now), now)).toEqual(t);
      }),
    );
  });
  it("is its own invert (from stopped)", () => {
    fc.assert(
      fc.property(fc.tuple(fc.integer(), fc.integer()), ([elapsed, now]) => {
        const t: TimerStopped = { type: "timer_stopped", elapsed };
        expect(timerToggle(timerToggle(t, now), now)).toEqual(t);
      }),
    );
  });
});

describe("getElapsed", () => {
  it("returns delai (from active)", () => {
    expect(getElapsed({ type: "timer_active", since: 10 }, 1010)).toBe(1000);
  });
  it("returns delai (from stopped)", () => {
    expect(getElapsed({ type: "timer_stopped", elapsed: 1000 }, 10)).toBe(1000);
  });
});

describe("setElapsed", () => {
  it("is consistent with getElapsed (from active)", () => {
    fc.assert(
      fc.property(fc.tuple(fc.integer(), fc.integer()), ([elapsed, now]) => {
        const t: TimerAcive = { type: "timer_active", since: 0 };
        expect(getElapsed(setElapsed(t, elapsed, now), now)).toBe(elapsed);
      }),
    );
  });
  it("is consistent with getElapsed (from stopped)", () => {
    fc.assert(
      fc.property(fc.tuple(fc.integer(), fc.integer()), ([elapsed, now]) => {
        const t: TimerStopped = { type: "timer_stopped", elapsed: 0 };
        expect(getElapsed(setElapsed(t, elapsed, now), now)).toBe(elapsed);
      }),
    );
  });
});
