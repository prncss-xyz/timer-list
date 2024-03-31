import { useRouter, useFocusEffect, Link } from "expo-router";
import { Text } from "react-native";

export default function Page() {
  const router = useRouter();
  useFocusEffect(() => {
    router.replace("/list");
  });

  return (
    <Link href="/list">
      <Text>Should redirect to /list</Text>
    </Link>
  );
}
