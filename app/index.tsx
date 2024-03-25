import { ClearList } from "../src/components/clearList";
import { HeadSeparator } from "../src/components/headSeparator";
import { List } from "../src/components/list";
import { TimerBar } from "../src/components/timerBar";

export default function Page() {
  return (
    <>
      <TimerBar />
      <HeadSeparator />
      <List />
      <ClearList />
    </>
  );
}
