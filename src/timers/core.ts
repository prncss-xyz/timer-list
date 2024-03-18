export type TimerStopped = {
  type: "timer_stopped";
  delai: number;
};
export type TimerAcive = {
  type: "timer_active";
  event: number;
};
export type Timer = TimerStopped | TimerAcive;

export function stop(timer: TimerAcive, now: number): TimerStopped {
  return { type: "timer_stopped", delai: timer.event - now };
}
export function start(timer: TimerStopped, now: number): TimerAcive {
  return { type: "timer_active", event: timer.delai + now };
}

export function timerToggle(timer: Timer, now: number): Timer {
  if (timer.type === "timer_active") return stop(timer, now);
  return start(timer, now);
}
export function setDelai(timer: Timer, delai: number, now: number): Timer {
  const t: TimerStopped = { type: "timer_stopped", delai };
  if (timer.type === "timer_active") return start(t, now);
  return t;
}
export function getDelai(timer: Timer, now: number) {
  const t = timer.type === "timer_stopped" ? timer : stop(timer, now);
  return t.delai;
}
