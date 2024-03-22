import { ReactNode } from "react";
import { Text } from "react-native";

import { styles } from "../styles";

export function BaseText({ children }: { children: ReactNode }) {
  return <Text style={styles.baseText}>{children}</Text>;
}
