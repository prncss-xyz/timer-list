import { View } from "react-native";

import { borderWidths, colors, sizes } from "@/styles";

export function HeadSeparator() {
  return (
    <View
      style={{
        height: sizes.headSeparator,
        borderColor: colors.brand,
        borderBottomWidth: borderWidths.light,
        borderStyle: "solid",
      }}
    />
  );
}
