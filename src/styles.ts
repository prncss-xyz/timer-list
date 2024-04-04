import { Platform, StyleSheet } from "react-native";

export const sizes = {
  headSeparator: 35,
  icon: 35,
  digit: 50,
  screenMaxWidth: 500,
};

export const fontSizes = {
  20: 20,
  28: 28,
};

export const spaces = {
  5: 5,
  10: 10,
  15: 15,
  40: 40,
};

export const borderWidths = {
  light: 1,
};

// https://www.radix-ui.com/colors
export const lightColors = {
  background: "#fff",
  playing: "#FF92AD",
  brand: "#0090FF",
  danger: "#FFC53D",
  current: "#3DD68C",
};

export const darkColors = {
  background: "black",
  playing: "#FF92AD",
  brand: "#0090FF",
  danger: "#FFC53D",
  current: "#3DD68C",
};

export const styles = StyleSheet.create({
  mono500: {
    fontFamily: Platform.select({
      ios: "RobotoMono-Medium",
      web: "RobotoMono_500Medium",
      android: "RobotoMono_500Medium",
    }),
    fontWeight: "500",
  },
  clockText: {
    fontSize: fontSizes[28],
  },
  iconPlace: {
    width: sizes.icon,
    height: sizes.icon,
  },
  timerViewBar: {
    padding: spaces[10],
    borderWidth: borderWidths.light,
    borderStyle: "solid",
    textAlign: "center",
    justifyContent: "center",
  },
  timerViewList: {
    padding: spaces[5],
    alignItems: "flex-start",
    justifyContent: "center",
  },
  button: {
    fontFamily: Platform.select({
      ios: "Inter-SemiBold",
      web: "Inter_600SemiBold",
      android: "Inter_600SemiBold",
    }),
    fontWeight: "600",
    fontSize: fontSizes[20],
    padding: spaces[5],
    borderWidth: borderWidths.light,
    textAlign: "center",
    textTransform: "uppercase",
  },
});
