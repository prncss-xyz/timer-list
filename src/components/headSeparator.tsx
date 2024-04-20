import { View } from "react-native";

import { useColor } from "@/hooks/color";
import { borderWidths, sizes } from "@/styles";

export function HeadSeparator() {
  const color = useColor("brand");
  return (
    <View
      style={{
        height: sizes.headSeparator,
        borderColor: color,
        borderBottomWidth: borderWidths.light,
        borderStyle: "solid",
      }}
    />
  );
}
