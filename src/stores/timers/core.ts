export type TimerStopped = {
  type: "timer_stopped";
  elapsed: number;
};
export type TimerAcive = {
  type: "timer_active";
  since: number;
};
export type Timer = TimerStopped | TimerAcive;

export function stop(timer: TimerAcive, now: number): TimerStopped {
  return { type: "timer_stopped", elapsed: now - timer.since };
}
export function start(timer: TimerStopped, now: number): TimerAcive {
  return { type: "timer_active", since: now - timer.elapsed };
}

export function timerToggle(timer: Timer, now: number): Timer {
  if (timer.type === "timer_active") return stop(timer, now);
  return start(timer, now);
}
export function setElapsed(timer: Timer, elapsed: number, now: number): Timer {
  const t: TimerStopped = { type: "timer_stopped", elapsed };
  if (timer.type === "timer_active") return start(t, now);
  return t;
}
export function getElapsed(timer: Timer, now: number) {
  const t = timer.type === "timer_stopped" ? timer : stop(timer, now);
  return t.elapsed;
}
