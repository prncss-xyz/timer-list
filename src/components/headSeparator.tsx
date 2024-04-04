import { View } from "react-native";

import { useColor } from "@/hooks/color";
import { borderWidths, sizes } from "@/styles";

export function HeadSeparator() {
  return (
    <View
      style={{
        height: sizes.headSeparator,
        borderColor: useColor("brand"),
        borderBottomWidth: borderWidths.light,
        borderStyle: "solid",
      }}
    />
  );
}
