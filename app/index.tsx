import { ClearList } from "@/components/clearList";
import { HeadSeparator } from "@/components/headSeparator";
import { TimerBar } from "@/components/timerBar";
import { TimerList } from "@/components/timerList";

export default function Page() {
  return (
    <>
      <TimerBar />
      <HeadSeparator />
      <TimerList />
      <ClearList />
    </>
  );
}
