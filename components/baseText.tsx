import { ReactNode } from "react";
import { Text } from "react-native";

import { styles } from "../src/styles";

export function BaseText({ children }: { children: ReactNode }) {
  return <Text style={styles.baseText}>{children}</Text>;
}
