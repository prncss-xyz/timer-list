import { ListAnim, SkipAnimateOnMount } from "./animation";
import { RawTimerList } from "./raw";

export function TimerList() {
  return (
    <SkipAnimateOnMount>
      <RawTimerList CellRendererComponent={ListAnim} />
    </SkipAnimateOnMount>
  );
}
