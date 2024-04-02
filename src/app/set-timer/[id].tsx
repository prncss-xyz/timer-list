import { useLocalSearchParams } from "expo-router";

import { SetTimer } from "@/components/setTimer";

export default function Page() {
  const timerId = String(useLocalSearchParams().id);
  return <SetTimer timerId={timerId} />;
}
