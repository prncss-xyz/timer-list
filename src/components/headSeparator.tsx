import { View } from "react-native";

import { borderWidths, colors, spaces } from "@/styles";

export function HeadSeparator() {
  return (
    <View
      style={{
        marginTop: spaces[15],
        marginBottom: spaces[5],
        borderColor: colors.brand,
        borderBottomWidth: borderWidths.light,
        borderStyle: "solid",
      }}
    />
  );
}
