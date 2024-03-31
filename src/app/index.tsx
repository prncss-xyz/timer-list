import { useRouter, useFocusEffect } from "expo-router";

export default function Page() {
  const router = useRouter();
  useFocusEffect(() => {
    router.replace("/list");
  });

  return null;
}
