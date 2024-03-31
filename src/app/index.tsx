import { useRouter, useFocusEffect } from "expo-router";
import { Text } from "react-native";

export default function Page() {
  const router = useRouter();
  useFocusEffect(() => {
    router.replace("/list");
  });

  return <Text>redirectiong...</Text>;
}
